const express = require('express');
const { commentModel } = require('./model');
const { Service } = require('./service');

const router = express.Router();

exports.commentRouter = (sequelize, secret) => {
    const COMMENT = commentModel(sequelize);
    const service = Service(COMMENT, secret);

    router
    .route('/comment')
    // .get((request, response) => {
    //     service.findAll().then((messageList) => response.json(messageList))
    // })
    .post((request, response) => {
        service
            .create(request.body)
            .then((result) => result.error ? response.json(result) : response.json('comment successfully created'));
    });

    return router;
}
