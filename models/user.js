const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require('bcrypt-nodejs');
const dataValidation = require('../helpers/data_validation');

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
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    phone: String,
    facebook: Object
});

// On Save, encrypt password
// Before saving a model, run this function
userSchema.pre('save', function(next) {
    var user = this;

    // Generate a SALT
    bcrypt.genSalt(10, function(err, salt) {
        if (err) return next(err);

        // HASH the password using the SALT
        bcrypt.hash(user.password, salt, null, function(err, hash) {
            if (err) return next(err);

            // Overwrite plain text password with encrypted password
            user.password = hash;
            return next();
        })
    })
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