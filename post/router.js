const express = require('express');
const { Service } = require('./service');

const router = express.Router();

exports.postRouter = () => {
    const service = Service();

    router
    .route('/post')
    .get((request, response) => {
        service.findAll().then((postsList) => response.json(postsList))
    })
    .post((request, response) => {
        service
            .create(request.body)
            .then((result) => !result.error && response.json(result))
    });

    router
    .route('/post/author')
    .get((request, response) => {
        service
            .findByAuthor(request.query)
            .then((result) => response.json(result))
    })

    router
    .route('/post/:id')
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
