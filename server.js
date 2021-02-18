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
const SECRET_SESSION = process.env.SECRET_SESSION; 
// const isLoggedin = require('./middleware/isLoggedIn'); not ready for use yet

// Middleware
app.use(require('morgan')('dev'))
app.use(express.urlencoded({ extended: false }));
app.use(express.static(__dirname + '/public'));
app.use(ejsLayouts);

// Session Middleware to be added later alongside passport

// secret for req.flash()
const sessionObject = {
  secret: SECRET_SESSION,
  resave: false,
  saveUninitialized: true
}
app.use(session(sessionObject));

// Flash 
app.use(flash());
app.use((req, res, next) => {
  console.log(res.locals);
  res.locals.alerts = req.flash();
  res.locals.currentUser = req.user;
  next();
});

// Controllers
app.use('/auth', require('./controllers/auth'))

app.get('/', (req, res)=> {
  res.render("index");
})

// Server Hosting

const PORT = process.env.PORT || 8000;
const server = app.listen(PORT, () => {
  console.log(`The server is listening on port ${PORT}`)
});

module.exports = server;