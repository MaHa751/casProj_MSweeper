//see https://www.callicoder.com/node-js-express-mongodb-restful-crud-api-tutorial/

const mongoose = require('mongoose');

const CommentSchema = mongoose.Schema({
    user: String,
    content: String,
    stars: String,
    time: String
}, {
    timestamps: true
});

module.exports = mongoose.model('Comment', CommentSchema);