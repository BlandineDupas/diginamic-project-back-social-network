exports.Service = (MODEL, secret) => {
    // CRUD
    const create = async (comment) => {
        const { content, authorId, messageId } = comment;
        return await MODEL.create({
            content,
            'USERId': authorId,
            'MESSAGEId': messageId
        });
    }
    const findOne = async (id) => {
        return await MODEL.findOne({ where: { id }})
    }

    const update = async (comment, id) => {
        return await MODEL.update(comment, { where: { id }})
    }
    
    const destroy = async (id) => {
        // TODO supprimer les données reliées au comment
        return await MODEL.destroy({ where: { id }})
    }

    // Find ALl
    // Specific
    return { create, findOne, update, destroy };
}