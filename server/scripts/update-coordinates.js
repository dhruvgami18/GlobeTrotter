const prisma = require('../config/database');

const cityCoords = {
  Goa: { latitude: 15.2993, longitude: 74.1240 },
  Jaipur: { latitude: 26.9124, longitude: 75.7873 },
  Varanasi: { latitude: 25.3176, longitude: 82.9739 },
  Manali: { latitude: 32.2432, longitude: 77.1892 },
  'Munnar & Kochi': { latitude: 10.0889, longitude: 77.0595 },
  Mumbai: { latitude: 19.0760, longitude: 72.8777 },
  'Delhi & Agra': { latitude: 28.6139, longitude: 77.2090 },
  Paris: { latitude: 48.8566, longitude: 2.3522 },
  Tokyo: { latitude: 35.6762, longitude: 139.6503 },
  Dubai: { latitude: 25.2048, longitude: 55.2708 },
};

const activityCoords = [
  // Goa
  { name: 'Scuba Diving & Snorkeling at Grand Island', latitude: 15.3536, longitude: 73.7667 },
  { name: 'Dudhsagar Waterfalls 4x4 Jungle Safari', latitude: 15.3144, longitude: 74.3143 },
  { name: 'Fort Aguada & Lighthouse Sunset Walk', latitude: 15.4920, longitude: 73.7737 },
  { name: 'Calangute & Baga Water Sports Combo', latitude: 15.5439, longitude: 73.7554 },
  { name: 'Traditional Goan Fish Curry Shack Dinner', latitude: 15.5553, longitude: 73.7517 },
  { name: 'Sahakari Spice Plantation Guided Tour & Buffet', latitude: 15.4206, longitude: 74.0261 },

  // Jaipur
  { name: 'Amber Fort & Palace Heritage Tour', latitude: 26.9855, longitude: 75.8513 },
  { name: 'Hawa Mahal & City Palace Royal Museum', latitude: 26.9239, longitude: 75.8267 },
  { name: 'Nahargarh Fort Sunset & City Skyline', latitude: 26.9373, longitude: 75.8155 },
  { name: 'Chokhi Dhani Cultural Village & Grand Thali', latitude: 26.7663, longitude: 75.8362 },
  { name: 'Johari & Bapu Bazaar Craft & Sweet Trail', latitude: 26.9196, longitude: 75.8242 },

  // Varanasi
  { name: 'Dashashwamedh Ghat Grand Evening Ganga Aarti', latitude: 25.3076, longitude: 83.0107 },
  { name: 'Subah-e-Banaras Sunrise Boat Ride', latitude: 25.2974, longitude: 83.0069 },
  { name: 'Kashi Vishwanath Temple Corridor Darshan', latitude: 25.3109, longitude: 83.0107 },
  { name: 'Banarasi Silk Weavers & Street Food Safari', latitude: 25.3216, longitude: 82.9872 },

  // Manali
  { name: 'Rohtang Pass & Snow Glacier Expedition', latitude: 32.3716, longitude: 77.2466 },
  { name: 'Solang Valley Paragliding High-Flight', latitude: 32.3166, longitude: 77.1575 },
  { name: 'Hadimba Devi Pagoda Temple in Cedar Woods', latitude: 32.2483, longitude: 77.1806 },
  { name: 'Old Manali Riverside Cafe Hopping & Trout Meal', latitude: 32.2530, longitude: 77.1750 },

  // Munnar & Kerala
  { name: 'Kolukkumalai Sunrise 4x4 Tea Estate Safari', latitude: 10.0800, longitude: 77.2100 },
  { name: 'Alleppey Backwaters Private Houseboat Cruise', latitude: 9.4981, longitude: 76.3388 },
  { name: 'Kathakali & Kalaripayattu Live Cultural Night', latitude: 9.9658, longitude: 76.2421 },

  // Delhi & Agra
  { name: 'Taj Mahal Sunrise Guided Monument Tour', latitude: 27.1751, longitude: 78.0421 },
  { name: 'Agra Fort Red Sandstone Royal Citadel', latitude: 27.1795, longitude: 78.0211 },
  { name: 'Chandni Chowk Food Walk & Cycle Rickshaw Safari', latitude: 28.6506, longitude: 77.2303 },
];

async function updateCoordinates() {
  console.log('📍 Updating City and Activity location coordinates (latitude & longitude)...');

  // Update Cities
  for (const [name, coords] of Object.entries(cityCoords)) {
    await prisma.city.updateMany({
      where: { name },
      data: {
        latitude: coords.latitude,
        longitude: coords.longitude,
      },
    });
  }

  // Update Activities
  for (const act of activityCoords) {
    await prisma.activity.updateMany({
      where: { name: act.name },
      data: {
        latitude: act.latitude,
        longitude: act.longitude,
      },
    });
  }

  console.log('✅ Updated all city and activity records with GPS coordinates!');
  await prisma.$disconnect();
}

updateCoordinates().catch((err) => {
  console.error('Error updating coordinates:', err);
  process.exit(1);
});
