import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ListingCard from './ListingCard';

const BuyerDashboard = ({ user }) => { 
  const [signedNDAsListings, setSignedNDAsListings] = useState([]);
  const [savedListings, setSavedListings] = useState([]);

  useEffect(() => {
    if (user) {
      console.log("User is authenticated:", user); // Debug log
      const savedListingIds = JSON.parse(localStorage.getItem('savedListings')) || [];
      setSavedListings(savedListingIds);
    } else {
      console.log("User is not authenticated.");
    }
  }, [user]);

  useEffect(() => {
    const fetchListings = async () => {
      try {
        if (user) {
          const response = await axios.get('/api/listings/getSignedNDAs', {
            headers: { Authorization: `Bearer ${user.token}` },
          });
          setSignedNDAsListings(response.data);
        }
      } catch (error) {
        console.error('Error fetching signed NDA listings:', error);
      }
    };

    fetchListings();
  }, [user]);

  if (!user) {
    return <p>Please log in to view your dashboard.</p>; // Message for unauthenticated users
  }

  return (
    <div className="buyer-dashboard">
      <h2 className="text-3xl font-bold">Buyer Dashboard</h2>

      <section>
        <h3 className="text-xl font-semibold mt-4">Listings you have signed NDAs for</h3>
        <div className="listings-grid">
          {signedNDAsListings.length ? (
            signedNDAsListings.map(listing => (
              <ListingCard key={listing._id} listing={listing} />
            ))
          ) : (
            <p>No signed NDA listings found.</p>
          )}
        </div>
      </section>

      <section>
        <h3 className="text-xl font-semibold mt-4">Listings you have saved</h3>
        <div className="listings-grid">
          {savedListings.length ? (
            savedListings.map(listingId => (
              <ListingCard key={listingId} listing={{ _id: listingId }} />
            ))
          ) : (
            <p>No saved listings found.</p>
          )}
        </div>
      </section>
    </div>
  );
};

export default BuyerDashboard;
