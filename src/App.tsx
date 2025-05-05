import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './contexts/AuthContext';
import { CartProvider } from './contexts/CartContext';

import Layout from './components/layout/Layout';
import HomePage from './pages/HomePage';
import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';
import MealListingPage from './pages/MealListingPage';
import MealDetailPage from './pages/MealDetailPage';
import TermsPage from './pages/legal/TermsPage';
import PrivacyPolicy from './pages/legal/PrivacyPolicy';
import ContactPage from './pages/ContactPage';

// Admin Pages
import AdminLogin from './pages/admin/AdminLogin';
import AdminDashboard from './pages/admin/AdminDashboard';

// Vendor Pages
import VendorDashboard from './pages/vendor/VendorDashboard';
import VendorMeals from './pages/vendor/VendorMeals';
import VendorOrders from './pages/vendor/VendorOrders';
import VendorProfile from './pages/vendor/VendorProfile';
import CreateMeal from './pages/vendor/CreateMeal';
import EditMeal from './pages/vendor/EditMeal';

// Consumer Pages
import ConsumerDashboard from './pages/consumer/ConsumerDashboard';
import ConsumerOrders from './pages/consumer/ConsumerOrders';
import ConsumerProfile from './pages/consumer/ConsumerProfile';
import ConsumerFavorites from './pages/consumer/ConsumerFavorites';
import Checkout from './pages/consumer/Checkout';
import OrderConfirmation from './pages/consumer/OrderConfirmation';

// Protected Routes
import ProtectedRoute from './components/auth/ProtectedRoute';

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <Router>
          <Layout>
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<HomePage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route path="/meals" element={<MealListingPage />} />
              <Route path="/meals/:id" element={<MealDetailPage />} />
              <Route path="/terms" element={<TermsPage />} />
              <Route path="/privacy" element={<PrivacyPolicy />} />
              <Route path="/contact" element={<ContactPage />} />
              
              {/* Admin Routes */}
              <Route path="/admin/login" element={<AdminLogin />} />
              <Route path="/admin/*" element={<ProtectedRoute userType="admin"><AdminDashboard /></ProtectedRoute>} />
              
              {/* Vendor Routes */}
              <Route path="/vendor" element={<ProtectedRoute userType="vendor"><VendorDashboard /></ProtectedRoute>} />
              <Route path="/vendor/meals" element={<ProtectedRoute userType="vendor"><VendorMeals /></ProtectedRoute>} />
              <Route path="/vendor/meals/create" element={<ProtectedRoute userType="vendor"><CreateMeal /></ProtectedRoute>} />
              <Route path="/vendor/meals/:id/edit" element={<ProtectedRoute userType="vendor"><EditMeal /></ProtectedRoute>} />
              <Route path="/vendor/orders" element={<ProtectedRoute userType="vendor"><VendorOrders /></ProtectedRoute>} />
              <Route path="/vendor/profile" element={<ProtectedRoute userType="vendor"><VendorProfile /></ProtectedRoute>} />
              
              {/* Consumer Routes */}
              <Route path="/consumer" element={<ProtectedRoute userType="consumer"><ConsumerDashboard /></ProtectedRoute>} />
              <Route path="/consumer/orders" element={<ProtectedRoute userType="consumer"><ConsumerOrders /></ProtectedRoute>} />
              <Route path="/consumer/profile" element={<ProtectedRoute userType="consumer"><ConsumerProfile /></ProtectedRoute>} />
              <Route path="/consumer/favorites" element={<ProtectedRoute userType="consumer"><ConsumerFavorites /></ProtectedRoute>} />
              <Route path="/checkout" element={<ProtectedRoute userType="consumer"><Checkout /></ProtectedRoute>} />
              <Route path="/order-confirmation/:id" element={<ProtectedRoute userType="consumer"><OrderConfirmation /></ProtectedRoute>} />
            </Routes>
          </Layout>
          <Toaster position="top-right" />
        </Router>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;