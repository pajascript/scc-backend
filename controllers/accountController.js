const express = require('express');
const mongoose = require('mongoose');
const User = require('../models/user.model');
const Enrollment = require('../models/enrollment.model');

const signupUser = async (req, res) => {

    const { lastname, firstname, middlename, email, phonenumber, gender } = req.body
    

};



module.exports = { signupUser }