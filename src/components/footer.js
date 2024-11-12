"use client";
import React from 'react';

import 'bootstrap-icons/font/bootstrap-icons.css'; // Import Bootstrap Icons CSS

function Footer() {
    return (
      <div className="bg-black">
        {/* Footer Container */}
        <footer className="bg-black p-16 space-y-6 border-t-4 border-gray-300 shadow-lg">
          {/* Align logo using flex */}
          <div className="flex justify-center items-center">
            {/* Logo in text */}
            <h1 className="text-4xl font-bold text-white">brokr.</h1>
          </div>
        </footer>
      </div>
    );
}

export default Footer;
