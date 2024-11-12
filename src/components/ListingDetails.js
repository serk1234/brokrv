"use client";
import React, { useState, useRef, useEffect } from "react";
import SignaturePad from "react-signature-canvas";
import { Worker, Viewer } from '@react-pdf-viewer/core';
import '@react-pdf-viewer/core/lib/styles/index.css';
import '@react-pdf-viewer/default-layout/lib/styles/index.css';
import StylizedButton from "../components/stylized-button"
import Modal from "react-modal";
import { defaultLayoutPlugin } from '@react-pdf-viewer/default-layout';
import '../styles/globals.css';
import { useRouter } from 'next/router';
import axios from 'axios';
import Cookies from 'js-cookie';



 // Relative path to globals.css

// Rest of your ListingDetails.js code
function ListingDetails({ onBackToListings, listing, user }) {
  const [activeTab, setActiveTab] = useState("overview");
  const router = useRouter();
  const [ndaSigned, setNdaSigned] = useState(false);
  const [showNDAModal, setShowNDAModal] = useState(false);
  const [useFullName, setUseFullName] = useState(false);
  const [fullName, setFullName] = useState(user?.name || "");
  const signaturePadRef = useRef(null);
  const [email, setEmail] = useState("");
  const [showLoiModal, setShowLoiModal] = useState(false);
   // Initialize showLoiModal state here


 
  

  // Example function to toggle the LOI modal
  const handleLoiClick = () => {
    setShowLoiModal(true);
  };

  const handleRedirectToDashboard = () => {
    router.push('/dashboard');
  };

  // Function to toggle between full name and signature pad
  const toggleSignatureMethod = () => {
    setUseFullName(!useFullName);
  };

 

  

  const handleNDAClick = () => {
    setShowNDAModal(true); // Directly show the NDA modal without any authentication
  };
  

  const handleNDASign = () => {
    setNdaSigned(true);
    setShowNDAModal(false);
    alert("NDA signed successfully.");
  };


  
  const {
    businessName = "Business Name",
    industry = "Industry",
    location = "Location",
    price = 1000000,
    revenue = 600000,
    cashFlow = 200000,
    multiple = 5,
    description = "Description of the business goes here.",
  } = listing || {};



  const [loiForm, setLoiForm] = React.useState({
    price: 1000000,
    dueDiligence: 14,
    sellerFinancing: false,
    sellerFinancingAmount: 0,
    deposit: 10000,
    proofOfFunds: null,
    buyerName: "",
    purchasingEntity: "",
    buyerEmail: "",
    buyerPhone: "",
    closingDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
  });
  const [currentStep, setCurrentStep] = React.useState(0);

  const financialData = {
    revenue: [500000, 550000, 600000],
    costs: [350000, 375000, 400000],
    cashFlow: [150000, 175000, 200000],
    margin: [30, 31.82, 33.33],
    inventory: [100000, 110000, 120000],
    debt: [200000, 180000, 160000],
    expenses: {
      salaries: [180000, 190000, 200000],
      rent: [50000, 52000, 55000],
      utilities: [20000, 22000, 25000],
      marketing: [30000, 35000, 40000],
      other: [70000, 76000, 80000],
    },
    revenueGrowth: [0, 10, 9.09],
    customers: [1000, 1100, 1200],
  };

  const modelInputs = {
    price: 1000000,
    costs: 50000,
    debt: 630000,
    debtInterest: 12,
    sellerFinance: 262500,
    sellerFinanceInterest: 8,
  };

  const calculateModel = () => {
    const totalAcquisition = modelInputs.price + modelInputs.costs;
    const cash =
      totalAcquisition - modelInputs.debt - modelInputs.sellerFinance;
    const cashFlow = financialData.cashFlow[financialData.cashFlow.length - 1];
    const debtServiceAmount =
      (modelInputs.debt + modelInputs.sellerFinance) * 0.12;
    const fcf = cashFlow - debtServiceAmount;
    const roe = (fcf / cash) * 100;

    return {
      totalAcquisition,
      cash,
      cashFlow,
      debtServiceAmount,
      fcf,
      roe,
    };
  };

  const modelResults = calculateModel();

  const formatCurrency = (value) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  const formatShortCurrency = (value) => {
    if (value >= 1000000) {
      return `$${(value / 1000000).toFixed(value % 1000000 === 0 ? 0 : 2)}m`;
    } else if (value >= 1000) {
      return `$${(value / 1000).toFixed(0)}k`;
    } else {
      return `$${value}`;
    }
  };
  


  const formatPercentage = (value) => {
    return new Intl.NumberFormat("en-US", {
      style: "percent",
      minimumFractionDigits: 1,
      maximumFractionDigits: 1,
    }).format(value / 100);
  };

  const formatMultiple = (value) => {
    return (
      new Intl.NumberFormat("en-US", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }).format(value) + "x"
    );
  };

  const blurredClass = ndaSigned ? "" : "filter blur-[8px]";
  const strongBlurredClass = ndaSigned ? "" : "filter blur-[16px]";

  const handleBlurredClick = () => {
    if (!ndaSigned) {
      alert("Please sign the NDA to view this information.");
    }
  };

  

  const handleModelInputChange = (field, value) => {
    setModelInputs((prev) => ({
      ...prev,
      [field]: parseFloat(value),
    }));
  };

  const handleLoiInputChange = (field, value) => {
    setLoiForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const nextStep = () => {
    setCurrentStep((prev) => prev + 1);
  };

  const prevStep = () => {
    setCurrentStep((prev) => prev - 1);
  };

  const handleLoiSubmit = () => {
    setShowLoiModal(false);
  };

  const calculateFundsDueAtClosing = () => {
    const price = loiForm.price || 0;
    const sellerFinance = loiForm.sellerFinancingAmount || 0;
    const deposit = loiForm.deposit || 0;
    return price - sellerFinance - deposit;
  };

  const ndaText = `
  brokr.

  NON-DISCLOSURE, NON-CIRCUMVENTION, AND CONFIDENTIALITY AGREEMENT

  This Agreement is made and entered into as of the date signed below by the undersigned ("Buyer").

  1. Confidential Information
  All information provided to the Buyer in connection with any potential business transaction is considered confidential and proprietary. This includes, but is not limited to, business details, financial information, intellectual property, and any other material shared by or on behalf of the Seller. Confidential information does not include information that is already known to the Buyer or publicly available through lawful means.

  2. Obligation of Confidentiality
  The Buyer agrees not to disclose, distribute, or use any confidential information provided by the Seller for any purpose other than for evaluating a potential transaction. This confidentiality obligation shall continue indefinitely, including after the termination of any negotiations or discussions.

  3. Non-Circumvention
  The Buyer agrees not to attempt to circumvent the Seller by directly or indirectly negotiating or completing a transaction with any other party introduced through the transaction without the Seller’s consent. Should the Buyer circumvent and complete a transaction without authorization, the Buyer shall be liable for any applicable fees and damages incurred by the Seller.

  4. Use of Information
  The Buyer agrees that all information provided will be used exclusively for the purpose of evaluating the potential purchase of the business and for no other purpose, including competing with the Seller. Should no transaction be completed, the Buyer agrees to return or destroy all confidential materials provided.

  5. Indemnification
  brokr.
  The Buyer agrees to indemnify and hold harmless the Seller from any liability, claims, or damages resulting from the misuse or unauthorized disclosure of confidential information by the Buyer.

  6. Non-Solicitation
  The Buyer agrees not to directly or indirectly solicit or hire any employees, contractors, or other affiliates of the Seller without the express written consent of the Seller.

  7. Due Diligence
  The Buyer is responsible for conducting their own independent due diligence regarding any information provided by the Seller and acknowledges that the Seller makes no representations as to the accuracy or completeness of any such information.

  8. Term
  This Agreement shall remain in effect for a period of four (4) years from the date signed below.

  9. Governing Law
  This Agreement shall be governed by and construed in accordance with the laws of New York.

  10. Entire Agreement
  This Agreement constitutes the entire understanding between the Buyer and the Seller regarding the confidentiality and non-circumvention obligations related to the potential transaction.
`;



  return (

    <div className="main-container">
      <div className="listing-content">
    <div className="bg-white min-h-screen font-open-sans">
      <div className="container mx-auto px-4 py-8 flex flex-col md:flex-row bg-white">
        <div className="w-full md:w-2/3 space-y-8 bg-white">
          <div className="flex justify-between items-center mb-4">
            <StylizedButton
              text="Back to Listings"
              onClick={onBackToListings}
              className="bg-[#A3E636] text-black rounded-lg shadow-lg"
            />
          </div>

          {/* Image */}
          <div className="flex items-center justify-between space-y-8">
            <img
              src={listing?.image || "/default-image.jpg"}
              alt={`${industry} representation`}
              className="w-full h-64 object-cover rounded-lg border border-black shadow-lg mb-4"
            />
          </div>

          {/* Business name and NDA button */}
       {/* Business name, Industry, and Location */}
<div className="flex justify-between items-center">
  <h1
    className={`text-3xl font-semibold ${ndaSigned ? "" : "filter blur-[16px]"}`}
    onClick={() => !ndaSigned && alert("Please sign the NDA to view this information.")}
  >
    {businessName}
  </h1>
</div>

<div className="flex flex-col sm:flex-row items-start sm:items-center space-y-2 sm:space-y-0 sm:space-x-2">
  {/* NDA Button */}
  <StylizedButton
    text={ndaSigned ? "✅ NDA Signed" : "Sign NDA"}
    onClick={ndaSigned ? null : handleNDAClick}
    className={`${
      ndaSigned
        ? "bg-gray-400 cursor-not-allowed"
        : "bg-[#A3E636] hover:bg-blue-500 hover:text-white rounded-lg shadow-lg"
    }`}
    disabled={ndaSigned}
  />


    


{ndaSigned && (
      <StylizedButton
        text="View Dashboard"
        onClick={handleRedirectToDashboard}
        className="bg-green-500 text-white hover:bg-green-700 rounded-lg shadow-lg ml-4"
      />
    )}
  </div>

{/* Industry and Location */}
{/* Industry and Location - Always Visible */}
<div className="flex items-center space-x-4 mt-4">
    <span className="bg-black text-white px-3 py-1 rounded-lg">{industry}</span>
    <span className="text-xl">📍 {location}</span>
</div>



          {/* NDA Modal */}
          <Modal isOpen={showNDAModal} onRequestClose={() => setShowNDAModal(false)} ariaHideApp={false}>
                <div className="relative p-6 bg-white rounded-lg shadow-lg">
                  <button
                    className="absolute top-4 right-4 text-xl"
                    onClick={() => setShowNDAModal(false)}
                  >
                    &times;
                  </button>
                  <h3 className="text-xl font-bold mb-4">brokr NDA</h3>
                  <div className="text-left mb-4 whitespace-pre-wrap">
                    {ndaText}
                  </div>
                  <input
                    type="text"
                    placeholder="Enter your full name"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="border border-black px-2 py-1 rounded-lg mt-2 w-full"
                    required
                  />
                  <input
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="border border-black px-2 py-1 rounded-lg mt-4 w-full"
                    required
                  />
                  <div className="flex justify-end mt-4">
                    <StylizedButton
                      text="Sign NDA"
                      onClick={handleNDASign}
                      className="bg-[#A3E636] text-black px-4 py-2 rounded-lg shadow-lg"
                    />
                  </div>
                </div>
              </Modal>

            
        
        


          {/* Financial section */}
          <div className="p-6 bg-white border border-black rounded-lg shadow-lg">
            <div className="flex justify-between items-center mb-4">
              <p className="text-xl font-bold">💰 {formatShortCurrency(price)}</p>
              <p className="text-xl">📈 {formatShortCurrency(revenue)}</p>
              <p className="text-xl">💸 {formatShortCurrency(cashFlow)}</p>
              <p className="text-xl">🔄 {formatMultiple(multiple)}</p>
            </div>
            <p className={`mb-4 ${ndaSigned ? "" : "filter blur-[8px]"}`} onClick={handleBlurredClick}>
              {description}
            </p>
      
          <p className={`mb-4 ${blurredClass}`} onClick={handleBlurredClick}>
            Description of the business goes here.
          </p>
          {ndaSigned && (
            <div className="flex space-x-4">
              <StylizedButton text="View IM" onClick={() => {}} />
              <StylizedButton text="View Website" onClick={() => {}} />
            </div>
          )}
        </div>
  
        {/* Tab section with rounded corners */}
        <div>
          <div className="flex space-x-4 mb-4">
            {["Overview", "Financials" ].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab.toLowerCase())}
                className={`px-4 py-2 rounded-lg font-medium ${
                  activeTab === tab.toLowerCase()
                    ? "bg-[#A3E636] border border-black"
                    : "bg-white"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
  
            {activeTab === "overview" && (
              <div>
                <div className="p-6 bg-white border border-black rounded shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                  <div className="flex justify-between items-center mb-4">
                    <h2 className="text-2xl font-semibold">Highlights</h2>
                    {ndaSigned && (
                      <div className="flex items-center space-x-2">
                        <span className="flex items-center">✅ Verified</span>
                        <StylizedButton text="Download" onClick={() => {}} />
                      </div>
                    )}
                  </div>
                  <div
                    className={`grid grid-cols-4 gap-4 ${blurredClass}`}
                    onClick={handleBlurredClick}
                  >
                    <div className="font-medium">Year</div>
                    {[2021, 2022, 2023].map((year) => (
                      <div key={year} className="font-medium text-center">
                        {year}
                      </div>
                    ))}
                    <div className="font-medium">Revenue</div>
                    {financialData.revenue.map((rev, index) => (
                      <div key={index} className="text-center">
                        {formatCurrency(rev)}
                      </div>
                    ))}
                    <div className="font-medium">Costs</div>
                    {financialData.costs.map((cost, index) => (
                      <div key={index} className="text-center">
                        {formatCurrency(cost)}
                      </div>
                    ))}
                    <div className="font-medium">Cash Flow</div>
                    {financialData.cashFlow.map((cash, index) => (
                      <div key={index} className="text-center">
                        {formatCurrency(cash)}
                      </div>
                    ))}
                    <div className="font-medium">Net Margin</div>
                    {financialData.margin.map((margin, index) => (
                      <div key={index} className="text-center">
                        {formatPercentage(margin)}
                      </div>
                    ))}
                  </div>
                </div>
                <div className="mt-8 p-6 bg-white border border-black rounded shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                  <div className="flex justify-between items-center mb-4">
                    <h2 className="text-2xl font-semibold">Key Metrics</h2>
                    {ndaSigned && (
                      <div className="flex items-center space-x-2">
                        <span className="flex items-center">✅ Verified</span>
                        <StylizedButton text="Download" onClick={() => {}} />
                      </div>
                    )}
                  </div>
                  <div
                    className={`grid grid-cols-4 gap-4 ${blurredClass}`}
                    onClick={handleBlurredClick}
                  >
                    <div className="font-medium">Year</div>
                    <div className="font-medium">Revenue Growth</div>
                    <div className="font-medium">Cash Flow</div>
                    <div className="font-medium">Customers</div>
                    {[2021, 2022, 2023].map((year, index) => (
                      <React.Fragment key={year}>
                        <div>{year}</div>
                        <div>
                          {formatPercentage(financialData.revenueGrowth[index])}
                        </div>
                        <div>
                          {formatCurrency(financialData.cashFlow[index])}
                        </div>
                        <div>{financialData.customers[index]}</div>
                      </React.Fragment>
                    ))}
                  </div>
                </div>
                <h2 className="text-2xl font-semibold mb-4 mt-8">Terms</h2>
                <div className="p-4 bg-white border border-black rounded shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                  <p
                    className={`mb-4 ${blurredClass}`}
                    onClick={handleBlurredClick}
                  >
                    Details about the terms of the sale would be listed here.
                  </p>
                </div>
              </div>
            )}

            {activeTab === "financials" && (
              <div className="p-6 bg-white border border-black rounded shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-2xl font-semibold">Financials</h2>
                  {ndaSigned && (
                    <div className="flex items-center space-x-2">
                      <span className="flex items-center">✅ Verified</span>
                      <StylizedButton text="Download" onClick={() => {}} />
                    </div>
                  )}
                </div>
                <div
                  className={`overflow-x-auto ${blurredClass}`}
                  onClick={handleBlurredClick}
                >
                  <table className="w-full">
                    <thead>
                      <tr>
                        <th className="p-2 text-left"></th>
                        <th className="p-2 text-right">2021</th>
                        <th className="p-2 text-right">2022</th>
                        <th className="p-2 text-right">2023</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td className="p-2 font-medium">Revenue</td>
                        {financialData.revenue.map((rev, index) => (
                          <td key={index} className="p-2 text-right text-black">
                            {formatCurrency(rev)}
                          </td>
                        ))}
                      </tr>
                      <tr>
                        <td className="p-2 font-medium">Salaries</td>
                        {financialData.expenses.salaries.map(
                          (salary, index) => (
                            <td
                              key={index}
                              className="p-2 text-right text-black"
                            >
                              {formatCurrency(salary)}
                            </td>
                          )
                        )}
                      </tr>
                      <tr>
                        <td className="p-2 font-medium">Rent</td>
                        {financialData.expenses.rent.map((rent, index) => (
                          <td key={index} className="p-2 text-right text-black">
                            {formatCurrency(rent)}
                          </td>
                        ))}
                      </tr>
                      <tr>
                        <td className="p-2 font-medium">Utilities</td>
                        {financialData.expenses.utilities.map(
                          (utility, index) => (
                            <td
                              key={index}
                              className="p-2 text-right text-black"
                            >
                              {formatCurrency(utility)}
                            </td>
                          )
                        )}
                      </tr>
                      <tr>
                        <td className="p-2 font-medium">Marketing</td>
                        {financialData.expenses.marketing.map(
                          (marketing, index) => (
                            <td
                              key={index}
                              className="p-2 text-right text-black"
                            >
                              {formatCurrency(marketing)}
                            </td>
                          )
                        )}
                      </tr>
                      <tr>
                        <td className="p-2 font-medium">Other</td>
                        {financialData.expenses.other.map((other, index) => (
                          <td key={index} className="p-2 text-right text-black">
                            {formatCurrency(other)}
                          </td>
                        ))}
                      </tr>
                      <tr>
                        <td className="p-2 font-medium">Inventory</td>
                        {financialData.inventory.map((inventory, index) => (
                          <td key={index} className="p-2 text-right text-black">
                            {formatCurrency(inventory)}
                          </td>
                        ))}
                      </tr>
                      <tr>
                        <td className="p-2 font-medium">Debt</td>
                        {financialData.debt.map((debt, index) => (
                          <td key={index} className="p-2 text-right text-black">
                            {formatCurrency(debt)}
                          </td>
                        ))}
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            )}

           

            {activeTab === "model" && (
              <div className="p-6 bg-white border border-black rounded shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] w-full">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-2xl font-semibold">Model</h2>
                  {ndaSigned && (
                    <div className="flex items-center space-x-2">
                      <StylizedButton
                        text="Download Model"
                        onClick={() => {}}
                      />
                    </div>
                  )}
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <tbody>
                      {[
                        { label: "Price", field: "price" },
                        { label: "Costs", field: "costs" },
                        {
                          label: "Total Acquisition",
                          field: "totalAcquisition",
                        },
                        { label: "Debt", field: "debt" },
                        { label: "Debt Interest", field: "debtInterest" },
                        { label: "Seller Financing", field: "sellerFinance" },
                        {
                          label: "Seller Financing Interest",
                          field: "sellerFinanceInterest",
                        },
                        { label: "Cash", field: "cash" },
                        { label: "Cash Flow", field: "cashFlow" },
                        { label: "Debt Service", field: "debtServiceAmount" },
                        { label: "FCF", field: "fcf" },
                        { label: "ROE", field: "roe" },
                      ].map(({ label, field }) => (
                        <tr key={field}>
                          <td className="p-2 font-medium text-left">{label}</td>
                          <td className="p-2 text-right">
                            {[
                              "price",
                              "costs",
                              "debt",
                              "sellerFinance",
                            ].includes(field) ? (
                              <input
                                type="text"
                                value={`${formatCurrency(modelInputs[field])}`}
                                onChange={(e) =>
                                  handleModelInputChange(
                                    field,
                                    e.target.value.replace(/[^0-9]/g, "")
                                  )
                                }
                                className="w-full text-blue-500 text-right"
                              />
                            ) : [
                                "debtInterest",
                                "sellerFinanceInterest",
                              ].includes(field) ? (
                              <input
                                type="text"
                                value={`${modelInputs[field]}%`}
                                onChange={(e) =>
                                  handleModelInputChange(
                                    field,
                                    e.target.value.replace(/[^0-9.]/g, "")
                                  )
                                }
                                className="w-full text-blue-500 text-right"
                              />
                            ) : field === "roe" ? (
                              formatPercentage(modelResults[field])
                            ) : (
                              `${formatCurrency(modelResults[field])}`
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        </div>
        <div className="w-full md:w-1/3 space-y-8">
          {/* Add content for the right column here */}
        </div>
      </div>

      {showLoiModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-white bg-opacity-50">
          <div className="bg-white p-6 rounded shadow-lg w-[600px] border border-black">
            <div className="w-full bg-gray-300 h-6 mb-4">
              <div
                className="h-6 bg-[#A3E636] transition-all duration-300 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
                style={{ width: `${((currentStep + 1) / 5) * 100}%` }}
              ></div>
            </div>
            <img
              src="/cartoon-business-image.jpg"
              alt="Cartoon representation of the technology industry"
              className="w-full h-32 object-cover rounded border border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] mb-4"
            />
            <h1 className="text-xl font-semibold mb-4">Business Name</h1>
            {currentStep === 0 && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <span role="img" aria-label="price">
                      💲
                    </span>
                    <label className="block font-medium ml-2">Price</label>
                  </div>
                  <input
                    type="text"
                    name="price"
                    value={formatCurrency(loiForm.price)}
                    onChange={(e) =>
                      handleLoiInputChange(
                        "price",
                        parseFloat(e.target.value.replace(/[^0-9]/g, ""))
                      )
                    }
                    className="w-[48%] border border-black rounded px-2 py-1"
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <span role="img" aria-label="seller financing">
                      💵
                    </span>
                    <label className="block font-medium ml-2">
                      Seller Financing
                    </label>
                  </div>
                  <input
                    type="checkbox"
                    name="sellerFinancing"
                    checked={loiForm.sellerFinancing}
                    onChange={() =>
                      handleLoiInputChange(
                        "sellerFinancing",
                        !loiForm.sellerFinancing
                      )
                    }
                    className="ml-2"
                  />
                  {loiForm.sellerFinancing && (
                    <input
                      type="text"
                      name="sellerFinancingAmount"
                      value={formatCurrency(loiForm.sellerFinancingAmount)}
                      onChange={(e) =>
                        handleLoiInputChange(
                          "sellerFinancingAmount",
                          parseFloat(e.target.value.replace(/[^0-9]/g, ""))
                        )
                      }
                      className="w-[48%] border border-black rounded px-2 py-1"
                    />
                  )}
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <span role="img" aria-label="deposit">
                      💰
                    </span>
                    <label className="block font-medium ml-2">Deposit</label>
                  </div>
                  <input
                    type="text"
                    name="deposit"
                    value={formatCurrency(loiForm.deposit)}
                    onChange={(e) =>
                      handleLoiInputChange(
                        "deposit",
                        parseFloat(e.target.value.replace(/[^0-9]/g, ""))
                      )
                    }
                    className="w-[48%] border border-black rounded px-2 py-1"
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <span role="img" aria-label="funds due at closing">
                      💲
                    </span>
                    <label className="block font-medium ml-2">
                      Funds Due at Closing
                    </label>
                  </div>
                  <span className="w-[48%]">
                    {formatCurrency(calculateFundsDueAtClosing())}
                  </span>
                </div>
              </div>
            )}
            {currentStep === 1 && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <span role="img" aria-label="due diligence">
                      🕛
                    </span>
                    <label className="block font-medium ml-2">
                      Due Diligence
                    </label>
                  </div>
                  <input
                    type="text"
                    name="dueDiligence"
                    value={loiForm.dueDiligence}
                    onChange={(e) =>
                      handleLoiInputChange("dueDiligence", e.target.value)
                    }
                    className="w-[48%] border border-black rounded px-2 py-1"
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <span role="img" aria-label="closing date">
                      📅
                    </span>
                    <label className="block font-medium ml-2">
                      Closing Days
                    </label>
                  </div>
                  <input
                    type="number"
                    name="closingDays"
                    value={30}
                    onChange={(e) =>
                      handleLoiInputChange(
                        "closingDate",
                        new Date(
                          Date.now() + e.target.value * 24 * 60 * 60 * 1000
                        )
                      )
                    }
                    className="w-[48%] border border-black rounded px-2 py-1"
                  />
                </div>
              </div>
            )}
            {currentStep === 2 && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <span role="img" aria-label="proof of funds">
                      📂
                    </span>
                    <label className="block font-medium ml-2">
                      Proof of Funds
                    </label>
                  </div>
                  <input
                    type="file"
                    name="proofOfFunds"
                    onChange={(e) =>
                      handleLoiInputChange("proofOfFunds", e.target.files[0])
                    }
                    className="w-[48%] ml-2"
                  />
                </div>
              </div>
            )}
            {currentStep === 3 && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <span role="img" aria-label="contact name">
                      🙋‍♀️
                    </span>
                    <label className="block font-medium ml-2">
                      Contact Name
                    </label>
                  </div>
                  <input
                    type="text"
                    name="buyerName"
                    value={loiForm.buyerName}
                    onChange={(e) =>
                      handleLoiInputChange("buyerName", e.target.value)
                    }
                    className="w-[48%] border border-black rounded px-2 py-1"
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <span role="img" aria-label="purchasing entity">
                      🏢
                    </span>
                    <label className="block font-medium ml-2">
                      Purchasing Entity
                    </label>
                  </div>
                  <input
                    type="text"
                    name="purchasingEntity"
                    value={loiForm.purchasingEntity}
                    onChange={(e) =>
                      handleLoiInputChange("purchasingEntity", e.target.value)
                    }
                    className="w-[48%] border border-black rounded px-2 py-1"
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <span role="img" aria-label="email">
                      ✉️
                    </span>
                    <label className="block font-medium ml-2">Email</label>
                  </div>
                  <input
                    type="email"
                    name="buyerEmail"
                    value={loiForm.buyerEmail}
                    onChange={(e) =>
                      handleLoiInputChange("buyerEmail", e.target.value)
                    }
                    className="w-[48%] border border-black rounded px-2 py-1"
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <span role="img" aria-label="phone">
                      📞
                    </span>
                    <label className="block font-medium ml-2">Phone</label>
                  </div>
                  <input
                    type="tel"
                    name="buyerPhone"
                    value={loiForm.buyerPhone}
                    onChange={(e) =>
                      handleLoiInputChange("buyerPhone", e.target.value)
                    }
                    className="w-[48%] border border-black rounded px-2 py-1"
                  />
                </div>
              </div>
            )}
            {currentStep === 4 && (
              <div className="space-y-4">
                <p className="text-left">
                  Letter of Intent for{" "}
                  <strong>{loiForm.purchasingEntity}</strong> to acquire{" "}
                  <strong>Business Name</strong> for{" "}
                  <strong>{formatCurrency(loiForm.price)}</strong>. The Seller
                  will finance{" "}
                  <strong>
                    {formatCurrency(loiForm.sellerFinancingAmount)}
                  </strong>{" "}
                  and the Purchaser will pay a deposit of{" "}
                  <strong>{formatCurrency(loiForm.deposit)}</strong> with{" "}
                  <strong>
                    {formatCurrency(calculateFundsDueAtClosing())}
                  </strong>{" "}
                  due at closing. The purchaser will have a due diligence period
                  of <strong>{loiForm.dueDiligence} days</strong> and following
                  that the deposit will be due. The transaction will close{" "}
                  <strong>
                    {parseInt(
                      (loiForm.closingDate - new Date()) /
                        (1000 * 60 * 60 * 24),
                      10
                    )}{" "}
                    days
                  </strong>{" "}
                  following the acceptance of the offer and the terms will be
                  transferred to a binding purchase and sale agreement. This
                  offer is being submitted by{" "}
                  <strong>{loiForm.buyerName}</strong> on behalf of{" "}
                  <strong>{loiForm.purchasingEntity}</strong>.
                </p>
              </div>
            )}
            <div className="flex justify-end mt-4">
              {currentStep > 0 && currentStep < 4 && (
                <button
                  onClick={prevStep}
                  className="px-4 py-2 bg-gray-300 border border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] rounded"
                >
                  Previous
                </button>
              )}
              <button
                onClick={currentStep === 4 ? handleLoiSubmit : nextStep}
                className="px-4 py-2 bg-[#A3E636] text-black border border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] rounded ml-2"
              >
                {currentStep === 4 ? "Submit & Go to Dashboard" : "Next"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
    </div>
    </div>
    
  );
}

export default ListingDetails;