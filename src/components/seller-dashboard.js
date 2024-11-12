import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/router';
import StylizedButton from '../components/stylized-button';

const SellerDashboard = () => {
  const [listings, setListings] = useState([]);
  const router = useRouter();

  useEffect(() => {
    const fetchListings = async () => {
      const token = localStorage.getItem('jwtToken');
      try {
        const { data } = await axios.get('/api/listings/getSellerListings', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setListings(data);
      } catch (error) {
        console.error('Error fetching seller listings:', error);
      }
    };

    fetchListings();
  }, [router.query.refresh]);

  return (
    <div className="bg-white p-4 rounded-lg shadow-lg border border-gray-300 mt-8">
      <h2 className="text-3xl font-bold text-gray-800 mb-4">Seller Dashboard</h2>
      <p className="text-lg text-gray-600">Your active listings will be shown here.</p>
      {listings.length > 0 ? (
        <div className="space-y-6 mt-4">
          {listings.map((listing, index) => (
            <div
              key={listing._id || index}
              className="bg-[#E0E7F1] p-4 border border-black shadow-lg rounded-lg space-y-4"
            >
              <div className="flex items-start gap-4">
                <img
                  src={listing.image || '/business-image.jpg'}
                  alt="Business storefront"
                  className="w-[160px] h-[96px] object-cover rounded border border-black"
                />
                <h2 className="font-medium text-lg">
                  {listing.businessName}
                </h2>
              </div>
              <div className="grid grid-cols-4 gap-4 mt-4">
                <div className="bg-white p-2 border border-black rounded w-full max-w-[150px] text-center">
                  <div className="font-semibold">1</div>
                  <div className="text-sm text-gray-600">Views</div>
                </div>
                <div className="bg-white p-2 border border-black rounded w-full max-w-[150px] text-center">
                  <div className="font-semibold">2</div>
                  <div className="text-sm text-gray-600">Questions</div>
                </div>
                <div className="bg-white p-2 border border-black rounded w-full max-w-[150px] text-center">
                  <div className="font-semibold">3</div>
                  <div className="text-sm text-gray-600">NDAs</div>
                </div>
                <div className="bg-white p-2 border border-black rounded w-full max-w-[150px] text-center">
                  <div className="font-semibold">4</div>
                  <div className="text-sm text-gray-600">Watchlist</div>
                </div>
              </div>
              <div className="flex justify-end mt-4">
                <StylizedButton
                  text="View"
                  onClick={() => router.push(`/listings/${listing._id}`)}
                  className="px-4 py-2 bg-[#A3E636] rounded-lg shadow-md"
                />
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="mt-4 text-gray-500">No listings found.</p>
      )}
      <div className="flex justify-end mt-6">
        <StylizedButton
          text="Create New Listing"
          onClick={() => router.push('/create-listing')}
          className="bg-[#F87171] px-4 py-2 rounded-lg shadow-lg text-black font-semibold"
        />
      </div>
    </div>
  );
};

export default SellerDashboard;
