// client/src/components/CartSummary.jsx
import React from 'react';
import { useCart } from '../context/CartContext';
import { Link } from 'react-router-dom';

const CartSummary = () => {
  const { cartCount } = useCart();

  return (
    <div className="cart-summary w-full md:w-80 border rounded-lg p-4 sticky top-4">
      <h2 className="text-xl font-semibold mb-4">Cart Summary</h2>
      <div className="flex justify-between mb-4">
        <span>Items in Cart:</span>
        <span>{cartCount}</span>
      </div>
      <Link
        to="/cart"
        className="block w-full bg-green-500 text-white text-center py-2 rounded hover:bg-green-600"
      >
        View Cart
      </Link>
    </div>
  );
};

export default CartSummary;