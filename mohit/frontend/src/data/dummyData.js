export const DUMMY_TRIPS = [
  {
    id: "1",
    tripName: "Japan Tour 2026",
    startDate: "2026-10-15",
    endDate: "2026-10-30",
    budget: 45000,
    coverImage: "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?q=80&w=800&auto=format&fit=crop",
    destinations: ["Tokyo", "Kyoto", "Osaka"]
  },
  {
    id: "2",
    tripName: "Euro Trip Summer",
    startDate: "2026-07-01",
    endDate: "2026-07-21",
    budget: 85000,
    coverImage: "https://images.unsplash.com/photo-1499856871958-5b9627545d1a?q=80&w=800&auto=format&fit=crop",
    destinations: ["Paris", "Rome", "Berlin"]
  }
];

export const POPULAR_DESTINATIONS = [
  { name: "Bali, Indonesia", image: "https://images.unsplash.com/photo-1537996194471-e657df975ab4?q=80&w=800&auto=format&fit=crop" },
  { name: "Santorini, Greece", image: "https://images.unsplash.com/photo-1570077188670-e3a8d69ac542?q=80&w=800&auto=format&fit=crop" },
  { name: "Banff, Canada", image: "https://images.unsplash.com/photo-1503614472-8c93d56e92ce?q=80&w=800&auto=format&fit=crop" }
];

export const DUMMY_ITINERARY = [
  {
    day: 1,
    date: "2026-10-15",
    city: "Tokyo",
    activities: [
      { id: "a1", time: "10:00 AM", title: "Arrive at Haneda Airport", cost: 0, type: "Transport" },
      { id: "a2", time: "12:30 PM", title: "Check-in to Hotel Shinjuku", cost: 1500, type: "Hotel" },
      { id: "a3", time: "03:00 PM", title: "Visit Meiji Shrine", cost: 0, type: "Activity" },
      { id: "a4", time: "07:00 PM", title: "Dinner at Ichiran Ramen", cost: 25, type: "Food" }
    ]
  },
  {
    day: 2,
    date: "2026-10-16",
    city: "Tokyo",
    activities: [
      { id: "a5", time: "09:00 AM", title: "Senso-ji Temple", cost: 5, type: "Activity" },
      { id: "a6", time: "01:00 PM", title: "Akihabara exploration", cost: 50, type: "Activity" }
    ]
  }
];
