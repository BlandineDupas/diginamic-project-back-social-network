const express = require('express');
const { Service } = require('./service');

const router = express.Router();

exports.commentRouter = (MODEL, sequelize, secret) => {
    const service = Service(MODEL, secret);

    router
    .route('/comment')
    // .get((request, response) => {
    //     service.findAll().then((messageList) => response.json(messageList))
    // })
    .post((request, response) => {
        service
            .create(request.body)
            .then((result) => !result.error && response.json(result))
    });

    router
    .route('/comment/:id')
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


    return router;
}
