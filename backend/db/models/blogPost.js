'use strict';
var mongoose = require('mongoose');
var crypto = require('crypto');
var _ = require('lodash');

var schema = new mongoose.Schema({
    date: {
        type: Date, default: Date.now
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: [true, 'Must be signed in to create a Blog Post']
    },
    password: {
        type: String
    },
    salt: {
        type: String
    },
    blogType: {
      type: String,
      default: 'private'
    },
    friends: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],
    thumbnail: {
        //will get stored in firebase also with _id
        type: String,
        // default: '/img/adam.jpg'
    },
    content: {
        type: String,
        default: "No Content"
    },
    title: {
        type: String,
        default: "No Title"
    },
    subtitle: {
        type: String,
        default: "No Sub Title"
    }
});

// method to remove sensitive information from user objects before sending them out
schema.methods.sanitize = function () {
    return _.omit(this.toJSON(), ['password', 'salt']);
};

// generateSalt, encryptPassword and the pre 'save' and 'correctPassword' operations
// are all used for local authentication security.
var generateSalt = function () {
    return crypto.randomBytes(16).toString('base64');
};

var encryptPassword = function (plainText, salt) {
    var hash = crypto.createHash('sha1');
    hash.update(plainText);
    hash.update(salt);
    return hash.digest('hex');
};

schema.pre('save', function (next) {

    if (this.isModified('password')) {
        this.salt = this.constructor.generateSalt();
        this.password = this.constructor.encryptPassword(this.password, this.salt);
    }

    next();

});

schema.statics.generateSalt = generateSalt;
schema.statics.encryptPassword = encryptPassword;

schema.method('correctPassword', function (candidatePassword) {
    return encryptPassword(candidatePassword, this.salt) === this.password;
});



mongoose.model('blogPost', schema);
