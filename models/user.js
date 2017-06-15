const bcrypt = require('bcrypt-nodejs');
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const dataValidation = require('../helpers/data_validation');
const auth = require('../helpers/auth');

// Define Model
const userSchema = new Schema({
    email: { 
        type: String, 
        unique: true, 
        lowercase: true, 
        required: true,
        validate: {
            validator: function(value) {
                return dataValidation.isValidEmail(value);
            },
            message: "'{VALUE}' is not a valid email"
        }
    },
    password: { type: String, required: true },
    isActive: { type: Boolean, default: true },
    createdAt: { type: Date, default: new Date() },
    updatedAt: { type: Date, default: new Date() },
    inactivatedAt: Date,
    createdBy: {
        type: Schema.Types.ObjectId,
        ref: 'user'
    },
    updatedBy: {
        type: Schema.Types.ObjectId,
        ref: 'user'
    },
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    phone: String,
    facebook: Object
});

// On Save, encrypt password
// Before saving a model, run this function
userSchema.pre('save', function(next) {
    var user = this;
    
    auth.generateHashPassword(user.password, function(err, hashPassword) {
        if (err) return next(err);
        
        user.updatedBy = user._id;
        user.createdBy = user._id;
        user.password = hash;
        return next();

    });
});

userSchema.pre('update', function(next) {
    this.update({}, { $set: { updatedAt: new Date() } });
    
    return next();
});

userSchema.methods.comparePassword = function(candidatePassword, callback) {
    bcrypt.compare(candidatePassword, this.password, function(err, isMatch) {
        if (err) return callback(err);

        callback(null, isMatch);
    })
}

// Create Model Class
const Users = mongoose.model('user', userSchema);

module.exports = Users;