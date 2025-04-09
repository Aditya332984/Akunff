import React from 'react';
import { Link } from 'react-router-dom';

const CategoryNav = () => {
  return (
    <div className="bg-gray-900 text-white py-2 border-b border-gray-800">
      <div className="container mx-auto flex items-center justify-center space-x-6">
        <Link
          to="/category"
          className="px-4 py-2 text-sm font-medium hover:bg-gray-800 rounded transition-colors duration-300"
        >
          Category
        </Link>
        <Link
          to="/steam-gift-cards"
          className="px-4 py-2 text-sm font-medium hover:bg-gray-800 rounded transition-colors duration-300"
        >
          Steam Gift Cards
        </Link>
        <Link
          to="/bigo-live"
          className="px-4 py-2 text-sm font-medium hover:bg-gray-800 rounded transition-colors duration-300"
        >
          BIGO Live
        </Link>
        <Link
          to="/psn-card"
          className="px-4 py-2 text-sm font-medium hover:bg-gray-800 rounded transition-colors duration-300"
        >
          PSN Card
        </Link>
        <Link
          to="/rbl-universe"
          className="px-4 py-2 text-sm font-medium hover:bg-gray-800 rounded transition-colors duration-300"
        >
          RBL Universe
        </Link>
        <Link
          to="/top-up-mlb"
          className="px-4 py-2 text-sm font-medium hover:bg-gray-800 rounded transition-colors duration-300"
        >
          Top Up MLB
        </Link>
        <Link
          to="/crypto-gift-cards"
          className="px-4 py-2 text-sm font-medium hover:bg-gray-800 rounded transition-colors duration-300"
        >
          Crypto Gift Cards
        </Link>
      </div>
    </div>
  );
};

export default CategoryNav;