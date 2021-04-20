const jwt = require('jsonwebtoken');

exports.Service = (MODEL, secret) => {
    /**
     * Creates a user
     * 
     * @param {*} user 
     */
    const create = async (message) => {
        const { content, authorId } = message;
        return await MODEL.create({
            content,
            'USERId': authorId
        });
    }

    const findAll = async () => {
        return await MODEL.findAll();
    }

    const findByAuthor = async (authorId) => {
        return await MODEL.findAll({ where : {'USERId': authorId}});
    }

    return { create, findAll, findByAuthor };
}