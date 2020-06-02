const express = require('express')
const mongoose = require('mongoose');
const router = express.Router();
const { ensureAuthenticated } = require('../helpers/auth');

require('../models/Idea')
const Idea = mongoose.model('ideas')

router.get('/', ensureAuthenticated, (req, res) => {
    Idea.find({ user: req.user.id})
      .sort({date:'desc'})
      .then(ideas => {
        res.render('ideas/index', {
          ideas:ideas
        });
      });
  });
  
  router.get('/add', ensureAuthenticated, (req, res) => {
    res.render('ideas/add');
  });
  
  
  router.get('/edit/:id', ensureAuthenticated, (req, res) => {
    Idea.findOne({
      _id: req.params.id
    })
    .then(idea => {
      res.render('ideas/edit', {
        idea:idea
      });
    });
  });
  
  
  router.post('/', ensureAuthenticated, (req, res) => {
    let errors = [];
  
    if(!req.body.title){
      errors.push({text:'Please add a title'});
    }
    if(!req.body.details){
      errors.push({text:'Please add some details'});
    }
  
    if(errors.length > 0){
      res.render('/add', {
        errors: errors,
        title: req.body.title,
        details: req.body.details
      });
    } else {
      const newUser = {
        title: req.body.title,
        details: req.body.details,
        user: req.user.id
      }
      new Idea(newUser)
        .save()
        .then(idea => {
          req.flash('success_msg', 'Data is added in DB');
          res.redirect('/ideas');
        })
    }
  });
  
  
  router.put('/:id', ensureAuthenticated, (req, res) => {
    Idea.findOne({
      _id: req.params.id
    })
    .then(idea => {
  
      idea.title = req.body.title;
      idea.details = req.body.details;
  
      idea.save()
        .then(idea => {
          req.flash('success_msg', 'Data is updated in database');
          res.redirect('/ideas');
        })
    });
  });
  
  
  router.delete('/:id', ensureAuthenticated, (req, res) => {
    Idea.remove({_id: req.params.id})
      .then(() => {
        req.flash('success_msg', 'Data is removed');
        res.redirect('/ideas');
      });
  });

  module.exports = router;