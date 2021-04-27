
exports.Service = () => {
    // CRUD
    const create = async (comment) => {
        const { content, authorId, postId } = comment;
        return await COMMENT.create({
            content,
            'USERId': authorId,
            'POSTId': postId
        });
    }
    const findOne = async (id) => {
        return await COMMENT.findOne({ where: { id }})
    }

    const update = async (comment, id) => {
        return await COMMENT.update(comment, { where: { id }})
    }
    
    const destroy = async (id) => {
        // TODO supprimer les données reliées au comment
        return await COMMENT.destroy({ where: { id }})
    }

    // Find ALl
    // Specific
    return { create, findOne, update, destroy };
}