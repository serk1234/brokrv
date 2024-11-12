"use client";
import React from "react";

function StylizedButton({ text, onClick, className = "", bgColor = "#A3E636" }) {
  return (
    <button
      onClick={onClick}
      className={`px-6 py-2 rounded text-black font-semibold border border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] ${className}`}
      style={{ backgroundColor: bgColor }}
    >
      {text}
    </button>
  );
}

function StylizedButtonStory() {
  return (
    <div className="p-4 space-y-4">
      <StylizedButton
        text="Click me!"
        onClick={() => alert("Button clicked!")}
      />
      <StylizedButton text="Submit" onClick={() => alert("Submitted!")} />
      <StylizedButton text="Cancel" onClick={() => alert("Cancelled!")} />
    </div>
  );
}

export default StylizedButton;
