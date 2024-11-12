require('dotenv').config({ path: './.env.local' }); // Specify the exact path to your env file

const dbConnect = require('./src/pages/api/auth/dbConnect'); 
const Listing = require('./src/models/Listing'); 

async function initializeListings() {
    await dbConnect();

    try {
        await Listing.updateMany(
            { ndaSignedBy: { $exists: false } }, // Find listings where ndaSignedBy is missing
            { $set: { ndaSignedBy: [] } }         // Set ndaSignedBy to an empty array
        );
        console.log("All listings initialized with ndaSignedBy field.");
    } catch (error) {
        console.error("Error initializing ndaSignedBy field:", error);
    } finally {
        process.exit(); // Exit the script after running
    }
}

initializeListings();

