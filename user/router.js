const { response, request } = require('express');
const express = require('express');
const { userModel } = require('./model');
const { Service } = require('./service');

const router = express.Router();

exports.userRouter = (sequelize, secret) => {
    const USER = userModel(sequelize);
    const service = Service(USER, secret, sequelize);

    router
    .route('/user')
    .get((request, response) => {
        service.findAll().then((userList) => response.json(userList))
    })
    .post((request, response) => {
        service
            .create(request.body)
            .then((result) => result.error ? response.json(result) : response.json('user successfully created'));
    });

    router
    .route('/login')
    .post((request, response) => {
        const { email, password } = request.body;
        service
            .logUser(email, password)
            .then((answer) => 
                answer.token
                ? response.json(answer)
                : response.status(403).json({ error: 'connection failed' }));
    });

    return router;
}
