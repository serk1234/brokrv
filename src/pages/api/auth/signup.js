import dbConnect from './dbConnect';
import User from '../../../models/User';

export default async function handler(req, res) {
  await dbConnect();
  
  if (req.method === 'POST') {
    const { email, password, name } = req.body;

    // Check if the user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Save the new user to the database
    const newUser = new User({
      email,
      password, // Make sure to hash the password before saving in production
      name,
    });

    try {
      await newUser.save();
      res.status(201).json({ message: 'User registered successfully' });
    } catch (error) {
      console.error('Error saving user:', error);
      res.status(500).json({ message: 'Error saving user' });
    }
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
} 