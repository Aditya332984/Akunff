import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const CategoryNav = () => {
  const [isBuyAccountsOpen, setIsBuyAccountsOpen] = useState(false);

  return (
    <div className="bg-gray-900 text-white py-2 border-b border-gray-800">
      <div className="container mx-auto flex flex-wrap items-center justify-center space-x-4 sm:space-x-6 md:space-x-8 lg:space-x-10">
        <Link
          to="/"
          className="px-3 py-2 text-sm font-medium hover:bg-gray-800 rounded transition-colors duration-300"
        >
          Home
        </Link>
        <div className="relative">
          <button
            onClick={() => setIsBuyAccountsOpen(!isBuyAccountsOpen)}
            className="px-3 py-2 text-sm font-medium hover:bg-gray-800 rounded transition-colors duration-300 flex items-center"
          >
            Buy Accounts
          </button>
          {isBuyAccountsOpen && (
            <div className="absolute top-full mt-2 w-56 bg-gray-800 border border-gray-700 rounded-xl shadow-2xl p-2 z-50">
              <Link
                to="/products?game=free-fire"
                className="block px-4 py-2 text-gray-300 hover:bg-gray-700 hover:text-white rounded-lg transition-colors duration-200 text-sm"
                onClick={() => setIsBuyAccountsOpen(false)}
              >
                Free Fire Accounts
              </Link>
              <Link
                to="/products?game=pubg"
                className="block px-4 py-2 text-gray-300 hover:bg-gray-700 hover:text-white rounded-lg transition-colors duration-200 text-sm"
                onClick={() => setIsBuyAccountsOpen(false)}
              >
                PUBG / BGMI Accounts
              </Link>
            </div>
          )}
        </div>
        <Link
          to="/sell"
          className="px-3 py-2 text-sm font-medium hover:bg-gray-800 rounded transition-colors duration-300"
        >
          Sell Accounts
        </Link>
        <Link
          to="/redeem-codes"
          className="px-3 py-2 text-sm font-medium hover:bg-gray-800 rounded transition-colors duration-300"
        >
          Redeem Codes
        </Link>
        <Link
          to="/top-ups"
          className="px-3 py-2 text-sm font-medium hover:bg-gray-800 rounded transition-colors duration-300"
        >
          Top-Ups
        </Link>
        <Link
          to="/digital-products"
          className="px-3 py-2 text-sm font-medium hover:bg-gray-800 rounded transition-colors duration-300"
        >
          Digital Products
        </Link>
        <Link
          to="/blog"
          className="px-3 py-2 text-sm font-medium hover:bg-gray-800 rounded transition-colors duration-300 hidden xl:block"
        >
          Blog
        </Link>
        <Link
          to="/support"
          className="px-3 py-2 text-sm font-medium hover:bg-gray-800 rounded transition-colors duration-300 hidden xl:block"
        >
          Support
        </Link>
      </div>
    </div>
  );
};

export default CategoryNav;