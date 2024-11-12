import React, { useState } from 'react';
import axios from 'axios';
import BrokrHeaderDesign from '../components/brokr-header-design';
import Footer from '../components/footer';
import { useRouter } from 'next/router';
import '../styles/globals.css';
import StylizedButton from '../components/stylized-button';
import jwtDecode from 'jwt-decode';

function CreateListing() {
  const router = useRouter();
  const [userId, setUserId] = useState(null);
  const [formData, setFormData] = useState({
    businessName: '',
    industry: '',
    location: '',
    price: '',
    revenue: '',
    cashFlow: '',
    multiple: '',
    sellerFinancing: false,
    terms: '',
    description: '',
    viewIM: '',
    viewWebsite: '',
    financials: {
      '2021': { revenue: '', costs: '', cashFlow: '', netMargin: '' },
      '2022': { revenue: '', costs: '', cashFlow: '', netMargin: '' },
      '2023': { revenue: '', costs: '', cashFlow: '', netMargin: '' },
    },
    keyMetrics: {
      revenueGrowth: { '2022': '', '2023': '' },
      customers: { '2022': '', '2023': '' },
    },
    financialBreakdown: {
      '2021': { wages: '', rent: '', utilities: '', marketing: '', other: '', totalExpenses: '', inventory: '', debt: '' },
      '2022': { wages: '', rent: '', utilities: '', marketing: '', other: '', totalExpenses: '', inventory: '', debt: '' },
      '2023': { wages: '', rent: '', utilities: '', marketing: '', other: '', totalExpenses: '', inventory: '', debt: '' },
    },
    ndaSignedBy: [],
    createdAt: new Date(),
    image: null,
  });
  const [errors, setErrors] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const [formTouched, setFormTouched] = useState(false);
  const [selectedYear, setSelectedYear] = useState(2021);
  const [isSuccessPopupVisible, setIsSuccessPopupVisible] = useState(false);


  const industryImages = {
    Agriculture: '/assets/Agriculture.webp',
    Construction: '/assets/Construction.webp',
    Education: '/assets/Education.webp',
    Finance: '/assets/Finance.webp',
    Healthcare: '/assets/Healthcare.webp',
    Hospitality: '/assets/Hospitality.webp',
    Manufacturing: '/assets/Manufacturing.webp',
    Retail: '/assets/Retail.webp',
    Technology: '/assets/Technology.webp',
    Transportation: '/assets/Transportation.webp',
    Other: '/assets/Other.webp',
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) {
      return;
    }
  
    const cleanedFormData = {
      ...JSON.parse(
        JSON.stringify(formData, (key, value) => {
          if (value === '' || value === null) {
            return undefined;
          }
          return value;
        })
      ),
      createdBy: userId // Add the user ID to associate with this listing
    };
  
    try {
      const token = localStorage.getItem('token'); // Retrieve the token
      const response = await axios.post('/api/listings/createListing', cleanedFormData, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`, // Send token in authorization header
        },
      });
      console.log('Listing created successfully:', response.data);
  
      setIsSuccessPopupVisible(true);
    } catch (error) {
      console.error('Error creating listing:', error);
    }
  };
  

  const calculateMultiple = () => {
    const price = parseFloat(formData.price);
    const cashFlow = parseFloat(formData.cashFlow);
    if (price && cashFlow) {
      return (price / cashFlow).toFixed(2) + 'x';
    }
    return 'N/A';
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    const cleanedValue = ['price', 'revenue', 'cashFlow', 'multiple'].includes(name) ? value.replace(/,/g, '') : value;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : cleanedValue,
      image: name === 'industry' ? industryImages[cleanedValue] || null : prev.image,
    }));
  };

  const handleFinancialChange = (e, year, field) => {
    const { value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      financials: {
        ...prevState.financials,
        [year]: {
          ...prevState.financials[year],
          [field]: value,
        },
      },
    }));
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.businessName) newErrors.businessName = 'Business name is required';
    if (!formData.location) newErrors.location = 'Location is required';
    if (!formData.industry) newErrors.industry = 'Industry is required';
    if (currentPage === 2) {
      if (!formData.price) newErrors.price = 'Price is required';
      if (!formData.revenue) newErrors.revenue = 'Revenue is required';
      if (!formData.cashFlow) newErrors.cashFlow = 'Cash flow is required';
    }
    if ([5, 6, 7].includes(currentPage)) {
      ['revenue', 'costs', 'cashFlow'].forEach((field) => {
        if (!formData.financials[selectedYear][field]) {
          newErrors[`${field}${selectedYear}`] = `${field.charAt(0).toUpperCase() + field.slice(1)} for ${selectedYear} is required`;
        }
      });
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const nextPage = () => {
    if (validateForm()) {
      setCurrentPage(currentPage + 1);
      if ([5, 6, 7].includes(currentPage + 1)) {
        setSelectedYear(2021 + (currentPage + 1 - 5));
      }
    }
  };

  const prevPage = () => {
    setCurrentPage(currentPage - 1);
    if ([5, 6, 7].includes(currentPage - 1)) {
      setSelectedYear(2021 + (currentPage - 1 - 5));
    }
  };

  const formatNumber = (value) => {
    const numericValue = parseInt(value.toString().replace(/,/g, ''), 10);
    if (isNaN(numericValue)) return '$0';
    if (numericValue >= 1000000) {
      return `$${Math.floor(numericValue / 1000000)}m`;
    } else if (numericValue >= 1000) {
      return `$${Math.floor(numericValue / 1000)}k`;
    } else {
      return `$${numericValue}`;
    }
  };

  const renderProgressBar = () => {
    const totalPages = 7;
    const progressPercentage = ((currentPage - 1) / (totalPages - 1)) * 100;
    return (
      <div className="progress-bar w-full h-6 mb-4 border border-black rounded-lg relative overflow-hidden">
        <div
          className="progress-bar-fill absolute h-full bg-[#A3E636]"
          style={{ width: `${progressPercentage}%` }}
        ></div>
      </div>
    );
  };

  const renderPreview = () => (
    <div className="bg-gray-100 p-4 rounded-md shadow-md flex flex-col justify-between h-full">
      <h3 className="text-lg font-semibold mb-2">Preview</h3>
      <div className="bg-white border border-gray-300 rounded-md shadow-sm p-4 relative flex-grow">
        {formData.sellerFinancing && (
          <div className="absolute top-0 left-0 bg-green-500 text-white font-semibold px-2 py-1 rounded-bl-md rounded-tr-md">
            <span role="img" aria-label="Check">✅</span> Seller Financing
          </div>
        )}
        {formData.image && <img src={formData.image} alt="Industry" className="w-full h-32 object-cover mb-2" />}
        {(formData.industry || formData.location) && (
          <div className="bg-blue-500 text-white font-bold p-2 flex justify-between">
            <span>{formData.industry || ''}</span>
            <span>{formData.location && `📍 ${formData.location}`}</span>
          </div>
        )}
        <div className="p-2 flex justify-between">
          {formData.price && (
            <div className="flex items-center">
              <span role="img" aria-label="Price">💰</span>
              <span className="ml-2 font-semibold">
                {formData.price ? formatNumber(formData.price) : ''}
              </span>
            </div>
          )}
          {formData.revenue && (
            <div className="flex items-center">
              <span role="img" aria-label="Revenue">📈</span>
              <span className="ml-2 font-semibold">
                {formData.revenue ? formatNumber(formData.revenue) : ''}
              </span>
            </div>
          )}
          {formData.cashFlow && (
            <div className="flex items-center">
              <span role="img" aria-label="Cash Flow">💵</span>
              <span className="ml-2 font-semibold">
                {formData.cashFlow ? formatNumber(formData.cashFlow) : ''}
              </span>
            </div>
          )}
          {formData.price && formData.cashFlow && (
            <div className="flex items-center">
              <span role="img" aria-label="Multiple">🔄</span>
              <span className="ml-2 font-semibold">
                {calculateMultiple()}
              </span>
            </div>
          )}
        </div>
        {formData.description && (
          <div className="mt-4 p-2 border-t border-gray-200">
            <p className="text-gray-700">{formData.description}</p>
          </div>
        )}
      </div>
    </div>
  );

  const renderFinancialTabs = () => (
    <div className="flex mb-4">
      {[2021, 2022, 2023].map((year) => (
        <button
          key={year}
          className={`px-4 py-2 border ${selectedYear === year ? 'bg-[#A3E636] text-black' : 'bg-white text-gray-600'}`}
          onClick={() => setSelectedYear(year)}
        >
          {year}
        </button>
      ))}
    </div>
  );

  const renderFormSection = (currentPage) => (
    <div className="bg-gray-100 p-4 rounded-md shadow-md h-full flex flex-col justify-start">
      {renderProgressBar()}
      <div className="space-y-4 mt-4">
        {currentPage === 1 && (
          <>
            <div>
              <label className="block font-medium">
                Business Name
                <span className="ml-2 text-sm text-gray-500 italic">This will not be shown publicly.</span>
              </label>
              <input
                type="text"
                name="businessName"
                className="w-full p-2 border border-gray-300 rounded"
                placeholder="Business Name"
                value={formData.businessName}
                onChange={handleInputChange}
                required
              />
              {formTouched && errors.businessName && <p className="text-red-500 text-xs">{errors.businessName}</p>}
            </div>
            <div>
              <label className="block font-medium">Location</label>
              <input
                type="text"
                name="location"
                className="w-full p-2 border border-gray-300 rounded"
                placeholder="What city is your business located?"
                value={formData.location}
                onChange={handleInputChange}
                required
              />
              {formTouched && errors.location && <p className="text-red-500 text-xs">{errors.location}</p>}
            </div>
            <div>
              <label className="block font-medium">Industry</label>
              <select
                name="industry"
                className="w-full p-2 border border-gray-300 rounded"
                value={formData.industry}
                onChange={handleInputChange}
                required
              >
                <option value="">Select an industry</option>
                {Object.keys(industryImages).map((industry) => (
                  <option key={industry} value={industry}>
                    {industry}
                  </option>
                ))}
              </select>
              {formTouched && errors.industry && <p className="text-red-500 text-xs">{errors.industry}</p>}
            </div>
          </>
        )}
        {currentPage === 2 && (
          <>
            <div>
              <label className="block font-medium">Price</label>
              <input
                type="number"
                name="price"
                className="w-full p-2 border border-gray-300 rounded"
                placeholder="Price"
                value={formData.price}
                onChange={handleInputChange}
                required
              />
              {formTouched && errors.price && <p className="text-red-500 text-xs">{errors.price}</p>}
            </div>
            <div>
              <label className="block font-medium">Revenue</label>
              <input
                type="number"
                name="revenue"
                className="w-full p-2 border border-gray-300 rounded"
                placeholder="Revenue"
                value={formData.revenue}
                onChange={handleInputChange}
                required
              />
              {formTouched && errors.revenue && <p className="text-red-500 text-xs">{errors.revenue}</p>}
            </div>
            <div>
              <label className="block font-medium">Cash Flow</label>
              <input
                type="number"
                name="cashFlow"
                className="w-full p-2 border border-gray-300 rounded"
                placeholder="Cash Flow"
                value={formData.cashFlow}
                onChange={handleInputChange}
                required
              />
              {formTouched && errors.cashFlow && <p className="text-red-500 text-xs">{errors.cashFlow}</p>}
            </div>
          </>
        )}
        {currentPage === 3 && (
          <>
            <div className="flex items-center mt-2">
              <label className="font-medium mr-4">Seller Financing Available?</label>
              <div
                className="relative inline-block w-10 h-6 cursor-pointer"
                onClick={() => {
                  setFormData((prev) => ({ ...prev, sellerFinancing: !prev.sellerFinancing }));
                }}
              >
                <input type="checkbox" checked={formData.sellerFinancing} onChange={() => {}} className="sr-only" />
                <div
                  className={`w-full h-full rounded-full transition duration-300 ${
                    formData.sellerFinancing ? 'bg-green-500' : 'bg-red-500'
                  }`}
                ></div>
                <div
                  className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full shadow-md transform transition-transform duration-300 ${
                    formData.sellerFinancing ? 'translate-x-4' : ''
                  }`}
                ></div>
              </div>
            </div>
            <div className="mt-4">
              <label className="block font-medium">Terms</label>
              <input
                type="text"
                name="terms"
                className="w-full p-2 border border-gray-300 rounded"
                placeholder="Terms"
                value={formData.terms || ''}
                onChange={handleInputChange}
              />
            </div>
          </>
        )}
        {currentPage === 4 && (
          <>
            <div className="mt-2">
              <label className="block font-medium">Description</label>
              <textarea
                name="description"
                className="w-full p-2 border border-gray-300 rounded"
                placeholder="Tell us about your business"
                value={formData.description}
                onChange={handleInputChange}
              />
            </div>
          </>
        )}
        {[5, 6, 7].includes(currentPage) && (
          <>
            <div className="flex items-center mb-4">
              <h4 className="text-lg font-semibold mr-4">Financials</h4>
              <div className="flex space-x-2 items-center" style={{ marginTop: '15px' }}>
                {renderFinancialTabs()}
              </div>
            </div>
            {['revenue', 'costs', 'cashFlow'].map((field) => (
              <div key={field} className="mb-4">
                <label className="block font-medium capitalize">{field}</label>
                <input
                  type="number"
                  name={`${field}${selectedYear}`}
                  className="w-full p-2 border border-gray-300 rounded"
                  placeholder={`${field.charAt(0).toUpperCase() + field.slice(1)} for ${selectedYear}`}
                  value={formData.financials[selectedYear][field]}
                  onChange={(e) => handleFinancialChange(e, selectedYear, field)}
                  required
                />
                {formTouched && errors[`${field}${selectedYear}`] && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors[`${field}${selectedYear}`]}
                  </p>
                )}
              </div>
            ))}
          </>
        )}
        <div className={`flex mt-4 ${currentPage === 1 ? 'justify-end' : 'justify-between'}`}>
          {currentPage > 1 && (
            <button
              onClick={prevPage}
              className="px-4 py-2 bg-gray-300 text-black border border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] rounded ml-2"
            >
              Previous
            </button>
          )}
          {currentPage < 7 ? (
            <StylizedButton
              text="Next"
              onClick={() => {
                setFormTouched(true);
                nextPage();
              }}
              className="bg-[#A3E636] text-black border-2 border-black"
            />
          ) : (
            <StylizedButton
              text="Continue"
              onClick={handleSubmit}
              className="bg-[#A3E636] text-black border-2 border-black"
            />
          )}
        </div>
      </div>
    </div>
  );

  return (
    <>
      <BrokrHeaderDesign activePage="createListing" />
      <div className="container mx-auto px-4 py-8 grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>{renderPreview()}</div>
        <div>{renderFormSection(currentPage)}</div>
      </div>
      <Footer />

      {/* Success Popup */}
      {isSuccessPopupVisible && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50">
          <div className="bg-white p-8 rounded-lg shadow-lg text-center">
            <h2 className="text-2xl font-bold mb-4">Listing Successfully Completed</h2>
            <StylizedButton
              text="View in Dashboard"
              onClick={() => router.push('/api/auth/google?redirect=dashboardpage&refresh=true')}
              className="bg-[#A3E636] text-black px-6 py-2 rounded-lg shadow-md mt-4"
            />
          </div>
        </div>
      )}
    </>
  );
}

export default CreateListing;