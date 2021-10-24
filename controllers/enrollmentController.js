const express = require('express');
const mongoose = require('mongoose');
const nodemailer = require('nodemailer');
const Enrollment = require('../models/enrollment.model');
const { google } = require('googleapis');

require('dotenv').config();

//Goole OAuth Account Setup
const CLIENT_ID = process.env.CLIENT_ID;
const CLIENT_SECRET = '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';
const REDIRECT_URI = process.env.REDIRECT_URI;
const REFRESH_TOKEN = process.env.REFRESH_TOKEN;
const oAuth2Client = new google.auth.OAuth2(CLIENT_ID, CLIENT_SECRET, REDIRECT_URI)
oAuth2Client.setCredentials({ refresh_token: REFRESH_TOKEN });

//Function to send email using nodemailer and oauth2 credentials
const sendMail = async (email, uniqueString) => {
    try {

        //Create nodemailer transport and email template 
        const accessToken = await oAuth2Client.getAccessToken();

        const Transport = nodemailer.createTransport({
            service: 'Gmail',
            auth: {
                type: 'OAuth2',
                user: 'jpatrickpajarillo@gmail.com',
                clientId: CLIENT_ID,
                clientSecret: CLIENT_SECRET,
                refreshToken: REFRESH_TOKEN,
                accessToken: accessToken 
            }
        });

        const mailOptions = {
            from: 'St. Clare College',
            to: email,
            subject: "Please verify your email address to complete the process.",
            text: `Your 8-digit code is ${uniqueString}`
        };

        //Send Email
        await Transport.sendMail(mailOptions);

    }
    catch(error) {
        console.log(error);
        return error;
    }
}



const enroll = async (req, res) => {
    const { lastname, firstname, middlename, email, phonenumber, address, birthdate, birthplace, nationality, religion, sex, yearlevel, semester } = req.body;

    try {
        //Check if email already exist in database
        const existingUser = await Enrollment.findOne({email});
        if (existingUser) return res.status(400).json({message: "User with this email already exist."});

        //Create a random string for email verification link
        const randomString = () => {
            const strLength = 8;
            let randStr = "";

            for (let i = 0; i < strLength; i++) {

                const ch = Math.floor(Math.random() * 10);
                randStr += ch;
            }
            return randStr;
        };

        const uniqueString = randomString();

        //New instance of Enrollment model
        const enrollee = new Enrollment({
            lastname,
            firstname,
            middlename,
            email, 
            phonenumber,
            address,
            birthdate,
            birthplace,
            nationality,
            religion,
            sex,
            yearlevel,
            semester,
            emailToken: uniqueString,
        });

        //Save enrollee to database
        const newEnrollee = await enrollee.save();

        //Call Function to send email
        sendMail(enrollee.email, uniqueString)
            .then(() => {
                res.status(201).json(newEnrollee);
            })
            .catch((error) => {
                console.log(error);
                return res.status(500).json({ message: error })
            })

        

    } catch (err) {
        res.status(500).json({message: err.message});
        console.log(err);
    }
};



const verify = async (req, res) => {
    try {
        const code = req.body.code;
        const enrollee = await Enrollment.findOneAndUpdate({ emailToken: code }, {isVerified: true, emailToken: null }, {new: true});

        if (!enrollee) return res.status(400).json({message: "Incorrect Code."});

        res.status(200).json(enrollee);
    } 
    catch (err) {
        res.status(500).json({message: "Something went wrong."});
    }
};

module.exports = {enroll, verify};