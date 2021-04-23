const { Sequelize, Op } = require('sequelize');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const saltRounds = 10;

/**
 * Hash a string
 * 
 * @param {String} password 
 * @returns hashed password
 */
const hash = async (password) => {
    return await bcrypt.hash(password, saltRounds);
};

const compareHash = async (password, hash) => await bcrypt.compare(password, hash);

exports.Service = (MODEL, secret, sequelize) => {
    const { MESSAGE, COMMENT, PROPOSED_INVITE, RECEIVED_INVITE, FRIENDS } = sequelize.models

    // CRUD
    const create = async (user) => {
        const { email } = user;
        const exists = await MODEL.findOne({ where: { email }});
        if (!exists) {
            const hashedPassword = await hash(user.password);
            return await MODEL.create({
                ...user,
                password: hashedPassword
            });
        } else {
            return { error: 'Cette adresse mail est déjà reliée à un compte' };
        }
    }
    
    const findOne = async (id) => {
        return await MODEL.findOne({
            where: { id },
            include: [
                // { association: 'received_invites', through: { attributes: ['status', 'createdAt'] } },
                // { association: 'friends', through: { attributes: [] } },
                { association: 'proposed_invites', through: { attributes: ['status', 'createdAt'] } },
                { association: 'received_invites', through: { attributes: ['status', 'createdAt'] } },
                { association: 'friends', through: { attributes: [] } },    
            ]
        })
    }

    const update = async (user, id) => {
        return await MODEL.update(user, { where: { id }})
    }

    const destroy = async (id) => {
        // TODO supprimer les données reliées au user
        return await MODEL.destroy({ where: { id }})
    }

    // Find All
    const findAll = async ({ search }) => { // TODO supprimer les includes, ils ne sont pas nécessaires en vrai
        console.log('SEARCH : ', search);
        let words = [];
        search && (words = search.split(' '));
        let whereParam;
        // TODO trouver un moyen plus optimisé de gérer les différentes possibilités (et 4, 5 ou plus de mots ???)
        words.length === 1 && (whereParam = Sequelize.or(
            { firstname: {[Op.like]: '%' + words[0] + '%'}},
            { lastname: {[Op.like]: '%' + words[0] + '%'}}
        ));

        words.length === 2 && (whereParam = Sequelize.or(
            { firstname: {[Op.like]: '%' + words[0] + ' ' + words[1] + '%'}},
            { lastname: {[Op.like]: '%' + words[0] + ' ' + words[1] + '%'}},
            { firstname: {[Op.like]: '%' + words[0] + '%'}, lastname: {[Op.like]: '%' + words[1] + '%'}},
            { firstname: {[Op.like]: '%' + words[1] + '%'}, lastname: {[Op.like]: '%' + words[0] + '%'}}
        ));

        words.length === 3 && (whereParam = Sequelize.or(
            { firstname: {[Op.like]: '%' + words[0] + ' ' + words[1] + '%'}, lastname: {[Op.like]: '%' + words[2] + '%'}},
            { firstname: {[Op.like]: '%' + words[0] + '%'}, lastname: {[Op.like]: '%' + words[1] + ' ' + words[2] + '%'}}
        ));

        return await MODEL.findAll({
            where: whereParam,
            include: [
                { model: MESSAGE, include: COMMENT},
                { association: 'proposed_invites', through: { attributes: ['status', 'createdAt'] } },
                { association: 'received_invites', through: { attributes: ['status', 'createdAt'] } },
                { association: 'friends', through: { attributes: [] } },
            ]});
    }
    
    // Specific
    const logUser = async (email, password) => {
        const user = await MODEL.findOne({
            where: { email },
            include: [
                { association: 'proposed_invites', through: { attributes: ['status', 'createdAt'] } },
                { association: 'received_invites', through: { attributes: ['status', 'createdAt'] } },
                { association: 'friends', through: { attributes: [] } },    
            ]
        });

        if (!user) return { error: 'Cet utilisateur n\'existe pas' };
        
        const valid = await compareHash(password, user.password);
        if (!valid) return { error: 'Mauvais mot de passe' };
        
        const { lastname, firstname } = user;
        return {
            token: jwt.sign({ email, lastname, firstname }, secret, { expiresIn: '1h' }),
            user
        }
    }

    const proposeInvite = async (invite, proposerId) => {
        const { receiverId } = invite;
        await PROPOSED_INVITE.create({
            status: 'waiting',
            proposerId,
            receiverId
        });
        await RECEIVED_INVITE.create({
            status: 'waiting',
            proposerId,
            receiverId
        });
        return findOne(proposerId);
    }

    const answerInvite = async (answer, receiverId) => {
        const { proposerId, status } = answer;

        const proposedInvite = await PROPOSED_INVITE.update({status}, { where: { proposerId, receiverId }});
        const receivedInvite = await RECEIVED_INVITE.update({status}, { where: { proposerId, receiverId } });

        if (status === "accepted") {
            await FRIENDS.create({
                friend1: proposerId,
                friend2: receiverId
            });
            await FRIENDS.create({
                friend2: proposerId,
                friend1: receiverId
            });
        }
        return findOne(receiverId);
    }

    const destroyInvite = async (invite, proposerId) => {
        const { receiverId } = invite;
        await PROPOSED_INVITE.destroy({ where: { proposerId, receiverId }})
        await RECEIVED_INVITE.destroy({ where: { proposerId, receiverId }})
        return findOne(proposerId);
    }


    return { create, findOne, update, destroy, findAll, logUser, proposeInvite, answerInvite, destroyInvite };
}