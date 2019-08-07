const userQueries = require("../db/queries.user.js");
const wikiQueries = require("../db/queries.wiki.js");
const passport = require("passport");
const sgMail = require("@sendgrid/mail");
const secretKey = "sk_test_UpmWeAejUQCmCuXSdqc7rFd600fFB104zH";
const keyPublishable = "pk_test_HuYw0bsV4lODDe8aER3FWtvW00nsWf3GHU";
const stripe = require('stripe')(secretKey);
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
    subscription(req, res, next){
        res.render("./users/subscription.ejs", {keyPublishable});//
    },
    upgradeToPremium(req,res,next){
        const charge = 1500;
        stripe.customers.create({ //Create customer https://stripe.com/docs/checkout/express
            email: req.body.stripeEmail,
            source: req.body.stripeToken, // obtained with Stripe.js
          })
          .then((customer) => { //Create charge 
              stripe.charges.create({
                amount: charge,
                currency: "usd",
                customer: customer.id,
                description: "Charge for a purchase of a Blocipedia Membership",
              }) 
              .then((charges) => {
                    userQueries.upgradeToPremium(req.user.dataValues.id);
                    res.render("./users/successful_Charge.ejs");
              })
          })
    },
    downgradeToFree(req, res, next){
        console.log("donwgrading");
        userQueries.downgradeToFree(req.user.dataValues.id);
        wikiQueries.makeWikisPublic(req.user.dataValues.id);
        req.flash("notice", "You are no longer a premium user!");
        res.redirect("/");
    },
}