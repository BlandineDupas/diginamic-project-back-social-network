exports.Service = (MODEL, secret, sequelize) => {
    const { COMMENT } = sequelize.models
    
    // CRUD
    const create = async (message) => {
        const { content, authorId } = message;
        return await MODEL.create({
            content,
            'USERId': authorId
        });
    }
    
    const findOne = async (id) => {
        return await MODEL.findOne({ where: { id }})
    }

    const update = async (message, id) => {
        return await MODEL.update(message, { where: { id }})
    }

    const destroy = async (id) => {
        // TODO supprimer les données reliées au message
        return await MODEL.destroy({ where: { id }})
    }

    // Find All
    const findAll = async () => {
        return await MODEL.findAll({ include: COMMENT });
    }

    // Specific
    const findByAuthor = async (authorId) => {
        return await MODEL.findAll({ where : {'USERId': authorId}});
    }

    return { create, findOne, update, destroy, findAll, findByAuthor };
}