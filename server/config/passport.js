const passport = require("passport");
const { Strategy: JwtStrategy } = require("passport-jwt");
const { Strategy: GoogleStrategy } = require("passport-google-oauth20");
const { Strategy: AppleStrategy } = require("passport-apple");
const mongoose = require("mongoose");
const path = require("path");

const keys = require("./keys");
const { EMAIL_PROVIDER } = require("../constants");

const { google, apple } = keys;
const { jwtSecret, myBearerPrefix } = keys.jwt;

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
  secretOrKey: jwtSecret
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
      console.error("JwtStrategy:", err?.message);
      return done(err, false);
    }
  })
);

passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((user, done) => {
  done(null, user);
});

const googleAuth = async () => {
  try {
    passport.use(
      new GoogleStrategy(
        {
          clientID: google.clientID,
          clientSecret: google.clientSecret,
          callbackURL: google.callbackURL
        },
        async (_accessToken, _refreshToken, profile, done) => {
          try {
            // console.log("GoogleStrategy:", profile);

            let user = null;
            user = await User.findOne({ googleId: profile.id });
            if (!user) {
              user = new User({
                provider: EMAIL_PROVIDER.Google,
                googleId: profile.id,
                email: profile.emails?.[0].value,
                firstName: profile.name?.givenName,
                lastName: profile.name?.familyName,
                avatar: profile.photos?.[0].value,
                password: null
              });
              await user.save();
            }

            return done(null, user);
          } catch (error) {
            console.error("GoogleStrategy:", error?.message);
            return done(error, false);
          }
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

module.exports = async (app) => {
  app.use(passport.initialize());
  app.use(passport.session());

  await googleAuth();
  await appleAuth();
};
