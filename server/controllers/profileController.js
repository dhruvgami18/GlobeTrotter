const prisma = require('../config/database');

/**
 * GET /api/profile
 */
async function getProfile(req, res, next) {
  try {
    const userId = req.user.id;

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        phone: true,
        city: true,
        country: true,
        bio: true,
        avatarUrl: true,
        language: true,
        role: true,
        createdAt: true,
        updatedAt: true,
        savedDestinations: {
          include: {
            city: {
              include: {
                _count: { select: { activities: true } },
              },
            },
          },
        },
      },
    });

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    res.json({
      success: true,
      data: user,
    });
  } catch (error) {
    next(error);
  }
}

/**
 * PUT /api/profile
 */
async function updateProfile(req, res, next) {
  try {
    const userId = req.user.id;
    const {
      firstName,
      lastName,
      phone,
      city,
      country,
      bio,
      avatarUrl,
      language,
    } = req.body;

    const updateData = {};
    if (firstName !== undefined) updateData.firstName = firstName.trim();
    if (lastName !== undefined) updateData.lastName = lastName.trim();
    if (phone !== undefined) updateData.phone = phone ? phone.trim() : null;
    if (city !== undefined) updateData.city = city ? city.trim() : null;
    if (country !== undefined) updateData.country = country ? country.trim() : null;
    if (bio !== undefined) updateData.bio = bio ? bio.trim() : null;
    if (avatarUrl !== undefined) updateData.avatarUrl = avatarUrl ? avatarUrl.trim() : null;
    if (language !== undefined) updateData.language = language;

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: updateData,
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        phone: true,
        city: true,
        country: true,
        bio: true,
        avatarUrl: true,
        language: true,
        role: true,
        updatedAt: true,
      },
    });

    res.json({
      success: true,
      message: 'Profile updated successfully',
      data: updatedUser,
    });
  } catch (error) {
    next(error);
  }
}

/**
 * DELETE /api/profile
 */
async function deleteAccount(req, res, next) {
  try {
    const userId = req.user.id;

    // Delete user (cascade handles savedDestinations and user's trips)
    await prisma.user.delete({
      where: { id: userId },
    });

    res.json({
      success: true,
      message: 'Your account has been deleted successfully.',
    });
  } catch (error) {
    next(error);
  }
}

/**
 * GET /api/profile/saved-destinations
 */
async function getSavedDestinations(req, res, next) {
  try {
    const userId = req.user.id;

    const saved = await prisma.savedDestination.findMany({
      where: { userId },
      include: {
        city: {
          include: {
            _count: { select: { activities: true } },
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    res.json({
      success: true,
      count: saved.length,
      data: saved,
    });
  } catch (error) {
    next(error);
  }
}

/**
 * POST /api/profile/saved-destinations
 */
async function addSavedDestination(req, res, next) {
  try {
    const userId = req.user.id;
    const { cityId } = req.body;

    if (!cityId) {
      return res.status(400).json({ success: false, message: 'cityId is required' });
    }

    const cityIdNum = parseInt(cityId, 10);
    const city = await prisma.city.findUnique({ where: { id: cityIdNum } });
    if (!city) {
      return res.status(404).json({ success: false, message: 'City not found' });
    }

    // Upsert or find existing
    const existing = await prisma.savedDestination.findUnique({
      where: {
        userId_cityId: {
          userId,
          cityId: cityIdNum,
        },
      },
    });

    if (existing) {
      return res.json({
        success: true,
        message: `${city.name} is already in your saved destinations.`,
        data: existing,
      });
    }

    const saved = await prisma.savedDestination.create({
      data: {
        userId,
        cityId: cityIdNum,
      },
      include: {
        city: true,
      },
    });

    res.status(201).json({
      success: true,
      message: `${city.name} added to saved destinations!`,
      data: saved,
    });
  } catch (error) {
    next(error);
  }
}

/**
 * DELETE /api/profile/saved-destinations/:cityId
 */
async function removeSavedDestination(req, res, next) {
  try {
    const userId = req.user.id;
    const cityId = parseInt(req.params.cityId, 10);

    if (isNaN(cityId)) {
      return res.status(400).json({ success: false, message: 'Invalid city ID' });
    }

    const existing = await prisma.savedDestination.findUnique({
      where: {
        userId_cityId: {
          userId,
          cityId,
        },
      },
      include: { city: true },
    });

    if (!existing) {
      return res.status(404).json({
        success: false,
        message: 'Destination not in your saved list.',
      });
    }

    await prisma.savedDestination.delete({
      where: {
        userId_cityId: {
          userId,
          cityId,
        },
      },
    });

    res.json({
      success: true,
      message: `${existing.city.name} removed from saved destinations.`,
      data: { cityId },
    });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  getProfile,
  updateProfile,
  deleteAccount,
  getSavedDestinations,
  addSavedDestination,
  removeSavedDestination,
};
