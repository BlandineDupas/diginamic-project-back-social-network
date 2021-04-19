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

exports.Service = (MODEL, secret) => {
    /**
     * Creates a user
     * 
     * @param {*} user 
     */
    const create = async (user) => {
        const hashedPassword = await hash(user.password);
        return await MODEL.create({
            ...user,
            password: hashedPassword
        });
    }

    const all = async () => {
        return await MODEL.findAll();
    }
    
    const logUser = async (email, password) => {
        const user = await MODEL.findOne({ where: { email }});
        const valid = await compareHash(password, user.password);
        if (!valid) return;
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

    return { create, all, logUser };
}