// Mock data for Find My PG

export const cities = [
  { id: 1, name: 'Bengaluru', image: 'https://images.unsplash.com/photo-1596176530529-78163a4f7af2?w=400' },
  { id: 2, name: 'Chandigarh', image: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=400' },
  { id: 3, name: 'Chennai', image: 'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?w=400' },
  { id: 4, name: 'Coimbatore', image: 'https://images.unsplash.com/photo-1567157577867-05ccb1388e66?w=400' },
  { id: 5, name: 'Gurgaon', image: 'https://images.unsplash.com/photo-1570168007204-dfb528c6958f?w=400' },
  { id: 6, name: 'Hyderabad', image: 'https://images.unsplash.com/photo-1505678261036-a3fcc5e884ee?w=400' },
  { id: 7, name: 'Indore', image: 'https://images.unsplash.com/photo-1605649487212-47bdab064df7?w=400' },
  { id: 8, name: 'Jaipur', image: 'https://images.unsplash.com/photo-1477587458883-47145ed94245?w=400' },
  { id: 9, name: 'Kolkata', image: 'https://images.unsplash.com/photo-1558431382-27e303142255?w=400' },
  { id: 10, name: 'Mumbai', image: 'https://images.unsplash.com/photo-1567157577867-05ccb1388e66?w=400' },
  { id: 11, name: 'New Delhi', image: 'https://images.unsplash.com/photo-1587474260584-136574528ed5?w=400' },
  { id: 12, name: 'Noida', image: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=400' },
  { id: 13, name: 'Pune', image: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=400' }
];

export const offers = [
  { id: 1, city: 'Bengaluru', discount: '750', code: 'BMPFB', color: 'bg-yellow-500' },
  { id: 2, city: 'Chennai', discount: '750', code: 'BMPJAN21', color: 'bg-blue-900' },
  { id: 3, city: 'Chennai', discount: '250', code: 'BMP0523', color: 'bg-blue-800' },
  { id: 4, city: 'Chennai', discount: '500', code: 'PGCH500', color: 'bg-blue-900' },
  { id: 5, city: 'Coimbatore', discount: '500', code: 'PGCO500', color: 'bg-blue-800' },
  { id: 6, city: 'Gurgaon', discount: '500', code: 'PGGU500', color: 'bg-yellow-500' },
  { id: 7, city: 'Bengaluru', discount: '500', code: 'PGBA500', color: 'bg-blue-900' }
];

export const pgs = [
  {
    id: 1,
    name: 'Green Valley PG',
    city: 'Bengaluru',
    locality: 'Koramangala',
    address: '123, 5th Block, Koramangala, Bengaluru',
    gender: 'boys',
    image: 'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?w=800',
    images: [
      'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?w=800',
      'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800',
      'https://images.unsplash.com/photo-1556020685-ae41abfc9365?w=800'
    ],
    sharingTypes: [
      { type: 'Single', price: 12000, available: true },
      { type: 'Double', price: 8000, available: true },
      { type: 'Triple', price: 6000, available: true }
    ],
    amenities: ['WiFi', 'AC', 'TV', 'Locker', 'Hot Water', 'Laundry', 'Food', 'Power Backup'],
    description: 'Premium PG accommodation in the heart of Koramangala with all modern amenities.',
    rating: 4.5,
    reviews: 120,
    ownerId: 1
  },
  {
    id: 2,
    name: 'Comfort Stay PG',
    city: 'Chennai',
    locality: 'Thoraipakkam',
    address: '456, OMR Road, Thoraipakkam, Chennai',
    gender: 'girls',
    image: 'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=800',
    images: [
      'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=800',
      'https://images.unsplash.com/photo-1540518614846-7eded433c457?w=800',
      'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=800'
    ],
    sharingTypes: [
      { type: 'Single', price: 10000, available: true },
      { type: 'Double', price: 7000, available: true },
      { type: 'Triple', price: 5500, available: false }
    ],
    amenities: ['WiFi', 'AC', 'Balcony', 'Locker', 'Hot Water', 'Security', 'Food'],
    description: 'Safe and secure PG for working women near IT corridor.',
    rating: 4.7,
    reviews: 85,
    ownerId: 2
  },
  {
    id: 3,
    name: 'Urban Living PG',
    city: 'Pune',
    locality: 'Hinjewadi',
    address: '789, Phase 2, Hinjewadi, Pune',
    gender: 'boys',
    image: 'https://images.unsplash.com/photo-1502672260066-6bc35f0a1f80?w=800',
    images: [
      'https://images.unsplash.com/photo-1502672260066-6bc35f0a1f80?w=800',
      'https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?w=800',
      'https://images.unsplash.com/photo-1616594266452-94b49d8cf0a5?w=800'
    ],
    sharingTypes: [
      { type: 'Single', price: 11000, available: true },
      { type: 'Double', price: 7500, available: true },
      { type: 'Triple', price: 6000, available: true }
    ],
    amenities: ['WiFi', 'AC', 'TV', 'Gym', 'Locker', 'Hot Water', 'Parking'],
    description: 'Modern PG with gym facilities near IT parks.',
    rating: 4.3,
    reviews: 95,
    ownerId: 1
  },
  {
    id: 4,
    name: 'Sky View PG',
    city: 'Hyderabad',
    locality: 'Gachibowli',
    address: '321, Financial District, Gachibowli, Hyderabad',
    gender: 'boys',
    image: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800',
    images: [
      'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800',
      'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800'
    ],
    sharingTypes: [
      { type: 'Single', price: 13000, available: true },
      { type: 'Double', price: 8500, available: true }
    ],
    amenities: ['WiFi', 'AC', 'TV', 'Locker', 'Hot Water', 'Food', 'Terrace'],
    description: 'Premium PG with terrace access and city views.',
    rating: 4.6,
    reviews: 110,
    ownerId: 3
  },
  {
    id: 5,
    name: 'Paradise PG',
    city: 'Mumbai',
    locality: 'Andheri',
    address: '654, West Andheri, Mumbai',
    gender: 'girls',
    image: 'https://images.unsplash.com/photo-1554995207-c18c203602cb?w=800',
    images: [
      'https://images.unsplash.com/photo-1554995207-c18c203602cb?w=800',
      'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=800'
    ],
    sharingTypes: [
      { type: 'Single', price: 15000, available: false },
      { type: 'Double', price: 10000, available: true },
      { type: 'Triple', price: 7500, available: true }
    ],
    amenities: ['WiFi', 'AC', 'Locker', 'Hot Water', 'Security', 'Food', 'Laundry'],
    description: 'Safe PG for working women near metro station.',
    rating: 4.8,
    reviews: 145,
    ownerId: 2
  },
  {
    id: 6,
    name: 'Elite Residency PG',
    city: 'Bengaluru',
    locality: 'Whitefield',
    address: '987, ITPL Main Road, Whitefield, Bengaluru',
    gender: 'boys',
    image: 'https://images.unsplash.com/photo-1564501049412-61c2a3083791?w=800',
    images: [
      'https://images.unsplash.com/photo-1564501049412-61c2a3083791?w=800'
    ],
    sharingTypes: [
      { type: 'Single', price: 11500, available: true },
      { type: 'Double', price: 7800, available: true }
    ],
    amenities: ['WiFi', 'AC', 'TV', 'Locker', 'Hot Water', 'Parking', 'Power Backup'],
    description: 'Premium accommodation near IT corridor.',
    rating: 4.4,
    reviews: 78,
    ownerId: 3
  }
];

export const testimonials = [
  {
    id: 1,
    name: 'Suresh Kumar',
    text: 'The like-minded people, be it from startups, corporates and designers under one roof, are creating a wonderful environment.',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200'
  },
  {
    id: 2,
    name: 'Naga',
    text: "It's an amazing property, very spacious, and is located near the market and easily accessible. Wonderful concept.",
    image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200'
  },
  {
    id: 3,
    name: 'Aswin',
    text: 'You just have to arrive at the place, it has all basic amenities and services and even your friends are welcome. Wonderful concept.',
    image: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=200'
  },
  {
    id: 4,
    name: 'Vasu',
    text: 'Find My PG is a wonderful concept. The facilities and hassle-free accommodation is what makes Find My PG very interesting.',
    image: 'https://images.unsplash.com/photo-1519345182560-3f2917c472ef?w=200'
  }
];

export const amenitiesList = [
  { name: 'Air Conditioner', icon: 'AirVent', available: true },
  { name: 'Balcony', icon: 'Home', available: false },
  { name: 'Extra Bed', icon: 'Bed', available: false },
  { name: 'Flat TV', icon: 'Tv', available: true },
  { name: 'Hot & Cold Water', icon: 'Droplets', available: true },
  { name: 'InterCom', icon: 'Phone', available: true },
  { name: 'Locker', icon: 'Lock', available: true },
  { name: 'Read Table', icon: 'Lamp', available: true },
  { name: 'WiFi', icon: 'Wifi', available: true }
];

export const howItWorks = [
  {
    id: 1,
    title: 'Search',
    description: 'Fill the search fields like your locality, or city, boys pg or girls pg',
    icon: 'Search'
  },
  {
    id: 2,
    title: 'Make Payment',
    description: 'Select your PG Rental Home, Sharing Type and make payment Online.',
    icon: 'CreditCard'
  },
  {
    id: 3,
    title: 'Booking Confirmation',
    description: 'Your subscription and booking date confirmed.',
    icon: 'CheckCircle'
  }
];

export const features = [
  {
    id: 1,
    title: 'Find PGs Near You',
    description: 'Find Paying guests near you by selecting your location. We cover more than 50+ localities in every city.',
    icon: 'MapPin'
  },
  {
    id: 2,
    title: 'Book Online',
    description: 'Book your PG online through our web portal or mobile application. Avail discounts that are available for booking online.',
    icon: 'Smartphone'
  },
  {
    id: 3,
    title: 'Best Deals On PGs',
    description: 'We have tie ups with PGs in every city. We make sure that our customers get the best deals for PGs.',
    icon: 'BadgePercent'
  }
];
