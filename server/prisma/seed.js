const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seed for GlobeTrotter (Indian Destinations & INR Pricing)...');

  // Clean existing tables
  await prisma.expense.deleteMany();
  await prisma.savedDestination.deleteMany();
  await prisma.itineraryItem.deleteMany();
  await prisma.tripStop.deleteMany();
  await prisma.trip.deleteMany();
  await prisma.activity.deleteMany();
  await prisma.city.deleteMany();
  await prisma.user.deleteMany();

  // Create default demo user (Rahul Sharma / demo@globetrotter.com / demo123)
  const passwordHash = await bcrypt.hash('demo123', 10);
  const demoUser = await prisma.user.create({
    data: {
      firstName: 'Rahul',
      lastName: 'Sharma',
      email: 'demo@globetrotter.com',
      passwordHash,
      phone: '+91 98765 43210',
      city: 'Mumbai',
      country: 'India',
      bio: 'Passionate globetrotter, culture enthusiast, street-food lover, and Himalayan trekker.',
      avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
      language: 'Hindi',
      role: 'USER',
    },
  });

  // Create alias for rahul@globetrotter.com / rahul123
  const rahulHash = await bcrypt.hash('rahul123', 10);
  await prisma.user.create({
    data: {
      firstName: 'Rahul',
      lastName: 'Sharma',
      email: 'rahul@globetrotter.com',
      passwordHash: rahulHash,
      phone: '+91 98765 43211',
      city: 'Delhi',
      country: 'India',
      bio: 'Passionate travel planner and heritage explorer.',
      language: 'English',
      role: 'USER',
    },
  });

  // Create demo admin user (admin@globetrotter.com / admin123)
  const adminHash = await bcrypt.hash('admin123', 10);
  await prisma.user.create({
    data: {
      firstName: 'Admin',
      lastName: 'User',
      email: 'admin@globetrotter.com',
      passwordHash: adminHash,
      phone: '+91 99999 88888',
      city: 'Bengaluru',
      country: 'India',
      bio: 'GlobeTrotter system administrator and platform curator.',
      language: 'English',
      role: 'ADMIN',
    },
  });

  console.log('✅ Created demo users (Rahul Sharma & Admin User)');

  // 1. Create Indian & Global Cities
  const goa = await prisma.city.create({
    data: {
      name: 'Goa',
      country: 'India',
      region: 'Goa',
      costIndex: 55,
      popularityScore: 98,
      latitude: 15.2993,
      longitude: 74.1240,
      description: 'Sun-kissed tropical paradise known for golden beaches, vibrant shacks, Portuguese architecture, water sports, and electrifying nightlife.',
      imageUrl: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=1200&q=80',
    },
  });

  const jaipur = await prisma.city.create({
    data: {
      name: 'Jaipur',
      country: 'India',
      region: 'Rajasthan',
      costIndex: 45,
      popularityScore: 96,
      latitude: 26.9124,
      longitude: 75.7873,
      description: 'The Pink City of royalty, featuring majestic hilltop forts, opulent palaces, vibrant bazaars, and legendary Rajasthani hospitality.',
      imageUrl: 'https://images.unsplash.com/photo-1599661046289-e31897846e41?auto=format&fit=crop&w=1200&q=80',
    },
  });

  const varanasi = await prisma.city.create({
    data: {
      name: 'Varanasi',
      country: 'India',
      region: 'Uttar Pradesh',
      costIndex: 35,
      popularityScore: 94,
      latitude: 25.3176,
      longitude: 82.9739,
      description: 'The spiritual capital of India on the sacred banks of the Ganges, renowned for ancient ghats, evening aartis, and centuries of mysticism.',
      imageUrl: 'https://images.unsplash.com/photo-1561361513-2d000a50f0dc?auto=format&fit=crop&w=1200&q=80',
    },
  });

  const manali = await prisma.city.create({
    data: {
      name: 'Manali',
      country: 'India',
      region: 'Himachal Pradesh',
      costIndex: 50,
      popularityScore: 95,
      latitude: 32.2432,
      longitude: 77.1892,
      description: 'Scenic Himalayan valley enveloped in pine forests, snow peaks, roaring rivers, adventurous trails, and serene apple orchards.',
      imageUrl: 'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?auto=format&fit=crop&w=1200&q=80',
    },
  });

  const munnar = await prisma.city.create({
    data: {
      name: 'Munnar & Kochi',
      country: 'India',
      region: 'Kerala',
      costIndex: 48,
      popularityScore: 92,
      latitude: 10.0889,
      longitude: 77.0595,
      description: 'God’s Own Country with emerald rolling tea estates, tranquil palm-lined backwaters, spice gardens, and historic colonial port heritage.',
      imageUrl: 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?auto=format&fit=crop&w=1200&q=80',
    },
  });

  const mumbai = await prisma.city.create({
    data: {
      name: 'Mumbai',
      country: 'India',
      region: 'Maharashtra',
      costIndex: 70,
      popularityScore: 97,
      latitude: 19.0760,
      longitude: 72.8777,
      description: 'The energetic City of Dreams, boasting Victorian Gothic architecture, the iconic Marine Drive promenade, Bollywood, and eclectic street food.',
      imageUrl: 'https://images.unsplash.com/photo-1570168007204-dfb528c6958f?auto=format&fit=crop&w=1200&q=80',
    },
  });

  const delhi = await prisma.city.create({
    data: {
      name: 'Delhi & Agra',
      country: 'India',
      region: 'Delhi NCR / UP',
      costIndex: 50,
      popularityScore: 98,
      latitude: 28.6139,
      longitude: 77.2090,
      description: 'Heart of India featuring the magnificent Taj Mahal, Red Fort, Chandni Chowk bazaars, and timeless Mughal architectural marvels.',
      imageUrl: 'https://images.unsplash.com/photo-1564507592333-c60657eea523?auto=format&fit=crop&w=1200&q=80',
    },
  });

  const paris = await prisma.city.create({
    data: {
      name: 'Paris',
      country: 'France',
      region: 'Europe',
      costIndex: 85,
      popularityScore: 96,
      latitude: 48.8566,
      longitude: 2.3522,
      description: 'The City of Light, global center for art, fashion, gastronomy, and culture with iconic monuments like the Eiffel Tower and Louvre.',
      imageUrl: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=1200&q=80',
    },
  });

  const tokyo = await prisma.city.create({
    data: {
      name: 'Tokyo',
      country: 'Japan',
      region: 'Asia',
      costIndex: 78,
      popularityScore: 98,
      latitude: 35.6762,
      longitude: 139.6503,
      description: 'The bustling capital of Japan, blending ultramodern neon skyscrapers with historic temples and world-class gastronomy.',
      imageUrl: 'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=1200&q=80',
    },
  });

  const dubai = await prisma.city.create({
    data: {
      name: 'Dubai',
      country: 'United Arab Emirates',
      region: 'Middle East',
      costIndex: 80,
      popularityScore: 97,
      latitude: 25.2048,
      longitude: 55.2708,
      description: 'Futuristic oasis of luxury shopping, ultramodern architecture, desert safaris, and the world-record Burj Khalifa tower.',
      imageUrl: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=1200&q=80',
    },
  });

  console.log('✅ Created cities: Goa, Jaipur, Varanasi, Manali, Munnar, Mumbai, Delhi & Agra, Paris, Tokyo, Dubai');

  // 2. Create Activities with Indian Rupee (₹) Pricing
  const activitiesData = [
    // Goa Activities
    {
      cityId: goa.id,
      name: 'Scuba Diving & Snorkeling at Grand Island',
      description: 'Explore vibrant coral reefs, shipwrecks, and exotic marine life with PADI certified dive instructors and dolphin spotting boat ride.',
      category: 'ADVENTURE',
      durationHours: 5.0,
      estimatedCost: 3500,
      imageUrl: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=800&q=80',
      rating: 4.9,
    },
    {
      cityId: goa.id,
      name: 'Dudhsagar Waterfalls 4x4 Jungle Safari',
      description: 'Thrill ride across rivers into Bhagwan Mahavir Wildlife Sanctuary to witness India’s four-tiered 310m milky white waterfall.',
      category: 'NATURE',
      durationHours: 6.0,
      estimatedCost: 1800,
      imageUrl: 'https://images.unsplash.com/photo-1588714477688-cf28a50e94f7?auto=format&fit=crop&w=800&q=80',
      rating: 4.8,
    },
    {
      cityId: goa.id,
      name: 'Fort Aguada & Lighthouse Sunset Walk',
      description: '17th-century Portuguese fortress commanding sweeping Arabian Sea panoramas with a historic freshwater reservoir.',
      category: 'SIGHTSEEING',
      durationHours: 2.0,
      estimatedCost: 200,
      imageUrl: 'https://images.unsplash.com/photo-1590050752117-238cb0fb12b1?auto=format&fit=crop&w=800&q=80',
      rating: 4.7,
    },
    {
      cityId: goa.id,
      name: 'Calangute & Baga Water Sports Combo',
      description: 'Parasailing high over the coastline, jet ski rides, bumper boat, and banana boat rides on North Goa’s famous sands.',
      category: 'ADVENTURE',
      durationHours: 3.0,
      estimatedCost: 2200,
      imageUrl: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80',
      rating: 4.6,
    },
    {
      cityId: goa.id,
      name: 'Traditional Goan Fish Curry Shack Dinner',
      description: 'Savor spicy Kingfish Rava fry, prawn balchão, and fresh poee bread by candlelight directly on the beachfront.',
      category: 'FOOD',
      durationHours: 2.5,
      estimatedCost: 750,
      imageUrl: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=800&q=80',
      rating: 4.9,
    },
    {
      cityId: goa.id,
      name: 'Sahakari Spice Plantation Guided Tour & Buffet',
      description: 'Walk through organic vanilla, cardamom, and black pepper groves with traditional welcome garland, cashew feni, and lunch.',
      category: 'CULTURE',
      durationHours: 3.0,
      estimatedCost: 800,
      imageUrl: 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&w=800&q=80',
      rating: 4.7,
    },

    // Jaipur Activities
    {
      cityId: jaipur.id,
      name: 'Amber Fort & Palace Heritage Tour',
      description: 'Majestic 16th-century hilltop fortress with Sheesh Mahal (Mirror Palace), courtyards, and panoramic views of Maota Lake.',
      category: 'CULTURE',
      durationHours: 3.5,
      estimatedCost: 500,
      imageUrl: 'https://images.unsplash.com/photo-1599661046289-e31897846e41?auto=format&fit=crop&w=800&q=80',
      rating: 4.9,
    },
    {
      cityId: jaipur.id,
      name: 'Hawa Mahal & City Palace Royal Museum',
      description: 'The 953-window honeycomb façade designed for royal women to observe street life, plus royal armory and textile galleries.',
      category: 'SIGHTSEEING',
      durationHours: 3.0,
      estimatedCost: 400,
      imageUrl: 'https://images.unsplash.com/photo-1603288967396-03f395786f5c?auto=format&fit=crop&w=800&q=80',
      rating: 4.8,
    },
    {
      cityId: jaipur.id,
      name: 'Nahargarh Fort Sunset & City Skyline',
      description: 'Watch the sun dip below the Aravalli hills, casting a golden glow over the entire Pink City skyline from Padao cafe.',
      category: 'SIGHTSEEING',
      durationHours: 2.5,
      estimatedCost: 300,
      imageUrl: 'https://images.unsplash.com/photo-1609137144822-2591e13e2f5b?auto=format&fit=crop&w=800&q=80',
      rating: 4.9,
    },
    {
      cityId: jaipur.id,
      name: 'Chokhi Dhani Cultural Village & Grand Thali',
      description: 'Immersive Rajasthani fair with folk dancers, puppet shows, camel rides, pottery, fire stunts, and a lavish Dal Baati Churma feast.',
      category: 'CULTURE',
      durationHours: 4.0,
      estimatedCost: 1400,
      imageUrl: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=800&q=80',
      rating: 4.8,
    },
    {
      cityId: jaipur.id,
      name: 'Johari & Bapu Bazaar Craft & Sweet Trail',
      description: 'Shop authentic handcrafted silver jewelry, block-printed quilts, bandhani dupattas, and taste hot Ghewar sweets.',
      category: 'SHOPPING',
      durationHours: 2.5,
      estimatedCost: 600,
      imageUrl: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=800&q=80',
      rating: 4.7,
    },

    // Varanasi Activities
    {
      cityId: varanasi.id,
      name: 'Dashashwamedh Ghat Grand Evening Ganga Aarti',
      description: 'Experience the mesmerizing synchronized brass lamp rituals, conch shells, and Vedic chants from a private wooden river boat.',
      category: 'CULTURE',
      durationHours: 2.0,
      estimatedCost: 500,
      imageUrl: 'https://images.unsplash.com/photo-1561361513-2d000a50f0dc?auto=format&fit=crop&w=800&q=80',
      rating: 5.0,
    },
    {
      cityId: varanasi.id,
      name: 'Subah-e-Banaras Sunrise Boat Ride',
      description: 'Row past 84 historical ghats in misty dawn light as pilgrims bathe and yogis practice morning surya namaskar.',
      category: 'SIGHTSEEING',
      durationHours: 2.5,
      estimatedCost: 650,
      imageUrl: 'https://images.unsplash.com/photo-1627894483216-2138af692e32?auto=format&fit=crop&w=800&q=80',
      rating: 4.9,
    },
    {
      cityId: varanasi.id,
      name: 'Kashi Vishwanath Temple Corridor Darshan',
      description: 'Visit one of the 12 sacred Jyotirlingas, newly renovated with a sprawling riverfront corridor connecting to the Ganges.',
      category: 'CULTURE',
      durationHours: 2.0,
      estimatedCost: 0,
      imageUrl: 'https://images.unsplash.com/photo-1596401057633-54a8fe8ef647?auto=format&fit=crop&w=800&q=80',
      rating: 4.9,
    },
    {
      cityId: varanasi.id,
      name: 'Banarasi Silk Weavers & Street Food Safari',
      description: 'Witness master artisans weave intricate golden Zari sarees, paired with Banarasi kachori-jalebi and creamy Blue Lassi.',
      category: 'FOOD',
      durationHours: 3.0,
      estimatedCost: 450,
      imageUrl: 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?auto=format&fit=crop&w=800&q=80',
      rating: 4.8,
    },

    // Manali Activities
    {
      cityId: manali.id,
      name: 'Rohtang Pass & Snow Glacier Expedition',
      description: 'Ascend to 3,978 meters for breathtaking Himalayan views, snow scooter rides, skiing, and pristine mountain air.',
      category: 'ADVENTURE',
      durationHours: 7.0,
      estimatedCost: 3200,
      imageUrl: 'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?auto=format&fit=crop&w=800&q=80',
      rating: 4.9,
    },
    {
      cityId: manali.id,
      name: 'Solang Valley Paragliding High-Flight',
      description: 'Soar like an eagle with tandem pilots over alpine cedar forests and river streams with stunning mountain backdrops.',
      category: 'ADVENTURE',
      durationHours: 3.0,
      estimatedCost: 3500,
      imageUrl: 'https://images.unsplash.com/photo-1506929562872-bb421503ef21?auto=format&fit=crop&w=800&q=80',
      rating: 4.8,
    },
    {
      cityId: manali.id,
      name: 'Hadimba Devi Pagoda Temple in Cedar Woods',
      description: 'Carved 16th-century wooden temple dedicated to Hadimba in the midst of towering centuries-old Dhungri pine forest.',
      category: 'NATURE',
      durationHours: 1.5,
      estimatedCost: 100,
      imageUrl: 'https://images.unsplash.com/photo-1596761068534-4679753770ef?auto=format&fit=crop&w=800&q=80',
      rating: 4.7,
    },
    {
      cityId: manali.id,
      name: 'Old Manali Riverside Cafe Hopping & Trout Meal',
      description: 'Chilled out cafes overlooking the Manalsu river with live acoustic music, wood-fired pizza, and fresh Himalayan river trout.',
      category: 'NIGHTLIFE',
      durationHours: 3.0,
      estimatedCost: 950,
      imageUrl: 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&w=800&q=80',
      rating: 4.8,
    },

    // Munnar & Kerala Activities
    {
      cityId: munnar.id,
      name: 'Kolukkumalai Sunrise 4x4 Tea Estate Safari',
      description: 'Ride to the world’s highest organic tea plantation (7,900 ft) to witness an awe-inspiring cloudbed sunrise.',
      category: 'NATURE',
      durationHours: 5.0,
      estimatedCost: 2400,
      imageUrl: 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?auto=format&fit=crop&w=800&q=80',
      rating: 5.0,
    },
    {
      cityId: munnar.id,
      name: 'Alleppey Backwaters Private Houseboat Cruise',
      description: 'Glide through tranquil canals and paddy fields while onboard chefs serve traditional Kerala banana leaf Sadhya meals.',
      category: 'NATURE',
      durationHours: 5.5,
      estimatedCost: 4500,
      imageUrl: 'https://images.unsplash.com/photo-1593693397690-362cb9666fc2?auto=format&fit=crop&w=800&q=80',
      rating: 4.9,
    },
    {
      cityId: munnar.id,
      name: 'Kathakali & Kalaripayattu Live Cultural Night',
      description: 'Marvel at elaborate classical face-painting makeup, facial expressions, and ancient sword-and-shield martial arts.',
      category: 'CULTURE',
      durationHours: 2.0,
      estimatedCost: 600,
      imageUrl: 'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&w=800&q=80',
      rating: 4.8,
    },

    // Delhi & Agra Activities
    {
      cityId: delhi.id,
      name: 'Taj Mahal Sunrise Guided Monument Tour',
      description: 'Be the first through the gates as dawn turns the white marble monument of love into soft shades of amber and rose.',
      category: 'SIGHTSEEING',
      durationHours: 3.0,
      estimatedCost: 350,
      imageUrl: 'https://images.unsplash.com/photo-1564507592333-c60657eea523?auto=format&fit=crop&w=800&q=80',
      rating: 5.0,
    },
    {
      cityId: delhi.id,
      name: 'Agra Fort Red Sandstone Royal Citadel',
      description: 'Vast Mughal fortress with Jahangir Palace, Khas Mahal, and views across the Yamuna river to the Taj Mahal.',
      category: 'CULTURE',
      durationHours: 2.5,
      estimatedCost: 200,
      imageUrl: 'https://images.unsplash.com/photo-1585136917228-56e6d1c810fb?auto=format&fit=crop&w=800&q=80',
      rating: 4.8,
    },
    {
      cityId: delhi.id,
      name: 'Chandni Chowk Food Walk & Cycle Rickshaw Safari',
      description: 'Taste legendary Paranthe Wali Gali paranthas, crispy jalebis, butter chicken, and spices in Old Delhi’s 300-year-old lanes.',
      category: 'FOOD',
      durationHours: 3.5,
      estimatedCost: 750,
      imageUrl: 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?auto=format&fit=crop&w=800&q=80',
      rating: 4.9,
    },
  ];

  for (const act of activitiesData) {
    await prisma.activity.create({ data: act });
  }

  console.log(`✅ Seeded ${activitiesData.length} Indian activities with INR pricing.`);

  // 3. Create Sample Trips in Rupees (₹)
  // Trip A: Goa Beach & Adventure Vacation (5 Days, ₹28,000)
  const goaTrip = await prisma.trip.create({
    data: {
      userId: demoUser.id,
      title: 'Goa Beach & Coastal Adventure',
      description: 'Tropical getaway featuring Arabian sea scuba diving, Dudhsagar waterfall trek, Portuguese forts, beach shacks, and seafood.',
      startDate: '2026-10-10',
      endDate: '2026-10-15',
      budget: 28000,
      coverImage: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=1200&q=80',
      isPublic: true,
      shareToken: 'goa-vacation-2026',
    },
  });

  const goaStop = await prisma.tripStop.create({
    data: {
      tripId: goaTrip.id,
      cityId: goa.id,
      arrivalDate: '2026-10-10',
      departureDate: '2026-10-15',
      stopOrder: 1,
    },
  });

  // Trip B: Golden Triangle Heritage Odyssey (7 Days, ₹45,000)
  const triangleTrip = await prisma.trip.create({
    data: {
      userId: demoUser.id,
      title: 'Golden Triangle Heritage Odyssey',
      description: 'Classic North India tour covering Delhi monuments, the sunrise Taj Mahal in Agra, and royal Amber Fort in Jaipur.',
      startDate: '2026-11-05',
      endDate: '2026-11-12',
      budget: 45000,
      coverImage: 'https://images.unsplash.com/photo-1599661046289-e31897846e41?auto=format&fit=crop&w=1200&q=80',
      isPublic: true,
      shareToken: 'golden-triangle-2026',
    },
  });

  const delhiStop = await prisma.tripStop.create({
    data: {
      tripId: triangleTrip.id,
      cityId: delhi.id,
      arrivalDate: '2026-11-05',
      departureDate: '2026-11-08',
      stopOrder: 1,
    },
  });

  const jaipurStop = await prisma.tripStop.create({
    data: {
      tripId: triangleTrip.id,
      cityId: jaipur.id,
      arrivalDate: '2026-11-08',
      departureDate: '2026-11-12',
      stopOrder: 2,
    },
  });

  // Trip C: Kerala Backwaters & Tea Gardens (6 Days, ₹35,000)
  const keralaTrip = await prisma.trip.create({
    data: {
      userId: demoUser.id,
      title: 'Kerala Backwaters & Tea Trails',
      description: 'Refreshing retreat among misty Munnar tea plantations, spice gardens, and tranquil Alleppey houseboat canals.',
      startDate: '2026-12-01',
      endDate: '2026-12-07',
      budget: 35000,
      coverImage: 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?auto=format&fit=crop&w=1200&q=80',
      isPublic: true,
      shareToken: 'kerala-tea-trails-2026',
    },
  });

  await prisma.tripStop.create({
    data: {
      tripId: keralaTrip.id,
      cityId: munnar.id,
      arrivalDate: '2026-12-01',
      departureDate: '2026-12-07',
      stopOrder: 1,
    },
  });

  // 4. Seed Itinerary Items for Goa Trip
  const scubaAct = await prisma.activity.findFirst({ where: { name: { contains: 'Scuba' } } });
  const dudhsagarAct = await prisma.activity.findFirst({ where: { name: { contains: 'Dudhsagar' } } });
  const fortAct = await prisma.activity.findFirst({ where: { name: { contains: 'Fort Aguada' } } });
  const shackAct = await prisma.activity.findFirst({ where: { name: { contains: 'Shack' } } });

  if (scubaAct && dudhsagarAct && fortAct && shackAct) {
    await prisma.itineraryItem.create({
      data: {
        tripId: goaTrip.id,
        tripStopId: goaStop.id,
        activityId: fortAct.id,
        date: '2026-10-10',
        startTime: '16:00',
        endTime: '18:30',
        notes: 'Catch the lighthouse sunset and take photos of Portuguese ramparts.',
        customCost: 200,
        sortOrder: 1,
      },
    });

    await prisma.itineraryItem.create({
      data: {
        tripId: goaTrip.id,
        tripStopId: goaStop.id,
        activityId: scubaAct.id,
        date: '2026-10-11',
        startTime: '08:30',
        endTime: '13:30',
        notes: 'Wear quick-dry swimwear. Underwater GOPRO photography included.',
        customCost: 3500,
        sortOrder: 1,
      },
    });

    await prisma.itineraryItem.create({
      data: {
        tripId: goaTrip.id,
        tripStopId: goaStop.id,
        activityId: shackAct.id,
        date: '2026-10-11',
        startTime: '19:30',
        endTime: '22:00',
        notes: 'Candlelight seafood dinner at Britto’s / Curlies shack.',
        customCost: 750,
        sortOrder: 2,
      },
    });

    await prisma.itineraryItem.create({
      data: {
        tripId: goaTrip.id,
        tripStopId: goaStop.id,
        activityId: dudhsagarAct.id,
        date: '2026-10-12',
        startTime: '07:00',
        endTime: '14:00',
        notes: '4x4 open jeep safari through Mollem National park river crossings.',
        customCost: 1800,
        sortOrder: 1,
      },
    });
  }

  // 5. Seed Itinerary Items for Golden Triangle
  const tajAct = await prisma.activity.findFirst({ where: { name: { contains: 'Taj Mahal' } } });
  const delhiFoodAct = await prisma.activity.findFirst({ where: { name: { contains: 'Chandni Chowk' } } });
  const amberAct = await prisma.activity.findFirst({ where: { name: { contains: 'Amber Fort' } } });
  const chokhiAct = await prisma.activity.findFirst({ where: { name: { contains: 'Chokhi Dhani' } } });

  if (tajAct && delhiFoodAct && amberAct && chokhiAct) {
    await prisma.itineraryItem.create({
      data: {
        tripId: triangleTrip.id,
        tripStopId: delhiStop.id,
        activityId: delhiFoodAct.id,
        date: '2026-11-05',
        startTime: '15:00',
        endTime: '18:30',
        notes: 'Paranthe Wali Gali, Natraj Dahi Bhalla, and spice market walk.',
        customCost: 750,
        sortOrder: 1,
      },
    });

    await prisma.itineraryItem.create({
      data: {
        tripId: triangleTrip.id,
        tripStopId: delhiStop.id,
        activityId: tajAct.id,
        date: '2026-11-06',
        startTime: '06:00',
        endTime: '09:30',
        notes: 'Sunrise ticket. Reach East gate by 05:45 AM.',
        customCost: 350,
        sortOrder: 1,
      },
    });

    await prisma.itineraryItem.create({
      data: {
        tripId: triangleTrip.id,
        tripStopId: jaipurStop.id,
        activityId: amberAct.id,
        date: '2026-11-09',
        startTime: '09:00',
        endTime: '12:30',
        notes: 'Explore the Sheesh Mahal and grand courtyards.',
        customCost: 500,
        sortOrder: 1,
      },
    });

    await prisma.itineraryItem.create({
      data: {
        tripId: triangleTrip.id,
        tripStopId: jaipurStop.id,
        activityId: chokhiAct.id,
        date: '2026-11-09',
        startTime: '18:30',
        endTime: '22:30',
        notes: 'Full cultural evening with folk music, dance, and royal thali.',
        customCost: 1400,
        sortOrder: 2,
      },
    });
  }

  // 6. Seed Realistic Expenses in Rupees (₹) for Goa Trip
  await prisma.expense.createMany({
    data: [
      {
        tripId: goaTrip.id,
        category: 'TRANSPORT',
        description: 'Vande Bharat Train Tickets (Mumbai to Madgaon Return)',
        amount: 3800,
        date: '2026-10-10',
      },
      {
        tripId: goaTrip.id,
        category: 'STAY',
        description: 'Boutique Beach Resort Booking (5 Nights in Calangute)',
        amount: 14500,
        date: '2026-10-10',
      },
      {
        tripId: goaTrip.id,
        category: 'ACTIVITY',
        description: 'Scuba Diving & Dudhsagar Safari Entry Passes',
        amount: 5300,
        date: '2026-10-11',
      },
      {
        tripId: goaTrip.id,
        category: 'MEAL',
        description: 'Beach Shack Dinners, Cocktails & Seafood Lunches',
        amount: 4200,
        date: '2026-10-12',
      },
      {
        tripId: goaTrip.id,
        category: 'MISCELLANEOUS',
        description: 'Scooter Rental (5 Days) + Fuel + Souvenirs',
        amount: 2200,
        date: '2026-10-13',
      },
    ],
  });

  // 7. Seed Saved Destinations for Rahul (Goa, Jaipur, Munnar, Paris)
  await prisma.savedDestination.createMany({
    data: [
      { userId: demoUser.id, cityId: goa.id },
      { userId: demoUser.id, cityId: jaipur.id },
      { userId: demoUser.id, cityId: munnar.id },
      { userId: demoUser.id, cityId: paris.id },
    ],
  });

  console.log('✅ Seeded trips, stops, activities, expenses in ₹, and saved destinations successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Error during seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
