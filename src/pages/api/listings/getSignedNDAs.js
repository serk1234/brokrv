import dbConnect from '../auth/dbConnect';
import Listing from '../../../models/Listing';
import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';

const getUserIdFromToken = (token) => {
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    return decoded.userId;
  } catch (error) {
    console.error('Invalid token:', error);
    return null;
  }
};

export default async function handler(req, res) {
  await dbConnect();

  // Ensure the request is a GET request
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const token = req.headers.authorization?.split(' ')[1];
  if (!token) {
    return res.status(401).json({ error: 'Unauthorized: Token missing' });
  }

  const userId = getUserIdFromToken(token);
  if (!userId) {
    return res.status(401).json({ error: 'Unauthorized: Invalid token' });
  }

  // Check if the userId is a valid ObjectId
  if (!mongoose.Types.ObjectId.isValid(userId)) {
    return res.status(400).json({ error: 'Invalid user ID' });
  }

  try {
    // Retrieve listings where the user has signed the NDA
    const listings = await Listing.find({ ndaSignedBy: userId });
    
    if (!listings.length) {
      return res.status(404).json({ message: 'No NDA-signed listings found for this user' });
    }

    res.status(200).json(listings);
  } catch (error) {
    console.error('Error fetching NDA-signed listings:', error);
    res.status(500).json({ error: 'Error fetching NDA-signed listings', details: error.message });
  }
}
