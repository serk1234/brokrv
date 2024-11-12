import dbConnect from '../auth/dbConnect';
import Listing from '../../../models/Listing';
import mongoose from 'mongoose';

export default async function handler(req, res) {
  await dbConnect();

  console.log("Received body:", req.body);  // Log entire request body to see its structure

  const { listingId } = req.body;

  console.log("Received listingId:", listingId, "Type:", typeof listingId);

  // Validate that listingId is a string and a valid MongoDB ObjectId
  if (!listingId || typeof listingId !== 'string' || !mongoose.Types.ObjectId.isValid(listingId)) {
    console.error("Invalid listingId format:", listingId);
    return res.status(400).json({ error: 'Invalid listingId format' });
  }

  try {
    const listing = await Listing.findById(listingId);

    if (!listing) {
      return res.status(404).json({ error: 'Listing not found' });
    }

    // Mark NDA as signed or any additional logic here
    res.status(200).json({ message: 'NDA signed successfully' });
  } catch (error) {
    console.error("Error signing NDA:", error.message);
    res.status(500).json({ error: 'Error signing NDA' });
  }
}
