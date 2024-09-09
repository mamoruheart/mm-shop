import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import User from '../model/user';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import AppleStrategy from 'passport-apple';
dotenv.config();

console.log(process.env.GOOGLE_CLIENT_ID!)
passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID!,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
  callbackURL: "http://localhost:3000/auth/google/callback"
}, async (accessToken, refreshToken, profile, done) => {
  try {
    let user = await User.findOne({ googleId: profile.id });
    if (!user) {
      user = new User({
        googleId: profile.id,
        name: profile.displayName,
        email: profile.emails?.[0].value,
        state: 0
      });
      await user.save();
    }
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET!, { expiresIn: '1h' });
    return done(null, { user, token });
  } catch (err) {
    return done(err, undefined);
  }
}));

passport.use('apple', new AppleStrategy({
  clientID: process.env.APPLE_CLIENT_ID!,
  teamID: process.env.APPLE_TEAM_ID!,
  callbackURL: '/auth/apple/callback',
  keyID: process.env.APPLE_KEY_ID!,
  privateKeyLocation: '../../AuthKey_8MWT8952R5.p8' // Path to your private key file
},(req, accessToken, refreshToken, idToken, profile, cb)=>{}));

passport.serializeUser((user: any, done) => {
  done(null, user);
});

passport.deserializeUser((obj: any, done) => {
  done(null, obj);
});

export default passport;
