const express = require('express');
const passport = require('../config/ppConfig'); 
const router = express.Router(); // same as localhost

// import db
const db = require('../models')

router.get('/signup', (req, res)=> {
    res.render('auth/signup'); // signup form
})

router.get('/login', (req, res) => {
    res.render('auth/login');
})

router.get('/favorites', (req,res) => {
    res.render('auth/favorites')
})

router.get('/country', (req, res) => {
    res.render('auth/country')
})

router.get('/capital', (req, res) => {
    res.render('auth/capital')
})

router.get('/logout', (req, res) => {
  req.logOut(); // logs the user out of the session
  req.flash('success', 'You have logged out! See you again soon!');
  res.redirect('/');
});

router.get('/favorites', (req, res) => {
  const {name} = req.favorite.get();
  res.render('favorite', {name});
})

// Post Route for creating favorite
router.post('/favorites', (req, res) => {
  // we now have access to the user info (req.body);
  console.log(req.body);
  const { name } = req.body; // goes and us access to whatever key/value inside of the object (req.body)
  db.favorite.findOrCreate({
    where: { name },
  })
  .then(([favorite, created]) => {
    if (created) {
      // if created, success and we will redirect back to / page
      console.log(`${favorite.name} was added....`);
      // flash messages
      const successObject = {
        successRedirect: '/favorites',
        successFlash: `Your favorite country ${favorite.name} was added to the list! `
      }
      // passport authenicate
      passport.authenticate('local', successObject)(req, res);
    } else {
      // Send back email already exists
      req.flash('error', 'Email already exists');
      res.redirect('/auth/signup');
    }
  })
  .catch(error => {
    console.log('**************Error');
    console.log(error);
    req.flash('error', 'Either email or password is incorrect. Please try again.');
    res.redirect('/auth/signup');
  });
});


// Post Route for creating user
router.post('/signup', (req, res) => {
    // we now have access to the user info (req.body);
    console.log(req.body);
    const { email, name, password } = req.body; // goes and us access to whatever key/value inside of the object (req.body)
    db.user.findOrCreate({
      where: { email },
      defaults: { name, password }
    })
    .then(([user, created]) => {
      if (created) {
        // if created, success and we will redirect back to / page
        console.log(`${user.name} was created....`);
        // flash messages
        const successObject = {
          successRedirect: '/',
          successFlash: `Welcome ${user.name}. Account was created and logging in...`
        }
        // passport authenicate
        passport.authenticate('local', successObject)(req, res);
      } else {
        // Send back email already exists
        req.flash('error', 'Email already exists');
        res.redirect('/auth/signup');
      }
    })
    .catch(error => {
      console.log('**************Error');
      console.log(error);
      req.flash('error', 'Either email or password is incorrect. Please try again.');
      res.redirect('/auth/signup');
    });
  });

  router.post('/login', passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/auth/login',
    successFlash: 'Success! You have logged in!',
    failureFlash: 'Either email or password is incorrect' 
  }));

  router.post('/country', (req, res) => {
    res.redirect('https://restcountries.eu/rest/v2/name/' + req.body.userSearchInput)
  })

  router.post('/capital', (req, res) => {
    res.redirect('https://restcountries.eu/rest/v2/capital/' + req.body.userSearchInput)
  })


module.exports = router;