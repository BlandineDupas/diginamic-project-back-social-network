const express = require('express');
const { userModel } = require('./model');
const { Service } = require('./service');

const router = express.Router();

exports.userRouter = (sequelize) => {
    const USER = userModel(sequelize);
    const service = Service(USER);

    router
    .route('/user')
    .get((request, response) => {
        service.all().then((userList) => response.json(userList))
    })
    .post((request, response) => {
        service
            .create(request.body)
            .then(() => response.json(request.body));
    });

    return router;
}
