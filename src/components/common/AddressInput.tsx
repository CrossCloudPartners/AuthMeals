import React, { useEffect, useState } from 'react';
import usePlacesAutocomplete, {
  getGeocode,
  getDetails
} from 'use-places-autocomplete';
import { AlertCircle } from 'lucide-react';

interface AddressInputProps {
  value?: Address;
  onChange: (address: Address) => void;
  onError?: (error: string) => void;
  required?: boolean;
  label?: string;
}

interface Address {
  street: string;
  unit?: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  formatted: string;
  placeId?: string;
}

const AddressInput: React.FC<AddressInputProps> = ({
  value,
  onChange,
  onError,
  required = false,
  label = 'Address'
}) => {
  const [unit, setUnit] = useState(value?.unit || '');
  const [isManualEntry, setIsManualEntry] = useState(false);
  const [manualAddress, setManualAddress] = useState<Partial<Address>>(value || {});
  const [error, setError] = useState<string>('');

  const {
    ready,
    value: searchValue,
    suggestions: { status, data },
    setValue: setSearchValue,
    clearSuggestions,
  } = usePlacesAutocomplete({
    requestOptions: {
      types: ['address'],
    },
    debounce: 300,
  });

  useEffect(() => {
    if (value?.street) {
      setSearchValue(value.formatted || value.street, false);
    }
  }, [value, setSearchValue]);

  const handleSelect = async (placeId: string, description: string) => {
    try {
      clearSuggestions();
      setSearchValue(description, false);

      const results = await getGeocode({ placeId });
      const details = await getDetails({
        placeId,
        fields: ['address_components', 'formatted_address'],
      });

      if (!results[0] || !details) {
        throw new Error('Failed to get address details');
      }

      const addressComponents = details.address_components || [];
      const formattedAddress = details.formatted_address || '';

      const getComponent = (type: string, short = false) => {
        const component = addressComponents.find(c => c.types.includes(type));
        return component ? (short ? component.short_name : component.long_name) : '';
      };

      const newAddress: Address = {
        street: `${getComponent('street_number')} ${getComponent('route')}`.trim(),
        unit: unit,
        city: getComponent('locality') || getComponent('sublocality'),
        state: getComponent('administrative_area_level_1'),
        zipCode: getComponent('postal_code'),
        country: getComponent('country'),
        formatted: formattedAddress,
        placeId,
      };

      onChange(newAddress);
      setError('');
    } catch (err) {
      const errorMessage = 'Failed to process address. Please try again or enter manually.';
      setError(errorMessage);
      onError?.(errorMessage);
    }
  };

  const handleManualSubmit = () => {
    if (!manualAddress.street || !manualAddress.city || !manualAddress.country) {
      const errorMessage = 'Please fill in all required fields';
      setError(errorMessage);
      onError?.(errorMessage);
      return;
    }

    const newAddress: Address = {
      street: manualAddress.street || '',
      unit: unit,
      city: manualAddress.city || '',
      state: manualAddress.state || '',
      zipCode: manualAddress.zipCode || '',
      country: manualAddress.country || '',
      formatted: [
        manualAddress.street,
        unit,
        manualAddress.city,
        manualAddress.state,
        manualAddress.zipCode,
        manualAddress.country
      ].filter(Boolean).join(', '),
    };

    onChange(newAddress);
    setError('');
  };

  const handleManualChange = (field: keyof Address, value: string) => {
    setManualAddress(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
        
        <div className="space-y-4">
          {!isManualEntry ? (
            <>
              <div className="relative">
                <input
                  type="text"
                  placeholder="Start typing an address..."
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-orange-500 focus:border-orange-500"
                  value={searchValue}
                  onChange={e => setSearchValue(e.target.value)}
                  disabled={!ready}
                />
                {status === 'OK' && (
                  <ul className="absolute z-10 w-full bg-white mt-1 border border-gray-300 rounded-md shadow-lg max-h-60 overflow-auto">
                    {data.map(suggestion => (
                      <li
                        key={suggestion.place_id}
                        className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                        onClick={() => handleSelect(suggestion.place_id, suggestion.description)}
                      >
                        {suggestion.description}
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              <div>
                <input
                  type="text"
                  placeholder="Apartment/Suite/Unit (optional)"
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-orange-500 focus:border-orange-500"
                  value={unit}
                  onChange={e => setUnit(e.target.value)}
                />
              </div>

              <button
                type="button"
                onClick={() => setIsManualEntry(true)}
                className="text-sm text-orange-600 hover:text-orange-700"
              >
                Enter address manually
              </button>
            </>
          ) : (
            <>
              <div className="space-y-4">
                <input
                  type="text"
                  placeholder="Street Address"
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-orange-500 focus:border-orange-500"
                  value={manualAddress.street || ''}
                  onChange={e => handleManualChange('street', e.target.value)}
                  required={required}
                />

                <input
                  type="text"
                  placeholder="Apartment/Suite/Unit (optional)"
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-orange-500 focus:border-orange-500"
                  value={unit}
                  onChange={e => setUnit(e.target.value)}
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <input
                    type="text"
                    placeholder="City"
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-orange-500 focus:border-orange-500"
                    value={manualAddress.city || ''}
                    onChange={e => handleManualChange('city', e.target.value)}
                    required={required}
                  />

                  <input
                    type="text"
                    placeholder="State/Province/Region"
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-orange-500 focus:border-orange-500"
                    value={manualAddress.state || ''}
                    onChange={e => handleManualChange('state', e.target.value)}
                  />

                  <input
                    type="text"
                    placeholder="ZIP/Postal Code"
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-orange-500 focus:border-orange-500"
                    value={manualAddress.zipCode || ''}
                    onChange={e => handleManualChange('zipCode', e.target.value)}
                  />

                  <input
                    type="text"
                    placeholder="Country"
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-orange-500 focus:border-orange-500"
                    value={manualAddress.country || ''}
                    onChange={e => handleManualChange('country', e.target.value)}
                    required={required}
                  />
                </div>

                <div className="flex justify-between">
                  <button
                    type="button"
                    onClick={() => setIsManualEntry(false)}
                    className="text-sm text-orange-600 hover:text-orange-700"
                  >
                    Use address lookup
                  </button>
                  <button
                    type="button"
                    onClick={handleManualSubmit}
                    className="px-4 py-2 bg-orange-500 text-white rounded-md hover:bg-orange-600"
                  >
                    Save Address
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      {error && (
        <div className="flex items-center text-red-600 text-sm">
          <AlertCircle className="h-4 w-4 mr-2" />
          {error}
        </div>
      )}
    </div>
  );
};

export default AddressInput;