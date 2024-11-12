import jwt from 'jsonwebtoken';
import dbConnect from './dbConnect';
import User from '../../../models/User';

export default async function handler(req, res) {
  const { code } = req.query;

  // Return a response if `code` is missing
  if (!code) {
    return res.status(400).json({ error: 'missing_code' });
  }

  try {
    // Exchange code for access token
    const tokenRes = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        code,
        client_id: process.env.GOOGLE_CLIENT_ID,
        client_secret: process.env.GOOGLE_CLIENT_SECRET,
        redirect_uri: `${process.env.BASE_URL}/api/auth/callback-dashboard`,
        grant_type: 'authorization_code'
      })
    });

    if (!tokenRes.ok) {
      const errorText = await tokenRes.text();
      console.error("Token exchange failed:", errorText);
      return res.status(500).json({ error: 'token_exchange_failed', details: errorText });
    }

    const tokenData = await tokenRes.json();
    const { access_token } = tokenData;

    if (!access_token) {
      console.error("Access token not received:", tokenData);
      return res.status(500).json({ error: 'access_token_missing' });
    }

    // Fetch user info
    const userInfoRes = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
      headers: { Authorization: `Bearer ${access_token}` }
    });

    if (!userInfoRes.ok) {
      const errorText = await userInfoRes.text();
      console.error("User info fetch failed:", errorText);
      return res.status(500).json({ error: 'user_info_fetch_failed', details: errorText });
    }

    const userInfo = await userInfoRes.json();

    // Connect to MongoDB and find or create user
    await dbConnect();
    const user = await User.findOneAndUpdate(
      { googleId: userInfo.id },
      {
        googleId: userInfo.id,
        displayName: userInfo.name,
        email: userInfo.email,
        profilePicture: userInfo.picture
      },
      { upsert: true, new: true }
    );

    if (!user) {
      console.error("User creation failed");
      return res.status(500).json({ error: 'user_creation_failed' });
    }

    // Debugging: Log JWT_SECRET to confirm it's loaded
    console.log('JWT_SECRET:', process.env.JWT_SECRET);

    // Create a JWT for the user
    const jwtToken = jwt.sign(
      { userId: user._id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );

    // Redirect to dashboard page with token
    return res.redirect(`${process.env.BASE_URL}/dashboardpage?token=${jwtToken}`);

  } catch (error) {
    console.error("Error during Google OAuth:", error.message);
    return res.status(500).json({ error: 'internal_error', details: error.message });
  }
}