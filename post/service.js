const { Sequelize, Op } = require('sequelize');

exports.Service = (MODEL, secret, sequelize) => {
    const { COMMENT, USER } = sequelize.models
    
    // CRUD
    const create = async (post) => {
        const { content, authorId } = post;
        return await MODEL.create({
            content,
            'USERId': authorId
        });
    }
    
    const findOne = async (id) => {
        return await MODEL.findOne({ where: { id }})
    }

    const update = async (post, id) => {
        return await MODEL.update(post, { where: { id }})
    }

    const destroy = async (id) => {
        // TODO supprimer les données reliées au post
        return await MODEL.destroy({ where: { id }})
    }

    // Find All
    const findAll = async () => {
        return await MODEL.findAll({
            include: [
                USER,
                { model: COMMENT, include: USER}
            ]
        });
    }

    // Specific
    const findByAuthor = async (query) => {
        const { authors } = query;
        let authorParam = [];
        authors && (authorParam = authors.map((author) => ({'USERId': author})));
        const now = new Date(Date.now() - 86400000);
        // 1j = 86400000 millisecondes
        // 1h = 3600000 millisecondes
        // 1min = 60000 millisecondes
        return await MODEL.findAll({
            where: Sequelize.and(
                {[Op.or]: authorParam},
                { 'createdAt': { [Op.gt]: now }}
            ),
            order: [
                ['createdAt', 'DESC']
            ],
            include: [
                USER,
                { model: COMMENT, include: USER}
            ]
        });
    }

    return { create, findOne, update, destroy, findAll, findByAuthor };
}