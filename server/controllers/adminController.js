const prisma = require('../config/database');

/**
 * GET /api/admin/stats
 * Aggregates system-wide analytics, popular destinations/activities,
 * trip creations over time, and user engagement metrics.
 */
async function getAdminStats(req, res, next) {
  try {
    const [
      totalUsers,
      totalTrips,
      publicTrips,
      totalActivities,
      totalCities,
      users,
      trips,
      tripStops,
      itineraryItems,
      cities,
      activities,
    ] = await Promise.all([
      prisma.user.count(),
      prisma.trip.count(),
      prisma.trip.count({ where: { isPublic: true } }),
      prisma.activity.count(),
      prisma.city.count(),
      prisma.user.findMany({ select: { id: true, createdAt: true, role: true } }),
      prisma.trip.findMany({
        select: {
          id: true,
          userId: true,
          budget: true,
          isPublic: true,
          createdAt: true,
        },
      }),
      prisma.tripStop.findMany({
        select: { cityId: true },
      }),
      prisma.itineraryItem.findMany({
        select: { activityId: true, tripStop: { select: { city: { select: { name: true } } } } },
      }),
      prisma.city.findMany({
        select: { id: true, name: true, country: true, imageUrl: true },
      }),
      prisma.activity.findMany({
        select: { id: true, name: true, category: true, estimatedCost: true, rating: true, city: { select: { name: true } } },
      }),
    ]);

    // 1. Popular Cities by number of TripStops
    const cityCountMap = {};
    tripStops.forEach((stop) => {
      cityCountMap[stop.cityId] = (cityCountMap[stop.cityId] || 0) + 1;
    });

    const popularCities = cities
      .map((city) => ({
        id: city.id,
        name: city.name,
        country: city.country,
        imageUrl: city.imageUrl,
        stopsCount: cityCountMap[city.id] || 0,
      }))
      .sort((a, b) => b.stopsCount - a.stopsCount)
      .slice(0, 8);

    // 2. Popular Activities by number of ItineraryItems
    const activityCountMap = {};
    itineraryItems.forEach((item) => {
      activityCountMap[item.activityId] = (activityCountMap[item.activityId] || 0) + 1;
    });

    const popularActivities = activities
      .map((act) => ({
        id: act.id,
        name: act.name,
        category: act.category,
        cityName: act.city?.name,
        rating: act.rating,
        estimatedCost: act.estimatedCost,
        itineraryCount: activityCountMap[act.id] || 0,
      }))
      .sort((a, b) => b.itineraryCount - a.itineraryCount)
      .slice(0, 8);

    // 3. Trips Created Over Time (Group by month YYYY-MM)
    const tripsByMonthMap = {};
    trips.forEach((t) => {
      const date = new Date(t.createdAt);
      const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      tripsByMonthMap[key] = (tripsByMonthMap[key] || 0) + 1;
    });

    // Ensure at least last few months exist for aesthetic charting
    const tripsCreatedOverTime = Object.keys(tripsByMonthMap)
      .sort()
      .map((month) => ({
        month,
        trips: tripsByMonthMap[month],
      }));

    if (tripsCreatedOverTime.length === 0) {
      const now = new Date();
      const currentMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
      tripsCreatedOverTime.push({ month: currentMonth, trips: totalTrips });
    }

    // 4. User Engagement Metrics
    const usersWithTrips = new Set(trips.map((t) => t.userId).filter(Boolean)).size;
    const avgTripsPerUser = totalUsers > 0 ? Number((totalTrips / totalUsers).toFixed(2)) : 0;
    const avgStopsPerTrip = totalTrips > 0 ? Number((tripStops.length / totalTrips).toFixed(2)) : 0;
    const privateTrips = totalTrips - publicTrips;

    res.json({
      success: true,
      data: {
        summary: {
          totalUsers,
          totalTrips,
          publicTrips,
          privateTrips,
          totalActivities,
          totalCities,
          totalStops: tripStops.length,
          totalScheduledActivities: itineraryItems.length,
        },
        userEngagement: {
          activeTripCreators: usersWithTrips,
          avgTripsPerUser,
          avgStopsPerTrip,
          publicTripRatio: totalTrips > 0 ? Number(((publicTrips / totalTrips) * 100).toFixed(1)) : 0,
        },
        popularCities,
        popularActivities,
        tripsCreatedOverTime,
      },
    });
  } catch (error) {
    next(error);
  }
}

/**
 * GET /api/admin/users
 * Returns list of users with trip and destination counts (excluding passwordHash)
 */
async function getAdminUsers(req, res, next) {
  try {
    const users = await prisma.user.findMany({
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        role: true,
        phone: true,
        city: true,
        country: true,
        avatarUrl: true,
        language: true,
        createdAt: true,
        _count: {
          select: {
            trips: true,
            savedDestinations: true,
          },
        },
      },
    });

    res.json({
      success: true,
      data: users,
    });
  } catch (error) {
    next(error);
  }
}

/**
 * DELETE /api/admin/users/:id
 * Delete a user from the system. Admin cannot delete themselves.
 */
async function deleteAdminUser(req, res, next) {
  try {
    const userIdToDelete = parseInt(req.params.id, 10);
    if (isNaN(userIdToDelete)) {
      return res.status(400).json({ success: false, message: 'Invalid user ID' });
    }

    if (req.user?.id === userIdToDelete) {
      return res.status(400).json({
        success: false,
        message: 'You cannot delete your own admin account.',
      });
    }

    const user = await prisma.user.findUnique({ where: { id: userIdToDelete } });
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    await prisma.user.delete({ where: { id: userIdToDelete } });

    res.json({
      success: true,
      message: `User ${user.firstName} ${user.lastName} (${user.email}) has been deleted.`,
    });
  } catch (error) {
    next(error);
  }
}

/**
 * GET /api/admin/trips
 * List all trips across all users with creator info and counts
 */
async function getAdminTrips(req, res, next) {
  try {
    const trips = await prisma.trip.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            avatarUrl: true,
          },
        },
        tripStops: {
          orderBy: { stopOrder: 'asc' },
          include: { city: true },
        },
        _count: {
          select: {
            itineraryItems: true,
            expenses: true,
          },
        },
      },
    });

    res.json({
      success: true,
      data: trips,
    });
  } catch (error) {
    next(error);
  }
}

/**
 * DELETE /api/admin/trips/:id
 * Delete any trip
 */
async function deleteAdminTrip(req, res, next) {
  try {
    const tripId = parseInt(req.params.id, 10);
    if (isNaN(tripId)) {
      return res.status(400).json({ success: false, message: 'Invalid trip ID' });
    }

    const trip = await prisma.trip.findUnique({ where: { id: tripId } });
    if (!trip) {
      return res.status(404).json({ success: false, message: 'Trip not found' });
    }

    await prisma.trip.delete({ where: { id: tripId } });

    res.json({
      success: true,
      message: `Trip "${trip.title}" deleted successfully.`,
    });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  getAdminStats,
  getAdminUsers,
  deleteAdminUser,
  getAdminTrips,
  deleteAdminTrip,
};
