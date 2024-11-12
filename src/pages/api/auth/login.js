// /api/auth/login.js
export default async function handler(req, res) {
  const { redirect, listingId } = req.query;

  // Construct the Google OAuth URL
  const googleAuthUrl = `https://accounts.google.com/o/oauth2/v2/auth?${new URLSearchParams({
    client_id: process.env.GOOGLE_CLIENT_ID,
    redirect_uri: `${process.env.BASE_URL}/api/auth/signNDAcallback`,
    response_type: 'code',
    scope: 'openid email profile',
    access_type: 'offline',
    prompt: 'consent',
    state: JSON.stringify({
      redirect: redirect || '/',
      listingId: listingId || '',  // Add the listingId if provided
      action: 'signNDA'  // Indicate the action to be performed after login
    }),
  }).toString()}`;

  // Redirect the user to Google OAuth
  res.redirect(googleAuthUrl);
}
