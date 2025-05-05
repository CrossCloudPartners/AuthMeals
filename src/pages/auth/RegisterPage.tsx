import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, ChefHat, CheckCircle, ArrowRight } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import Button from '../../components/common/Button';
import { UserRole } from '../../types';

const RegisterPage: React.FC = () => {
  const [step, setStep] = useState(1);
  const [userType, setUserType] = useState<UserRole | null>(null);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const { register, isLoading } = useAuth();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleUserTypeSelect = (type: UserRole) => {
    setUserType(type);
    setStep(2);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    
    // Validate form
    if (!formData.firstName || !formData.lastName) {
      setError('Please enter your full name');
      return;
    }
    
    if (!formData.email) {
      setError('Email is required');
      return;
    }
    
    if (!formData.password) {
      setError('Password is required');
      return;
    }
    
    if (formData.password.length < 8) {
      setError('Password must be at least 8 characters');
      return;
    }
    
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    
    if (!userType) {
      setError('Please select account type');
      return;
    }
    
    try {
      await register(formData, userType);
      // Redirect to appropriate dashboard after successful registration
      navigate(userType === 'vendor' ? '/vendor' : '/consumer');
    } catch (err) {
      setError((err as Error).message || 'Failed to register');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center">
          <ChefHat className="h-12 w-12 text-orange-500" />
        </div>
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Create your account
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Already have an account?{' '}
          <Link to="/login" className="font-medium text-orange-600 hover:text-orange-500">
            Sign in
          </Link>
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          {error && (
            <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm text-red-700">{error}</p>
                </div>
              </div>
            </div>
          )}
          
          {step === 1 ? (
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-6">What type of account do you want to create?</h3>
              
              <div className="space-y-4">
                <button
                  type="button"
                  onClick={() => handleUserTypeSelect('consumer')}
                  className={`w-full relative border ${userType === 'consumer' ? 'border-orange-500 bg-orange-50' : 'border-gray-300'} rounded-lg p-4 text-left transition hover:border-orange-500 focus:outline-none`}
                >
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-base font-medium text-gray-900">Consumer</p>
                      <p className="text-sm text-gray-500 mt-1">I want to order meals from home cooks.</p>
                    </div>
                    {userType === 'consumer' && (
                      <CheckCircle className="h-6 w-6 text-orange-500" />
                    )}
                  </div>
                </button>
                
                <button
                  type="button"
                  onClick={() => handleUserTypeSelect('vendor')}
                  className={`w-full relative border ${userType === 'vendor' ? 'border-orange-500 bg-orange-50' : 'border-gray-300'} rounded-lg p-4 text-left transition hover:border-orange-500 focus:outline-none`}
                >
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-base font-medium text-gray-900">Vendor / Home Cook</p>
                      <p className="text-sm text-gray-500 mt-1">I want to sell my homemade meals.</p>
                    </div>
                    {userType === 'vendor' && (
                      <CheckCircle className="h-6 w-6 text-orange-500" />
                    )}
                  </div>
                </button>
              </div>
              
              <div className="mt-6">
                <Button
                  type="button"
                  variant="primary"
                  fullWidth
                  onClick={() => {
                    if (userType) {
                      setStep(2);
                    } else {
                      setError('Please select an account type');
                    }
                  }}
                >
                  <span>Continue</span>
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </div>
          ) : (
            <form className="space-y-6" onSubmit={handleSubmit}>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="firstName" className="block text-sm font-medium text-gray-700">
                    First name
                  </label>
                  <div className="mt-1">
                    <input
                      id="firstName"
                      name="firstName"
                      type="text"
                      autoComplete="given-name"
                      required
                      value={formData.firstName}
                      onChange={handleInputChange}
                      className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-orange-500 focus:border-orange-500"
                    />
                  </div>
                </div>
                
                <div>
                  <label htmlFor="lastName" className="block text-sm font-medium text-gray-700">
                    Last name
                  </label>
                  <div className="mt-1">
                    <input
                      id="lastName"
                      name="lastName"
                      type="text"
                      autoComplete="family-name"
                      required
                      value={formData.lastName}
                      onChange={handleInputChange}
                      className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-orange-500 focus:border-orange-500"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                  Email address
                </label>
                <div className="mt-1">
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    value={formData.email}
                    onChange={handleInputChange}
                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-orange-500 focus:border-orange-500"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                  Password
                </label>
                <div className="mt-1 relative">
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    autoComplete="new-password"
                    required
                    value={formData.password}
                    onChange={handleInputChange}
                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-orange-500 focus:border-orange-500"
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5 text-gray-400" />
                    ) : (
                      <Eye className="h-5 w-5 text-gray-400" />
                    )}
                  </button>
                </div>
                <p className="mt-1 text-xs text-gray-500">
                  Password must be at least 8 characters long
                </p>
              </div>
              
              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                  Confirm password
                </label>
                <div className="mt-1 relative">
                  <input
                    id="confirmPassword"
                    name="confirmPassword"
                    type={showPassword ? 'text' : 'password'}
                    autoComplete="new-password"
                    required
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-orange-500 focus:border-orange-500"
                  />
                </div>
              </div>

              <div className="flex items-center">
                <input
                  id="terms"
                  name="terms"
                  type="checkbox"
                  required
                  className="h-4 w-4 text-orange-600 focus:ring-orange-500 border-gray-300 rounded"
                />
                <label htmlFor="terms" className="ml-2 block text-sm text-gray-900">
                  I agree to the{' '}
                  <Link to="/terms" className="text-orange-600 hover:text-orange-500">
                    Terms of Service
                  </Link>{' '}
                  and{' '}
                  <Link to="/privacy" className="text-orange-600 hover:text-orange-500">
                    Privacy Policy
                  </Link>
                </label>
              </div>

              <div className="flex space-x-4">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="inline-flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500"
                >
                  Back
                </button>
                
                <Button
                  type="submit"
                  variant="primary"
                  fullWidth
                  isLoading={isLoading}
                >
                  Create account
                </Button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;