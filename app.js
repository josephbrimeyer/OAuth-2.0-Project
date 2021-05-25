const express = require("express");

const app = express();

const passport = require("passport");

const session = require("express-session");

const facebookStrategy = require("passport-facebook").Strategy;

const dotenv = require("dotenv").config();

app.set("view engine", "ejs");

app.use(session({ secret: "keyboard cat" }));
app.use(passport.initialize());
app.use(passport.session());

// Make our facebook strategy

passport.use(
  new facebookStrategy(
    {
      clientID: process.env.FACEBOOK_CLIENT_ID,
      clientSecret: process.env.FACEBOOK_CLIENT_SECRET,
      callbackURL: process.env.FACEBOOK_CALLBACK_URL,
      profileFields: [
        "id",
        "displayName",
        "name",
        "gender",
        "picture.type(large)",
        "email",
      ],
      passReqToCallback: true,
    }, // Facebook will send back the token and profile.
    function (token, refreshToken, profile, done) {
      console.log(profile);
      return done(null, profile);
    }
  )
);

app.get("/", (req, res) => {
  res.render("index");
});

app.get(
  "/auth/facebook",
  passport.authenticate("facebook", { scope: "email" })
);

app.get(
  "/facebook/callback",
  passport.authenticate("facebook", {
    successRedirect: "/profile",
    failureRedirect: "/",
  })
);

app.get("/profile", (req, res) => {
  res.send("You are a valid user");

  // res.render('profile', { user: req.user });
});

app.get("/failed", (req, res) => {
  res.send("You are not a valid user.");
});

passport.serializeUser(function (user, done) {
  done(null, user.id);
});
passport.deserializeUser(function (id, done) {
  return done(null, id);
});

app.listen(5000, () => {
  console.log("App is listening on Port 5000");
});
