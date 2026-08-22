const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seed for GlobeTrotter...');

  // Clean existing tables
  await prisma.expense.deleteMany();
  await prisma.savedDestination.deleteMany();
  await prisma.itineraryItem.deleteMany();
  await prisma.tripStop.deleteMany();
  await prisma.trip.deleteMany();
  await prisma.activity.deleteMany();
  await prisma.city.deleteMany();
  await prisma.user.deleteMany();

  // Create default demo user (demo@globetrotter.com / demo123)
  const passwordHash = await bcrypt.hash('demo123', 10);
  const demoUser = await prisma.user.create({
    data: {
      firstName: 'Alex',
      lastName: 'Explorer',
      email: 'demo@globetrotter.com',
      passwordHash,
      phone: '+1 (555) 234-5678',
      city: 'San Francisco',
      country: 'United States',
      bio: 'Passionate globetrotter, culture enthusiast, and street-food adventurer.',
      avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
      language: 'English',
      role: 'USER',
    },
  });

  // Create demo admin user
  await prisma.user.create({
    data: {
      firstName: 'Admin',
      lastName: 'User',
      email: 'admin@globetrotter.com',
      passwordHash: await bcrypt.hash('admin123', 10),
      language: 'English',
      role: 'ADMIN',
    },
  });

  // 1. Create Cities
  const tokyo = await prisma.city.create({
    data: {
      name: 'Tokyo',
      country: 'Japan',
      description: 'The bustling capital of Japan, blending ultramodern neon skyscrapers with historic temples and world-class gastronomy.',
      imageUrl: 'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=1200&q=80',
    },
  });

  const kyoto = await prisma.city.create({
    data: {
      name: 'Kyoto',
      country: 'Japan',
      description: 'The ancient imperial capital famous for classical Buddhist temples, gardens, imperial palaces, Shinto shrines, and geishas.',
      imageUrl: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=1200&q=80',
    },
  });

  const osaka = await prisma.city.create({
    data: {
      name: 'Osaka',
      country: 'Japan',
      description: 'Japan\'s street-food capital known for modern architecture, vibrant nightlife, and towering Osaka Castle.',
      imageUrl: 'https://images.unsplash.com/photo-1590559899731-a3f07b743759?auto=format&fit=crop&w=1200&q=80',
    },
  });

  const paris = await prisma.city.create({
    data: {
      name: 'Paris',
      country: 'France',
      description: 'The City of Light, global center for art, fashion, gastronomy, and culture with iconic monuments like the Eiffel Tower and Louvre.',
      imageUrl: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=1200&q=80',
    },
  });

  const london = await prisma.city.create({
    data: {
      name: 'London',
      country: 'United Kingdom',
      description: 'A 21st-century city with history stretching to Roman times, home to Big Ben, Tower Bridge, and rich theater life.',
      imageUrl: 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?auto=format&fit=crop&w=1200&q=80',
    },
  });

  const rome = await prisma.city.create({
    data: {
      name: 'Rome',
      country: 'Italy',
      description: 'The Eternal City packed with nearly 3,000 years of globally influential art, architecture, and ruins like the Colosseum.',
      imageUrl: 'https://images.unsplash.com/photo-1552832230-c0197dd311b5?auto=format&fit=crop&w=1200&q=80',
    },
  });

  console.log('✅ Created cities: Tokyo, Kyoto, Osaka, Paris, London, Rome');

  // 2. Create Activities for Tokyo
  const tokyoActivities = [
    {
      name: 'Senso-ji Temple & Asakusa Old Town',
      description: 'Tokyo’s oldest Buddhist temple founded in 645 AD. Walk down Nakamise Shopping Street lined with traditional snacks and crafts.',
      category: 'CULTURE',
      durationHours: 2.0,
      estimatedCost: 0,
      imageUrl: 'https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?auto=format&fit=crop&w=800&q=80',
      rating: 4.8,
      cityId: tokyo.id,
    },
    {
      name: 'Tokyo Tower Observation Deck',
      description: 'Iconic communications and observation tower in the Shiba-koen district. Enjoy 360-degree panoramic views across Tokyo and Mt. Fuji on clear days.',
      category: 'SIGHTSEEING',
      durationHours: 2.0,
      estimatedCost: 25,
      imageUrl: 'https://images.unsplash.com/photo-1536098561742-ca998e48cbcc?auto=format&fit=crop&w=800&q=80',
      rating: 4.7,
      cityId: tokyo.id,
    },
    {
      name: 'Shibuya Crossing & Hachiko Statue',
      description: 'Experience the world’s busiest pedestrian crossing with thousands of people crossing in all directions against dazzling billboard screens.',
      category: 'SIGHTSEEING',
      durationHours: 1.5,
      estimatedCost: 0,
      imageUrl: 'https://images.unsplash.com/photo-1542051841857-5f90071e7989?auto=format&fit=crop&w=800&q=80',
      rating: 4.6,
      cityId: tokyo.id,
    },
    {
      name: 'Authentic Sushi Making Masterclass',
      description: 'Learn the craft of preparing Edo-style sushi with a licensed master chef in Tsukiji. Includes tasting multiple cuts of fresh fish.',
      category: 'FOOD',
      durationHours: 3.0,
      estimatedCost: 85,
      imageUrl: 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?auto=format&fit=crop&w=800&q=80',
      rating: 4.9,
      cityId: tokyo.id,
    },
    {
      name: 'Meiji Shrine & Yoyogi Forest Walk',
      description: 'Serene Shinto shrine dedicated to Emperor Meiji surrounded by 170 acres of evergreen forested tranquil parkland.',
      category: 'CULTURE',
      durationHours: 2.0,
      estimatedCost: 0,
      imageUrl: 'https://images.unsplash.com/photo-1583084332997-c8c368cbdb21?auto=format&fit=crop&w=800&q=80',
      rating: 4.7,
      cityId: tokyo.id,
    },
    {
      name: 'teamLab Planets Digital Art Museum',
      description: 'An immersive digital art museum where you walk through water and a garden where you become one with the flowers and lights.',
      category: 'ADVENTURE',
      durationHours: 2.5,
      estimatedCost: 38,
      imageUrl: 'https://images.unsplash.com/photo-1508739773434-c26b3d09e071?auto=format&fit=crop&w=800&q=80',
      rating: 4.9,
      cityId: tokyo.id,
    },
    {
      name: 'Tsukiji Outer Market Food Tour',
      description: 'Taste fresh sashimi, tamagoyaki, wagyu skewers, and fresh oysters guided by a local culinary enthusiast.',
      category: 'FOOD',
      durationHours: 3.0,
      estimatedCost: 65,
      imageUrl: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=800&q=80',
      rating: 4.8,
      cityId: tokyo.id,
    },
    {
      name: 'Akihabara Electric Town & Retro Arcades',
      description: 'Explore multi-story electronics department stores, retro video game sanctuaries, and anime collector shops.',
      category: 'SHOPPING',
      durationHours: 3.0,
      estimatedCost: 20,
      imageUrl: 'https://images.unsplash.com/photo-1563245372-f21724e3856d?auto=format&fit=crop&w=800&q=80',
      rating: 4.5,
      cityId: tokyo.id,
    },
    {
      name: 'Shinjuku Golden Gai Night Bar Crawl',
      description: 'Venture into a network of 6 narrow alleys containing over 200 tiny thematic watering holes and whiskey lounges.',
      category: 'NIGHTLIFE',
      durationHours: 3.5,
      estimatedCost: 55,
      imageUrl: 'https://images.unsplash.com/photo-1514933651103-005eec06c04b?auto=format&fit=crop&w=800&q=80',
      rating: 4.7,
      cityId: tokyo.id,
    },
    {
      name: 'Shinjuku Gyoen National Garden',
      description: 'One of Tokyo’s largest and most popular parks featuring traditional Japanese, English landscape, and French formal gardens.',
      category: 'NATURE',
      durationHours: 2.0,
      estimatedCost: 5,
      imageUrl: 'https://images.unsplash.com/photo-1528164344705-475426879c0d?auto=format&fit=crop&w=800&q=80',
      rating: 4.8,
      cityId: tokyo.id,
    },
  ];

  // 3. Create Activities for Kyoto
  const kyotoActivities = [
    {
      name: 'Fushimi Inari-taisha Thousand Torii Gates',
      description: 'Hike through thousands of vermilion torii gates winding up sacred Mount Inari with fox statues guarding the path.',
      category: 'CULTURE',
      durationHours: 3.0,
      estimatedCost: 0,
      imageUrl: 'https://images.unsplash.com/photo-1478436127897-769e00d7c583?auto=format&fit=crop&w=800&q=80',
      rating: 4.9,
      cityId: kyoto.id,
    },
    {
      name: 'Arashiyama Bamboo Grove & Monkey Park',
      description: 'Stroll through towering bamboo stalks that rustle gently in the breeze and climb to the hilltop macaque sanctuary.',
      category: 'NATURE',
      durationHours: 3.0,
      estimatedCost: 8,
      imageUrl: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80',
      rating: 4.8,
      cityId: kyoto.id,
    },
    {
      name: 'Kinkaku-ji (Golden Pavilion)',
      description: 'Zen Buddhist temple whose top two floors are completely covered in brilliant gold leaf, overlooking a tranquil mirror pond.',
      category: 'CULTURE',
      durationHours: 1.5,
      estimatedCost: 5,
      imageUrl: 'https://images.unsplash.com/photo-1545569341-9eb8b30979d9?auto=format&fit=crop&w=800&q=80',
      rating: 4.7,
      cityId: kyoto.id,
    },
    {
      name: 'Nishiki Market Culinary Discovery',
      description: 'Known as "Kyoto\'s Kitchen", this narrow five-block shopping street features over a hundred stalls with skewers, pickles, and dashi.',
      category: 'FOOD',
      durationHours: 2.0,
      estimatedCost: 40,
      imageUrl: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=800&q=80',
      rating: 4.8,
      cityId: kyoto.id,
    },
    {
      name: 'Traditional Machiya Tea Ceremony',
      description: 'Experience the mindful art of Japanese green tea preparation (Chado) hosted by a kimono-clad tea master in a historic townhome.',
      category: 'CULTURE',
      durationHours: 1.5,
      estimatedCost: 45,
      imageUrl: 'https://images.unsplash.com/photo-1576092768241-dec231879fc3?auto=format&fit=crop&w=800&q=80',
      rating: 4.9,
      cityId: kyoto.id,
    },
    {
      name: 'Gion Historic Lantern Walking Tour',
      description: 'Atmospheric evening walk through preservation quarters, wooden machiya houses, and lantern-lit stone alleys.',
      category: 'CULTURE',
      durationHours: 2.0,
      estimatedCost: 30,
      imageUrl: 'https://images.unsplash.com/photo-1528164344705-475426879c0d?auto=format&fit=crop&w=800&q=80',
      rating: 4.7,
      cityId: kyoto.id,
    },
    {
      name: 'Kiyomizu-dera Cliffside Temple',
      description: 'Ancient wooden temple built on the slopes of Mount Otowa with a vast veranda offering sweeping vistas over Kyoto.',
      category: 'CULTURE',
      durationHours: 2.0,
      estimatedCost: 4,
      imageUrl: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=800&q=80',
      rating: 4.8,
      cityId: kyoto.id,
    },
  ];

  // 4. Create Activities for Osaka
  const osakaActivities = [
    {
      name: 'Osaka Castle & Surrounding Park',
      description: 'Magnificent five-story castle fortress reconstructed with museum displays, stone ramparts, and panoramic observation deck.',
      category: 'SIGHTSEEING',
      durationHours: 2.5,
      estimatedCost: 6,
      imageUrl: 'https://images.unsplash.com/photo-1590559899731-a3f07b743759?auto=format&fit=crop&w=800&q=80',
      rating: 4.6,
      cityId: osaka.id,
    },
    {
      name: 'Dotonbori Street Food & Canal Cruise',
      description: 'Marvel at gigantic Glico Running Man and moving mechanical crab signs while feasting on hot takoyaki and okonomiyaki.',
      category: 'FOOD',
      durationHours: 3.0,
      estimatedCost: 35,
      imageUrl: 'https://images.unsplash.com/photo-1533050487297-09b450131914?auto=format&fit=crop&w=800&q=80',
      rating: 4.8,
      cityId: osaka.id,
    },
    {
      name: 'Universal Studios Japan & Super Nintendo World',
      description: 'World-class theme park featuring immersive Mario Kart rides, Wizarding World of Harry Potter, and thrilling roller coasters.',
      category: 'ADVENTURE',
      durationHours: 7.0,
      estimatedCost: 80,
      imageUrl: 'https://images.unsplash.com/photo-1513151233558-d860c5398176?auto=format&fit=crop&w=800&q=80',
      rating: 4.8,
      cityId: osaka.id,
    },
    {
      name: 'Kuromon Ichiba Seafood Market',
      description: 'Historic fresh food market affectionately called Osaka’s Dining Table, featuring grilled sea urchin, giant king crab, and Kobe beef.',
      category: 'FOOD',
      durationHours: 2.0,
      estimatedCost: 45,
      imageUrl: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=800&q=80',
      rating: 4.7,
      cityId: osaka.id,
    },
    {
      name: 'Umeda Sky Building Floating Garden Observatory',
      description: 'Spectacular twin towers connected by an open-air circular sky bridge 173 meters above the city skyline.',
      category: 'SIGHTSEEING',
      durationHours: 1.5,
      estimatedCost: 15,
      imageUrl: 'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=800&q=80',
      rating: 4.6,
      cityId: osaka.id,
    },
  ];

  // 5. Create Activities for Paris
  const parisActivities = [
    {
      name: 'Eiffel Tower Summit Access & Champagne',
      description: 'Ascend Gustave Eiffel’s iron masterpiece to the highest observation platform in the European Union for breathless vistas.',
      category: 'SIGHTSEEING',
      durationHours: 2.5,
      estimatedCost: 32,
      imageUrl: 'https://images.unsplash.com/photo-1511739001486-6bfe10ce785f?auto=format&fit=crop&w=800&q=80',
      rating: 4.8,
      cityId: paris.id,
    },
    {
      name: 'Louvre Museum Masterpieces Tour',
      description: 'Explore the world’s largest art museum, home to the Mona Lisa, Venus de Milo, and the Winged Victory of Samothrace.',
      category: 'CULTURE',
      durationHours: 3.5,
      estimatedCost: 22,
      imageUrl: 'https://images.unsplash.com/photo-1499856871958-5b9627545d1a?auto=format&fit=crop&w=800&q=80',
      rating: 4.9,
      cityId: paris.id,
    },
    {
      name: 'Seine River Sunset Cruise with Wine',
      description: 'Glide past the historic bridges of Paris, Notre-Dame Cathedral, and the illuminated Musée d\'Orsay.',
      category: 'SIGHTSEEING',
      durationHours: 1.5,
      estimatedCost: 20,
      imageUrl: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=800&q=80',
      rating: 4.7,
      cityId: paris.id,
    },
    {
      name: 'Montmartre & Sacré-Cœur Artist Quarter Walk',
      description: 'Wander cobblestone lanes once walked by Picasso and Van Gogh, leading to the dazzling white dome of Sacré-Cœur.',
      category: 'CULTURE',
      durationHours: 2.5,
      estimatedCost: 0,
      imageUrl: 'https://images.unsplash.com/photo-1509299349698-dd22323b5963?auto=format&fit=crop&w=800&q=80',
      rating: 4.8,
      cityId: paris.id,
    },
    {
      name: 'French Macaron & Croissant Baking Class',
      description: 'Hands-on pastry masterclass with an artisan French chef in a cozy Parisian atelier kitchen.',
      category: 'FOOD',
      durationHours: 3.0,
      estimatedCost: 95,
      imageUrl: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=800&q=80',
      rating: 4.9,
      cityId: paris.id,
    },
    {
      name: 'Palace of Versailles Hall of Mirrors Day Trip',
      description: 'Opulent royal residence of King Louis XIV with gold-leaf rooms, monumental fountain gardens, and Marie Antoinette’s estate.',
      category: 'CULTURE',
      durationHours: 5.0,
      estimatedCost: 30,
      imageUrl: 'https://images.unsplash.com/photo-1568084680786-a84f91d1153c?auto=format&fit=crop&w=800&q=80',
      rating: 4.8,
      cityId: paris.id,
    },
  ];

  // Insert all activities
  const allActivities = [
    ...tokyoActivities,
    ...kyotoActivities,
    ...osakaActivities,
    ...parisActivities,
  ];

  for (const act of allActivities) {
    await prisma.activity.create({ data: act });
  }

  console.log(`✅ Seeded ${allActivities.length} activities.`);

  // 6. Create Default Sample Trip for testing Member 3 Flow
  // "Japan Highlights: Tokyo & Kyoto" (Oct 12 to Oct 18)
  const sampleTrip = await prisma.trip.create({
    data: {
      userId: demoUser.id,
      title: 'Japan Autumn Highlights: Tokyo & Kyoto',
      description: 'A 7-day culinary and cultural adventure across Tokyo and Kyoto with temples, sushi classes, and bamboo forests.',
      startDate: '2026-10-12',
      endDate: '2026-10-18',
      budget: 3500,
      coverImage: 'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=1200&q=80',
      isPublic: true,
      shareToken: 'japan-autumn-2026',
    },
  });

  // Create Stops for Trip
  const tokyoStop = await prisma.tripStop.create({
    data: {
      tripId: sampleTrip.id,
      cityId: tokyo.id,
      arrivalDate: '2026-10-12',
      departureDate: '2026-10-15',
      stopOrder: 1,
    },
  });

  const kyotoStop = await prisma.tripStop.create({
    data: {
      tripId: sampleTrip.id,
      cityId: kyoto.id,
      arrivalDate: '2026-10-16',
      departureDate: '2026-10-18',
      stopOrder: 2,
    },
  });

  // Query back created activities to get IDs
  const sensoji = await prisma.activity.findFirst({ where: { name: { contains: 'Senso-ji' } } });
  const tokyoTower = await prisma.activity.findFirst({ where: { name: { contains: 'Tokyo Tower' } } });
  const sushi = await prisma.activity.findFirst({ where: { name: { contains: 'Sushi Making' } } });
  const shibuya = await prisma.activity.findFirst({ where: { name: { contains: 'Shibuya Crossing' } } });
  const teamlab = await prisma.activity.findFirst({ where: { name: { contains: 'teamLab' } } });
  const fushimi = await prisma.activity.findFirst({ where: { name: { contains: 'Fushimi Inari' } } });
  const bamboo = await prisma.activity.findFirst({ where: { name: { contains: 'Arashiyama' } } });

  // Seed sample itinerary items matching the prompt requirement
  if (sensoji && tokyoTower && sushi && shibuya && teamlab && fushimi && bamboo) {
    // Day 1: Oct 12 (Tokyo)
    await prisma.itineraryItem.create({
      data: {
        tripId: sampleTrip.id,
        tripStopId: tokyoStop.id,
        activityId: sensoji.id,
        date: '2026-10-12',
        startTime: '09:00',
        endTime: '11:00',
        notes: 'Arrive early to avoid crowds. Try the ningyo-yaki doll cakes on Nakamise Street!',
        customCost: 0,
        sortOrder: 1,
      },
    });

    await prisma.itineraryItem.create({
      data: {
        tripId: sampleTrip.id,
        tripStopId: tokyoStop.id,
        activityId: tokyoTower.id,
        date: '2026-10-12',
        startTime: '14:00',
        endTime: '16:00',
        notes: 'Book Main Deck tickets online for quick elevator entry.',
        customCost: 25,
        sortOrder: 2,
      },
    });

    await prisma.itineraryItem.create({
      data: {
        tripId: sampleTrip.id,
        tripStopId: tokyoStop.id,
        activityId: sushi.id,
        date: '2026-10-12',
        startTime: '19:00',
        endTime: '22:00',
        notes: 'Wear comfortable casual clothes. Includes omakase dining with sake pairing.',
        customCost: 85,
        sortOrder: 3,
      },
    });

    // Day 2: Oct 13 (Tokyo)
    await prisma.itineraryItem.create({
      data: {
        tripId: sampleTrip.id,
        tripStopId: tokyoStop.id,
        activityId: shibuya.id,
        date: '2026-10-13',
        startTime: '10:00',
        endTime: '11:30',
        notes: 'Check out the view from Shibuya Sky or Starbucks Tsutaya overlooking crossing.',
        customCost: 0,
        sortOrder: 1,
      },
    });

    await prisma.itineraryItem.create({
      data: {
        tripId: sampleTrip.id,
        tripStopId: tokyoStop.id,
        activityId: teamlab.id,
        date: '2026-10-13',
        startTime: '15:00',
        endTime: '17:30',
        notes: 'Need to remove shoes & roll up pants for knee-deep water installations.',
        customCost: 38,
        sortOrder: 2,
      },
    });

    // Day 5: Oct 16 (Kyoto)
    await prisma.itineraryItem.create({
      data: {
        tripId: sampleTrip.id,
        tripStopId: kyotoStop.id,
        activityId: fushimi.id,
        date: '2026-10-16',
        startTime: '08:30',
        endTime: '11:30',
        notes: 'Early morning hike to the Yotsutsuji intersection for views over southern Kyoto.',
        customCost: 0,
        sortOrder: 1,
      },
    });

    // Day 6: Oct 17 (Kyoto)
    await prisma.itineraryItem.create({
      data: {
        tripId: sampleTrip.id,
        tripStopId: kyotoStop.id,
        activityId: bamboo.id,
        date: '2026-10-17',
        startTime: '09:00',
        endTime: '12:00',
        notes: 'Walk through the grove then visit Tenryu-ji Zen garden right next door.',
        customCost: 8,
        sortOrder: 1,
      },
    });
  }

  // Also create a second trip: "Parisian Elegance" (Nov 05 - Nov 09)
  const parisTrip = await prisma.trip.create({
    data: {
      userId: demoUser.id,
      title: 'Romantic Autumn in Paris',
      description: 'Museums, monuments, pastry classes and sunset cruises along the Seine.',
      startDate: '2026-11-05',
      endDate: '2026-11-09',
      budget: 2800,
      coverImage: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=1200&q=80',
      isPublic: true,
      shareToken: 'paris-autumn-2026',
    },
  });

  const parisStop = await prisma.tripStop.create({
    data: {
      tripId: parisTrip.id,
      cityId: paris.id,
      arrivalDate: '2026-11-05',
      departureDate: '2026-11-09',
      stopOrder: 1,
    },
  });

  const eiffel = await prisma.activity.findFirst({ where: { name: { contains: 'Eiffel Tower' } } });
  const louvre = await prisma.activity.findFirst({ where: { name: { contains: 'Louvre' } } });

  if (eiffel && louvre) {
    await prisma.itineraryItem.create({
      data: {
        tripId: parisTrip.id,
        tripStopId: parisStop.id,
        activityId: louvre.id,
        date: '2026-11-06',
        startTime: '10:00',
        endTime: '13:30',
        notes: 'Enter via Carrousel du Louvre to skip the main pyramid queue.',
        customCost: 22,
        sortOrder: 1,
      },
    });

    await prisma.itineraryItem.create({
      data: {
        tripId: parisTrip.id,
        tripStopId: parisStop.id,
        activityId: eiffel.id,
        date: '2026-11-06',
        startTime: '18:00',
        endTime: '20:30',
        notes: 'Watch the hourly sparkle light show at sunset from the top floor.',
        customCost: 32,
        sortOrder: 2,
      },
    });
  }

  // 4. Seed Expenses for Japan Highlights Trip
  await prisma.expense.createMany({
    data: [
      {
        tripId: sampleTrip.id,
        category: 'TRANSPORT',
        description: 'Shinkansen Bullet Train (Tokyo -> Kyoto)',
        amount: 140,
        date: '2026-10-16',
      },
      {
        tripId: sampleTrip.id,
        category: 'TRANSPORT',
        description: 'Tokyo Metro 72-Hour Tourist Subway Pass',
        amount: 15,
        date: '2026-10-12',
      },
      {
        tripId: sampleTrip.id,
        category: 'STAY',
        description: 'Hotel Gracery Shinjuku (4 Nights Tokyo)',
        amount: 620,
        date: '2026-10-12',
      },
      {
        tripId: sampleTrip.id,
        category: 'STAY',
        description: 'Traditional Kyoto Machiya Townhouse (3 Nights)',
        amount: 450,
        date: '2026-10-16',
      },
      {
        tripId: sampleTrip.id,
        category: 'MEAL',
        description: 'Omakase Chef Tasting Dinner in Ginza',
        amount: 180,
        date: '2026-10-13',
      },
      {
        tripId: sampleTrip.id,
        category: 'MEAL',
        description: 'Nishiki Market Street Food Tour Skewers',
        amount: 45,
        date: '2026-10-17',
      },
      {
        tripId: sampleTrip.id,
        category: 'MISCELLANEOUS',
        description: 'Pocket WiFi 5G Rental (7 Days)',
        amount: 35,
        date: '2026-10-12',
      },
      {
        tripId: sampleTrip.id,
        category: 'MISCELLANEOUS',
        description: 'Matcha Tea Sets & Gion Souvenirs',
        amount: 65,
        date: '2026-10-17',
      },
    ],
  });

  // 5. Seed Expenses for Paris Trip
  await prisma.expense.createMany({
    data: [
      {
        tripId: parisTrip.id,
        category: 'TRANSPORT',
        description: 'Eurostar Ticket London to Paris Gare du Nord',
        amount: 185,
        date: '2026-11-05',
      },
      {
        tripId: parisTrip.id,
        category: 'STAY',
        description: 'Boutique Hotel Saint-Germain-des-Prés (4 Nights)',
        amount: 780,
        date: '2026-11-05',
      },
      {
        tripId: parisTrip.id,
        category: 'MEAL',
        description: 'Romantic 3-Course Bistro Dinner with Wine',
        amount: 110,
        date: '2026-11-06',
      },
      {
        tripId: parisTrip.id,
        category: 'MISCELLANEOUS',
        description: 'Paris Museum Pass 4-Day Access',
        amount: 75,
        date: '2026-11-05',
      },
    ],
  });

  // Seed Saved Destinations for demo user (Kyoto & Paris)
  await prisma.savedDestination.createMany({
    data: [
      { userId: demoUser.id, cityId: kyoto.id },
      { userId: demoUser.id, cityId: paris.id },
    ],
  });

  console.log('✅ Seeded sample trips, stops, saved destinations, and initial itinerary items successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Error during seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
