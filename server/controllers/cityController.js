const prisma = require('../config/database');

async function getCities(req, res, next) {
  try {
    const { search } = req.query;
    const where = {};
    if (search) {
      where.OR = [
        { name: { contains: search } },
        { country: { contains: search } },
      ];
    }

    const cities = await prisma.city.findMany({
      where,
      orderBy: { name: 'asc' },
      include: {
        _count: {
          select: { activities: true },
        },
      },
    });

    res.json({
      success: true,
      data: cities,
    });
  } catch (error) {
    next(error);
  }
}

async function getCityById(req, res, next) {
  try {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) {
      return res.status(400).json({ success: false, message: 'Invalid city ID' });
    }

    const city = await prisma.city.findUnique({
      where: { id },
      include: {
        activities: true,
      },
    });

    if (!city) {
      return res.status(404).json({ success: false, message: 'City not found' });
    }

    res.json({
      success: true,
      data: city,
    });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  getCities,
  getCityById,
};
