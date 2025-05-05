// User Types
export type UserRole = 'consumer' | 'vendor' | 'admin';

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  createdAt: string;
  avatar?: string;
}

export interface Consumer extends User {
  role: 'consumer';
  deliveryAddresses: Address[];
  dietaryPreferences: string[];
  favoriteVendors: string[];
  favoriteMeals: string[];
}

export interface Vendor extends User {
  role: 'vendor';
  businessName: string;
  description: string;
  phoneNumber: string;
  address: Address;
  businessHours: BusinessHours[];
  cuisineTypes: string[];
  deliveryZones: DeliveryZone[];
  rating: number;
  reviewCount: number;
  isVerified: boolean;
}

// Meal Types
export interface Meal {
  id: string;
  vendorId: string;
  name: string;
  description: string;
  price: number;
  images: string[];
  cuisineType: string[];
  dietaryInfo: DietaryInfo;
  minOrderQuantity: number;
  maxOrderQuantity?: number;
  availability: Availability;
  rating: number;
  reviewCount: number;
  createdAt: string;
  deliveryInfo?: DeliveryInfo;
}

export interface DietaryInfo {
  isVegetarian: boolean;
  isVegan: boolean;
  isGlutenFree: boolean;
  isDairyFree: boolean;
  isNutFree: boolean;
  isSpicy: boolean;
  allergens: string[];
  calories?: number;
}

export interface DeliveryInfo {
  radius: number;
  fee: number;
  minimumOrder: number;
  estimatedTime: string;
  availableTimes: string[];
}

export interface Availability {
  daysAvailable: string[]; // ['monday', 'tuesday', etc.]
  startTime: string; // e.g., '09:00'
  endTime: string; // e.g., '17:00'
  availableDates?: string[]; // specific dates
}

// Order Types
export interface Order {
  id: string;
  consumerId: string;
  vendorId: string;
  items: OrderItem[];
  status: OrderStatus;
  totalAmount: number;
  deliveryAddress: Address;
  deliveryOption: 'delivery' | 'pickup';
  deliveryFee: number;
  requestedDeliveryTime: string;
  createdAt: string;
  updatedAt: string;
  paymentStatus: PaymentStatus;
  specialInstructions?: string;
}

export interface OrderItem {
  mealId: string;
  name: string;
  price: number;
  quantity: number;
  totalPrice: number;
}

export type OrderStatus = 
  | 'pending' 
  | 'accepted' 
  | 'preparing' 
  | 'ready_for_pickup' 
  | 'out_for_delivery' 
  | 'delivered' 
  | 'completed' 
  | 'cancelled' 
  | 'rejected';

export type PaymentStatus = 'pending' | 'paid' | 'refunded' | 'failed';

// Address and Location Types
export interface Address {
  id?: string;
  street: string;
  unit?: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  isDefault?: boolean;
  label?: string; // e.g., 'Home', 'Work'
}

export interface DeliveryZone {
  id?: string;
  zipCodes: string[];
  cities?: string[];
  radius?: number; // in miles or km
  fee: number;
  minimumOrderAmount: number;
}

export interface BusinessHours {
  day: string;
  isOpen: boolean;
  openTime?: string;
  closeTime?: string;
}

// Review Types
export interface Review {
  id: string;
  mealId?: string;
  vendorId: string;
  consumerId: string;
  rating: number;
  comment: string;
  createdAt: string;
  images?: string[];
}

// Cart Types
export interface CartItem {
  meal: Meal;
  quantity: number;
}

export interface Cart {
  items: CartItem[];
  vendorId: string | null;
  vendorName: string | null;
  totalAmount: number;
  deliveryFee?: number;
}

// Message Types
export interface Message {
  id: string;
  conversationId: string;
  senderId: string;
  recipientId: string;
  content: string;
  createdAt: string;
  isRead: boolean;
}

export interface Conversation {
  id: string;
  participants: string[];
  lastMessage: string;
  lastMessageTime: string;
  unreadCount: number;
}