const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ToDoSchema = new Schema({
    title: String,
    items: [{
        description: String,
        completed: { type: Boolean, default: false }
    }],
    dueDate: Date
});

const ToDo = mongoose.model('todo', ToDoSchema);

module.exports = ToDo;