const express = require('express');
const mongoose = require('mongoose');
const nodemailer = require('nodemailer');
const Enrollment = require('../models/enrollment.model');

require('dotenv').config();

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

        //Create nodemailer transport and email template 
        const Transport = nodemailer.createTransport({
            service: 'Gmail',
            auth: {
                user: "jpatrickpajarillo@gmail.com",
                pass: process.env.EMAIL_PASSWORD
            }
        });

        let sender = "St. Clare College";
        const mailOptions = {
            from: sender,
            to: enrollee.email,
            subject: "Please verify your email address to complete the process.",
            text: `Your 8-digit code is ${uniqueString}`
        };
        //Send Email
        Transport.sendMail(mailOptions, () => {
            if (error) {
                console.log("error");
                return res.status(500).json({message: "email not sent"});
            } else {
                console.log("Message Sent");
            }
        });

        res.status(201).json(newEnrollee);

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