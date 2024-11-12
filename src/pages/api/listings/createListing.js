import dbConnect from '../auth/dbConnect';
import Listing from '../../../models/Listing';
import jwt from 'jsonwebtoken';
import { parse } from 'cookie';

const industryImages = {
  Agriculture: '/assets/Agriculture.webp',
  Construction: '/assets/Construction.webp',
  Education: '/assets/Education.webp',
  Finance: '/assets/Finance.webp',
  Healthcare: '/assets/Healthcare.webp',
  Hospitality: '/assets/Hospitality.webp',
  Manufacturing: '/assets/Manufacturing.webp',
  Other: '/assets/Other.webp',
  Retail: '/assets/Retail.webp',
  Technology: '/assets/Technology.webp',
  Transportation: '/assets/Transportation.webp',
};

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  await dbConnect();

  try {
    const {
      businessName,
      industry,
      location,
      price,
      revenue,
      cashFlow,
      sellerFinancing,
      terms,
      description,
      financials = { '2021': {}, '2022': {}, '2023': {} },
      financialBreakdown = {},
      keyMetrics = { revenueGrowth: {} },
    } = req.body;

    // Basic validation for required fields
    if (!businessName || !industry || !location || !price || !revenue || !cashFlow || !description) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    // Parse and validate numeric fields
    const parsedPrice = parseFloat(price);
    const parsedRevenue = parseFloat(revenue);
    const parsedCashFlow = parseFloat(cashFlow);
    if (isNaN(parsedPrice) || isNaN(parsedRevenue) || isNaN(parsedCashFlow)) {
      return res.status(400).json({ message: 'Invalid numeric values' });
    }

    const multiple = parsedPrice / parsedCashFlow;
    const image = industryImages[industry] || '/assets/Other.webp';

    // Parse token from cookies
    const cookies = parse(req.headers.cookie || '');
    const token = cookies.token; // assuming 'token' is the name of your cookie

    if (!token) {
      return res.status(401).json({ message: 'Missing token, please log in' });
    }

    let userId;
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      userId = decoded.userId;
      console.log("Decoded userId from token:", userId); // Debug log
    } catch (error) {
      console.warn("Invalid token, unable to retrieve 'createdBy':", error.message);
      return res.status(401).json({ message: 'Invalid token, please log in again' });
    }

    if (!userId) {
      return res.status(400).json({ message: 'User ID is required to create a listing' });
    }

    // Log listing data before saving for debugging purposes
    console.log("Creating listing with data:", {
      businessName,
      industry,
      location,
      price: parsedPrice,
      revenue: parsedRevenue,
      cashFlow: parsedCashFlow,
      multiple,
      sellerFinancing,
      terms,
      description,
      financials,
      keyMetrics,
      financialBreakdown,
      image,
      createdBy: userId,
    });

    // Create and save the new listing
    const newListing = new Listing({
      businessName,
      industry,
      location,
      price: parsedPrice,
      revenue: parsedRevenue,
      cashFlow: parsedCashFlow,
      multiple,
      sellerFinancing,
      terms,
      description,
      financials,
      keyMetrics,
      financialBreakdown,
      image,
      createdBy: userId,
      createdAt: new Date(),
    });

    await newListing.save();
    res.status(201).json({ message: 'Listing created successfully', listing: newListing });
  } catch (error) {
    console.error("Error creating listing:", error); // Log error details
    res.status(500).json({ message: 'Error creating listing', error: error.message });
  }
}
