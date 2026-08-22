const prisma = require('../config/database');

async function getTrips(req, res, next) {
  try {
    const trips = await prisma.trip.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        tripStops: {
          orderBy: { stopOrder: 'asc' },
          include: { city: true },
        },
        _count: {
          select: { itineraryItems: true },
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

async function getTripById(req, res, next) {
  try {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) {
      return res.status(400).json({ success: false, message: 'Invalid trip ID' });
    }

    const trip = await prisma.trip.findUnique({
      where: { id },
      include: {
        tripStops: {
          orderBy: { stopOrder: 'asc' },
          include: { city: true },
        },
        itineraryItems: {
          orderBy: [
            { date: 'asc' },
            { sortOrder: 'asc' },
            { startTime: 'asc' },
          ],
          include: {
            activity: { include: { city: true } },
            tripStop: { include: { city: true } },
          },
        },
      },
    });

    if (!trip) {
      return res.status(404).json({ success: false, message: 'Trip not found' });
    }

    res.json({
      success: true,
      data: trip,
    });
  } catch (error) {
    next(error);
  }
}

async function createTrip(req, res, next) {
  try {
    const { title, description, startDate, endDate, budget, coverImage, stops } = req.body;

    if (!title || !startDate || !endDate) {
      return res.status(400).json({
        success: false,
        message: 'Title, startDate, and endDate are required.',
      });
    }

    const trip = await prisma.trip.create({
      data: {
        title,
        description: description || null,
        startDate,
        endDate,
        budget: budget ? parseFloat(budget) : 0,
        coverImage: coverImage || 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=1200&q=80',
        tripStops: stops && Array.isArray(stops) && stops.length > 0
          ? {
              create: stops.map((stop, idx) => ({
                cityId: parseInt(stop.cityId, 10),
                arrivalDate: stop.arrivalDate,
                departureDate: stop.departureDate,
                stopOrder: idx + 1,
              })),
            }
          : undefined,
      },
      include: {
        tripStops: {
          include: { city: true },
        },
      },
    });

    res.status(201).json({
      success: true,
      message: 'Trip created successfully',
      data: trip,
    });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  getTrips,
  getTripById,
  createTrip,
};
