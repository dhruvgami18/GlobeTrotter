const prisma = require('../config/database');

/**
 * Helper to validate time string format HH:mm and start < end
 */
function isValidTimeRange(startTime, endTime) {
  if (!startTime || !endTime) return false;
  // Match HH:mm
  const timeRegex = /^([01]\d|2[0-3]):([0-5]\d)$/;
  if (!timeRegex.test(startTime) || !timeRegex.test(endTime)) {
    return false;
  }
  return startTime < endTime;
}

/**
 * GET /api/trips/:tripId/itinerary
 */
async function getTripItinerary(req, res, next) {
  try {
    const tripId = parseInt(req.params.tripId, 10);
    if (isNaN(tripId)) {
      return res.status(400).json({ success: false, message: 'Invalid trip ID' });
    }

    const trip = await prisma.trip.findUnique({
      where: { id: tripId },
      include: {
        tripStops: {
          orderBy: { stopOrder: 'asc' },
          include: {
            city: true,
          },
        },
      },
    });

    if (!trip) {
      return res.status(404).json({ success: false, message: 'Trip not found' });
    }

    const items = await prisma.itineraryItem.findMany({
      where: { tripId },
      orderBy: [
        { date: 'asc' },
        { sortOrder: 'asc' },
        { startTime: 'asc' },
      ],
      include: {
        activity: {
          include: {
            city: true,
          },
        },
        tripStop: {
          include: {
            city: true,
          },
        },
      },
    });

    // Compute basic summary stats
    const totalActivities = items.length;
    const totalEstimatedCost = items.reduce((sum, item) => {
      const cost = item.customCost !== null && item.customCost !== undefined
        ? item.customCost
        : (item.activity?.estimatedCost || 0);
      return sum + cost;
    }, 0);

    res.json({
      success: true,
      data: {
        trip,
        stops: trip.tripStops,
        items,
        summary: {
          totalActivities,
          totalEstimatedCost,
          totalStops: trip.tripStops.length,
          startDate: trip.startDate,
          endDate: trip.endDate,
        },
      },
    });
  } catch (error) {
    next(error);
  }
}

/**
 * POST /api/trips/:tripId/itinerary
 */
async function addItineraryItem(req, res, next) {
  try {
    const tripId = parseInt(req.params.tripId, 10);
    if (isNaN(tripId)) {
      return res.status(400).json({ success: false, message: 'Invalid trip ID' });
    }

    const {
      tripStopId,
      activityId,
      date,
      startTime,
      endTime,
      notes,
      customCost,
      sortOrder,
    } = req.body;

    if (!tripStopId || !activityId || !date || !startTime || !endTime) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields: tripStopId, activityId, date, startTime, and endTime are required.',
      });
    }

    // 1. Verify trip exists
    const trip = await prisma.trip.findUnique({ where: { id: tripId } });
    if (!trip) {
      return res.status(404).json({ success: false, message: 'Trip not found' });
    }

    // 2. Verify TripStop belongs to this trip
    const tripStop = await prisma.tripStop.findUnique({
      where: { id: parseInt(tripStopId, 10) },
      include: { city: true },
    });

    if (!tripStop || tripStop.tripId !== tripId) {
      return res.status(400).json({
        success: false,
        message: 'Invalid TripStop for this trip',
      });
    }

    // 3. Verify Activity exists & belongs to the Stop's City
    const activity = await prisma.activity.findUnique({
      where: { id: parseInt(activityId, 10) },
    });

    if (!activity) {
      return res.status(404).json({ success: false, message: 'Activity not found' });
    }

    if (activity.cityId !== tripStop.cityId) {
      return res.status(400).json({
        success: false,
        message: `Activity '${activity.name}' belongs to a different city than stop '${tripStop.city.name}'.`,
      });
    }

    // 4. Validate Date is within TripStop bounds
    if (date < tripStop.arrivalDate || date > tripStop.departureDate) {
      return res.status(400).json({
        success: false,
        message: `Selected date (${date}) is outside stop date range (${tripStop.arrivalDate} to ${tripStop.departureDate}).`,
      });
    }

    // 5. Validate startTime < endTime
    if (!isValidTimeRange(startTime, endTime)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid time range: startTime must be earlier than endTime (HH:mm format).',
      });
    }

    // Determine sortOrder if not provided
    let finalSortOrder = sortOrder;
    if (finalSortOrder === undefined || finalSortOrder === null) {
      const highestOrderItem = await prisma.itineraryItem.findFirst({
        where: { tripId, date },
        orderBy: { sortOrder: 'desc' },
      });
      finalSortOrder = highestOrderItem ? highestOrderItem.sortOrder + 1 : 1;
    }

    const newItem = await prisma.itineraryItem.create({
      data: {
        tripId,
        tripStopId: parseInt(tripStopId, 10),
        activityId: parseInt(activityId, 10),
        date,
        startTime,
        endTime,
        notes: notes ? notes.trim() : null,
        customCost: customCost !== undefined && customCost !== null && customCost !== ''
          ? parseFloat(customCost)
          : activity.estimatedCost,
        sortOrder: parseInt(finalSortOrder, 10) || 0,
      },
      include: {
        activity: {
          include: {
            city: true,
          },
        },
        tripStop: {
          include: {
            city: true,
          },
        },
      },
    });

    res.status(201).json({
      success: true,
      message: 'Activity successfully added to itinerary',
      data: newItem,
    });
  } catch (error) {
    next(error);
  }
}

/**
 * PUT /api/itinerary/:id
 */
async function updateItineraryItem(req, res, next) {
  try {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) {
      return res.status(400).json({ success: false, message: 'Invalid itinerary item ID' });
    }

    const existingItem = await prisma.itineraryItem.findUnique({
      where: { id },
      include: {
        tripStop: true,
      },
    });

    if (!existingItem) {
      return res.status(404).json({ success: false, message: 'Itinerary item not found' });
    }

    const {
      date,
      startTime,
      endTime,
      notes,
      customCost,
      sortOrder,
    } = req.body;

    const dataToUpdate = {};

    // Validate date if changed
    if (date !== undefined && date !== null) {
      if (date < existingItem.tripStop.arrivalDate || date > existingItem.tripStop.departureDate) {
        return res.status(400).json({
          success: false,
          message: `Date (${date}) is outside the stop dates (${existingItem.tripStop.arrivalDate} to ${existingItem.tripStop.departureDate}).`,
        });
      }
      dataToUpdate.date = date;
    }

    // Validate times
    const effectiveStart = startTime !== undefined ? startTime : existingItem.startTime;
    const effectiveEnd = endTime !== undefined ? endTime : existingItem.endTime;

    if (!isValidTimeRange(effectiveStart, effectiveEnd)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid time range: startTime must be earlier than endTime.',
      });
    }

    if (startTime !== undefined) dataToUpdate.startTime = startTime;
    if (endTime !== undefined) dataToUpdate.endTime = endTime;
    if (notes !== undefined) dataToUpdate.notes = notes ? notes.trim() : null;
    if (customCost !== undefined) {
      dataToUpdate.customCost = customCost !== null && customCost !== '' ? parseFloat(customCost) : null;
    }
    if (sortOrder !== undefined) {
      dataToUpdate.sortOrder = parseInt(sortOrder, 10);
    }

    const updatedItem = await prisma.itineraryItem.update({
      where: { id },
      data: dataToUpdate,
      include: {
        activity: {
          include: {
            city: true,
          },
        },
        tripStop: {
          include: {
            city: true,
          },
        },
      },
    });

    res.json({
      success: true,
      message: 'Itinerary item updated successfully',
      data: updatedItem,
    });
  } catch (error) {
    next(error);
  }
}

/**
 * DELETE /api/itinerary/:id
 */
async function deleteItineraryItem(req, res, next) {
  try {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) {
      return res.status(400).json({ success: false, message: 'Invalid itinerary item ID' });
    }

    const existingItem = await prisma.itineraryItem.findUnique({ where: { id } });
    if (!existingItem) {
      return res.status(404).json({ success: false, message: 'Itinerary item not found' });
    }

    // Delete the itinerary item only (preserving the master activity)
    await prisma.itineraryItem.delete({
      where: { id },
    });

    res.json({
      success: true,
      message: 'Activity removed from itinerary successfully',
      data: { id },
    });
  } catch (error) {
    next(error);
  }
}

/**
 * PUT /api/trips/:tripId/itinerary/reorder
 */
async function reorderTripItinerary(req, res, next) {
  try {
    const tripId = parseInt(req.params.tripId, 10);
    if (isNaN(tripId)) {
      return res.status(400).json({ success: false, message: 'Invalid trip ID' });
    }

    const { items } = req.body;
    if (!Array.isArray(items)) {
      return res.status(400).json({
        success: false,
        message: 'Expected items array in request body: [{ id, sortOrder, date? }]',
      });
    }

    // Execute atomic transaction to update all sort orders
    const updates = items.map((item) => {
      const updateData = {
        sortOrder: parseInt(item.sortOrder, 10) || 0,
      };
      if (item.date) {
        updateData.date = item.date;
      }
      return prisma.itineraryItem.updateMany({
        where: {
          id: parseInt(item.id, 10),
          tripId,
        },
        data: updateData,
      });
    });

    await prisma.$transaction(updates);

    // Fetch and return reordered list
    const updatedItems = await prisma.itineraryItem.findMany({
      where: { tripId },
      orderBy: [
        { date: 'asc' },
        { sortOrder: 'asc' },
        { startTime: 'asc' },
      ],
      include: {
        activity: {
          include: {
            city: true,
          },
        },
        tripStop: {
          include: {
            city: true,
          },
        },
      },
    });

    res.json({
      success: true,
      message: 'Itinerary reordered successfully',
      data: updatedItems,
    });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  getTripItinerary,
  addItineraryItem,
  updateItineraryItem,
  deleteItineraryItem,
  reorderTripItinerary,
};
