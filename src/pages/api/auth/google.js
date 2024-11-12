import passport from './passport'; // Adjust the path as needed

export default async function handler(req, res) {
  const redirectTo = req.query.redirect; // Use `redirect` instead of `action`

  let callbackURL;

  // Determine the correct callback based on the `redirectTo` query parameter
  if (redirectTo === 'dashboardpage') {
    callbackURL = `${process.env.BASE_URL}/api/auth/callback-dashboard`;
  } else if (redirectTo === 'signNDA') {
    callbackURL = `${process.env.BASE_URL}/api/auth/callbackSignNDA`; // Adjusted callback for NDA
  } else {
    callbackURL = `${process.env.BASE_URL}/api/auth/callback`;
  }

  passport.authenticate('google', {
    scope: ['profile', 'email'],
    callbackURL: callbackURL,
  })(req, res);
}
