import React from "react";

function LandingPage() {
  return (
    <div className="flex items-center justify-center h-screen bg-gradient-to-r from-coral to-orange-300 text-white">
      <div className="text-center max-w-lg">
        <h1 className="text-6xl font-bold mb-4">Pay Later!?</h1>
        <p className="text-xl mb-8">Manage your bills and payments!</p>
        <a href="/register">
          <button className="bg-white text-coral font-semibold px-8 py-3 rounded-full shadow-lg hover:bg-gray-100 transition duration-300">
            Get Started
          </button>
        </a>
      </div>
    </div>
  );
}

export default LandingPage;
