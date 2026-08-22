import { z } from 'zod';

export const itineraryItemSchema = z.object({
  tripStopId: z.number({ required_error: 'Please select a city stop' }),
  activityId: z.number({ required_error: 'Please select an activity' }),
  date: z.string().min(1, 'Date is required'),
  startTime: z.string().regex(/^([01]\d|2[0-3]):([0-5]\d)$/, 'Invalid start time (HH:mm)'),
  endTime: z.string().regex(/^([01]\d|2[0-3]):([0-5]\d)$/, 'Invalid end time (HH:mm)'),
  customCost: z.preprocess((val) => (val === '' ? null : Number(val)), z.number().min(0, 'Cost must be non-negative').nullable().optional()),
  notes: z.string().max(500, 'Notes cannot exceed 500 characters').optional(),
}).refine((data) => {
  return data.startTime < data.endTime;
}, {
  message: 'Start time must be before end time',
  path: ['endTime'],
});
