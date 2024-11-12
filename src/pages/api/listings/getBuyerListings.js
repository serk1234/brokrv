// /pages/api/listings/getBuyerListings.js
import dbConnect from '../auth/dbConnect';
import Listing from '../../../models/Listing';
import jwt from 'jsonwebtoken';
import { parse } from 'cookie';

export default async function handler(req, res) {
  await dbConnect();

  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  // Parse the token from cookies
  const cookies = parse(req.headers.cookie || '');
  const token = cookies.token;

  if (!token) {
    return res.status(401).json({ error: 'Unauthorized: Missing token' });
  }

  let userId;
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    userId = decoded.userId;
  } catch (error) {
    return res.status(401).json({ error: 'Invalid token' });
  }

  try {
    // Find listings where the user has signed the NDA (or modify for saved listings)
    const listings = await Listing.find({ ndaSignedBy: userId });
    res.status(200).json(listings);
  } catch (error) {
    console.error('Error fetching buyer listings:', error);
    res.status(500).json({ error: 'Error fetching buyer listings', details: error.message });
  }
}
