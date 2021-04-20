const jwt = require('jsonwebtoken');

exports.Service = (MODEL, secret) => {
    const create = async (comment) => {
        const { content, authorId, messageId } = comment;
        return await MODEL.create({
            content,
            'USERId': authorId,
            'MESSAGEId': messageId
        });
    }

    return { create };
}