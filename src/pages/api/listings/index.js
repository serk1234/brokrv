import dbConnect from '../auth/dbConnect';
import Listing from '../../../models/Listing';

export default async function handler(req, res) {
  await dbConnect();

  if (req.method === 'GET') {
    try {
      const listings = await Listing.find({});
      res.status(200).json(listings);
    } catch (error) {
      console.error('Error fetching listings:', error);
      res.status(500).json({ success: false, message: 'Error fetching listings', error: error.message });
    }
  } else {
    res.status(405).json({ success: false, message: 'Method not allowed' });
  }
}
