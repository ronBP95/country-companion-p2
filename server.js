// Requirements

require('dotenv').config();
const express = require('express');
const ejsLayouts = require('express-ejs-layouts')
const session = require('express-session')
// const passport = require('./config/ppConfig'); not ready for use yet
const flash = require('connect-flash')

const app = express();
app.set('view engine', 'ejs');

// Session
// const SECRET_SESSION = process.env.SECRET_SESSION;
// const isLoggedin = require('./middleware/isLoggedIn');

// Middleware
app.use(require('morgan')('dev'))
app.use(express.urlencoded({ extended: false }));
app.use(express.static(__dirname + '/public'));
app.use(ejsLayouts);

// Session Middleware to be added later alongside passport

// Controllers
// app.use('/auth', require('./controllers/auth')) // controller not added yet


// to be changed to res.render('index'); when the api/db is linked
app.get('/', (req, res)=> {
  res.render("index");
})

// Server Hosting

const PORT = process.env.PORT || 8000;
const server = app.listen(PORT, () => {
  console.log(`The server is listening on port ${PORT}`)
});

module.exports = server;