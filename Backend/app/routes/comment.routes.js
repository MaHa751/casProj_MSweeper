//see https://www.callicoder.com/node-js-express-mongodb-restful-crud-api-tutorial/

module.exports = (app) => {
    const comments = require('../controllers/comment.controller.js');

    // Create a new Comment
    app.post('/comments', comments.create);

    // Retrieve all Comments
    app.get('/comments', comments.findAll);

    // Retrieve a single Comment with commentId
    app.get('/comments/:commentId', comments.findOne);

    // Update a Comment with commentId
    app.put('/comments/:commentId', comments.update);

    // Delete a Comment with commentId
    app.delete('/comments/:commentId', comments.delete);
}