const express = require('express');
const { Service } = require('./service');

const router = express.Router();

exports.messageRouter = (MODEL, sequelize, secret) => {
    const service = Service(MODEL, secret, sequelize);

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
    .route('/message/:id')
    .get((request, response) => {
        service
            .findOne(request.params.id)
            .then(result => response.json(result))
    })
    .put((request, response) => {
        service
            .update(request.body, request.params.id)
            .then(result => response.json(result))
    })
    .delete((request, response) => {
        service
            .destroy(request.params.id)
            .then(result => response.json(result))
    })

    // TODO changer l'adresse
    router
    .route('/message/author/:userId')
    .get((request, response) => {
        console.log(request.params.userId);
        service
            .findByAuthor(request.params.userId)
            .then((result) => response.json(result))
    })

    return router;
}
