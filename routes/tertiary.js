const express = require('express');
const router = express.Router();
const { enroll, verify } = require("../controllers/enrollmentController.js");

//Post Request
router.post('/', enroll);

router.post('/verify', verify);

module.exports = router;