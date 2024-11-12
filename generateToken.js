const jwt = require('jsonwebtoken');
const fs = require('fs');
const docusign = require('docusign-esign');
const path = require('path');

// Your credentials (Replace with your actual values)
const integrationKey = '16a4bce8-8112-4b58-b851-6bb59d1b9cd6'; // Your Integration Key (API Key)
const userId = 'd91e43f1-9775-4e5e-8d49-95fcafe6e318'; // Corrected User ID (Your API User ID)
const accountId = '7b4927ea-7b94-4db0-9dda-1bc6a7f41ddf'; // Your Account ID
const privateKeyPath = path.join(__dirname, 'privateKey.pem'); // The path to your private key file

// Read your private key from the provided RSA PRIVATE KEY
const privateKey = fs.readFileSync(privateKeyPath);

// JWT payload
const jwtPayload = {
  iss: integrationKey,
  sub: userId,
  aud: 'account-d.docusign.com', // For sandbox use 'account-d.docusign.com'. For production use 'account.docusign.com'
  iat: Math.floor(Date.now() / 1000),
  exp: Math.floor(Date.now() / 1000) + (60 * 60), // Token valid for 1 hour
  scope: 'signature impersonation'
};

// Sign JWT
const jwtToken = jwt.sign(jwtPayload, privateKey, { algorithm: 'RS256' });

console.log("Generated JWT:", jwtToken); // For debugging

// Exchange JWT for OAuth token
async function getOAuthToken() {
  const apiClient = new docusign.ApiClient();
  apiClient.setOAuthBasePath('account-d.docusign.com'); // Sandbox environment

  try {
    const results = await apiClient.requestJWTUserToken(
      integrationKey,
      userId,
      'signature impersonation',
      privateKey,
      3600 // 1 hour
    );

    const accessToken = results.body.access_token;
    console.log('OAuth Access Token:', accessToken);

    // Save token to .env.local file for future use
    const envData = `DOCUSIGN_ACCESS_TOKEN=${accessToken}\nDOCUSIGN_ACCOUNT_ID=${accountId}\nDOCUSIGN_BASE_URI=https://demo.docusign.net`;
    fs.writeFileSync('.env.local', envData);

    console.log('Environment variables saved to .env.local');
  } catch (error) {
    // Add detailed error logging
    if (error.response && error.response.body) {
      console.error('Error during token generation:', error.response.body);
    } else {
      console.error('Error during token generation:', error);
    }
  }
}

getOAuthToken();
