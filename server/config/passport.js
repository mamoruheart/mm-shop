const passport = require("passport");
const JwtStrategy = require("passport-jwt").Strategy;
const GoogleStrategy = require("passport-google-oauth2").Strategy;
const AppleStrategy = require("passport-apple").Strategy;
const ExtractJwt = require("passport-jwt").ExtractJwt;
const mongoose = require("mongoose");
const path = require("path");

const keys = require("./keys");
const { EMAIL_PROVIDER } = require("../constants");

const { google, apple } = keys;

const User = mongoose.model("User");
const secret = keys.jwt.secret;

const opts = {};
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = secret;

passport.use(
  new JwtStrategy(opts, (payload, done) => {
    User.findById(payload.id)
      .then((user) => {
        if (user) {
          return done(null, user);
        }
        return done(null, false);
      })
      .catch((err) => {
        return done(err, false);
      });
  })
);

module.exports = async (app) => {
  app.use(passport.initialize());

  await googleAuth();
  await appleAuth();
};

const googleAuth = async () => {
  try {
    passport.use(
      new GoogleStrategy(
        {
          clientID: google.clientID,
          clientSecret: google.clientSecret,
          callbackURL: google.callbackURL
        },
        (accessToken, refreshToken, profile, done) => {
          User.findOne({ email: profile.email })
            .then((user) => {
              if (user) {
                return done(null, user);
              }

              const name = profile.displayName.split(" ");

              const newUser = new User({
                provider: EMAIL_PROVIDER.Google,
                googleId: profile.id,
                email: profile.email,
                firstName: name[0],
                lastName: name[1],
                avatar: profile.picture,
                password: null
              });

              newUser.save((err, user) => {
                if (err) {
                  return done(err, false);
                }

                return done(null, user);
              });
            })
            .catch((err) => {
              return done(err, false);
            });
        }
      )
    );
  } catch (error) {
    console.log("Missing google keys");
  }
};

const appleAuth = async () => {
  try {
    passport.use(
      new AppleStrategy(
        {
          clientID: apple.clientID,
          teamID: apple.teamID,
          callbackURL: apple.callbackURL,
          keyID: apple.keyID,
          privateKeyLocation: path.resolve(
            __dirname,
            "..",
            "AuthKey_8MWT8952R5.p8"
          )
        },
        (accessToken, refreshToken, idToken, profile, done) => {
          User.findOne({ appleId: profile.id })
            .then((user) => {
              if (user) {
                return done(null, user);
              }

              const newUser = new User({
                provider: EMAIL_PROVIDER.Apple,
                appleId: profile.id,
                email: profile.emails ? profile.emails[0].value : null,
                firstName: profile.name.givenName,
                lastName: profile.name.familyName,
                avatar: profile.photos[0].value,
                password: null
              });

              newUser.save((err, user) => {
                if (err) {
                  return done(err, false);
                }

                return done(null, user);
              });
            })
            .catch((err) => {
              return done(err, false);
            });
        }
      )
    );
  } catch (error) {
    console.log("Missing apple keys");
  }
};
