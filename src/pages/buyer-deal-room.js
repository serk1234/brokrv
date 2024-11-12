import React, { useState, useEffect } from "react";
import BrokrHeaderDesign from "../components/brokr-header-design";
import StylizedButton from "../components/stylized-button";


const BuyerDealRoom = () => {
  const [activeTab, setActiveTab] = useState("BuyerDealRoom");
  const [activeFinancialTab, setActiveFinancialTab] = useState("P&L");
  const [purchasePrice, setPurchasePrice] = useState(5000000);
  const [equityContribution, setEquityContribution] = useState(3000000);
  const [roe, setRoe] = useState(0);

  // Mock data for the selected deal
  const selectedDeal = {
    name: "ABC Trucking LLC",
    stage: "LOI Submitted",
    status: 80,
    closed: false,
  };

  useEffect(() => {
    calculateROE();
  }, [purchasePrice, equityContribution]);

  const calculateROE = () => {
    if (purchasePrice && equityContribution) {
      const calculatedROE =
        ((purchasePrice - equityContribution) / equityContribution) * 100;
      setRoe(calculatedROE.toFixed(2));
    }
  };

  return (
    <div className="bg-white min-h-screen">
      <BrokrHeaderDesign activePage="Buyer Deal Room" />
      <div className="container mx-auto p-6 space-y-6">
        {/* Add navigation buttons */}
        <div className="flex justify-center p-4 border-b border-black space-x-2">
          <button
            onClick={() => router.push("/buyer-dashboard")}
            className="px-2 py-1 rounded text-black font-semibold border-2 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] bg-[#A3E636] border-black text-white"
          >
            Buyer Dashboard
          </button>
          <button
            onClick={() => router.push("/buyer-deal-room")}
            className="px-2 py-1 rounded text-black font-semibold border-2 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] bg-[#A3E636] border-black text-white"
          >
            Buyer Deal Room
          </button>
         </div>
 
        {/* Buyer Deal Room Content */}
        {activeTab === "BuyerDealRoom" && selectedDeal && (
          <div className="space-y-4">
            <div className="p-4 bg-white border-2 border-black rounded shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
              <h3 className="font-semibold text-xl">{selectedDeal.name} Deal Room</h3>

              <div className="mt-4 space-y-2">
                <div className="bg-[#E0E7F1] p-4 border border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                  <div className="px-4 py-2 mt-2 border border-black rounded bg-white shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                    <div className="flex justify-between items-center">
                      <span className="font-medium">Status: {selectedDeal.stage}</span>
                      <div className="flex-1 mx-2 h-6 bg-gray-200 rounded-full border border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                        <div
                          className={`h-full rounded-full`}
                          style={{
                            width: `${selectedDeal.status}%`,
                            backgroundColor: selectedDeal.closed ? '#38A169' : '#A3E636'
                          }}
                        ></div>
                      </div>
                      <div className="space-x-2">
                        <StylizedButton text="Download LOI" onClick={() => { }} />
                        <StylizedButton text="Update Offer" onClick={() => { }} />
                      </div>
                    </div>
                  </div>
                  <div className="mt-2 p-2 bg-white border border-black rounded shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                    <h5 className="font-semibold text-lg">Financials</h5>
                    <div className="flex justify-between items-center mb-2">
                      <div className="flex space-x-2">
                        <StylizedButton
                          text="P&L"
                          onClick={() => setActiveFinancialTab('P&L')}
                          className={`px-2 py-1 rounded ${activeFinancialTab === 'P&L' ? 'bg-[#A3E636] text-white' : 'bg-white'}`}
                        />
                        <StylizedButton
                          text="Tax Returns"
                          onClick={() => setActiveFinancialTab('TaxReturns')}
                          className={`px-2 py-1 rounded ${activeFinancialTab === 'TaxReturns' ? 'bg-[#A3E636] text-white' : 'bg-white'}`}
                        />
                      </div>
                      <div className="flex items-center space-x-2">
                        <span>✅</span>
                        <StylizedButton text="Download" onClick={() => { }} />
                      </div>
                    </div>
                    {activeFinancialTab === 'P&L' && (
                      <div className="space-y-2">
                        <div className="flex">
                          <div className="w-1/5 font-medium">
                            <div>Year</div>
                            <div>Revenue</div>
                            <div>Expenses</div>
                            <div>Net Income</div>
                            <div>Debt</div>
                            <div>Inventory</div>
                          </div>
                          <div className="w-1/5 text-right">
                            <div className="font-medium">2021</div>
                            <div>$500,000</div>
                            <div>$400,000</div>
                            <div>$100,000</div>
                            <div>$200,000</div>
                            <div>$50,000</div>
                          </div>
                          <div className="w-1/5 text-right">
                            <div className="font-medium">2022</div>
                            <div>$600,000</div>
                            <div>$450,000</div>
                            <div>$150,000</div>
                            <div>$150,000</div>
                            <div>$75,000</div>n
                          </div>
                          <div className="w-1/5 text-right">
                            <div className="font-medium">2023</div>
                            <div>$750,000</div>
                            <div>$500,000</div>
                            <div>$250,000</div>
                            <div>$100,000</div>
                            <div>$100,000</div>
                          </div>
                        </div>
                      </div>
                    )}
                    {activeFinancialTab === 'TaxReturns' && (
                      <div className="space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="font-medium">2021</span>
                          <StylizedButton text="Download" onClick={() => { }} />
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="font-medium">2022</span>
                          <StylizedButton text="Download" onClick={() => { }} />
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="font-medium">2023</span>
                          <StylizedButton text="Download" onClick={() => { }} />
                        </div>
                      </div>
                    )}
                  </div>
                  <div className="mt-2 p-2 bg-white border border-black rounded shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                    <div className="flex justify-between items-center mb-2">
                      <h5 className="font-semibold text-lg">Q&A</h5>
                      <div className="flex space-x-2">
                        <StylizedButton text="Hide Q&A" onClick={() => { }} />
                        <StylizedButton text="Download Q&A" onClick={() => { }} />
                      </div>
                    </div>
                    <div className="space-y-4">
                      <div className="bg-gray-100 p-2 rounded">
                        <p className="font-medium">Q1: What is the projected growth for next year?</p>
                        <p>A: We expect a 10% increase in revenue.</p>
                      </div>
                      <div className="bg-gray-100 p-2 rounded">
                        <p className="font-medium">Q2: Can you provide more details on recent acquisitions?</p>
                        <p>A: We acquired XYZ Corp to expand market reach.</p>
                      </div>
                      <div className="bg-gray-100 p-2 rounded">
                        <p className="font-medium">Q3: How do you manage supply chain risks?</p>
                        <p>A: We have diversified suppliers and use monitoring tools.</p>
                      </div>
                      <div className="bg-gray-100 p-2 rounded">
                        <p className="font-medium">Q4: What is the retention rate of top clients?</p>
                        <p>A: Our retention rate is 95%</p>
                      </div>
                      <div className="bg-gray-100 p-2 rounded">
                        <p className="font-medium">Q5: Are there any pending legal issues?</p>
                        <p>A: There are no ongoing legal proceedings.</p>
                      </div>
                      <div className="flex items-center space-x-2 mt-4">
                        <input
                          type="text"
                          placeholder="Ask a question..."
                          className="flex-grow p-2 border border-black rounded"
                        />
                        <label className="flex items-center space-x-1">
                          <span className="text-sm">Private</span>
                          <div className="relative inline-block w-10 mr-2 align-middle select-none transition duration-200 ease-in">
                            <input
                              type="checkbox"
                              name="toggle"
                              id="toggle"
                              className="absolute block w-6 h-6 rounded-full bg-white border-4 appearance-none cursor-pointer focus:outline-none"
                            />
                            <label
                              htmlFor="toggle"
                              className="block overflow-hidden h-6 rounded-full bg-gray-300 cursor-pointer"
                            />
                          </div>
                        </label>
                        <StylizedButton text="Submit Question" onClick={() => { }} />
                      </div>
                    </div>
                  </div>
                  <div className="mt-2 p-2 bg-white border border-black rounded shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                    <h5 className="font-semibold text-lg">Model</h5>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <label className="w-1/2">Purchase Price:</label>
                        <input
                          type="number"
                          value={purchasePrice}
                          onChange={(e) => setPurchasePrice(parseFloat(e.target.value))}
                          className="w-1/2 p-1 border-b-2"
                        />
                      </div>
                      <div className="flex justify-between">
                        <label className="w-1/2">Equity Contribution:</label>
                        <input
                          type="number"
                          value={equityContribution}
                          onChange={(e) => setEquityContribution(parseFloat(e.target.value))}
                          className="w-1/2 p-1 border-b-2"
                        />
                      </div>
                      <div className="flex justify-between">
                        <span className="w-1/2">ROE:</span>
                        <span className="w-1/2">{roe}%</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="w-1/2">Cash Required:</span>
                        <span className="w-1/2">${purchasePrice - equityContribution}</span>
                      </div>
                      <div className="flex justify-between">
                        <label className="w-1/2">Debt Financing:</label>
                        <input
                          type="number"
                          value={500000}
                          onChange={(e) => parseFloat(e.target.value)}
                          className="w-1/2 p-1 border-b-2"
                        />
                      </div>
                      <div className="flex justify-center">
                        <button
                          onClick={() => calculateROE()}
                          className="px-2 py-1 bg-[#A3E636] text-white rounded"
                        >
                          Calculate ROE
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 flex justify-end space-x-4">
                    <StylizedButton text="IM" onClick={() => { }} />
                    <StylizedButton text="Website" onClick={() => { }} />
                    <StylizedButton text="Download NDA" onClick={() => { }} />
                  </div>
                  <div className="mt-2 p-2 bg-white border border-black rounded shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-semibold text-lg">Team</span>
                      <button className="text-xl">➕</button>
                    </div>
                    <div className="space-y-4">
                      <div className="bg-gray-100 p-2 rounded flex justify-between items-center">
                        <span>John Doe <strong>@ Legal Co.</strong></span>
                        <span>✅</span>
                      </div>
                      <div className="bg-gray-100 p-2 rounded flex justify-between items-center">
                        <span>Jane Smith <strong>@ Finance Inc.</strong></span>
                        <span>⏳</span>
                      </div>
                      <div className="bg-gray-100 p-2 rounded flex justify-between items-center">
                        <span>Mike Lee <strong>@ Consult LLC</strong></span>
                        <span>✅</span>
                      </div>
                      <button className="px-2 py-1 bg-gray-300 rounded">Hide Team</button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default BuyerDealRoom;

