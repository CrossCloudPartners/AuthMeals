import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { Cart, CartItem, Meal } from '../types';
import toast from 'react-hot-toast';

interface CartContextType {
  cart: Cart;
  addToCart: (meal: Meal, quantity: number) => void;
  removeFromCart: (mealId: string) => void;
  updateQuantity: (mealId: string, quantity: number) => void;
  clearCart: () => void;
  itemCount: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

interface CartProviderProps {
  children: ReactNode;
}

const initialCartState: Cart = {
  items: [],
  vendorId: null,
  vendorName: null,
  totalAmount: 0
};

export const CartProvider: React.FC<CartProviderProps> = ({ children }) => {
  const [cart, setCart] = useState<Cart>(() => {
    const savedCart = localStorage.getItem('authMealsCart');
    return savedCart ? JSON.parse(savedCart) : initialCartState;
  });

  useEffect(() => {
    localStorage.setItem('authMealsCart', JSON.stringify(cart));
  }, [cart]);

  const calculateTotalAmount = (items: CartItem[]): number => {
    return items.reduce((total, item) => total + (item.meal.price * item.quantity), 0);
  };

  const addToCart = (meal: Meal, quantity: number) => {
    setCart(prevCart => {
      // Check if cart has items from a different vendor
      if (prevCart.items.length > 0 && prevCart.vendorId !== meal.vendorId) {
        const confirmed = window.confirm(
          'Adding items from a different vendor will clear your current cart. Do you want to continue?'
        );
        
        if (!confirmed) {
          return prevCart;
        }
        
        // Clear cart and add new item
        const newItem: CartItem = { meal, quantity };
        const newCart: Cart = {
          items: [newItem],
          vendorId: meal.vendorId,
          vendorName: "Vendor", // This would typically come from an API call
          totalAmount: meal.price * quantity
        };
        
        toast.success('Cart updated with new vendor items');
        return newCart;
      }
      
      // Check if the item already exists in the cart
      const existingItemIndex = prevCart.items.findIndex(item => item.meal.id === meal.id);
      
      if (existingItemIndex >= 0) {
        // Update existing item quantity
        const updatedItems = [...prevCart.items];
        updatedItems[existingItemIndex].quantity += quantity;
        
        const newCart = {
          ...prevCart,
          items: updatedItems,
          totalAmount: calculateTotalAmount(updatedItems)
        };
        
        toast.success(`Updated quantity in cart`);
        return newCart;
      }
      
      // Add new item to cart
      const newItem: CartItem = { meal, quantity };
      const newItems = [...prevCart.items, newItem];
      
      const newCart: Cart = {
        items: newItems,
        vendorId: meal.vendorId,
        vendorName: "Vendor", // This would typically come from an API call
        totalAmount: calculateTotalAmount(newItems)
      };
      
      toast.success('Added to cart successfully');
      return newCart;
    });
  };

  const removeFromCart = (mealId: string) => {
    setCart(prevCart => {
      const updatedItems = prevCart.items.filter(item => item.meal.id !== mealId);
      
      // If cart is empty after removal, reset vendorId and vendorName
      const vendorId = updatedItems.length > 0 ? prevCart.vendorId : null;
      const vendorName = updatedItems.length > 0 ? prevCart.vendorName : null;
      
      toast.success('Removed from cart');
      
      return {
        ...prevCart,
        items: updatedItems,
        vendorId,
        vendorName,
        totalAmount: calculateTotalAmount(updatedItems)
      };
    });
  };

  const updateQuantity = (mealId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(mealId);
      return;
    }
    
    setCart(prevCart => {
      const updatedItems = prevCart.items.map(item => 
        item.meal.id === mealId ? { ...item, quantity } : item
      );
      
      return {
        ...prevCart,
        items: updatedItems,
        totalAmount: calculateTotalAmount(updatedItems)
      };
    });
  };

  const clearCart = () => {
    setCart(initialCartState);
    toast.success('Cart cleared');
  };

  const itemCount = cart.items.reduce((count, item) => count + item.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        itemCount
      }}
    >
      {children}
    </CartContext.Provider>
  );
};