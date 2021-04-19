const bcrypt = require('bcrypt');
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

exports.Service = (MODEL) => {
    /**
     * Creates a user
     * 
     * @param {*} user 
     */
    const create = async ({ user }) => {
        console.log(user)
        console.log(user.password)
        const hashedPassword = await hash(user.password);
        return await MODEL.create({
            ...user,
            password: hashedPassword
        });
    }

    const all = async () => {
        return await MODEL.findAll();
    }

    return { create, all };
}