import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';
import BrokrHeaderDesign from '../components/brokr-header-design';
import StylizedButton from '../components/stylized-button';
import Footer from '../components/footer';
import '../styles/globals.css';

const DashboardPage = () => {
  const router = useRouter();
  const [buyerListings, setBuyerListings] = useState([]);
  const [sellerListings, setSellerListings] = useState([]);
  const [activeTab, setActiveTab] = useState("Buyer");

  useEffect(() => {
    const { token, refresh } = router.query;

    // Store token if present in the URL query
    if (token) {
      localStorage.setItem("jwtToken", token);
    }

    const storedToken = localStorage.getItem("jwtToken");

    if (storedToken) {
      const signedListingId = localStorage.getItem("signedListingId");

      if (signedListingId) {
        // Convert `signedListingId` to a string if it's not already
        const listingIdString = String(signedListingId);

        // Associate the signed NDA with the user's ID in the backend
        axios.post('/api/listings/associateNDA', { listingId: listingIdString }, {
          headers: { Authorization: `Bearer ${storedToken}` },
        })
        .then(() => {
          // Remove signedListingId from localStorage after associating it
          localStorage.removeItem("signedListingId");
        })
        .catch((error) => {
          console.error('Error associating signed NDA:', error.message || error);
        });
      }

      // Fetch buyer and seller listings
      fetchBuyerListings(storedToken);
      fetchSellerListings(storedToken);

      // Re-fetch seller listings if `refresh=true` is in the query
      if (refresh === 'true') {
        fetchSellerListings(storedToken);
        router.replace(router.pathname, undefined, { shallow: true }); // Remove refresh from URL after fetching
      }
    } else {
      // If no token, redirect to login
      router.push('/api/auth/google-dashboard');
    }
  }, [router.query]);

  // Function to fetch buyer listings
  const fetchBuyerListings = async (token) => {
    try {
      const { data: buyerData } = await axios.get('/api/listings/getSignedNDAs', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setBuyerListings(buyerData);
    } catch (error) {
      console.error('Error fetching buyer listings:', error);
    }
  };

  // Function to fetch seller listings
  const fetchSellerListings = async (token) => {
    try {
      const { data: sellerData } = await axios.get('/api/listings/getSellerListings', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setSellerListings(sellerData);
    } catch (error) {
      console.error('Error fetching seller listings:', error);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      <BrokrHeaderDesign activePage="dashboard" />
      <main className="flex flex-col items-center justify-center flex-grow p-8">
        <div className="flex flex-col md:flex-row justify-center items-center space-x-0 md:space-x-4 space-y-4 md:space-y-0">
          <StylizedButton
            text="Buyer Dashboard"
            onClick={() => setActiveTab("Buyer")}
            className={`px-6 py-2 rounded-lg shadow-lg font-semibold ${
              activeTab === "Buyer" ? "bg-[#A3E636] text-black" : "bg-white text-black"
            }`}
          />
          <StylizedButton
            text="Seller Dashboard"
            onClick={() => setActiveTab("Seller")}
            className={`px-6 py-2 rounded shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] font-semibold border border-black ${
              activeTab === "Seller" ? "bg-[#FF6347] text-white" : "bg-white text-black"
            }`}
          />
        </div>

        <div className="container mx-auto p-6">
          {activeTab === "Buyer" && (
            <div className="space-y-4">
              <p className="text-lg text-gray-600">
                Listings you have signed NDAs for will be shown here.
              </p>
              {buyerListings.length > 0 ? (
                <div className="space-y-4">
                  {buyerListings.map((listing, index) => (
                    <div
                      key={index}
                      className="bg-[#E0E7F1] p-4 border border-black shadow-lg rounded-lg flex items-center space-x-6"
                    >
                      <img
                        src={listing.image || '/business-image.jpg'}
                        alt="Business storefront"
                        className="w-[200px] h-[150px] object-cover rounded border border-black"
                      />
                      <div className="flex-1 space-y-2">
                        <h2 className="font-medium text-2xl">{listing.businessName}</h2>
                        <div className="grid grid-cols-4 gap-4">
                          <div className="bg-white p-4 border border-black rounded text-center">
                            <div className="font-semibold text-lg">${listing.price.toLocaleString()}</div>
                            <div className="text-sm text-gray-600">Price</div>
                          </div>
                          <div className="bg-white p-4 border border-black rounded text-center">
                            <div className="font-semibold text-lg">${listing.revenue.toLocaleString()}</div>
                            <div className="text-sm text-gray-600">Revenue</div>
                          </div>
                          <div className="bg-white p-4 border border-black rounded text-center">
                            <div className="font-semibold text-lg">${listing.cashFlow.toLocaleString()}</div>
                            <div className="text-sm text-gray-600">Cash Flow</div>
                          </div>
                          <div className="bg-white p-4 border border-black rounded text-center">
                            <div className="font-semibold text-lg">{listing.multiple}x</div>
                            <div className="text-sm text-gray-600">Multiple</div>
                          </div>
                        </div>
                      </div>
                      <StylizedButton
                        text="View"
                        onClick={() => router.push(`/listings/${listing._id}`)}
                        className="px-4 py-2"
                      />
                    </div>
                  ))}
                </div>
              ) : (
                <p className="mt-4 text-gray-500">No listings found.</p>
              )}
            </div>
          )}

          {activeTab === "Seller" && (
            <div className="space-y-4">
              <h2 className="text-3xl font-bold text-gray-800 mb-4">Seller Dashboard</h2>
              {sellerListings.length > 0 ? (
                <div className="space-y-4">
                  {sellerListings.map((listing, index) => (
                    <div
                      key={index}
                      className="bg-[#E0E7F1] p-4 border border-black shadow-lg rounded-lg flex items-center space-x-6"
                    >
                      <img
                        src={listing.image || '/business-image.jpg'}
                        alt="Business storefront"
                        className="w-[200px] h-[150px] object-cover rounded border border-black"
                      />
                      <div className="flex-1 space-y-2">
                        <h2 className="font-medium text-2xl">{listing.businessName}</h2>
                        <div className="grid grid-cols-4 gap-4">
                          <div className="bg-white p-4 border border-black rounded text-center">
                            <div className="font-semibold text-lg">1</div>
                            <div className="text-sm text-gray-600">Views</div>
                          </div>
                          <div className="bg-white p-4 border border-black rounded text-center">
                            <div className="font-semibold text-lg">2</div>
                            <div className="text-sm text-gray-600">Questions</div>
                          </div>
                          <div className="bg-white p-4 border border-black rounded text-center">
                            <div className="font-semibold text-lg">3</div>
                            <div className="text-sm text-gray-600">NDAs</div>
                          </div>
                          <div className="bg-white p-4 border border-black rounded text-center">
                            <div className="font-semibold text-lg">4</div>
                            <div className="text-sm text-gray-600">Watchlist</div>
                          </div>
                        </div>
                      </div>
                      <StylizedButton
                        text="View"
                        onClick={() => router.push(`/listings/${listing._id}`)}
                        className="px-4 py-2 bg-[#A3E636] rounded-lg shadow-md"
                      />
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
                  className="bg-[#A3E636] px-6 py-2 rounded-lg shadow-lg text-black font-semibold"
                />
              </div>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default DashboardPage;


