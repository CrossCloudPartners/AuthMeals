import React, { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDropzone } from 'react-dropzone';
import { Image, X, Plus, Save, Upload } from 'lucide-react';
import Button from '../../components/common/Button';

const CreateMeal = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    preparationTime: '',
    minOrderQuantity: '1',
    maxOrderQuantity: '',
    cuisineType: [],
    images: [] as string[],
    dietaryInfo: {
      isVegetarian: false,
      isVegan: false,
      isGlutenFree: false,
      isDairyFree: false,
      isNutFree: false,
      isSpicy: false,
      allergens: [],
      calories: ''
    }
  });
  const [isDraft, setIsDraft] = useState(true);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    // In a real app, we would upload these files to storage
    // For now, just create URLs for preview
    const newImages = acceptedFiles.map(file => URL.createObjectURL(file));
    setFormData(prev => ({
      ...prev,
      images: [...prev.images, ...newImages]
    }));
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png']
    },
    maxFiles: 8,
    multiple: true
  });

  const removeImage = (index: number) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Implement form submission
    console.log('Form submitted:', formData);
    navigate('/vendor/meals');
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="bg-white rounded-lg shadow">
        <div className="p-6 border-b border-gray-200">
          <h1 className="text-2xl font-bold text-gray-900">Create New Meal</h1>
          <p className="mt-1 text-sm text-gray-500">
            Add details about your new meal offering.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Basic Information */}
          <div className="space-y-4">
            <h2 className="text-lg font-medium text-gray-900">Basic Information</h2>
            
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                Meal Name *
              </label>
              <input
                type="text"
                id="name"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:ring-orange-500 focus:border-orange-500"
              />
            </div>

            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                Description *
              </label>
              <textarea
                id="description"
                required
                rows={4}
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:ring-orange-500 focus:border-orange-500"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label htmlFor="price" className="block text-sm font-medium text-gray-700">
                  Price ($) *
                </label>
                <input
                  type="number"
                  id="price"
                  required
                  min="0"
                  step="0.01"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:ring-orange-500 focus:border-orange-500"
                />
              </div>

              <div>
                <label htmlFor="minOrderQuantity" className="block text-sm font-medium text-gray-700">
                  Minimum Order *
                </label>
                <input
                  type="number"
                  id="minOrderQuantity"
                  required
                  min="1"
                  value={formData.minOrderQuantity}
                  onChange={(e) => setFormData({ ...formData, minOrderQuantity: e.target.value })}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:ring-orange-500 focus:border-orange-500"
                />
              </div>

              <div>
                <label htmlFor="maxOrderQuantity" className="block text-sm font-medium text-gray-700">
                  Maximum Order
                </label>
                <input
                  type="number"
                  id="maxOrderQuantity"
                  min="1"
                  value={formData.maxOrderQuantity}
                  onChange={(e) => setFormData({ ...formData, maxOrderQuantity: e.target.value })}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:ring-orange-500 focus:border-orange-500"
                />
              </div>
            </div>
          </div>

          {/* Images */}
          <div className="space-y-4">
            <h2 className="text-lg font-medium text-gray-900">Images</h2>
            
            <div
              {...getRootProps()}
              className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition ${
                isDragActive ? 'border-orange-500 bg-orange-50' : 'border-gray-300 hover:border-orange-500'
              }`}
            >
              <input {...getInputProps()} />
              <Image className="mx-auto h-12 w-12 text-gray-400" />
              <p className="mt-2 text-sm text-gray-500">
                Drag and drop images here, or click to select files
              </p>
              <p className="text-xs text-gray-500 mt-1">
                Upload 3-8 images (JPEG, PNG)
              </p>
            </div>

            {formData.images.length > 0 && (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                {formData.images.map((image, index) => (
                  <div key={index} className="relative">
                    <img
                      src={image}
                      alt={`Preview ${index + 1}`}
                      className="h-24 w-full object-cover rounded-lg"
                    />
                    <button
                      type="button"
                      onClick={() => removeImage(index)}
                      className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Dietary Information */}
          <div className="space-y-4">
            <h2 className="text-lg font-medium text-gray-900">Dietary Information</h2>
            
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={formData.dietaryInfo.isVegetarian}
                  onChange={(e) => setFormData({
                    ...formData,
                    dietaryInfo: {
                      ...formData.dietaryInfo,
                      isVegetarian: e.target.checked
                    }
                  })}
                  className="rounded text-orange-500 focus:ring-orange-500"
                />
                <span className="text-sm text-gray-700">Vegetarian</span>
              </label>

              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={formData.dietaryInfo.isVegan}
                  onChange={(e) => setFormData({
                    ...formData,
                    dietaryInfo: {
                      ...formData.dietaryInfo,
                      isVegan: e.target.checked
                    }
                  })}
                  className="rounded text-orange-500 focus:ring-orange-500"
                />
                <span className="text-sm text-gray-700">Vegan</span>
              </label>

              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={formData.dietaryInfo.isGlutenFree}
                  onChange={(e) => setFormData({
                    ...formData,
                    dietaryInfo: {
                      ...formData.dietaryInfo,
                      isGlutenFree: e.target.checked
                    }
                  })}
                  className="rounded text-orange-500 focus:ring-orange-500"
                />
                <span className="text-sm text-gray-700">Gluten-Free</span>
              </label>

              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={formData.dietaryInfo.isDairyFree}
                  onChange={(e) => setFormData({
                    ...formData,
                    dietaryInfo: {
                      ...formData.dietaryInfo,
                      isDairyFree: e.target.checked
                    }
                  })}
                  className="rounded text-orange-500 focus:ring-orange-500"
                />
                <span className="text-sm text-gray-700">Dairy-Free</span>
              </label>

              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={formData.dietaryInfo.isNutFree}
                  onChange={(e) => setFormData({
                    ...formData,
                    dietaryInfo: {
                      ...formData.dietaryInfo,
                      isNutFree: e.target.checked
                    }
                  })}
                  className="rounded text-orange-500 focus:ring-orange-500"
                />
                <span className="text-sm text-gray-700">Nut-Free</span>
              </label>

              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={formData.dietaryInfo.isSpicy}
                  onChange={(e) => setFormData({
                    ...formData,
                    dietaryInfo: {
                      ...formData.dietaryInfo,
                      isSpicy: e.target.checked
                    }
                  })}
                  className="rounded text-orange-500 focus:ring-orange-500"
                />
                <span className="text-sm text-gray-700">Spicy</span>
              </label>
            </div>

            <div>
              <label htmlFor="calories" className="block text-sm font-medium text-gray-700">
                Calories (per serving)
              </label>
              <input
                type="number"
                id="calories"
                min="0"
                value={formData.dietaryInfo.calories}
                onChange={(e) => setFormData({
                  ...formData,
                  dietaryInfo: {
                    ...formData.dietaryInfo,
                    calories: e.target.value
                  }
                })}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:ring-orange-500 focus:border-orange-500"
              />
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex justify-end space-x-4 pt-4 border-t">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate('/vendor/meals')}
            >
              Cancel
            </Button>
            <Button
              type="button"
              variant="secondary"
              onClick={() => {
                setIsDraft(true);
                handleSubmit;
              }}
            >
              <Save className="h-5 w-5 mr-2" />
              Save as Draft
            </Button>
            <Button
              type="submit"
              variant="primary"
              onClick={() => setIsDraft(false)}
            >
              <Upload className="h-5 w-5 mr-2" />
              Publish
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateMeal;