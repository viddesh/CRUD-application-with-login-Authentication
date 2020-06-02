const express = require('express');
const passport = require('passport');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs')
const router = express.Router();

require('../models/User')
const User = mongoose.model('users')

router.get('/login', (req, res) => {
    res.render('users/login');
})

router.get('/register', (req, res) => {
    res.render('users/register')
})

router.post('/login', (req, res, next) => {
    passport.authenticate('local', {
        successRedirect: '/',
        failureRedirect: '/users/login',
        failureFlash: true
    })(req, res, next)
})

router.post('/register', (req, res) => {
    let errors = [];

    if(req.body.password != req.body.password2){
        errors.push({text: 'password is not matching'})
    }

    if(req.body.password.length < 4){
        errors.push({text: 'password must have 4 character'})
    }

    if(errors.length > 0){
        res.render('users/register', {
            errors: errors,
            name: req.body.name,
            email: req.body.email,
            password: req.body.password,
            password2: req.body.password2            
        })
    }
    else{
        User.findOne({email: req.body.email})
            .then(user =>{
                if(user){
                    req.flash("error_msg", 'usr with this email is already exsist');
                    res.redirect('/users/register');
                }
                else{
                    const newUser = {
                        name: req.body.name,
                        email: req.body.email,
                        password: req.body.password
                    }
                    bcrypt.genSalt(10, (err, salt) => {
                        bcrypt.hash(newUser.password, salt, (err, hash) => {
                            newUser.password = hash;
                            new User(newUser)
                               .save()
                               .then(user =>{
                                   req.flash('success_msg', 'you are resigstred user now can procced with log in')
                                   res.redirect('/users/login')
                               })
                        })
                    })
                }
            })
    }
})

router.get('/logout', (req, res) => {
    req.logout();
    req.flash("success_msg", "you are successfully logged out");
    res.redirect('/users/login')
});

module.exports = router;