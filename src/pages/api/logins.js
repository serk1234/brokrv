// src/pages/api/logins.js

export default async function handler(req, res) {
  if (req.method === 'POST') {
    // Mock user data
    const mockUsers = {
      'testuser@example.com': 'testpassword123', // Buyer credentials
      'seller@example.com': 'sellerpassword123', // Seller credentials
    };

    try {
      const { email, password } = req.body;

      // Check if the email and password match the mock user credentials
      if (mockUsers[email] && mockUsers[email] === password) {
        // Simulate a successful login response
        res.status(200).json({ message: 'Login successful' });
      } else {
        // If credentials do not match, return an error
        res.status(401).json({ message: 'Invalid credentials' });
      }
    } catch (error) {
      res.status(400).json({ message: 'Error logging in', error: error.message });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
