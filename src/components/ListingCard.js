// ListingCard.js
import React from 'react';

const ListingCard = ({ listing, onView }) => {
  return (
    <div className="listing-card">
      <h2>{listing.name}</h2>
      <p>{listing.location}</p>
      <p>{listing.price}</p>
      <button onClick={() => onView(listing.id)}>View</button>
    </div>
  );
};

export default ListingCard;
