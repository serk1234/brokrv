import { useEffect, useState } from "react";
import axios from "axios";
import BrokrHeaderDesign from "../components/brokr-header-design";
import '../styles/globals.css';

import Footer from "../components/footer";
import ListingDetails from "../components/ListingDetails";

const ListingsPage = () => {
  const [listings, setListings] = useState([]);
  const [selectedListing, setSelectedListing] = useState(null);
  const [showFilters, setShowFilters] = useState(false);
  const [autoOpenNDA, setAutoOpenNDA] = useState(false);
  const [filters, setFilters] = useState({
    price: "",
    cashFlow: "",
    location: "",
    industry: "",
    sellerFinancing: false,
  });

  useEffect(() => {
    const fetchListings = async () => {
      try {
        const response = await axios.get("/api/listings");
        setListings(response.data);
      } catch (error) {
        console.error("Error fetching listings:", error);
      }
    };

    fetchListings();
  }, []);

  // Automatically select a listing if a `pendingListingId` is present in local storage
  useEffect(() => {
    const pendingListingId = localStorage.getItem('pendingListingId');
    const shouldOpenNDA = localStorage.getItem('openNDA') === 'true';

    if (pendingListingId && listings.length > 0) {
      const listing = listings.find((l) => l._id === pendingListingId);
      if (listing) {
        setSelectedListing(listing);
        localStorage.removeItem('pendingListingId'); // Clear it to prevent repeated selection

        // Set the autoOpenNDA state if needed
        if (shouldOpenNDA) {
          setAutoOpenNDA(true);
          localStorage.removeItem('openNDA');
        }
      }
    }
  }, [listings]);

  const handleFilterChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFilters((prevFilters) => ({
      ...prevFilters,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleViewClick = (id) => {
    setSelectedListing(listings.find((listing) => listing._id === id));
  };

  const handleBackClick = () => {
    setSelectedListing(null);
    setAutoOpenNDA(false); // Reset autoOpenNDA when going back to listings
  };

  // Filter the listings based on selected filters
  const filteredListings = listings.filter((listing) => {
    return (
      (filters.price ? listing.price <= Number(filters.price) : true) &&
      (filters.cashFlow ? listing.cashFlow >= Number(filters.cashFlow) : true) &&
      (filters.location ? listing.location.toLowerCase() === filters.location.toLowerCase() : true) &&
      (filters.industry ? listing.industry.toLowerCase() === filters.industry.toLowerCase() : true) &&
      (filters.sellerFinancing ? listing.sellerFinancing === filters.sellerFinancing : true)
    );
  });

  return (
    <div className="bg-gray-100 bg-[url('/grid-bg.png')] min-h-screen font-open-sans">
      <BrokrHeaderDesign activePage="listings" />
      <div className="container mx-auto px-4 py-8">
        {selectedListing ? (
          <ListingDetails 
            listing={selectedListing} 
            onBackToListings={handleBackClick} 
            autoOpenNDA={autoOpenNDA} // Pass autoOpenNDA prop to ListingDetails
          />
        ) : (
          <>
            <div className="mb-8 flex flex-col sm:flex-row items-center justify-between bg-white p-4 rounded-lg shadow-md border border-black">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="px-4 py-2 bg-[#A3E636] text-black font-semibold rounded border border-black"
              >
                {showFilters ? "Hide Filters" : "Show Filters"}
              </button>
              {showFilters && (
                <div className="flex flex-col sm:flex-row items-center space-y-2 sm:space-y-0 sm:space-x-4 flex-grow justify-evenly mt-4 sm:mt-0">
                  {/* Filters */}
                  <select
                    name="price"
                    value={filters.price}
                    onChange={handleFilterChange}
                    className="border border-gray-300 rounded px-3 py-2"
                  >
                    <option value="">💰 Price</option>
                    <option value="500000">$500k</option>
                    <option value="1000000">$1m</option>
                    <option value="5000000">$5m</option>
                  </select>
                  <select
                    name="cashFlow"
                    value={filters.cashFlow}
                    onChange={handleFilterChange}
                    className="border border-gray-300 rounded px-3 py-2"
                  >
                    <option value="">💵 Cash Flow</option>
                    <option value="100000">$100k</option>
                    <option value="500000">$500k</option>
                    <option value="1000000">$1m</option>
                  </select>
                  <select
                    name="location"
                    value={filters.location}
                    onChange={handleFilterChange}
                    className="border border-gray-300 rounded px-3 py-2"
                  >
                    <option value="">📍 Location</option>
                    {Array.from(new Set(listings.map((l) => l.location))).map((location) => (
                      <option key={location} value={location}>
                        {location}
                      </option>
                    ))}
                  </select>
                  <select
                    name="industry"
                    value={filters.industry}
                    onChange={handleFilterChange}
                    className="border border-gray-300 rounded px-3 py-2"
                  >
                    <option value="">🏭 Industry</option>
                    {Array.from(new Set(listings.map((l) => l.industry))).map((industry) => (
                      <option key={industry} value={industry}>
                        {industry}
                      </option>
                    ))}
                  </select>
                  <div className="flex items-center">
                    <span className="mr-2 font-normal">Seller Financing</span>
                    <input
                      type="checkbox"
                      name="sellerFinancing"
                      checked={filters.sellerFinancing}
                      onChange={handleFilterChange}
                      className="form-checkbox h-5 w-5 text-[#A3E636]"
                    />
                  </div>
                </div>
              )}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredListings.length > 0 ? (
                filteredListings.map((listing) => (
                  <div
                    key={listing._id}
                    className="bg-white border border-black rounded-lg shadow-lg overflow-hidden relative group"
                  >
                    <div className="relative">
                      {listing.sellerFinancing && (
                        <div className="absolute top-2 left-2 bg-[#4ade80] text-black py-1 px-2 rounded-lg z-10 font-normal text-sm">
                          ✅ Seller Financing
                        </div>
                      )}
                      <img
                        src={listing.image || '/default-image.jpg'}
                        alt={`${listing.industry} business`}
                        className="w-full h-48 object-cover"
                      />
                    </div>
                    <div className="bg-[#3b82f6] text-white py-2 px-4 flex justify-between items-center">
                      <span className="font-semibold">{listing.industry}</span>
                      <span className="font-normal">📍 {listing.location}</span>
                    </div>
                    <div className="p-4">
                      <p className="flex justify-between items-center text-base">
                        <span className="font-bold">💰 ${(listing.price / 1000000).toFixed(2)}m</span>
                        <span>📈 ${(listing.revenue / 1000000).toFixed(2)}m</span>
                        <span>💸 ${(listing.cashFlow / 1000).toFixed(0)}k</span>
                      </p>
                    </div>
                    <button
                      className="absolute inset-0 bg-[#A3E636] opacity-0 group-hover:opacity-80 flex items-center justify-center text-black font-semibold text-xl transition-opacity duration-300"
                      onClick={() => handleViewClick(listing._id)}
                    >
                      View
                    </button>
                  </div>
                ))
              ) : (
                <p className="text-center text-gray-500">
                  No listings found. Please try adjusting your filters.
                </p>
              )}
            </div>
          </>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default ListingsPage;