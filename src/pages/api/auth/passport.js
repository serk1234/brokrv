const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const User = require('../../../models/User');
const dbConnect = require('./dbConnect');

// Set up Google Strategy with a generic callback URL
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: `${process.env.BASE_URL}/api/auth/callback`, // Default callback URL
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        await dbConnect(); // Ensure database connection
        let user = await User.findOne({ googleId: profile.id });

        if (!user) {
          user = new User({
            googleId: profile.id,
            displayName: profile.displayName,
            email: profile.emails[0].value,
            profilePicture: profile.photos[0].value,
          });
          await user.save();
        }
        done(null, user);
      } catch (error) {
        console.error("Error in Google Strategy:", error);
        done(error, null);
      }
    }
  )
);

// Serialize the user ID for session management
passport.serializeUser((user, done) => done(null, user.id));

// Deserialize the user ID to retrieve user information
passport.deserializeUser(async (id, done) => {
  try {
    await dbConnect();
    const user = await User.findById(id);
    done(null, user);
  } catch (error) {
    done(error, null);
  }
});

module.exports = passport;