const express = require('express');
const { messageModel } = require('./model');
const { Service } = require('./service');

const router = express.Router();

exports.messageRouter = (sequelize, secret) => {
    const MESSAGE = messageModel(sequelize);
    const service = Service(MESSAGE, secret);

    router
    .route('/message')
    .get((request, response) => {
        service.findAll().then((messageList) => response.json(messageList))
    })
    .post((request, response) => {
        service
            .create(request.body)
            .then((result) => result.error ? response.json(result) : response.json('message successfully created'));
    });

    router
    .route('/message/:userId')
    .get((request, response) => {
        console.log(request.params.userId);
        service
            .findByAuthor(request.params.userId)
            .then((result) => response.json(result))
    })

    return router;
}
