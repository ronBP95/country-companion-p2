const express = require('express');
// const passport = require('../config/ppConfig'); not in use yet
const router = express.Router(); // same as localhost

// import db
const db = require('../models')

router.get('/signup', (req, res)=> {
    res.render('auth/signup'); // signup form
})

router.get('/login', (req, res) => {
    res.render('auth/login');
})

module.exports = router;