// pages/api/verifyToken.js
import jwt from 'jsonwebtoken';

export default function handler(req, res) {
  const { token } = req.query;

  if (!token) {
    return res.status(400).json({ error: 'Token is required' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    return res.status(200).json({ valid: true, decoded });
  } catch (error) {
    return res.status(401).json({ valid: false, error: 'Invalid token' });
  }
}
