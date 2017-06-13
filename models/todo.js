const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ToDoSchema = new Schema({
    title: String,
    items: [{
        description: { type: String, required: [true, 'An item must have a description'] },
        completed: { type: Boolean, default: false }
    }],
    dueDate: Date
});

ToDoSchema.path('items').validate(function(items){
    if(!items) return false
    else if (items.length === 0) return false
    return true;
}, 'At least one todo item must be added');

const ToDo = mongoose.model('todo', ToDoSchema);

module.exports = ToDo;