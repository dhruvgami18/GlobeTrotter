const crypto = require('crypto');
const prisma = require('../config/database');

/**
 * Generate a secure random token for public sharing
 */
function generateShareToken() {
  return crypto.randomBytes(6).toString('hex');
}

/**
 * POST /api/trips/:id/publish
 * Publish a trip to make it public and generate a shareToken.
 */
async function publishTrip(req, res, next) {
  try {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) {
      return res.status(400).json({ success: false, message: 'Invalid trip ID' });
    }

    const trip = await prisma.trip.findUnique({ where: { id } });
    if (!trip) {
      return res.status(404).json({ success: false, message: 'Trip not found' });
    }

    const token = trip.shareToken || generateShareToken();

    const updatedTrip = await prisma.trip.update({
      where: { id },
      data: {
        isPublic: true,
        shareToken: token,
      },
    });

    res.json({
      success: true,
      message: 'Trip published successfully! Anyone with the link can view it.',
      data: {
        id: updatedTrip.id,
        title: updatedTrip.title,
        isPublic: updatedTrip.isPublic,
        shareToken: updatedTrip.shareToken,
        shareUrl: `/public/trips/${updatedTrip.shareToken}`,
      },
    });
  } catch (error) {
    next(error);
  }
}

/**
 * POST /api/trips/:id/unpublish
 * Revert a trip back to private mode.
 */
async function unpublishTrip(req, res, next) {
  try {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) {
      return res.status(400).json({ success: false, message: 'Invalid trip ID' });
    }

    const trip = await prisma.trip.findUnique({ where: { id } });
    if (!trip) {
      return res.status(404).json({ success: false, message: 'Trip not found' });
    }

    const updatedTrip = await prisma.trip.update({
      where: { id },
      data: {
        isPublic: false,
      },
    });

    res.json({
      success: true,
      message: 'Trip is now private.',
      data: updatedTrip,
    });
  } catch (error) {
    next(error);
  }
}

/**
 * GET /api/public/trips/:shareToken
 * Fetch public trip details (read-only) using its unique share token.
 */
async function getPublicTrip(req, res, next) {
  try {
    const { shareToken } = req.params;
    if (!shareToken) {
      return res.status(400).json({ success: false, message: 'Share token required' });
    }

    const trip = await prisma.trip.findFirst({
      where: {
        shareToken,
        isPublic: true,
      },
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
        expenses: {
          orderBy: { date: 'asc' },
        },
      },
    });

    if (!trip) {
      return res.status(404).json({
        success: false,
        message: 'Public trip not found or this trip has been set to private.',
      });
    }

    // Calculate summary statistics
    let activitiesCost = 0;
    trip.itineraryItems.forEach((item) => {
      activitiesCost +=
        item.customCost !== null && item.customCost !== undefined
          ? Number(item.customCost)
          : Number(item.activity?.estimatedCost || 0);
    });

    let transportCost = 0;
    let stayCost = 0;
    let mealCost = 0;
    let miscCost = 0;
    let manualActivityCost = 0;

    trip.expenses.forEach((e) => {
      const amt = Number(e.amount) || 0;
      switch ((e.category || '').toUpperCase()) {
        case 'TRANSPORT':
          transportCost += amt;
          break;
        case 'STAY':
          stayCost += amt;
          break;
        case 'MEAL':
          mealCost += amt;
          break;
        case 'ACTIVITY':
          manualActivityCost += amt;
          break;
        case 'MISCELLANEOUS':
        default:
          miscCost += amt;
          break;
      }
    });

    const totalEstimatedCost =
      activitiesCost +
      manualActivityCost +
      transportCost +
      stayCost +
      mealCost +
      miscCost;

    const start = new Date(trip.startDate);
    const end = new Date(trip.endDate);
    const durationDays = !isNaN(start.getTime()) && !isNaN(end.getTime())
      ? Math.max(1, Math.round((end - start) / (1000 * 60 * 60 * 24)) + 1)
      : 1;

    res.json({
      success: true,
      data: {
        ...trip,
        summary: {
          durationDays,
          totalEstimatedCost,
          categoryBreakdown: {
            TRANSPORT: transportCost,
            STAY: stayCost,
            ACTIVITY: activitiesCost + manualActivityCost,
            MEAL: mealCost,
            MISCELLANEOUS: miscCost,
          },
        },
      },
    });
  } catch (error) {
    next(error);
  }
}

/**
 * POST /api/public/trips/:shareToken/copy
 * Deep copy an entire public trip into a new trip for the authenticated user.
 */
async function copyPublicTrip(req, res, next) {
  try {
    const { shareToken } = req.params;
    const currentUserId = req.user?.id;

    if (!currentUserId) {
      return res.status(401).json({
        success: false,
        message: 'Please log in to copy this itinerary to your account.',
      });
    }

    const sourceTrip = await prisma.trip.findFirst({
      where: {
        shareToken,
        isPublic: true,
      },
      include: {
        tripStops: {
          orderBy: { stopOrder: 'asc' },
        },
        itineraryItems: {
          orderBy: { sortOrder: 'asc' },
        },
        expenses: true,
      },
    });

    if (!sourceTrip) {
      return res.status(404).json({
        success: false,
        message: 'Public trip not found or no longer available for copying.',
      });
    }

    // Execute deep copy inside a transaction
    const result = await prisma.$transaction(async (tx) => {
      // 1. Create new Trip
      const newTrip = await tx.trip.create({
        data: {
          userId: currentUserId,
          title: `${sourceTrip.title} Copy`,
          description: sourceTrip.description,
          startDate: sourceTrip.startDate,
          endDate: sourceTrip.endDate,
          budget: sourceTrip.budget,
          coverImage: sourceTrip.coverImage,
          isPublic: false,
          shareToken: null,
        },
      });

      // 2. Copy TripStops and preserve mapping (oldStopId -> newStopId)
      const stopIdMap = new Map();
      for (const stop of sourceTrip.tripStops) {
        const newStop = await tx.tripStop.create({
          data: {
            tripId: newTrip.id,
            cityId: stop.cityId,
            arrivalDate: stop.arrivalDate,
            departureDate: stop.departureDate,
            stopOrder: stop.stopOrder,
          },
        });
        stopIdMap.set(stop.id, newStop.id);
      }

      // 3. Copy ItineraryItems
      for (const item of sourceTrip.itineraryItems) {
        const mappedStopId = stopIdMap.get(item.tripStopId);
        if (mappedStopId) {
          await tx.itineraryItem.create({
            data: {
              tripId: newTrip.id,
              tripStopId: mappedStopId,
              activityId: item.activityId,
              date: item.date,
              startTime: item.startTime,
              endTime: item.endTime,
              notes: item.notes,
              customCost: item.customCost,
              sortOrder: item.sortOrder,
            },
          });
        }
      }

      // 4. Copy Expenses
      for (const exp of sourceTrip.expenses) {
        await tx.expense.create({
          data: {
            tripId: newTrip.id,
            category: exp.category,
            description: exp.description,
            amount: exp.amount,
            date: exp.date,
          },
        });
      }

      return newTrip;
    });

    res.status(201).json({
      success: true,
      message: `Successfully cloned "${sourceTrip.title}" into your trips!`,
      data: result,
    });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  publishTrip,
  unpublishTrip,
  getPublicTrip,
  copyPublicTrip,
};
