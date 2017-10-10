var express = require("express");
var router = express.Router();
var passport = require("passport");
var User = require("../models/user");
var Campground = require("../models/campground");

//root route
router.get("/", function (req, res) {
    res.render("landing", { page: "register" });
});

//show register form
router.get("/register", function (req, res) {
    res.render("register");
});

//handle sign up logic
router.post("/register", function (req, res) {
    var newUser = new User({
        username: req.body.username,
        avatar: req.body.avatar,
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        email: req.body.email,
        bio: req.body.bio
    });
    //is the user admin?
    if (req.body.adminValidation === "adm1nc0d3") {
        newUser.admin = true;
    }
    User.register(newUser, req.body.password, function (err, user) {
        if (err) {
            console.log(err);
            return res.render("register", { error: err.message });
        }
        passport.authenticate("local")(req, res, function () {
            req.flash("success", "Welcome " + user.username);
            res.redirect("/campgrounds");
        });
    });
});

//show login form
router.get("/login", function (req, res) {
    res.render("login", { page: "login" });
});

//handling login logic
router.post("/login", passport.authenticate("local",
    {
        successRedirect: "/campgrounds",
        failureRedirect: "/login",
        failureFlash: "Username or password is incorrect!",
        successFlash: "Welcome back!"
    }), function (req, res) {
    });

//logout route
router.get("/logout", function (req, res) {
    req.logout();
    req.flash("error", "You have logged out!");
    res.redirect("/campgrounds");
});

//user profile
router.get("/users/:id", function (req, res) {
    User.findById(req.params.id, function (err, foundUser) {
        if (err) {
            req.flash("error", "User not found!");
            res.redirect("back");
        } else {
            Campground.find().where("author.id").equals(foundUser._id).exec(function (err, campgrounds) {
                if (err) {
                    req.flash("error", "Something went wrong");
                    res.redirect("back");
                } else {
                    res.render("users/show", { user: foundUser, campgrounds: campgrounds });
                }
            });
        }
    });
});

module.exports = router;