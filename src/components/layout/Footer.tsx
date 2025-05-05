import { Link } from 'react-router-dom';
import { ChefHat, Instagram, Facebook, Twitter } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-gray-800 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-1">
            <Link to="/" className="flex items-center mb-4">
              <ChefHat className="h-8 w-8 text-orange-500" />
              <span className="ml-2 text-xl font-bold">Authentic Meals</span>
            </Link>
            <p className="text-gray-300 mb-4">
              Connecting food lovers with talented home cooks in your neighborhood.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-300 hover:text-orange-500">
                <span className="sr-only">Facebook</span>
                <Facebook className="h-6 w-6" />
              </a>
              <a href="#" className="text-gray-300 hover:text-orange-500">
                <span className="sr-only">Instagram</span>
                <Instagram className="h-6 w-6" />
              </a>
              <a href="#" className="text-gray-300 hover:text-orange-500">
                <span className="sr-only">Twitter</span>
                <Twitter className="h-6 w-6" />
              </a>
            </div>
          </div>
          
          <div className="col-span-1">
            <h3 className="text-lg font-semibold mb-4">For Consumers</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/meals" className="text-gray-300 hover:text-orange-500">
                  Find Meals
                </Link>
              </li>
              <li>
                <Link to="/register" className="text-gray-300 hover:text-orange-500">
                  Sign Up
                </Link>
              </li>
              <li>
                <Link to="/consumer/orders" className="text-gray-300 hover:text-orange-500">
                  My Orders
                </Link>
              </li>
              <li>
                <Link to="/consumer/favorites" className="text-gray-300 hover:text-orange-500">
                  Favorites
                </Link>
              </li>
            </ul>
          </div>
          
          <div className="col-span-1">
            <h3 className="text-lg font-semibold mb-4">For Vendors</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/register" className="text-gray-300 hover:text-orange-500">
                  Become a Vendor
                </Link>
              </li>
              <li>
                <Link to="/vendor/meals" className="text-gray-300 hover:text-orange-500">
                  List Your Meals
                </Link>
              </li>
              <li>
                <Link to="/vendor/orders" className="text-gray-300 hover:text-orange-500">
                  Manage Orders
                </Link>
              </li>
              <li>
                <Link to="/vendor/profile" className="text-gray-300 hover:text-orange-500">
                  Vendor Resources
                </Link>
              </li>
            </ul>
          </div>
          
          <div className="col-span-1">
            <h3 className="text-lg font-semibold mb-4">Support</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/faq" className="text-gray-300 hover:text-orange-500">
                  FAQ
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-gray-300 hover:text-orange-500">
                  Contact Us
                </Link>
              </li>
              <li>
                <Link to="/privacy" className="text-gray-300 hover:text-orange-500">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link to="/terms" className="text-gray-300 hover:text-orange-500">
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gray-700 mt-8 pt-8 text-center text-gray-400">
          <p>&copy; {new Date().getFullYear()} Authentic Meals. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;