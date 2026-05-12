export const POPULAR_DESTINATIONS = [
  {
    id: '1',
    name: 'Bora Bora',
    location: 'French Polynesia',
    price: '$1200',
    rating: '4.9',
    image: require('@/assets/images/tropical_beach.png'),
    description: 'Bora Bora is a small South Pacific island northwest of Tahiti in French Polynesia. Surrounded by sand-fringed motus (islets) and a turquoise lagoon protected by a coral reef, it’s known for its scuba diving and luxury resorts.',
  },
  {
    id: '2',
    name: 'Swiss Alps',
    location: 'Switzerland',
    price: '$950',
    rating: '4.8',
    image: require('@/assets/images/snowy_mountain.png'),
    description: 'The Swiss Alps are a major mountain range in Switzerland. They are known for their stunning scenery, world-class skiing, and charming alpine villages.',
  },
  {
    id: '3',
    name: 'Tokyo',
    location: 'Japan',
    price: '$800',
    rating: '4.7',
    image: require('@/assets/images/vibrant_city.png'),
    description: 'Tokyo, Japan’s busy capital, mixes the ultramodern and the traditional, from neon-lit skyscrapers to historic temples.',
  },
];

export const ALL_DESTINATIONS = [...POPULAR_DESTINATIONS];
