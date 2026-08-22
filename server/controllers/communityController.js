const prisma = require('../config/database');

/**
 * Helper to calculate trip duration in days
 */
function calculateTripDuration(startDateStr, endDateStr) {
  const start = new Date(startDateStr);
  const end = new Date(endDateStr);
  if (isNaN(start.getTime()) || isNaN(end.getTime())) return 1;
  return Math.max(1, Math.round((end - start) / (1000 * 60 * 60 * 24)) + 1);
}

/**
 * GET /api/community/trips
 * List all publicly shared itineraries with search, filter, and sorting.
 */
async function getCommunityTrips(req, res, next) {
  try {
    const { search, country, maxBudget, maxDays, sortBy } = req.query;

    const whereClause = {
      isPublic: true,
    };

    // Filter by max budget
    if (maxBudget) {
      const parsedMaxBudget = parseFloat(maxBudget);
      if (!isNaN(parsedMaxBudget)) {
        whereClause.budget = { lte: parsedMaxBudget };
      }
    }

    // Filter by country or search text
    const andFilters = [];

    if (country && country.trim()) {
      andFilters.push({
        tripStops: {
          some: {
            city: {
              country: {
                equals: country.trim(),
              },
            },
          },
        },
      });
    }

    if (search && search.trim()) {
      const q = search.trim();
      andFilters.push({
        OR: [
          { title: { contains: q } },
          { description: { contains: q } },
          {
            tripStops: {
              some: {
                city: {
                  OR: [
                    { name: { contains: q } },
                    { country: { contains: q } },
                  ],
                },
              },
            },
          },
        ],
      });
    }

    if (andFilters.length > 0) {
      whereClause.AND = andFilters;
    }

    // Determine Prisma sort order
    let orderBy = { createdAt: 'desc' };
    if (sortBy === 'lowest_budget') {
      orderBy = { budget: 'asc' };
    } else if (sortBy === 'highest_budget') {
      orderBy = { budget: 'desc' };
    } else if (sortBy === 'oldest') {
      orderBy = { createdAt: 'asc' };
    }

    const trips = await prisma.trip.findMany({
      where: whereClause,
      orderBy,
      include: {
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            avatarUrl: true,
            country: true,
          },
        },
        tripStops: {
          orderBy: { stopOrder: 'asc' },
          include: {
            city: true,
          },
        },
        _count: {
          select: {
            itineraryItems: true,
            expenses: true,
          },
        },
      },
    });

    // Map and enrich with duration and stop summaries
    let enrichedTrips = trips.map((trip) => {
      const durationDays = calculateTripDuration(trip.startDate, trip.endDate);
      const citiesList = trip.tripStops.map((stop) => stop.city?.name).filter(Boolean);
      const countriesList = [
        ...new Set(trip.tripStops.map((stop) => stop.city?.country).filter(Boolean)),
      ];

      return {
        id: trip.id,
        title: trip.title,
        description: trip.description,
        startDate: trip.startDate,
        endDate: trip.endDate,
        budget: trip.budget || 0,
        coverImage: trip.coverImage,
        shareToken: trip.shareToken,
        createdAt: trip.createdAt,
        user: trip.user,
        durationDays,
        cities: citiesList,
        countries: countriesList,
        stopsCount: trip.tripStops.length,
        activitiesCount: trip._count.itineraryItems,
        expensesCount: trip._count.expenses,
      };
    });

    // Filter by maxDays in memory if specified
    if (maxDays) {
      const parsedMaxDays = parseInt(maxDays, 10);
      if (!isNaN(parsedMaxDays) && parsedMaxDays > 0) {
        enrichedTrips = enrichedTrips.filter((t) => t.durationDays <= parsedMaxDays);
      }
    }

    // Sort by popularity (activities count) if requested
    if (sortBy === 'popular') {
      enrichedTrips.sort((a, b) => b.activitiesCount - a.activitiesCount);
    }

    res.json({
      success: true,
      data: enrichedTrips,
      count: enrichedTrips.length,
    });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  getCommunityTrips,
};
