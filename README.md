# 🌍 GlobeTrotter — Smart Travel Planning MVP

GlobeTrotter is a full-stack collaborative travel planning web application built for seamless trip organization, day-by-day itinerary building, activity discovery, and interactive calendar scheduling.

---

## 👨‍💻 Member 3 Ownership: Activities + Itinerary + Calendar

Member 3 owns the core travel-planning experience:
1. **Activity Database & Catalog** (`Activity` model with 28+ pre-seeded activities across Tokyo, Kyoto, Osaka, Paris, London, Rome).
2. **Activity Search & Filtering** (modal & dedicated explorer, categorized by Sightseeing, Food, Culture, Adventure, Shopping, Nightlife, Nature with cost & duration sliders).
3. **Itinerary Builder** (City stops grouping, Day-by-day timeline & list views, schedule assignment).
4. **Drag & Drop Activity Reordering** (powered by `@dnd-kit/core` & `@dnd-kit/sortable` with persistent `sortOrder`).
5. **Interactive Calendar Schedule** (powered by `@fullcalendar/react` with Month/Week/Day views, drag-to-reschedule, and event quick-editing).
6. **Validation Engine** (Enforcing stop date bounds, `startTime < endTime`, city integrity).

---

## 🛠️ Technology Stack

- **Frontend**: React 18, Vite, Tailwind CSS, Lucide React, Axios, React Hook Form, Zod, `@dnd-kit/core`, `@dnd-kit/sortable`, `@fullcalendar/react`, `@fullcalendar/daygrid`, `@fullcalendar/timegrid`, `@fullcalendar/interaction`.
- **Backend**: Node.js, Express, Prisma ORM, SQLite (`dev.db`).

---

## 🚀 Quick Start

### 1. Install All Dependencies
```bash
npm run install:all
```
*Or individually:*
```bash
cd server && npm install
cd ../client && npm install
```

### 2. Setup Database & Seed
```bash
cd server
npx prisma db push
node prisma/seed.js
```

### 3. Run Development Servers
From root directory:
```bash
npm run dev
```
*Or in separate terminals:*
- **Backend**: `cd server && npm run dev` (Runs on `http://localhost:5000`)
- **Frontend**: `cd client && npm run dev` (Runs on `http://localhost:3000`)

---

## 📡 API Endpoints (Member 3)

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/activities` | Search & filter activities (`cityId`, `search`, `category`, `maxCost`, `maxDuration`, `sortBy`) |
| `GET` | `/api/activities/:id` | Get single activity details |
| `GET` | `/api/trips/:tripId/itinerary` | Get trip stops, day-grouped itinerary items, and summary |
| `POST` | `/api/trips/:tripId/itinerary` | Add activity to stop with date, time, and custom cost validation |
| `PUT` | `/api/itinerary/:id` | Update itinerary item schedule, notes, and custom cost |
| `DELETE` | `/api/itinerary/:id` | Delete itinerary item (preserves master activity) |
| `PUT` | `/api/trips/:tripId/itinerary/reorder` | Batch update `sortOrder` from drag-and-drop operations |

---

## 🧪 Acceptance Test Flow

1. Open `http://localhost:3000/trips/1/itinerary` ("Japan Autumn Highlights: Tokyo & Kyoto").
2. Switch between **List View** and **Timeline View**.
3. Under Stop 1 (Tokyo), click **+ Add Activity**.
4. Search for "Senso-ji" or filter by **Culture & Heritage**.
5. Select the activity, set the date (e.g. Oct 14), set time (13:00 - 15:00), notes, and save.
6. Drag to reorder activities with `@dnd-kit` — sort order is immediately saved.
7. Click the **Pencil** icon on any activity to edit times, notes, or override estimated cost.
8. Click the **Trash** icon to remove an activity.
9. Click **Calendar Schedule** tab (`/trips/1/calendar`) to view all items on the FullCalendar.
10. Click any calendar event to open the Quick Edit dialog.
11. Drag an event on the calendar to reschedule to a new time or date.