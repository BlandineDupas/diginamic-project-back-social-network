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
    const { MESSAGE, COMMENT, PROPOSED_INVITE, RECEIVED_INVITE } = sequelize.models

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
                { association: 'received_invites', through: { attributes: ['status', 'createdAt'] } }
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
    const findAll = async () => { // TODO supprimer les includes, ils ne sont pas nécessaires en vrai
        return await MODEL.findAll({
            include: [
                { model: MESSAGE, include: COMMENT},
                'proposed_invites'
                // { association: 'proposed_invites', through: { attributes: ['status', 'createdAt'] } },
                // { association: 'received_invites', through: { attributes: ['status', 'createdAt'] } }
            ]});
    }
    
    // Specific
    const logUser = async (email, password) => {
        const user = await MODEL.findOne({
            where: { email },
            // include: 'friends' // TODO les messages des amis
        });

        if (!user) return { error: 'Cet utilisateur n\'existe pas' };
        
        const valid = await compareHash(password, user.password);
        if (!valid) return { error: 'Mauvais mot de passe' };
        
        const { id, lastname, firstname } = user;
        return {
            token: jwt.sign({ email, lastname, firstname }, secret, { expiresIn: '1h' }),
            user: {
                id,
                lastname,
                firstname,
                email
            }
        }
    }

    const proposeInvite = async (invite, proposerId) => {
        const { receiverId } = invite;
        const newInvite = await PROPOSED_INVITE.create({
            status: 'waiting',
            proposerId,
            receiverId
        })
        await RECEIVED_INVITE.create({
            status: 'waiting',
            proposerId,
            receiverId
        })
        return newInvite;
    }

    const answerInvite = async (answer, receiverId) => {
        const { proposerId, status } = answer;
        await PROPOSED_INVITE.update({status}, { where: { proposerId, receiverId }});
        return await RECEIVED_INVITE.update({status}, { where: { proposerId, receiverId } });
    }

    return { create, findOne, update, destroy, findAll, logUser, proposeInvite, answerInvite };
}