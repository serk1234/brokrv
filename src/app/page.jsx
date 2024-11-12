"use client";
import React, { useState } from "react";
import BrokrHeaderDesign from "../components/brokr-header-design";
import StylizedButton from "../components/stylized-button";
import { useRouter } from 'next/navigation';

function MainComponent() {
  const [showForm, setShowForm] = useState(false);
  const [showLoginForm, setShowLoginForm] = useState(false);
  const router = useRouter();


  const handleGoogleSignUp = () => {
    // Redirect to Google sign-in with `redirect=create-listing` parameter
    router.push("/api/auth/google?redirect=create-listing");
  };
  
 
  
  
  
  
  
  const goToListings = () => {
    router.push("/listings");
  };

  // Handle login function
  

  // Handle sign-up function
  const handleSubmit = async (event) => {
    event.preventDefault();
    const formElements = event.target.elements;
    const fullName = formElements["fullName"].value;
    const email = formElements["email"].value;
    const password = formElements["password"].value;
    const phoneNumber = formElements["phoneNumber"].value;

    if (fullName && email && password && phoneNumber) {
      try {
        const response = await axios.post('/api/auth/signup', {
          fullName,
          email,
          password,
          phoneNumber,
        });
        alert("Sign-up successful! You can now log in.");
        setShowForm(false);
        setShowLoginForm(true);
      } catch (error) {
        alert("Sign-up failed. Please try again.");
        console.error("Sign-up error:", error);
      }
    } else {
      alert("Please fill out all fields.");
    }
  };

  return (
    <div className="bg-white min-h-screen font-open-sans">
       <BrokrHeaderDesign activePage="home" />
        
     
      <main className="container mx-auto px-4">
        <section className="py-20 flex flex-col md:flex-row items-center space-y-6 md:space-y-0">
          <div className="w-full">
            <h1 className="text-6xl font-bold mb-12">
              brokr is{" "}
              <span className="text-[#A3E636] italic font-black">the</span>{" "}
              all-in-one Business Transaction Solution.
            </h1>
            <div className="flex space-x-8 mt-8">
  <StylizedButton
    text="Buy a Business"
    onClick={goToListings}
    className="px-4 py-2 rounded text-black font-semibold bg-lime-400 border border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
  />
  <StylizedButton
    text="Sell Your Business"
    onClick={handleGoogleSignUp}
    className="px-4 py-2 rounded text-black font-semibold bg-lime-400 border border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
  />
</div>


          </div>
        </section>

        <section className="py-20">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: "🚀",
                title: "Speed",
                description:
                  "From onboarding through to closing. We remove the bottlenecks of the transaction process to enable faster transaction processing.",
              },
              {
                icon: "💼",
                title: "Buyer Tools",
                description:
                  "We provide the buyer a streamlined solution to not only seek out target acquisitions but to qualify and make offers. Increased efficiency and ease for buyers means better outcomes for sellers.",
              },
              {
                icon: "📊",
                title: "Data",
                description:
                  "Seller dashboard shows exactly how well a listing is performing. Showing activity, questions, enquiries, and engagement.",
              },
              {
                icon: "💬",
                title: "Communications",
                description:
                  "Buyers and sellers can communicate real-time on the platform which is integrated via email and text. Allowing for faster transaction time and reduced wait time.",
              },
              {
                icon: "🔗",
                title: "Integration",
                description:
                  "All elements, information, and data on the same platform. No endless email chains and time wasted tracking down information to make a decision.",
              },
              {
                icon: "🔍",
                title: "Real Time Buyer Engagement",
                description:
                  "Buyers can access and qualify a target acquisition in real time and submit an offer based on a built-in acquisition model.",
              },
            ].map((feature, index) => (
              <div
                key={index}
                className="bg-white p-6 rounded border border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:bg-[#A3E636] transition-colors duration-300"
              >
                <h3 className="text-xl font-semibold mb-2">
                  <span className="text-4xl mr-2">{feature.icon}</span>
                  {feature.title}
                </h3>
                <p>{feature.description}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="py-20">
  <div className="grid grid-cols-1 gap-8 text-center">
    {[
      { title: "$38m", subtitle: "Total Transaction Volume via the brokr network", improvement: "Since March 2024" },
      { title: "4 mins", subtitle: "Avg. time to list new business", improvement: "114% faster" },
      { title: "3.9 weeks", subtitle: "Avg. Time to sell via brokr", improvement: "72% faster" },
      { title: "17.3x", subtitle: "More enquiries, offers and qualified buyer interaction", improvement: "58% higher" }
    ].map((item, index) => (
      <div key={index} className="bg-[#A3E636] p-6 rounded border border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:bg-white transition-colors duration-300 flex flex-col h-full">
        <h3 className="text-5xl font-black mb-2">{item.title}</h3>
        <p className="text-lg flex-grow flex items-center justify-center">{item.subtitle}</p>
        <p className="text-green-600 text-lg font-bold">{item.improvement}</p>
      </div>
    ))}
  </div>
</section>



        <section className="py-20 bg-white">
  <div className="max-w-5xl mx-auto p-8">
    <h2 className="text-4xl text-center mb-12 font-bold">
      <span className="font-bold">brokr</span> vs Traditional Brokers
    </h2>
    <div className="grid grid-cols-3 text-center">
      {/* Header Row */}
      <div className="p-4 font-bold text-xl bg-white">
        Feature
      </div>
      <div className="p-4 font-bold text-xl bg-[#A3E636] border-t border-l border-r border-black rounded-t-lg">
        brokr
      </div>
      <div className="p-4 font-bold text-xl bg-white">
        Traditional Brokers
      </div>

      {/* Row 1 */}
      <div className="p-4">Average Sale Time</div>
      <div className="p-4 bg-[#A3E636] font-bold border-l border-r border-black">2-4 months</div>
      <div className="p-4">6-12 months</div>

      {/* Row 2 */}
      <div className="p-4">Time to List (live on the platform)</div>
      <div className="p-4 bg-[#A3E636] font-bold border-l border-r border-black">Within 24 hours</div>
      <div className="p-4">Weeks</div>

      {/* Row 3 */}
      <div className="p-4">Conversion</div>
      <div className="p-4 bg-[#A3E636] font-bold border-l border-r border-black">64%</div>
      <div className="p-4">20-30%</div>

      {/* Row 4 */}
      <div className="p-4">Buyer Onboarding</div>
      <div className="p-4 bg-[#A3E636] font-bold border-l border-r border-black">Automated</div>
      <div className="p-4">Manual</div>

      {/* Row 5 */}
      <div className="p-4">Custom Buyer Modeling</div>
      <div className="p-4 bg-[#A3E636] border-l border-r border-black">✅</div>
      <div className="p-4 text-red-500">❌</div>

      {/* Row 6 */}
      <div className="p-4">Real-time Datarooms</div>
      <div className="p-4 bg-[#A3E636] border-l border-r border-black">✅</div>
      <div className="p-4 text-red-500">❌</div>

      {/* Row 7 */}
      <div className="p-4 rounded-bl-lg">Verified Financials</div>
      <div className="p-4 bg-[#A3E636] border-b border-l border-r border-black rounded-b-lg">✅</div>
      <div className="p-4 text-red-500 rounded-br-lg">❌</div>
    </div>
  </div>
</section>






     

        <div className="flex justify-center space-x-4 mt-8 mb-20">
          <StylizedButton text="Book a Demo" onClick={() => {}} />
          <StylizedButton text="Sell Your Business" onClick={handleGoogleSignUp} />
          <StylizedButton text="View Listings" onClick={goToListings} />
        </div>

        {showForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg p-8 w-full max-w-md relative">
              <button
                className="absolute top-4 right-4 text-gray-500 hover:text-black"
                onClick={() => setShowForm(false)}
              >
                &times;
              </button>
              <h2 className="text-3xl font-bold mb-6">Let's Get Started</h2>
              <form className="space-y-4" onSubmit={handleSubmit}>
                <input
                  type="text"
                  name="fullName"
                  placeholder="Full Name"
                  className="w-full p-2 border border-gray-300 rounded"
                  required
                />
                <input
                  type="email"
                  name="email"
                  placeholder="Email Address"
                  className="w-full p-2 border border-gray-300 rounded"
                  required
                />
                <input
                  type="password"
                  name="password"
                  placeholder="Password"
                  className="w-full p-2 border border-gray-300 rounded"
                  required
                />
                <input
                  type="tel"
                  name="phoneNumber"
                  placeholder="Phone Number"
                  className="w-full p-2 border border-gray-300 rounded"
                  required
                />
                <StylizedButton text="Start Your Listing" type="submit" />
              </form>
              <p className="mt-4 text-sm text-center">
                Already have an account?{" "}
                <a href="#" className="text-blue-500" onClick={() => setShowLoginForm(true)}>
                  Log in
                </a>
              </p>
            </div>
          </div>
        )}

        {showLoginForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg p-8 w-full max-w-md relative">
              <button
                className="absolute top-4 right-4 text-gray-500 hover:text-black"
                onClick={() => setShowLoginForm(false)}
              >
                &times;
              </button>
              <h2 className="text-3xl font-bold mb-6">Log in to Your Account</h2>
              <form className="space-y-4" onSubmit={handleLogin}>
                <input
                  type="email"
                  name="loginEmail"
                  placeholder="Email Address"
                  className="w-full p-2 border border-gray-300 rounded"
                  required
                />
                <input
                  type="password"
                  name="loginPassword"
                  placeholder="Password"
                  className="w-full p-2 border border-gray-300 rounded"
                  required
                />
                <StylizedButton text="Log In" type="submit" />
              </form>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default MainComponent;