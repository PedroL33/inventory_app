var User = require('../models/user')

var bcrypt = require('bcryptjs');
const saltRounds = 12;

const { body,validationResult } = require('express-validator/check');
const { sanitizeBody } = require('express-validator/filter');

const passport = require('passport');


exports.get_login = function(req, res) {
    res.render('login_form', {title: 'Login'});
}

exports.get_signup = function(req, res) {
  res.render('signup_form', {title: 'Signup'});
}

exports.post_login = function(req, res, next) {
    passport.authenticate('local', function(err, user, info) {
      if(err) { return next(err); }
      if (!user) {
        res.render('login_form', {title: 'Login', message: info.message, username: req.body.username})
      }
      req.logIn(user, function(err) {
        if(err) { return next(err); }
        return res.redirect('/');
      })
    })(req, res, next);
};

exports.post_signup = [
  body('signupPassword', 'Password must be 6 characters or longer').isLength({min:6}).trim(),
  body('signupUsername', 'Username must be 3 characters of longer').isLength({min:3}).trim(),

  sanitizeBody('password').escape(),
  sanitizeBody('username').escape(),

  (req, res, next) => {
    const errors = validationResult(req);

    if(!errors.isEmpty()) {
      res.render('signup_form', {title: 'Signup', errors: errors.array()})
    }
    else {
      bcrypt.hash(req.body.signupPassword, saltRounds, function(err, hash) {
        var user = new User(
            {
              username: req.body.signupUsername,
              password: hash
            }
        )
        user.save(function(err) {
          if(err) { 
            if (err.name === 'MongoError' && err.code === 11000) {
              return res.render('signup_form', {title: 'Signup', error: 'Username already taken'})
            } else {
              return next(err)
            }
          }
          res.redirect('/catalog/categories')
        })
      })
    }
  }
]

exports.logout = function(req, res) {
    req.logout();
    res.redirect("/");
};