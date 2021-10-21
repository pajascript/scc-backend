//Libraries and Dependencies
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

require('dotenv').config();

const app = express();
const port = process.env.PORT || 5000;

//middleware
app.use(express.json());
app.use(cors());


//MongoDB Connection
mongoose.connect(process.env.ATLAS_URI,{ UseNewUrlParser: true});
const connection = mongoose.connection;
connection.on('error', (error) => console.error(error));
connection.once('open', () => console.log('connected to database'));


//Routes
const enrollmentRouter = require('./routes/tertiary');
app.use('/enrollment', enrollmentRouter);


//Server Listen
app.listen(port, () => console.log('server started'));