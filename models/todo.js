const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const toDoSchema = new Schema({
    title: String,
    items: [{
        description: { type: String, required: [true, 'An item must have a description'] },
        completed: { type: Boolean, default: false }
    }],
    dueDate: Date,
    createdAt: { type: Date, default: new Date() },
    updatedAt: { type: Date, default: new Date() },
    createdBy: {
        type: Schema.Types.ObjectId,
        ref: 'user',
        required: true
    },
    updatedBy: {
        type: Schema.Types.ObjectId,
        ref: 'user'
    },
});

toDoSchema.pre('save', function(next) {
    this.updatedBy = this.createdBy;
    return next();
});

toDoSchema.pre('update', function(next) {
    this.update({}, { $set: { updatedAt: new Date() } });
    return next();
});

toDoSchema.path('items').validate(function(items){
    if(!items) return false
    else if (items.length === 0) return false
    return true;
}, 'At least one todo item must be added');

const ToDos = mongoose.model('todo', toDoSchema);

module.exports = ToDos;