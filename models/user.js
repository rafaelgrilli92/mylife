const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require('bcrypt-nodejs');

// Define Model
const userSchema = new Schema({
    email: { type: String, unique: true, lowercase: true },
    password: String,
    firstName: String,
    lastName: String,
    phone: String
});

// On Save, encrypt password
// Before saving a model, run this function
userSchema.pre('save', function(next) {
    // Generate a SALT
    bcrypt.genSalt(10, function(err, salt) {
        if (err) return next(err);

        // HASH the password using the SALT
        bcrypt.hash(this.password, salt, null, function(err, hash) {
            if (err) return next(err);

            // Overwrite plain text password with encrypted password
            this.password = hash;
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