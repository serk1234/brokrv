import jwt from 'jsonwebtoken';
import dbConnect from './dbConnect';
import User from '../../../models/User';
import { serialize } from 'cookie';

export default async function handler(req, res) {
  const { code } = req.query;

  if (!code) {
    return res.status(400).json({ error: 'missing_code' });
  }

  try {
    const tokenRes = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        code,
        client_id: process.env.GOOGLE_CLIENT_ID,
        client_secret: process.env.GOOGLE_CLIENT_SECRET,
        redirect_uri: `${process.env.BASE_URL}/api/auth/callback`,
        grant_type: 'authorization_code',
      }),
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

    const userInfoRes = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
      headers: { Authorization: `Bearer ${access_token}` },
    });

    if (!userInfoRes.ok) {
      const errorText = await userInfoRes.text();
      console.error("User info fetch failed:", errorText);
      return res.status(500).json({ error: 'user_info_fetch_failed', details: errorText });
    }

    const userInfo = await userInfoRes.json();

    await dbConnect();
    const user = await User.findOneAndUpdate(
      { googleId: userInfo.id },
      {
        googleId: userInfo.id,
        displayName: userInfo.name,
        email: userInfo.email,
        profilePicture: userInfo.picture,
      },
      { upsert: true, new: true }
    );

    if (!user) {
      console.error("User creation failed");
      return res.status(500).json({ error: 'user_creation_failed' });
    }

    const jwtToken = jwt.sign(
      { userId: user._id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );

    // Set token in cookies
    res.setHeader('Set-Cookie', serialize('token', jwtToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 60 * 60 * 24, // 1 day
      path: '/',
    }));

    // Redirect to create-listing page without token in URL
    return res.redirect(`${process.env.BASE_URL}/create-listing`);

  } catch (error) {
    console.error("Error during Google OAuth:", error.message);
    return res.status(500).json({ error: 'internal_error', details: error.message });
  }
}
