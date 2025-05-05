import React, { useState, useCallback, useRef } from 'react';
import { useDropzone } from 'react-dropzone';
import Cropper from 'react-cropper';
import { Camera, Eye, EyeOff, X, Check, AlertCircle } from 'lucide-react';
import Button from '../../components/common/Button';
import { useAuth } from '../../contexts/AuthContext';
import toast from 'react-hot-toast';
import zxcvbn from 'zxcvbn';
import 'cropperjs/dist/cropper.css';

interface ProfileFormData {
  businessName: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  altPhone: string;
  website: string;
  addresses: {
    street: string;
    unit: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
    type: 'primary' | 'shipping' | 'billing';
  }[];
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

const VendorProfile = () => {
  const { user } = useAuth();
  const [profilePicture, setProfilePicture] = useState<string | null>(null);
  const [showCropper, setShowCropper] = useState(false);
  const [cropperImage, setCropperImage] = useState('');
  const cropperRef = useRef<any>(null);
  const [showPassword, setShowPassword] = useState({
    current: false,
    new: false,
    confirm: false
  });
  const [formData, setFormData] = useState<ProfileFormData>({
    businessName: '',
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    email: user?.email || '',
    phone: '',
    altPhone: '',
    website: '',
    addresses: [
      {
        street: '',
        unit: '',
        city: '',
        state: '',
        zipCode: '',
        country: '',
        type: 'primary'
      }
    ],
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error('Image size must be less than 5MB');
        return;
      }

      const reader = new FileReader();
      reader.onload = () => {
        setCropperImage(reader.result as string);
        setShowCropper(true);
      };
      reader.readAsDataURL(file);
    }
  }, []);

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: {
      'image/jpeg': ['.jpg', '.jpeg'],
      'image/png': ['.png']
    },
    maxFiles: 1,
    multiple: false
  });

  const handleCrop = () => {
    if (cropperRef.current) {
      const croppedCanvas = cropperRef.current.cropper.getCroppedCanvas();
      if (croppedCanvas) {
        const croppedImage = croppedCanvas.toDataURL();
        setProfilePicture(croppedImage);
        setShowCropper(false);
        // In a real app, upload the cropped image to storage
      }
    }
  };

  const handleAddAddress = () => {
    setFormData(prev => ({
      ...prev,
      addresses: [
        ...prev.addresses,
        {
          street: '',
          unit: '',
          city: '',
          state: '',
          zipCode: '',
          country: '',
          type: 'shipping'
        }
      ]
    }));
  };

  const handleRemoveAddress = (index: number) => {
    setFormData(prev => ({
      ...prev,
      addresses: prev.addresses.filter((_, i) => i !== index)
    }));
  };

  const getPasswordStrength = (password: string) => {
    const result = zxcvbn(password);
    const strengthMap = ['Very Weak', 'Weak', 'Fair', 'Good', 'Strong'];
    const colorMap = ['bg-red-500', 'bg-orange-500', 'bg-yellow-500', 'bg-blue-500', 'bg-green-500'];
    return {
      score: result.score,
      label: strengthMap[result.score],
      color: colorMap[result.score]
    };
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      // Validate form
      if (!formData.businessName || !formData.firstName || !formData.lastName || !formData.email) {
        throw new Error('Please fill in all required fields');
      }

      if (formData.newPassword) {
        if (!formData.currentPassword) {
          throw new Error('Current password is required to set a new password');
        }
        if (formData.newPassword.length < 8) {
          throw new Error('New password must be at least 8 characters long');
        }
        if (formData.newPassword !== formData.confirmPassword) {
          throw new Error('New passwords do not match');
        }
        if (getPasswordStrength(formData.newPassword).score < 2) {
          throw new Error('Please choose a stronger password');
        }
      }

      // In a real app, make API call to update profile
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast.success('Profile updated successfully');
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to update profile');
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="bg-white rounded-lg shadow">
        <div className="p-6 border-b border-gray-200">
          <h1 className="text-2xl font-bold text-gray-900">Vendor Profile</h1>
          <p className="mt-1 text-sm text-gray-500">
            Manage your profile information and settings
          </p>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Profile Picture */}
          <div className="space-y-4">
            <h2 className="text-lg font-medium text-gray-900">Profile Picture</h2>
            <div className="flex items-center space-x-6">
              <div className="relative">
                {profilePicture ? (
                  <div className="relative">
                    <img
                      src={profilePicture}
                      alt="Profile"
                      className="h-24 w-24 rounded-full object-cover"
                    />
                    <button
                      type="button"
                      onClick={() => setProfilePicture(null)}
                      className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                ) : (
                  <div className="h-24 w-24 rounded-full bg-gray-200 flex items-center justify-center">
                    <Camera className="h-8 w-8 text-gray-400" />
                  </div>
                )}
              </div>
              
              <div
                {...getRootProps()}
                className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-orange-500 cursor-pointer"
              >
                <input {...getInputProps()} />
                <Camera className="mx-auto h-8 w-8 text-gray-400" />
                <p className="mt-1 text-sm text-gray-500">
                  Click to upload or drag and drop
                </p>
                <p className="text-xs text-gray-500">
                  JPG, PNG (max. 5MB)
                </p>
              </div>
            </div>
          </div>

          {/* Business Information */}
          <div className="space-y-4">
            <h2 className="text-lg font-medium text-gray-900">Business Information</h2>
            
            <div>
              <label htmlFor="businessName" className="block text-sm font-medium text-gray-700">
                Business Name *
              </label>
              <input
                type="text"
                id="businessName"
                required
                value={formData.businessName}
                onChange={(e) => setFormData({ ...formData, businessName: e.target.value })}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:ring-orange-500 focus:border-orange-500"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="firstName" className="block text-sm font-medium text-gray-700">
                  First Name *
                </label>
                <input
                  type="text"
                  id="firstName"
                  required
                  value={formData.firstName}
                  onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:ring-orange-500 focus:border-orange-500"
                />
              </div>
              
              <div>
                <label htmlFor="lastName" className="block text-sm font-medium text-gray-700">
                  Last Name *
                </label>
                <input
                  type="text"
                  id="lastName"
                  required
                  value={formData.lastName}
                  onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:ring-orange-500 focus:border-orange-500"
                />
              </div>
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email Address *
              </label>
              <input
                type="email"
                id="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:ring-orange-500 focus:border-orange-500"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                  Phone Number *
                </label>
                <input
                  type="tel"
                  id="phone"
                  required
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:ring-orange-500 focus:border-orange-500"
                />
              </div>
              
              <div>
                <label htmlFor="altPhone" className="block text-sm font-medium text-gray-700">
                  Alternative Phone
                </label>
                <input
                  type="tel"
                  id="altPhone"
                  value={formData.altPhone}
                  onChange={(e) => setFormData({ ...formData, altPhone: e.target.value })}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:ring-orange-500 focus:border-orange-500"
                />
              </div>
            </div>

            <div>
              <label htmlFor="website" className="block text-sm font-medium text-gray-700">
                Website
              </label>
              <input
                type="url"
                id="website"
                value={formData.website}
                onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:ring-orange-500 focus:border-orange-500"
                placeholder="https://"
              />
            </div>
          </div>

          {/* Addresses */}
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-lg font-medium text-gray-900">Addresses</h2>
              <Button
                type="button"
                variant="outline"
                onClick={handleAddAddress}
                disabled={formData.addresses.length >= 3}
              >
                Add Address
              </Button>
            </div>

            {formData.addresses.map((address, index) => (
              <div key={index} className="border border-gray-200 rounded-lg p-4 space-y-4">
                <div className="flex justify-between items-center">
                  <select
                    value={address.type}
                    onChange={(e) => {
                      const newAddresses = [...formData.addresses];
                      newAddresses[index].type = e.target.value as 'primary' | 'shipping' | 'billing';
                      setFormData({ ...formData, addresses: newAddresses });
                    }}
                    className="border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:ring-orange-500 focus:border-orange-500"
                  >
                    <option value="primary">Primary Address</option>
                    <option value="shipping">Shipping Address</option>
                    <option value="billing">Billing Address</option>
                  </select>
                  
                  {index > 0 && (
                    <button
                      type="button"
                      onClick={() => handleRemoveAddress(index)}
                      className="text-red-500 hover:text-red-600"
                    >
                      <X className="h-5 w-5" />
                    </button>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700">
                      Street Address *
                    </label>
                    <input
                      type="text"
                      required
                      value={address.street}
                      onChange={(e) => {
                        const newAddresses = [...formData.addresses];
                        newAddresses[index].street = e.target.value;
                        setFormData({ ...formData, addresses: newAddresses });
                      }}
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:ring-orange-500 focus:border-orange-500"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Unit/Suite
                    </label>
                    <input
                      type="text"
                      value={address.unit}
                      onChange={(e) => {
                        const newAddresses = [...formData.addresses];
                        newAddresses[index].unit = e.target.value;
                        setFormData({ ...formData, addresses: newAddresses });
                      }}
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:ring-orange-500 focus:border-orange-500"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      City *
                    </label>
                    <input
                      type="text"
                      required
                      value={address.city}
                      onChange={(e) => {
                        const newAddresses = [...formData.addresses];
                        newAddresses[index].city = e.target.value;
                        setFormData({ ...formData, addresses: newAddresses });
                      }}
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:ring-orange-500 focus:border-orange-500"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      State/Province *
                    </label>
                    <input
                      type="text"
                      required
                      value={address.state}
                      onChange={(e) => {
                        const newAddresses = [...formData.addresses];
                        newAddresses[index].state = e.target.value;
                        setFormData({ ...formData, addresses: newAddresses });
                      }}
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:ring-orange-500 focus:border-orange-500"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      ZIP/Postal Code *
                    </label>
                    <input
                      type="text"
                      required
                      value={address.zipCode}
                      onChange={(e) => {
                        const newAddresses = [...formData.addresses];
                        newAddresses[index].zipCode = e.target.value;
                        setFormData({ ...formData, addresses: newAddresses });
                      }}
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:ring-orange-500 focus:border-orange-500"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Country *
                    </label>
                    <select
                      required
                      value={address.country}
                      onChange={(e) => {
                        const newAddresses = [...formData.addresses];
                        newAddresses[index].country = e.target.value;
                        setFormData({ ...formData, addresses: newAddresses });
                      }}
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:ring-orange-500 focus:border-orange-500"
                    >
                      <option value="">Select a country</option>
                      <option value="US">United States</option>
                      <option value="CA">Canada</option>
                      {/* Add more countries as needed */}
                    </select>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Password Management */}
          <div className="space-y-4">
            <h2 className="text-lg font-medium text-gray-900">Change Password</h2>
            
            <div>
              <label htmlFor="currentPassword" className="block text-sm font-medium text-gray-700">
                Current Password
              </label>
              <div className="mt-1 relative">
                <input
                  type={showPassword.current ? 'text' : 'password'}
                  id="currentPassword"
                  value={formData.currentPassword}
                  onChange={(e) => setFormData({ ...formData, currentPassword: e.target.value })}
                  className="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 pr-10 focus:ring-orange-500 focus:border-orange-500"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword({ ...showPassword, current: !showPassword.current })}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                >
                  {showPassword.current ? (
                    <EyeOff className="h-5 w-5 text-gray-400" />
                  ) : (
                    <Eye className="h-5 w-5 text-gray-400" />
                  )}
                </button>
              </div>
            </div>

            <div>
              <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700">
                New Password
              </label>
              <div className="mt-1 relative">
                <input
                  type={showPassword.new ? 'text' : 'password'}
                  id="newPassword"
                  value={formData.newPassword}
                  onChange={(e) => setFormData({ ...formData, newPassword: e.target.value })}
                  className="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 pr-10 focus:ring-orange-500 focus:border-orange-500"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword({ ...showPassword, new: !showPassword.new })}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                >
                  {showPassword.new ? (
                    <EyeOff className="h-5 w-5 text-gray-400" />
                  ) : (
                    <Eye className="h-5 w-5 text-gray-400" />
                  )}
                </button>
              </div>
              {formData.newPassword && (
                <div className="mt-2">
                  <div className="flex items-center">
                    <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                      {Array.from({ length: 5 }).map((_, index) => (
                        <div
                          key={index}
                          className={`h-full transition-all ${
                            index <= getPasswordStrength(formData.newPassword).score
                              ? getPasswordStrength(formData.newPassword).color
                              : ''
                          }`}
                          style={{ width: '20%' }}
                        />
                      ))}
                    </div>
                    <span className="ml-2 text-sm text-gray-500">
                      {getPasswordStrength(formData.newPassword).label}
                    </span>
                  </div>
                  <p className="mt-1 text-sm text-gray-500">
                    Password must be at least 8 characters and include numbers and special characters
                  </p>
                </div>
              )}
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                Confirm New Password
              </label>
              <div className="mt-1 relative">
                <input
                  type={showPassword.confirm ? 'text' : 'password'}
                  id="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                  className="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 pr-10 focus:ring-orange-500 focus:border-orange-500"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword({ ...showPassword, confirm: !showPassword.confirm })}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                >
                  {showPassword.confirm ? (
                    <EyeOff className="h-5 w-5 text-gray-400" />
                  ) : (
                    <Eye className="h-5 w-5 text-gray-400" />
                  )}
                </button>
              </div>
              {formData.newPassword && formData.confirmPassword && (
                <div className="mt-2 flex items-center">
                  {formData.newPassword === formData.confirmPassword ? (
                    <>
                      <Check className="h-5 w-5 text-green-500" />
                      <span className="ml-2 text-sm text-green-500">Passwords match</span>
                    </>
                  ) : (
                    <>
                      <AlertCircle className="h-5 w-5 text-red-500" />
                      <span className="ml-2 text-sm text-red-500">Passwords do not match</span>
                    </>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex justify-end pt-4 border-t">
            <Button type="submit" variant="primary">
              Save Changes
            </Button>
          </div>
        </form>
      </div>

      {/* Image Cropper Modal */}
      {showCropper && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Crop Image</h3>
            <div className="mb-4">
              <Cropper
                ref={cropperRef}
                src={cropperImage}
                style={{ height: 400, width: '100%' }}
                aspectRatio={1}
                guides={true}
                viewMode={1}
                dragMode="move"
                scalable={true}
                cropBoxMovable={true}
                cropBoxResizable={true}
                highlight={false}
                toggleDragModeOnDblclick={false}
              />
            </div>
            <div className="flex justify-end space-x-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => setShowCropper(false)}
              >
                Cancel
              </Button>
              <Button
                type="button"
                variant="primary"
                onClick={handleCrop}
              >
                Crop & Save
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default VendorProfile;