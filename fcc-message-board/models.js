const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const repliesSchema = new Schema({
    text: { type: String, required: true },
    created_on: { type: Date, default: Date.now() },
    reported: { type: Boolean, default: false },
    delete_password: { type: String, required: true }
});
const threadSchema = new Schema({
    text: { type: String, required: true },
    created_on: { type: Date, default: Date.now() },
    bumped_on: { type: Date, default: Date.now() },
    reported: { type: Boolean, default: false },
    delete_password: { type: String, required: true },
    replies: {type: [repliesSchema], default: []}
});
const boardSchema = new Schema({
    board: { type: String, required: true, unique: true },
    threads: {type: [threadSchema], default: [] }
})

module.exports.Board = mongoose.model('board', boardSchema);