const LocalStratergy = require('passport-local').Strategy;
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const User = mongoose.model('users');

module.exports = function(passport){
    passport.use(new LocalStratergy({usernameField: 'email'}, (email, password, done) =>{
        User.findOne({
            email: email
        }).then(user => {
            if(!user){
                return done(null, false, {message: "user with this email id is not exsist"})
            }

            bcrypt.compare(password, user.password, (err, isMatch) => {
                if(isMatch){
                    return done(null, user)
                }
                else{
                    return done(null, false, {message:'password is not matching'})
                }
            })
        })
    }));

    passport.serializeUser(function(user, done) {
        done(null, user.id);
      });
      
      passport.deserializeUser(function(id, done) {
        User.findById(id, function(err, user) {
          done(err, user);
        });
      });
}
