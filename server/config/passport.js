const passport = require("passport");
const { Strategy: JwtStrategy } = require("passport-jwt");
const { Strategy: GoogleStrategy } = require("passport-google-oauth2");
const { Strategy: AppleStrategy } = require("passport-apple");
const mongoose = require("mongoose");
const path = require("path");

const keys = require("./keys");
const { EMAIL_PROVIDER } = require("../constants");

const { google, apple } = keys;
const { secret, myBearerPrefix } = keys.jwt;

const User = mongoose.model("User");

//-- extractor for custom token prefix
const myBearerExtractor = (req) => {
  try {
    let token = null;
    if (req.headers && req.headers.authorization) {
      const parts = req.headers.authorization.split(" ");
      if (parts.length === 2 && parts[0] === myBearerPrefix) {
        token = parts[1];
      }
    }
    return token;
  } catch (err) {
    console.error("myBearerExtractor:", err?.message);
    return null;
  }
};

const opts = {
  jwtFromRequest: myBearerExtractor,
  secretOrKey: secret
};

passport.use(
  new JwtStrategy(opts, async (payload, done) => {
    try {
      const user = await User.findById(payload.id);
      if (user) {
        return done(null, user);
      }
      return done(null, false);
    } catch (err) {
      return done(err, false);
    }
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
  } catch (err) {
    console.error("[googleAuth] Missing google keys:", err?.message);
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
  } catch (err) {
    console.error("[appleAuth] Missing apple keys:", err?.message);
  }
};
