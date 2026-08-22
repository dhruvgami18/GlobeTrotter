const prisma = require('../config/database');

/**
 * GET /api/activities
 * Query parameters:
 *  - cityId: number
 *  - search: string
 *  - category: string (SIGHTSEEING, FOOD, CULTURE, ADVENTURE, SHOPPING, NIGHTLIFE, NATURE)
 *  - maxCost: number
 *  - maxDuration: number
 *  - minRating: number
 *  - sortBy: string ('rating_desc', 'cost_asc', 'cost_desc', 'duration_asc', 'name_asc')
 */
async function getActivities(req, res, next) {
  try {
    const {
      cityId,
      search,
      category,
      maxCost,
      maxDuration,
      minRating,
      sortBy = 'rating_desc',
    } = req.query;

    const where = {};

    if (cityId) {
      where.cityId = parseInt(cityId, 10);
    }

    if (category && category !== 'ALL') {
      where.category = category.toUpperCase();
    }

    if (search && search.trim() !== '') {
      const term = search.trim();
      where.OR = [
        { name: { contains: term } },
        { description: { contains: term } },
      ];
    }

    if (maxCost !== undefined && maxCost !== '') {
      where.estimatedCost = {
        lte: parseFloat(maxCost),
      };
    }

    if (maxDuration !== undefined && maxDuration !== '') {
      where.durationHours = {
        lte: parseFloat(maxDuration),
      };
    }

    if (minRating !== undefined && minRating !== '') {
      where.rating = {
        gte: parseFloat(minRating),
      };
    }

    // Determine sorting
    let orderBy = { rating: 'desc' };
    if (sortBy === 'cost_asc') {
      orderBy = { estimatedCost: 'asc' };
    } else if (sortBy === 'cost_desc') {
      orderBy = { estimatedCost: 'desc' };
    } else if (sortBy === 'duration_asc') {
      orderBy = { durationHours: 'asc' };
    } else if (sortBy === 'duration_desc') {
      orderBy = { durationHours: 'desc' };
    } else if (sortBy === 'name_asc') {
      orderBy = { name: 'asc' };
    }

    const activities = await prisma.activity.findMany({
      where,
      orderBy,
      include: {
        city: {
          select: {
            id: true,
            name: true,
            country: true,
          },
        },
      },
    });

    res.json({
      success: true,
      count: activities.length,
      data: activities,
    });
  } catch (error) {
    next(error);
  }
}

/**
 * GET /api/activities/:id
 */
async function getActivityById(req, res, next) {
  try {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) {
      return res.status(400).json({ success: false, message: 'Invalid activity ID' });
    }

    const activity = await prisma.activity.findUnique({
      where: { id },
      include: {
        city: true,
      },
    });

    if (!activity) {
      return res.status(404).json({ success: false, message: 'Activity not found' });
    }

    res.json({
      success: true,
      data: activity,
    });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  getActivities,
  getActivityById,
};
