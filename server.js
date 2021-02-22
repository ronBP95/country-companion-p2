// Requirements

require('dotenv').config();
const express = require('express');
const ejsLayouts = require('express-ejs-layouts')
const session = require('express-session')
const passport = require('./config/ppConfig');
const flash = require('connect-flash')
const weather = require("weather-js")

const app = express();
app.set('view engine', 'ejs');

// Session
const SECRET_SESSION = process.env.SECRET_SESSION; 
const isLoggedIn = require('./middleware/isLoggedIn');

// Middleware
app.use(require('morgan')('dev'))
app.use(express.urlencoded({ extended: false }));
app.use(express.static(__dirname + '/public'));
app.use(ejsLayouts);

// Session Middleware 

// secret: What we actually will be giving the user on our site as a session cookie
// resave: Save the session even if it's modified, make this false
// saveUninitialized: If we have a new session, we save it, therefore making that true

// secret for req.flash()
const sessionObject = {
  secret: SECRET_SESSION,
  resave: false,
  saveUninitialized: true
}
app.use(session(sessionObject));

// Passport
app.use(passport.initialize()); // Initialize passport
app.use(passport.session()); // Add a session

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
});

app.get('/weatherView', (req, res)=> {
  res.render("weatherView");
});
// as referenced in express-weather-lab for SEI-111
app.get("/weather", (req, res) => {
  weather.find({search: req.query.zipcode, degreeType: 'F'}, function(err, result) {
          if(err) console.log(err);
         
          console.log(JSON.stringify(result, null, 2));
          res.render("weatherModule.ejs", { result })
        });
})

app.get('/about', (req, res)=> {
  res.render("about");
})

app.get('/profile', isLoggedIn, (req, res) => {
  const { id, name, email } = req.user.get(); 
  res.render('profile', { id, name, email });
});

app.use(function(req, res, next){
  res.status(404).json({
    url: req.originalUrl,
    message: "Sorry, that page does not exist",
  })
})


// Server Hosting

const PORT = process.env.PORT || 8000;
const server = app.listen(PORT, () => {
  console.log(`The server is listening on port ${PORT}`)
});

module.exports = server;