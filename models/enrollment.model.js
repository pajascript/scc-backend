const mongoose = require('mongoose');

const enrollmentSchema = new mongoose.Schema({

    lastname: {
        type: String,
        required: true,
    },
    firstname: {
        type: String,
        required: true,
    },
    middlename: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    phonenumber: {
        type: String,
        required: true,
    },
    address: {
        type: String,
        required: true,
    },
    birthdate: {
        type: String,
        required: true,
    },
    birthplace: {
        type: String,
        required: true,
    },
    nationality: {
        type: String,
        required: true,
    },
    religion: {
        type: String,
        required: true,
    },
    sex: {
        type: String,
        required: true,
    },
    yearlevel: {
        type: String,
        required: true,
    },
    semester: {
        type: String,
        required: true,
    },
    emailToken: {
        type: String
    },
    isVerified: {
        type: Boolean,
        default: false
    },
    isEnrolled: {
        type: Boolean,
        default: false
    }

})

module.exports = mongoose.model('tertiaryenrollments', enrollmentSchema)