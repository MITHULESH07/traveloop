export const dummyTrips = [
  {
    id: 'trip-1',
    destination: 'Kyoto, Japan',
    startDate: '2026-10-15',
    endDate: '2026-10-24',
    status: 'upcoming',
    image: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=800&q=80',
    budget: 3500,
    spent: 1200
  },
  {
    id: 'trip-2',
    destination: 'Santorini, Greece',
    startDate: '2027-06-10',
    endDate: '2027-06-18',
    status: 'planning',
    image: 'https://images.unsplash.com/photo-1533105079780-92b9be482077?w=800&q=80',
    budget: 4200,
    spent: 0
  }
];

export const dummyExpenses = [
  { id: 1, category: 'Flights', amount: 850, date: '2026-05-01' },
  { id: 2, category: 'Accommodation', amount: 350, date: '2026-05-05' },
];

export const dummyPackingList = [
  { id: 1, category: 'Clothing', items: [
    { id: 'i1', name: 'T-shirts (5)', checked: true },
    { id: 'i2', name: 'Jeans', checked: false }
  ]},
  { id: 2, category: 'Electronics', items: [
    { id: 'i3', name: 'Camera', checked: false },
    { id: 'i4', name: 'Power Bank', checked: true }
  ]}
];
