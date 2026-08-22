const prisma = require('../config/database');

/**
 * Generate an array of YYYY-MM-DD date strings between start and end date (inclusive)
 */
function getDatesInRange(startDateStr, endDateStr) {
  const dates = [];
  const curr = new Date(startDateStr);
  const end = new Date(endDateStr);

  if (isNaN(curr.getTime()) || isNaN(end.getTime())) {
    return [startDateStr];
  }

  while (curr <= end) {
    dates.push(curr.toISOString().split('T')[0]);
    curr.setDate(curr.getDate() + 1);
  }

  return dates.length > 0 ? dates : [startDateStr];
}

/**
 * GET /api/trips/:tripId/budget
 * Dynamic calculation of budget, actual spending, category breakdown,
 * daily spending, and over-budget day alerts.
 */
async function getTripBudget(req, res, next) {
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
      return res.status(404).json({ success: false, message: 'Trip not found' });
    }

    const tripBudget = trip.budget || 0;
    const allDates = getDatesInRange(trip.startDate, trip.endDate);
    const durationDays = Math.max(allDates.length, 1);

    // 1. Calculate Activity Costs from ItineraryItems
    let itineraryActivitiesTotal = 0;
    const itineraryByDate = {};

    trip.itineraryItems.forEach((item) => {
      const cost =
        item.customCost !== null && item.customCost !== undefined
          ? Number(item.customCost)
          : Number(item.activity?.estimatedCost || 0);

      itineraryActivitiesTotal += cost;

      const d = item.date;
      if (!itineraryByDate[d]) {
        itineraryByDate[d] = [];
      }
      itineraryByDate[d].push({
        id: item.id,
        name: item.activity?.name || 'Activity',
        category: item.activity?.category || 'ACTIVITY',
        cost,
        time: item.startTime,
        cityName: item.tripStop?.city?.name || '',
      });
    });

    // 2. Calculate Manual Expenses by Category
    let transportTotal = 0;
    let stayTotal = 0;
    let activityExpensesTotal = 0;
    let mealTotal = 0;
    let miscTotal = 0;
    const expensesByDate = {};

    trip.expenses.forEach((exp) => {
      const amount = Number(exp.amount) || 0;
      const cat = (exp.category || 'MISCELLANEOUS').toUpperCase();

      switch (cat) {
        case 'TRANSPORT':
          transportTotal += amount;
          break;
        case 'STAY':
          stayTotal += amount;
          break;
        case 'ACTIVITY':
          activityExpensesTotal += amount;
          break;
        case 'MEAL':
          mealTotal += amount;
          break;
        case 'MISCELLANEOUS':
        default:
          miscTotal += amount;
          break;
      }

      const d = exp.date;
      if (!expensesByDate[d]) {
        expensesByDate[d] = [];
      }
      expensesByDate[d].push({
        id: exp.id,
        category: cat,
        description: exp.description,
        amount,
      });
    });

    const totalActivities = itineraryActivitiesTotal + activityExpensesTotal;

    const categoryBreakdown = {
      TRANSPORT: transportTotal,
      STAY: stayTotal,
      ACTIVITY: totalActivities,
      MEAL: mealTotal,
      MISCELLANEOUS: miscTotal,
    };

    const total =
      transportTotal + stayTotal + totalActivities + mealTotal + miscTotal;

    const remaining = tripBudget - total;
    const averagePerDay = durationDays > 0 ? total / durationDays : total;
    const averageDailyBudget =
      tripBudget > 0 && durationDays > 0 ? tripBudget / durationDays : 0;
    const utilization =
      tripBudget > 0 ? Number(((total / tripBudget) * 100).toFixed(2)) : 0;

    // 3. Calculate Daily Breakdown and Over-Budget alerts
    const dailyBreakdown = allDates.map((dateStr, index) => {
      const dayActivities = itineraryByDate[dateStr] || [];
      const dayExpenses = expensesByDate[dateStr] || [];

      const dayActivitiesCost = dayActivities.reduce((acc, a) => acc + a.cost, 0);
      const dayExpensesCost = dayExpenses.reduce((acc, e) => acc + e.amount, 0);
      const dayTotal = dayActivitiesCost + dayExpensesCost;

      const isOverBudget =
        averageDailyBudget > 0 && dayTotal > averageDailyBudget;

      return {
        date: dateStr,
        dayNumber: index + 1,
        activitiesCost: dayActivitiesCost,
        expensesCost: dayExpensesCost,
        total: dayTotal,
        averageDailyBudget: Number(averageDailyBudget.toFixed(2)),
        isOverBudget,
        overBudgetAmount: isOverBudget ? Number((dayTotal - averageDailyBudget).toFixed(2)) : 0,
        activities: dayActivities,
        expenses: dayExpenses,
      };
    });

    // Also catch any expenses/activities with dates outside the primary trip range
    const knownDatesSet = new Set(allDates);
    const extraDates = new Set([
      ...Object.keys(itineraryByDate).filter((d) => !knownDatesSet.has(d)),
      ...Object.keys(expensesByDate).filter((d) => !knownDatesSet.has(d)),
    ]);

    extraDates.forEach((dateStr) => {
      const dayActivities = itineraryByDate[dateStr] || [];
      const dayExpenses = expensesByDate[dateStr] || [];
      const dayActivitiesCost = dayActivities.reduce((acc, a) => acc + a.cost, 0);
      const dayExpensesCost = dayExpenses.reduce((acc, e) => acc + e.amount, 0);
      const dayTotal = dayActivitiesCost + dayExpensesCost;

      dailyBreakdown.push({
        date: dateStr,
        dayNumber: 'Extra',
        activitiesCost: dayActivitiesCost,
        expensesCost: dayExpensesCost,
        total: dayTotal,
        averageDailyBudget: Number(averageDailyBudget.toFixed(2)),
        isOverBudget: averageDailyBudget > 0 && dayTotal > averageDailyBudget,
        overBudgetAmount:
          averageDailyBudget > 0 && dayTotal > averageDailyBudget
            ? Number((dayTotal - averageDailyBudget).toFixed(2))
            : 0,
        activities: dayActivities,
        expenses: dayExpenses,
      });
    });

    const overBudgetDays = dailyBreakdown.filter((day) => day.isOverBudget);

    res.json({
      success: true,
      data: {
        tripId: trip.id,
        tripTitle: trip.title,
        startDate: trip.startDate,
        endDate: trip.endDate,
        durationDays,
        budget: tripBudget,
        total,
        remaining,
        averagePerDay: Number(averagePerDay.toFixed(2)),
        averageDailyBudget: Number(averageDailyBudget.toFixed(2)),
        utilization,
        categoryBreakdown,
        dailyBreakdown,
        overBudgetDays,
        itemizedSummary: {
          itineraryActivitiesCost: itineraryActivitiesTotal,
          manualExpensesCost:
            transportTotal + stayTotal + activityExpensesTotal + mealTotal + miscTotal,
        },
      },
    });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  getTripBudget,
};
