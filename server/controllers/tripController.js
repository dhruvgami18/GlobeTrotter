const crypto = require('crypto');
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

    const shareToken = crypto.randomBytes(6).toString('hex');

    const trip = await prisma.trip.create({
      data: {
        title,
        description: description || null,
        startDate,
        endDate,
        budget: budget ? parseFloat(budget) : 0,
        coverImage: coverImage || 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=1200&q=80',
        shareToken,
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

async function updateTrip(req, res, next) {
  try {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) {
      return res.status(400).json({ success: false, message: 'Invalid trip ID' });
    }

    const { title, description, startDate, endDate, budget, coverImage, isPublic, stops } = req.body;

    const dataToUpdate = {};
    if (title !== undefined) dataToUpdate.title = title;
    if (description !== undefined) dataToUpdate.description = description;
    if (startDate !== undefined) dataToUpdate.startDate = startDate;
    if (endDate !== undefined) dataToUpdate.endDate = endDate;
    if (budget !== undefined) dataToUpdate.budget = parseFloat(budget) || 0;
    if (coverImage !== undefined) dataToUpdate.coverImage = coverImage;
    if (isPublic !== undefined) dataToUpdate.isPublic = Boolean(isPublic);

    const updatedTrip = await prisma.trip.update({
      where: { id },
      data: dataToUpdate,
      include: {
        tripStops: {
          include: { city: true },
        },
      },
    });

    res.json({
      success: true,
      message: 'Trip updated successfully',
      data: updatedTrip,
    });
  } catch (error) {
    next(error);
  }
}

async function deleteTrip(req, res, next) {
  try {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) {
      return res.status(400).json({ success: false, message: 'Invalid trip ID' });
    }

    await prisma.trip.delete({
      where: { id },
    });

    res.json({
      success: true,
      message: 'Trip deleted successfully',
      data: { id },
    });
  } catch (error) {
    next(error);
  }
}

async function addTripStop(req, res, next) {
  try {
    const tripId = parseInt(req.params.tripId, 10);
    const { cityId, arrivalDate, departureDate } = req.body;

    if (!cityId || !arrivalDate || !departureDate) {
      return res.status(400).json({
        success: false,
        message: 'cityId, arrivalDate, and departureDate are required',
      });
    }

    const highestOrder = await prisma.tripStop.findFirst({
      where: { tripId },
      orderBy: { stopOrder: 'desc' },
    });

    const stopOrder = highestOrder ? highestOrder.stopOrder + 1 : 1;

    const newStop = await prisma.tripStop.create({
      data: {
        tripId,
        cityId: parseInt(cityId, 10),
        arrivalDate,
        departureDate,
        stopOrder,
      },
      include: {
        city: true,
      },
    });

    res.status(201).json({
      success: true,
      message: 'City stop added to trip',
      data: newStop,
    });
  } catch (error) {
    next(error);
  }
}

async function publishTrip(req, res, next) {
  try {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) {
      return res.status(400).json({ success: false, message: 'Invalid trip ID' });
    }

    const existing = await prisma.trip.findUnique({ where: { id } });
    if (!existing) {
      return res.status(404).json({ success: false, message: 'Trip not found' });
    }

    let shareToken = existing.shareToken;
    if (!shareToken) {
      shareToken = crypto.randomBytes(6).toString('hex');
    }

    const updated = await prisma.trip.update({
      where: { id },
      data: {
        isPublic: true,
        shareToken,
      },
    });

    res.json({
      success: true,
      message: 'Trip published successfully to community!',
      data: updated,
    });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  getTrips,
  getTripById,
  createTrip,
  updateTrip,
  deleteTrip,
  addTripStop,
  publishTrip,
};
