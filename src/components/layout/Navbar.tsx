import {
  ChefHat,
  Heart,
  Home,
  LogOut,
  Menu,
  Package,
  Search,
  ShoppingBag,
  User
} from 'lucide-react';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useCart } from '../../contexts/CartContext';

const Navbar = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const { itemCount } = useCart();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
    if (isProfileOpen) setIsProfileOpen(false);
  };

  const toggleProfile = () => {
    setIsProfileOpen(!isProfileOpen);
    if (isMenuOpen) setIsMenuOpen(false);
  };

  const handleLogout = () => {
    logout();
    navigate('/');
    setIsProfileOpen(false);
  };

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex-shrink-0 flex items-center">
              <ChefHat className="h-8 w-8 text-orange-500" />
              <span className="ml-2 text-xl font-bold text-gray-900">Authentic Meals</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-4">
            <div className="relative">
              <input
                type="text"
                placeholder="Search for meals..."
                className="w-64 pl-10 pr-4 py-2 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              />
              <div className="absolute left-3 top-2.5">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
            </div>

            <Link 
              to="/meals" 
              className="text-gray-600 hover:text-orange-500 px-3 py-2 rounded-md text-sm font-medium"
            >
              Browse Meals
            </Link>

            {isAuthenticated ? (
              <>
                <Link
                  to={user?.role === 'vendor' ? '/vendor' : '/consumer'}
                  className="text-gray-600 hover:text-orange-500 px-3 py-2 rounded-md text-sm font-medium"
                >
                  Dashboard
                </Link>

                <div className="relative ml-3">
                  <button
                    onClick={toggleProfile}
                    className="flex text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500"
                  >
                    <span className="sr-only">Open user menu</span>
                    {user?.avatar ? (
                      <img
                        className="h-8 w-8 rounded-full"
                        src={user.avatar}
                        alt="User avatar"
                      />
                    ) : (
                      <div className="h-8 w-8 rounded-full bg-orange-200 flex items-center justify-center">
                        <span className="text-orange-700 font-medium">
                          {user?.first_name ? user.first_name[0] : 'U'}
                        </span>
                      </div>
                    )}
                  </button>

                  {isProfileOpen && (
                    <div className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5 focus:outline-none">
                      <div className="px-4 py-2 text-xs text-gray-500 border-b">
                        Signed in as <span className="font-medium">{user?.first_name}</span>
                      </div>
                      <Link
                        to={user?.role === 'vendor' ? '/vendor/profile' : '/consumer/profile'}
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center"
                        onClick={() => setIsProfileOpen(false)}
                      >
                        <User className="w-4 h-4 mr-2" />
                        Profile
                      </Link>
                      
                      {user?.role === 'vendor' ? (
                        <>
                          <Link
                            to="/vendor/meals"
                            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center"
                            onClick={() => setIsProfileOpen(false)}
                          >
                            <ChefHat className="w-4 h-4 mr-2" />
                            My Meals
                          </Link>
                          <Link
                            to="/vendor/orders"
                            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center"
                            onClick={() => setIsProfileOpen(false)}
                          >
                            <Package className="w-4 h-4 mr-2" />
                            Orders
                          </Link>
                        </>
                      ) : (
                        <>
                          <Link
                            to="/consumer/orders"
                            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center"
                            onClick={() => setIsProfileOpen(false)}
                          >
                            <Package className="w-4 h-4 mr-2" />
                            My Orders
                          </Link>
                          <Link
                            to="/consumer/favorites"
                            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center"
                            onClick={() => setIsProfileOpen(false)}
                          >
                            <Heart className="w-4 h-4 mr-2" />
                            Favorites
                          </Link>
                        </>
                      )}
                      
                      <div className="border-t border-gray-100"></div>
                      <button
                        onClick={handleLogout}
                        className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center"
                      >
                        <LogOut className="w-4 h-4 mr-2" />
                        Sign out
                      </button>
                    </div>
                  )}
                </div>

                {user?.role === 'consumer' && (
                  <Link 
                    to="/checkout" 
                    className="text-gray-600 hover:text-orange-500 px-3 py-2 rounded-md text-sm font-medium relative"
                  >
                    <ShoppingBag className="h-5 w-5" />
                    {itemCount > 0 && (
                      <span className="absolute -top-1 -right-1 bg-orange-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                        {itemCount}
                      </span>
                    )}
                  </Link>
                )}
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="text-gray-600 hover:text-orange-500 px-3 py-2 rounded-md text-sm font-medium"
                >
                  Log in
                </Link>
                <Link
                  to="/register"
                  className="bg-orange-500 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-orange-600"
                >
                  Sign up
                </Link>
              </>
            )}
          </div>

          {/* Mobile Navigation */}
          <div className="flex items-center md:hidden">
            {user?.role === 'consumer' && (
              <Link 
                to="/checkout" 
                className="text-gray-600 hover:text-orange-500 px-3 py-2 rounded-md text-sm font-medium relative mr-2"
              >
                <ShoppingBag className="h-5 w-5" />
                {itemCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-orange-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {itemCount}
                  </span>
                )}
              </Link>
            )}
            
            <button
              onClick={toggleMenu}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:text-orange-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-orange-500"
            >
              <span className="sr-only">Open main menu</span>
              <Menu className="h-6 w-6" />
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <Link
              to="/"
              className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-orange-500 hover:bg-gray-50 flex items-center"
              onClick={() => setIsMenuOpen(false)}
            >
              <Home className="w-5 h-5 mr-2" />
              Home
            </Link>
            
            <Link
              to="/meals"
              className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-orange-500 hover:bg-gray-50 flex items-center"
              onClick={() => setIsMenuOpen(false)}
            >
              <Search className="w-5 h-5 mr-2" />
              Browse Meals
            </Link>

            {isAuthenticated ? (
              <>
                <Link
                  to={user?.role === 'vendor' ? '/vendor' : '/consumer'}
                  className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-orange-500 hover:bg-gray-50 flex items-center"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <Home className="w-5 h-5 mr-2" />
                  Dashboard
                </Link>
                
                {user?.role === 'vendor' ? (
                  <>
                    <Link
                      to="/vendor/meals"
                      className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-orange-500 hover:bg-gray-50 flex items-center"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <ChefHat className="w-5 h-5 mr-2" />
                      My Meals
                    </Link>
                    <Link
                      to="/vendor/orders"
                      className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-orange-500 hover:bg-gray-50 flex items-center"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <Package className="w-5 h-5 mr-2" />
                      Orders
                    </Link>
                  </>
                ) : (
                  <>
                    <Link
                      to="/consumer/orders"
                      className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-orange-500 hover:bg-gray-50 flex items-center"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <Package className="w-5 h-5 mr-2" />
                      My Orders
                    </Link>
                    <Link
                      to="/consumer/favorites"
                      className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-orange-500 hover:bg-gray-50 flex items-center"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <Heart className="w-5 h-5 mr-2" />
                      Favorites
                    </Link>
                  </>
                )}
                
                <Link
                  to={user?.role === 'vendor' ? '/vendor/profile' : '/consumer/profile'}
                  className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-orange-500 hover:bg-gray-50 flex items-center"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <User className="w-5 h-5 mr-2" />
                  Profile
                </Link>
                
                <button
                  onClick={() => {
                    handleLogout();
                    setIsMenuOpen(false);
                  }}
                  className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-orange-500 hover:bg-gray-50 flex items-center"
                >
                  <LogOut className="w-5 h-5 mr-2" />
                  Sign out
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-orange-500 hover:bg-gray-50"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Log in
                </Link>
                <Link
                  to="/register"
                  className="block px-3 py-2 rounded-md text-base font-medium bg-orange-500 text-white hover:bg-orange-600"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Sign up
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;