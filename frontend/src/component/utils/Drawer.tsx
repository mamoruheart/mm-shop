import React, { useState } from 'react';

const Drawer: React.FC = () => {


  return (
    <div className="flex h-screen">


      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="bg-white shadow">
          <div className="flex justify-between items-center p-4">
            <button
              onClick={toggleDrawer}
              className="lg:hidden p-2 rounded bg-gray-200 focus:outline-none"
            >
              <svg
                className="w-6 h-6 text-gray-700"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 6h16M4 12h16m-7 6h7"
                ></path>
              </svg>
            </button>
            <h1 className="text-xl font-bold">Dashboard</h1>
          </div>
        </header>

        {/* Main Section */}
        <main className="flex-1 p-4">
          <h2 className="text-2xl font-bold">Welcome to your dashboard</h2>
          <p className="mt-2 text-gray-600">This is the main content area.</p>
        </main>
      </div>
    </div>
  );
};

export default Drawer;
