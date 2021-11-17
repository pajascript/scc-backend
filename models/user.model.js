const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({

    lastname: {
        type: String,
        required: true
    },
    firstname: {
        type: String,
        required: true
    },
    middlename: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    phonenumber: {
        type: String,
        required: true
    },
    gender: {
        type: String,
        required: true
    },
    role: {
        type: String,
        required: true,
        default: 'student'
    }

})

module.exports = mongoose.model('users', userSchema);