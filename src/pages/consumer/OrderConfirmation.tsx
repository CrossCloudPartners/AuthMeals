import React from 'react';
import { useParams } from 'react-router-dom';

const OrderConfirmation = () => {
  const { id } = useParams();

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Order Confirmation</h1>
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold mb-4">Thank you for your order!</h2>
        <p className="text-gray-600">Order ID: {id}</p>
        {/* Additional order details will be implemented later */}
      </div>
    </div>
  );
};

export default OrderConfirmation;