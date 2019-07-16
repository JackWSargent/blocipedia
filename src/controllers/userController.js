const userQueries = require("../db/queries.user.js");
const passport = require("passport");
const sgMail = require("@sendgrid/mail");
module.exports = {
    signUp(req, res, next){
        res.render("users/sign_up");
    },
    create(req, res, next){
        let newUser = {
            username: req.body.username,
            email: req.body.email,
            password: req.body.password,
            passwordConfirmation: req.body.passwordConfirmation
        };
        userQueries.createUser(newUser, (err, user) => {
            if(err){
                console.log("error : " + err);
                req.flash("error", err);
                res.redirect("/users/sign_up");
            } else {
                console.log("creating user: " + req.body.username);
                sgMail.setApiKey(process.env.SENDGRID_API_KEY);
                const msg = {
                    to: req.body.email,
                    from: 'no-reply@blocipedia.org',
                    subject: 'Password Comfirmation',
                    text: 'Please click to comfirm your account',
                    html: '<a href="localhost:3000/">Click Here to go to Blocipedia</a>',
                };
                sgMail.send(msg);
                passport.authenticate("local")(req, res, () => {
                    req.flash("notice", "You've successfully signed in!");
                    res.redirect("/");
                })
            }
        });
    },
    signInForm(req, res, next){
        res.render("users/sign_in");
    },
    signIn(req, res, next){
        passport.authenticate("local")(req, res, function () {
          if(!req.user){
            console.log("failed login");
            req.flash("notice", "Sign in failed. Please try again.")
            res.redirect("/users/sign_in");
          } else {
            req.flash("notice", "You've successfully signed in!");
            res.redirect("/");
          }
        })
    },
    signOut(req, res, next){
        req.logout();
        req.flash("notice", "You've successfully signed out!");
        res.redirect("/");
    },
}