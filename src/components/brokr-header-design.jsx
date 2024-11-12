"use client";
import React from "react";
import { useRouter } from "next/navigation";

function BrokrHeaderDesign({ activePage }) {
  const router = useRouter();

  

  const handleDashboardClick = () => {
    router.push("/api/auth/google?redirect=dashboardpage");
  };
  
  
  
  return (
    <header className="bg-white py-4 px-6 flex justify-between items-center border-b border-black">
      <a
        href="/"
        className="text-2xl font-open-sans text-black tracking-tight font-bold"
      >
        brokr.
      </a>
      <nav className="space-x-4 flex items-center">
        <a
          href="/listings"
          className={`font-open-sans font-medium ${
            activePage === "listings" ? "text-black" : "text-gray-600"
          } hover:text-black transition-colors duration-300`}
        >
          Listings
        </a>
        <button
          onClick={handleDashboardClick}
          className="px-4 py-2 rounded text-black font-semibold bg-lime-400 border border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:bg-lime-500 transition-colors duration-300"
        >
          Dashboard
        </button>
       
      </nav>
    </header>
  );
}

export default BrokrHeaderDesign;
