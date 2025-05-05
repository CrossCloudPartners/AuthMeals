import { Meal } from '../types';

export const mockMeals: Meal[] = [
  {
    id: '1',
    vendorId: 'v1',
    name: 'Homemade Lasagna',
    description: 'Traditional Italian lasagna with homemade pasta, rich Bolognese sauce, and creamy bechamel. Made with local organic ingredients and a family recipe passed down for generations. Each layer is carefully crafted with fresh pasta sheets, seasoned ground beef, Italian sausage, and a blend of premium cheeses including Parmigiano-Reggiano, mozzarella, and ricotta. Served with a side of garlic bread and fresh basil garnish.',
    price: 15.99,
    images: [
      'https://images.pexels.com/photos/6287447/pexels-photo-6287447.jpeg',
      'https://images.pexels.com/photos/5949885/pexels-photo-5949885.jpeg',
      'https://images.pexels.com/photos/4193872/pexels-photo-4193872.jpeg',
      'https://images.pexels.com/photos/5419336/pexels-photo-5419336.jpeg',
      'https://images.pexels.com/photos/4224304/pexels-photo-4224304.jpeg'
    ],
    cuisineType: ['Italian', 'Pasta'],
    dietaryInfo: {
      isVegetarian: false,
      isVegan: false,
      isGlutenFree: false,
      isDairyFree: false,
      isNutFree: true,
      isSpicy: false,
      allergens: ['Wheat', 'Dairy', 'Eggs', 'Beef'],
      calories: 650
    },
    preparationTime: 45,
    minOrderQuantity: 1,
    maxOrderQuantity: 10,
    availability: {
      daysAvailable: ['monday', 'wednesday', 'friday'],
      startTime: '10:00',
      endTime: '18:00'
    },
    rating: 4.8,
    reviewCount: 124,
    createdAt: '2023-05-10T14:30:00Z',
    deliveryInfo: {
      radius: 5,
      fee: 4.99,
      minimumOrder: 15,
      estimatedTime: '30-45',
      availableTimes: ['11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00']
    },
    vendor: {
      first_name: 'Maria',
      last_name: 'Romano'
    }
  },
  {
    id: '2',
    vendorId: 'v2',
    name: 'Authentic Thai Green Curry',
    description: 'Spicy and aromatic Thai green curry with bamboo shoots, bell peppers, and your choice of chicken or tofu. Served with jasmine rice.',
    price: 13.99,
    images: [
      'https://images.pexels.com/photos/699953/pexels-photo-699953.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1'
    ],
    cuisineType: ['Thai', 'Curry'],
    dietaryInfo: {
      isVegetarian: true,
      isVegan: false,
      isGlutenFree: true,
      isDairyFree: false,
      isNutFree: false,
      isSpicy: true,
      allergens: ['Peanuts', 'Shellfish'],
      calories: 550
    },
    preparationTime: 30,
    minOrderQuantity: 2,
    availability: {
      daysAvailable: ['tuesday', 'thursday', 'saturday'],
      startTime: '11:00',
      endTime: '20:00'
    },
    rating: 4.7,
    reviewCount: 89,
    createdAt: '2023-06-15T09:45:00Z'
  },
  {
    id: '4',
    vendorId: 'v4',
    name: 'Vegetarian Enchiladas',
    description: 'Three corn tortillas stuffed with black beans, roasted vegetables, and cheese, covered in homemade enchilada sauce and baked to perfection.',
    price: 12.99,
    images: [
      'https://images.pexels.com/photos/2092897/pexels-photo-2092897.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1'
    ],
    cuisineType: ['Mexican', 'Vegetarian'],
    dietaryInfo: {
      isVegetarian: true,
      isVegan: false,
      isGlutenFree: false,
      isDairyFree: false,
      isNutFree: true,
      isSpicy: true,
      allergens: ['Dairy', 'Wheat'],
      calories: 580
    },
    preparationTime: 35,
    minOrderQuantity: 1,
    availability: {
      daysAvailable: ['monday', 'wednesday', 'friday'],
      startTime: '11:00',
      endTime: '19:00'
    },
    rating: 4.6,
    reviewCount: 72,
    createdAt: '2023-07-05T11:15:00Z'
  },
  {
    id: '5',
    vendorId: 'v5',
    name: 'Japanese Bento Box',
    description: 'Traditional Japanese lunch box featuring teriyaki chicken, steamed rice, pickled vegetables, miso soup, and a small dessert.',
    price: 14.99,
    images: [
      'https://images.pexels.com/photos/884596/pexels-photo-884596.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1'
    ],
    cuisineType: ['Japanese', 'Asian'],
    dietaryInfo: {
      isVegetarian: false,
      isVegan: false,
      isGlutenFree: false,
      isDairyFree: true,
      isNutFree: false,
      isSpicy: false,
      allergens: ['Soy', 'Wheat', 'Sesame'],
      calories: 650
    },
    preparationTime: 40,
    minOrderQuantity: 1,
    availability: {
      daysAvailable: ['tuesday', 'thursday'],
      startTime: '11:00',
      endTime: '14:00'
    },
    rating: 4.8,
    reviewCount: 94,
    createdAt: '2023-03-12T10:30:00Z'
  },
  {
    id: '6',
    vendorId: 'v6',
    name: 'Mediterranean Mezze Platter',
    description: 'A selection of Mediterranean appetizers including hummus, baba ganoush, falafel, tabbouleh, olives, and warm pita bread.',
    price: 18.99,
    images: [
      'https://images.pexels.com/photos/6419746/pexels-photo-6419746.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1'
    ],
    cuisineType: ['Mediterranean', 'Middle Eastern'],
    dietaryInfo: {
      isVegetarian: true,
      isVegan: true,
      isGlutenFree: false,
      isDairyFree: true,
      isNutFree: false,
      isSpicy: false,
      allergens: ['Wheat', 'Sesame', 'Nuts'],
      calories: 720
    },
    preparationTime: 25,
    minOrderQuantity: 2,
    availability: {
      daysAvailable: ['wednesday', 'thursday', 'friday', 'saturday'],
      startTime: '12:00',
      endTime: '20:00'
    },
    rating: 4.7,
    reviewCount: 88,
    createdAt: '2023-08-10T15:45:00Z'
  },
  {
    id: '7',
    vendorId: 'v7',
    name: 'Homemade Beef Bourguignon',
    description: 'Classic French beef stew slow-cooked with red wine, bacon, mushrooms, and pearl onions. Served with crusty bread and butter.',
    price: 19.99,
    images: [
      'https://images.pexels.com/photos/675951/pexels-photo-675951.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1'
    ],
    cuisineType: ['French', 'Stew'],
    dietaryInfo: {
      isVegetarian: false,
      isVegan: false,
      isGlutenFree: true,
      isDairyFree: false,
      isNutFree: true,
      isSpicy: false,
      allergens: ['Dairy', 'Alcohol'],
      calories: 850
    },
    preparationTime: 90,
    minOrderQuantity: 2,
    availability: {
      daysAvailable: ['friday', 'saturday', 'sunday'],
      startTime: '16:00',
      endTime: '20:00'
    },
    rating: 4.9,
    reviewCount: 106,
    createdAt: '2023-02-05T17:30:00Z'
  },
  {
    id: '8',
    vendorId: 'v8',
    name: 'Vietnamese Pho Soup',
    description: 'Traditional Vietnamese beef noodle soup with rice noodles, thinly sliced beef, bean sprouts, and fresh herbs in a flavorful broth.',
    price: 13.99,
    images: [
      'https://images.pexels.com/photos/1031780/pexels-photo-1031780.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1'
    ],
    cuisineType: ['Vietnamese', 'Soup'],
    dietaryInfo: {
      isVegetarian: false,
      isVegan: false,
      isGlutenFree: true,
      isDairyFree: true,
      isNutFree: true,
      isSpicy: false,
      allergens: ['Soy'],
      calories: 520
    },
    preparationTime: 50,
    minOrderQuantity: 1,
    availability: {
      daysAvailable: ['monday', 'tuesday', 'wednesday', 'thursday'],
      startTime: '11:00',
      endTime: '15:00'
    },
    rating: 4.8,
    reviewCount: 135,
    createdAt: '2023-05-25T09:00:00Z'
  },
  {
    id: '9',
    vendorId: 'v9',
    name: 'Homemade Vegetable Paella',
    description: 'Spanish rice dish with saffron, roasted vegetables, and a variety of seasonings. A vegetarian twist on the classic seafood paella.',
    price: 14.99,
    images: [
      'https://images.pexels.com/photos/12419160/pexels-photo-12419160.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1'
    ],
    cuisineType: ['Spanish', 'Rice'],
    dietaryInfo: {
      isVegetarian: true,
      isVegan: true,
      isGlutenFree: true,
      isDairyFree: true,
      isNutFree: true,
      isSpicy: false,
      allergens: [],
      calories: 620
    },
    preparationTime: 45,
    minOrderQuantity: 2,
    availability: {
      daysAvailable: ['wednesday', 'thursday', 'friday'],
      startTime: '12:00',
      endTime: '19:00'
    },
    rating: 4.6,
    reviewCount: 78,
    createdAt: '2023-07-18T14:15:00Z'
  },
  {
    id: '10',
    vendorId: 'v10',
    name: 'Korean Bibimbap Bowl',
    description: 'Traditional Korean rice bowl topped with assorted vegetables, marinated beef, and a fried egg. Served with gochujang sauce on the side.',
    price: 15.99,
    images: [
      'https://images.pexels.com/photos/5900759/pexels-photo-5900759.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1'
    ],
    cuisineType: ['Korean', 'Rice Bowl'],
    dietaryInfo: {
      isVegetarian: false,
      isVegan: false,
      isGlutenFree: true,
      isDairyFree: true,
      isNutFree: true,
      isSpicy: true,
      allergens: ['Eggs', 'Soy'],
      calories: 680
    },
    preparationTime: 35,
    minOrderQuantity: 1,
    availability: {
      daysAvailable: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday'],
      startTime: '11:00',
      endTime: '20:00'
    },
    rating: 4.7,
    reviewCount: 92,
    createdAt: '2023-06-30T12:45:00Z'
  },
  {
    id: '11',
    vendorId: 'v11',
    name: 'Homemade Margherita Pizza',
    description: 'Wood-fired pizza with San Marzano tomatoes, fresh mozzarella, basil, and extra virgin olive oil. Made with homemade dough fermented for 24 hours.',
    price: 12.99,
    images: [
      'https://images.pexels.com/photos/825661/pexels-photo-825661.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1'
    ],
    cuisineType: ['Italian', 'Pizza'],
    dietaryInfo: {
      isVegetarian: true,
      isVegan: false,
      isGlutenFree: false,
      isDairyFree: false,
      isNutFree: true,
      isSpicy: false,
      allergens: ['Wheat', 'Dairy'],
      calories: 760
    },
    preparationTime: 20,
    minOrderQuantity: 1,
    availability: {
      daysAvailable: ['wednesday', 'thursday', 'friday', 'saturday', 'sunday'],
      startTime: '16:00',
      endTime: '21:00'
    },
    rating: 4.9,
    reviewCount: 148,
    createdAt: '2023-01-15T18:30:00Z'
  },
  {
    id: '12',
    vendorId: 'v12',
    name: 'Ethiopian Vegetarian Combo',
    description: 'A selection of Ethiopian vegetarian dishes including misir wot (spiced red lentils), kik alicha (yellow split peas), and gomen (collard greens), served with injera bread.',
    price: 16.99,
    images: [
      'https://images.pexels.com/photos/5379707/pexels-photo-5379707.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1'
    ],
    cuisineType: ['Ethiopian', 'African'],
    dietaryInfo: {
      isVegetarian: true,
      isVegan: true,
      isGlutenFree: false,
      isDairyFree: true,
      isNutFree: true,
      isSpicy: true,
      allergens: ['Wheat'],
      calories: 710
    },
    preparationTime: 45,
    minOrderQuantity: 2,
    availability: {
      daysAvailable: ['tuesday', 'wednesday', 'thursday', 'friday'],
      startTime: '12:00',
      endTime: '20:00'
    },
    rating: 4.8,
    reviewCount: 86,
    createdAt: '2023-04-10T14:00:00Z'
  }
];

export const mockReviews = [
  {
    id: '1',
    user_name: 'John D.',
    rating: 5,
    comment: 'Absolutely delicious! The portion size was generous and the flavors were amazing. Will definitely order again.',
    created_at: '2025-05-01T14:30:00Z'
  },
  {
    id: '2',
    user_name: 'Sarah M.',
    rating: 4,
    comment: 'Great taste and quick delivery. The lasagna was perfectly cooked and the sauce was delicious.',
    created_at: '2025-04-28T09:15:00Z'
  },
  {
    id: '3',
    user_name: 'Michael P.',
    rating: 5,
    comment: 'Best homemade lasagna I\'ve had in years! The quality of ingredients really shows.',
    created_at: '2025-04-25T18:45:00Z'
  },
  {
    id: '4',
    user_name: 'Emma R.',
    rating: 4,
    comment: 'Very authentic Italian taste. Portion size was perfect for two people.',
    created_at: '2025-04-22T12:30:00Z'
  }
];