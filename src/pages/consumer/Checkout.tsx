import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  MapPin, 
  Clock, 
  CreditCard, 
  Truck, 
  Store,
  AlertCircle,
  ChevronRight,
  Info
} from 'lucide-react';
import { useCart } from '../../contexts/CartContext';
import { useAuth } from '../../contexts/AuthContext';
import { supabase } from '../../lib/supabase';
import Button from '../../components/common/Button';
import AddressInput from '../../components/common/AddressInput';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import toast from 'react-hot-toast';

interface DeliveryTimeSlot {
  id: string;
  time: string;
  available: boolean;
}

interface SavedAddress {
  id: string;
  street: string;
  unit?: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  isDefault: boolean;
}

const Checkout = () => {
  const navigate = useNavigate();
  const { cart, clearCart } = useCart();
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [deliveryOption, setDeliveryOption] = useState<'delivery' | 'pickup'>('delivery');
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<string>('');
  const [savedAddresses, setSavedAddresses] = useState<SavedAddress[]>([]);
  const [selectedAddress, setSelectedAddress] = useState<SavedAddress | null>(null);
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [specialInstructions, setSpecialInstructions] = useState('');
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'paypal'>('card');

  // Mock time slots
  const timeSlots: DeliveryTimeSlot[] = [
    { id: '1', time: '12:00 PM - 1:00 PM', available: true },
    { id: '2', time: '1:00 PM - 2:00 PM', available: true },
    { id: '3', time: '2:00 PM - 3:00 PM', available: false },
    { id: '4', time: '3:00 PM - 4:00 PM', available: true },
    { id: '5', time: '4:00 PM - 5:00 PM', available: true },
  ];

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }

    if (!cart.items.length) {
      navigate('/meals');
      return;
    }

    fetchSavedAddresses();
  }, [user, cart, navigate]);

  const fetchSavedAddresses = async () => {
    try {
      // In a real app, fetch saved addresses from the database
      const mockAddresses: SavedAddress[] = [
        {
          id: '1',
          street: '123 Main St',
          city: 'Anytown',
          state: 'ST',
          zipCode: '12345',
          country: 'USA',
          isDefault: true
        }
      ];

      setSavedAddresses(mockAddresses);
      setSelectedAddress(mockAddresses.find(addr => addr.isDefault) || null);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching addresses:', error);
      toast.error('Failed to load saved addresses');
      setLoading(false);
    }
  };

  const handleAddressSelect = (address: SavedAddress) => {
    setSelectedAddress(address);
    setShowAddressForm(false);
  };

  const handleAddressSubmit = async (address: any) => {
    try {
      // In a real app, save the address to the database
      const newAddress: SavedAddress = {
        id: Math.random().toString(),
        ...address,
        isDefault: savedAddresses.length === 0
      };

      setSavedAddresses(prev => [...prev, newAddress]);
      setSelectedAddress(newAddress);
      setShowAddressForm(false);
      toast.success('Address saved successfully');
    } catch (error) {
      console.error('Error saving address:', error);
      toast.error('Failed to save address');
    }
  };

  const calculateTotal = () => {
    const subtotal = cart.totalAmount;
    const deliveryFee = deliveryOption === 'delivery' ? 4.99 : 0;
    const tax = subtotal * 0.08; // 8% tax
    return {
      subtotal,
      deliveryFee,
      tax,
      total: subtotal + deliveryFee + tax
    };
  };

  const handleSubmitOrder = async () => {
    try {
      setProcessing(true);

      // Validate required fields
      if (deliveryOption === 'delivery' && !selectedAddress) {
        throw new Error('Please select a delivery address');
      }

      if (!selectedTimeSlot) {
        throw new Error('Please select a delivery/pickup time');
      }

      if (!acceptedTerms) {
        throw new Error('Please accept the terms and conditions');
      }

      // Calculate totals
      const { subtotal, deliveryFee, tax, total } = calculateTotal();

      // Create order in database
      const { data: order, error: orderError } = await supabase
        .from('orders')
        .insert({
          user_id: user?.id,
          status: 'pending',
          total_amount: total,
          delivery_address: deliveryOption === 'delivery' ? selectedAddress : null,
          delivery_option: deliveryOption,
          delivery_fee: deliveryFee,
          requested_delivery_time: selectedTimeSlot,
          special_instructions: specialInstructions,
          payment_status: 'pending'
        })
        .select()
        .single();

      if (orderError) throw orderError;

      // Create order items
      const orderItems = cart.items.map(item => ({
        order_id: order.id,
        meal_id: item.meal.id,
        quantity: item.quantity,
        price: item.meal.price,
        total_price: item.meal.price * item.quantity
      }));

      const { error: itemsError } = await supabase
        .from('order_items')
        .insert(orderItems);

      if (itemsError) throw itemsError;

      // Clear cart and redirect to confirmation page
      clearCart();
      navigate(`/order-confirmation/${order.id}`);
      toast.success('Order placed successfully');
    } catch (error) {
      console.error('Error placing order:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to place order');
    } finally {
      setProcessing(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <LoadingSpinner />
      </div>
    );
  }

  const { subtotal, deliveryFee, tax, total } = calculateTotal();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Order Summary */}
        <div className="space-y-6">
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Order Summary</h2>
            <div className="space-y-4">
              {cart.items.map((item) => (
                <div key={item.meal.id} className="flex items-center space-x-4">
                  <img
                    src={item.meal.images[0]}
                    alt={item.meal.name}
                    className="h-16 w-16 object-cover rounded-lg"
                  />
                  <div className="flex-1">
                    <h3 className="text-sm font-medium text-gray-900">{item.meal.name}</h3>
                    <p className="text-sm text-gray-500">Quantity: {item.quantity}</p>
                  </div>
                  <p className="text-sm font-medium text-gray-900">
                    ${(item.meal.price * item.quantity).toFixed(2)}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Delivery Options */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Delivery Options</h2>
            <div className="space-y-4">
              <div className="flex space-x-4">
                <button
                  onClick={() => setDeliveryOption('delivery')}
                  className={`flex-1 py-3 px-4 rounded-lg border ${
                    deliveryOption === 'delivery'
                      ? 'border-orange-500 bg-orange-50 text-orange-700'
                      : 'border-gray-300 text-gray-700'
                  }`}
                >
                  <Truck className="h-5 w-5 mb-1 mx-auto" />
                  <span className="block text-sm">Delivery</span>
                </button>
                
                <button
                  onClick={() => setDeliveryOption('pickup')}
                  className={`flex-1 py-3 px-4 rounded-lg border ${
                    deliveryOption === 'pickup'
                      ? 'border-orange-500 bg-orange-50 text-orange-700'
                      : 'border-gray-300 text-gray-700'
                  }`}
                >
                  <Store className="h-5 w-5 mb-1 mx-auto" />
                  <span className="block text-sm">Pickup</span>
                </button>
              </div>

              {/* Time Slots */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Select {deliveryOption === 'delivery' ? 'Delivery' : 'Pickup'} Time
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {timeSlots.map((slot) => (
                    <button
                      key={slot.id}
                      onClick={() => setSelectedTimeSlot(slot.time)}
                      disabled={!slot.available}
                      className={`py-2 px-4 rounded-md text-sm ${
                        !slot.available
                          ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                          : selectedTimeSlot === slot.time
                          ? 'bg-orange-500 text-white'
                          : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      {slot.time}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Delivery Address */}
          {deliveryOption === 'delivery' && (
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Delivery Address</h2>
              {!showAddressForm ? (
                <div className="space-y-4">
                  {savedAddresses.map((address) => (
                    <div
                      key={address.id}
                      onClick={() => handleAddressSelect(address)}
                      className={`p-4 rounded-lg border cursor-pointer ${
                        selectedAddress?.id === address.id
                          ? 'border-orange-500 bg-orange-50'
                          : 'border-gray-300 hover:border-orange-500'
                      }`}
                    >
                      <div className="flex items-start">
                        <MapPin className="h-5 w-5 text-gray-400 mt-1" />
                        <div className="ml-3">
                          <p className="text-sm font-medium text-gray-900">
                            {address.street}
                            {address.unit && `, ${address.unit}`}
                          </p>
                          <p className="text-sm text-gray-500">
                            {address.city}, {address.state} {address.zipCode}
                          </p>
                          {address.isDefault && (
                            <span className="inline-flex items-center mt-1 px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800">
                              Default
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                  <button
                    onClick={() => setShowAddressForm(true)}
                    className="w-full py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500"
                  >
                    Add New Address
                  </button>
                </div>
              ) : (
                <div>
                  <AddressInput
                    onChange={handleAddressSubmit}
                    required
                  />
                  <button
                    onClick={() => setShowAddressForm(false)}
                    className="mt-4 text-sm text-orange-600 hover:text-orange-500"
                  >
                    Cancel
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Special Instructions */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Special Instructions</h2>
            <textarea
              value={specialInstructions}
              onChange={(e) => setSpecialInstructions(e.target.value)}
              rows={3}
              className="w-full border border-gray-300 rounded-md shadow-sm focus:ring-orange-500 focus:border-orange-500"
              placeholder="Add any special instructions or notes for your order..."
            />
          </div>
        </div>

        {/* Payment Summary */}
        <div className="space-y-6">
          <div className="bg-white rounded-lg shadow p-6 sticky top-8">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Payment Summary</h2>
            
            <div className="space-y-4">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Subtotal</span>
                <span className="text-gray-900">${subtotal.toFixed(2)}</span>
              </div>
              
              {deliveryOption === 'delivery' && (
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Delivery Fee</span>
                  <span className="text-gray-900">${deliveryFee.toFixed(2)}</span>
                </div>
              )}
              
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Tax</span>
                <span className="text-gray-900">${tax.toFixed(2)}</span>
              </div>
              
              <div className="border-t pt-4">
                <div className="flex justify-between">
                  <span className="text-base font-medium text-gray-900">Total</span>
                  <span className="text-base font-medium text-gray-900">${total.toFixed(2)}</span>
                </div>
              </div>
            </div>

            {/* Payment Method */}
            <div className="mt-6">
              <h3 className="text-sm font-medium text-gray-900 mb-4">Payment Method</h3>
              <div className="space-y-3">
                <button
                  onClick={() => setPaymentMethod('card')}
                  className={`w-full flex items-center justify-between p-4 border rounded-lg ${
                    paymentMethod === 'card'
                      ? 'border-orange-500 bg-orange-50'
                      : 'border-gray-300'
                  }`}
                >
                  <div className="flex items-center">
                    <CreditCard className="h-5 w-5 text-gray-400" />
                    <span className="ml-3 text-sm font-medium text-gray-900">Credit Card</span>
                  </div>
                  {paymentMethod === 'card' && (
                    <ChevronRight className="h-5 w-5 text-orange-500" />
                  )}
                </button>

                <button
                  onClick={() => setPaymentMethod('paypal')}
                  className={`w-full flex items-center justify-between p-4 border rounded-lg ${
                    paymentMethod === 'paypal'
                      ? 'border-orange-500 bg-orange-50'
                      : 'border-gray-300'
                  }`}
                >
                  <div className="flex items-center">
                    <img
                      src="https://www.paypalobjects.com/webstatic/mktg/logo/pp_cc_mark_37x23.jpg"
                      alt="PayPal"
                      className="h-6"
                    />
                    <span className="ml-3 text-sm font-medium text-gray-900">PayPal</span>
                  </div>
                  {paymentMethod === 'paypal' && (
                    <ChevronRight className="h-5 w-5 text-orange-500" />
                  )}
                </button>
              </div>
            </div>

            {/* Terms an

d Conditions */}
            <div className="mt-6">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={acceptedTerms}
                  onChange={(e) => setAcceptedTerms(e.target.checked)}
                  className="h-4 w-4 text-orange-500 focus:ring-orange-500 border-gray-300 rounded"
                />
                <span className="ml-2 text-sm text-gray-500">
                  I agree to the{' '}
                  <a href="/terms" className="text-orange-600 hover:text-orange-500">
                    Terms and Conditions
                  </a>
                </span>
              </label>
            </div>

            {/* Place Order Button */}
            <div className="mt-6">
              <Button
                variant="primary"
                fullWidth
                onClick={handleSubmitOrder}
                disabled={!acceptedTerms || processing}
                isLoading={processing}
              >
                Place Order
              </Button>
              <p className="mt-2 text-xs text-gray-500 flex items-center justify-center">
                <Info className="h-3 w-3 mr-1" />
                Your payment will be processed securely
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;