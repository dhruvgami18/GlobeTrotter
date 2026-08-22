# 🌍 GlobeTrotter — Full-Stack Travel Planning & Sharing Platform

> **GlobeTrotter** is a modern, collaborative travel itinerary planning, budgeting, and sharing application. It enables travelers to curate multi-city journeys, schedule day-by-day activities, track real-time budgets with interactive charts, publish shareable itineraries, duplicate community trips, and manage platform telemetry via an administrative console.

---

## 🚀 Key Features by Module

### 🔐 1. Authentication & Profile Management (Member 1)
- **Secure Authentication**: JWT-based session management with bcrypt password hashing.
- **User Dashboard**: Personalized overview displaying upcoming journeys, saved destination bucket lists, and quick-action trip creation modals.
- **Profile Customization**: Update personal bios, avatars, regional languages, and contact details.
- **Destination Bookmarking**: Save and manage favorite world cities to a personal bucket list.

### 📍 2. Destination Catalog & Activity Explorer (Member 2 & 3)
- **Rich Destinations Catalog**: Curated Indian and international destinations (Goa, Jaipur, Varanasi, Manali, Kerala, Mumbai, Delhi, Paris, Tokyo, Dubai).
- **Curated Activity Database**: Filter activities by categories (*Sightseeing, Food, Culture, Adventure, Shopping, Nightlife, Nature*), rating, budget, and duration sliders.
- **Activity Detail Modals**: High-resolution imagery, descriptions, estimated pricing, and duration guides.

### 🗓️ 3. Interactive Itinerary Builder & Calendar (Member 3)
- **City Stops Architecture**: Group day-by-day itineraries by arrival and departure dates.
- **Dual View Modes**: Switch seamlessly between **Card List View** and chronological **Timeline View**.
- **Drag & Drop Reordering**: Reorder activities within or across days powered by `@dnd-kit/core` with persistent server-side `sortOrder`.
- **Interactive FullCalendar View**: Powered by `@fullcalendar/react` with Month, Week, and Day schedules, drag-to-reschedule, and event modals.
- **Cost Overriding**: Set custom actual costs on individual scheduled activities.

### 💰 4. Budget & Financial Analytics Hub (Member 4)
- **Dynamic Cost Engine**: Calculates total estimated costs by combining scheduled activity costs with manual multi-category expenses.
- **5-Category Breakdown**: Tracks *Transport, Stay, Activities, Meals, and Miscellaneous*.
- **Visual Analytics with Recharts**:
  - **Category Pie Chart**: Interactive donut/pie chart displaying spending distribution and percentages.
  - **Daily Spending Bar Chart**: Day-by-day spending chart with an **Average Daily Target** reference line.
- **Over-Budget Advisory Alert**: Non-blocking `⚠️ Budget Advisory` highlighting specific days that exceed the average daily target.
- **Complete Expense CRUD**: Add, edit, search, filter, and delete expense receipts with real-time recalculation.
- **Itemized Daily Accordion**: Expandable day-wise schedule comparing planned activities against logged expenses.

### 🔗 5. Public Sharing, Read-Only Itineraries & Copy Trip (Member 4)
- **Cryptographic Share Tokens**: Trips remain private by default; publishing assigns a secure hexadecimal `shareToken`.
- **Read-Only Public Route (`/public/trips/:shareToken`)**: Clean showcase page displaying route, creator avatar, scheduled activities, and costs with all edit/delete actions removed.
- **One-Click Share Link**: Copy link to clipboard with `navigator.clipboard` or trigger native mobile sharing via the **Web Share API**.
- **Deep-Copy Trip Cloning (`[Copy This Trip]`)**: Deep-clones the source trip, stops, itinerary items, and expenses into the authenticated user's account under `"<Title> Copy"`.

### 🌐 6. Community Hub & Discovery (Member 4)
- **Public Itinerary Grid (`/community`)**: Responsive travel cards showcasing routes (*e.g., Goa → Manali*), durations, creator badges, and budgets.
- **Multi-Faceted Filters**: Search by keyword/city/country, filter by max budget, trip duration, and sort by *Newest*, *Lowest Budget*, or *Popularity*.

### ⚡ 7. Admin Analytics Dashboard & RBAC (Member 4)
- **Role-Based Access Control (`requireAdmin`)**: Restricts `/admin` endpoints and frontend views exclusively to `ADMIN` accounts (`403 Forbidden` for standard users).
- **System Telemetry KPI Cards**: Real-time counters for Total Users, Platform Trips, Public Shared Trips, Activity Catalog, and Cities.
- **Administrative Recharts Analytics**:
  - Trip creations over time (Area chart).
  - Most visited cities by trip stops (Horizontal Bar chart).
  - Most scheduled activities (Bar chart).
  - Public vs. Private trips distribution (Donut chart).
- **User Management Directory**: Search and audit user accounts with safe cascade deletion (protecting admin self-deletion; password hashes never exposed).
- **Trip Auditing Table**: Search, inspect, and remove platform trips across all users.

---

## 🛠️ Technology Stack

| Layer | Technologies |
|---|---|
| **Frontend** | React 18, Vite, Tailwind CSS, Lucide React, Axios, Recharts, `@dnd-kit/core`, `@dnd-kit/sortable`, `@fullcalendar/react`, React Hook Form, Zod |
| **Backend** | Node.js, Express, Prisma ORM, SQLite (`dev.db`), bcryptjs, jsonwebtoken, cors, dotenv |
| **Database** | SQLite (ACID-compliant, local relational database via Prisma Client) |

---

## 📁 Repository Structure

```
GlobeTrotter/
├── package.json                        # Root concurrently runner scripts
├── README.md                           # Documentation & system guide
├── server/
│   ├── .env                            # Environment variables (PORT, DATABASE_URL, JWT_SECRET)
│   ├── server.js                       # Express application bootstrap & route mounting
│   ├── config/
│   │   └── database.js                 # Prisma client instance
│   ├── middleware/
│   │   ├── authMiddleware.js           # JWT authentication middleware
│   │   ├── adminMiddleware.js          # Admin role guard (Member 4)
│   │   └── errorMiddleware.js          # 404 & centralized error handlers
│   ├── controllers/
│   │   ├── authController.js           # Login, registration, password recovery (Member 1)
│   │   ├── profileController.js        # User profiles & saved destinations (Member 1)
│   │   ├── cityController.js           # Cities catalog (Member 2)
│   │   ├── activityController.js       # Activity search & discovery (Member 3)
│   │   ├── itineraryController.js      # Stops, items & drag reorder (Member 3)
│   │   ├── tripController.js           # Trip CRUD operations
│   │   ├── budgetController.js         # Budget analytics & breakdowns (Member 4)
│   │   ├── expenseController.js        # Expense CRUD operations (Member 4)
│   │   ├── publicController.js         # Public sharing & deep copy (Member 4)
│   │   ├── communityController.js      # Community discovery & filtering (Member 4)
│   │   └── adminController.js          # Telemetry & user management (Member 4)
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── profileRoutes.js
│   │   ├── cityRoutes.js
│   │   ├── activityRoutes.js
│   │   ├── itineraryRoutes.js
│   │   ├── tripRoutes.js
│   │   ├── budgetRoutes.js
│   │   ├── expenseRoutes.js
│   │   ├── publicRoutes.js
│   │   ├── communityRoutes.js
│   │   └── adminRoutes.js
│   └── prisma/
│       ├── schema.prisma               # Prisma data schema & models
│       └── seed.js                     # Seed script with users, cities, activities & expenses
└── client/
    ├── index.html                      # HTML entry point
    ├── vite.config.js                  # Vite configuration & dev proxy
    ├── tailwind.config.js              # Tailwind theme configuration
    └── src/
        ├── App.jsx                     # Application routing & layout tree
        ├── context/
        │   └── AuthContext.jsx         # User auth session provider
        ├── routes/
        │   ├── ProtectedRoute.jsx      # Auth route wrapper
        │   └── AdminRoute.jsx          # Admin role route wrapper (Member 4)
        ├── services/
        │   ├── api.js                  # Axios instance with JWT interceptors
        │   ├── authService.js
        │   ├── cityService.js
        │   ├── activityService.js
        │   ├── itineraryService.js
        │   ├── tripService.js
        │   ├── budgetService.js        # Member 4 Budget API client
        │   ├── communityService.js     # Member 4 Community & Sharing API client
        │   └── adminService.js         # Member 4 Admin API client
        ├── components/
        │   ├── layout/                 # Navbar, Sidebar, AppLayout, PageHeader
        │   └── ui/                     # Button, Card, Modal, Input, Badge, ConfirmDialog, Loading
        └── features/
            ├── auth/                   # Login, Register, Forgot Password
            ├── dashboard/              # WelcomeCard, UpcomingTrips, BudgetHighlight, RecommendedCities
            ├── profile/                # Profile view & settings
            ├── activities/             # ActivitySearch, ActivityCard, FilterDrawer
            ├── itinerary/              # ItineraryBuilder, StopSection, ActivityModal, DragDrop
            ├── calendar/               # CalendarView (FullCalendar schedule)
            ├── budget/                 # BudgetTracker, SummaryCards, PieChart, BarChart, ExpenseTable
            ├── community/              # CommunityHub, CommunityCard, Filters, PublicTripView, ShareModal
            └── admin/                  # AdminDashboard, StatCards, AnalyticsCharts, User & Trip Tables
```

---

## ⚡ Quick Start & Installation

### 1. Prerequisites
- **Node.js** (v18 or higher recommended)
- **npm** (v9 or higher)

### 2. Install All Dependencies
From the root directory:
```bash
npm run install:all
```
*Or install client and server packages individually:*
```bash
cd server && npm install
cd ../client && npm install
```

### 3. Initialize & Seed Database
Ensure [`server/.env`](file:///c:/Projects/GlobeTrotter/server/.env) exists with:
```env
PORT=5000
NODE_ENV=development
DATABASE_URL="file:./dev.db"
JWT_SECRET="Your_secret_key_here"
```

Push the Prisma schema and seed initial Indian destinations, trips, activities, and expenses:
```bash
cd server
npx prisma db push
node prisma/seed.js
```

### 4. Start Development Servers
From the root directory:
```bash
npm run dev
```
- 🌐 **Frontend Client**: `http://localhost:3000` (or `http://localhost:5173`)
- ⚙️ **Backend API**: `http://localhost:5000`

---

## 🔑 Pre-Seeded Demo Accounts

| Email | Password | Role | Description |
|---|---|---|---|
| `demo@globetrotter.com` | `demo123` | **USER** | Standard traveler (Rahul Sharma) with pre-loaded trips & expenses |
| `rahul@globetrotter.com` | `rahul123` | **USER** | Alternative standard traveler profile |
| `admin@globetrotter.com` | `admin123` | **ADMIN** | System administrator with full access to `/admin` telemetry |

---

## 📡 REST API Reference

### 🔐 Authentication & Profile (`/api/auth`, `/api/profile`)
| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `POST` | `/api/auth/register` | Public | Create new account |
| `POST` | `/api/auth/login` | Public | Authenticate user & receive JWT |
| `GET` | `/api/auth/me` | User | Get current logged-in user details |
| `GET` | `/api/profile` | User | Fetch full profile data & trips |
| `PUT` | `/api/profile` | User | Update personal details & bio |
| `GET` | `/api/profile/saved-destinations` | User | Get bookmarked cities |
| `POST` | `/api/profile/saved-destinations` | User | Add city to saved destinations |
| `DELETE` | `/api/profile/saved-destinations/:cityId` | User | Remove city from saved destinations |

### 📍 Destinations & Activities (`/api/cities`, `/api/activities`)
| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `GET` | `/api/cities` | Public | List all supported destinations |
| `GET` | `/api/cities/:id` | Public | Get single city details & activities |
| `GET` | `/api/activities` | Public | Search & filter activity catalog |
| `GET` | `/api/activities/:id` | Public | Get single activity details |

### 🗓️ Trips & Itinerary (`/api/trips`, `/api/itinerary`)
| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `GET` | `/api/trips` | Public/User | List trips |
| `POST` | `/api/trips` | User | Create a new trip |
| `GET` | `/api/trips/:id` | Public/User | Get trip by ID with stops & items |
| `GET` | `/api/trips/:tripId/itinerary` | Public/User | Get full itinerary grouped by stops & dates |
| `POST` | `/api/trips/:tripId/itinerary` | User | Add activity to stop with date, time, custom cost |
| `PUT` | `/api/itinerary/:id` | User | Update scheduled item timings/notes/customCost |
| `DELETE` | `/api/itinerary/:id` | User | Remove activity from itinerary |
| `PUT` | `/api/trips/:tripId/itinerary/reorder` | User | Batch update activity `sortOrder` after drag-and-drop |

### 💰 Budget & Expenses (`/api/trips/:tripId/budget`, `/api/expenses`)
| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `GET` | `/api/trips/:tripId/budget` | Public/User | Aggregated budget, 5 categories breakdown, daily timeline, over-budget days |
| `GET` | `/api/trips/:tripId/expenses` | Public/User | Get all manual expenses for a trip |
| `POST` | `/api/trips/:tripId/expenses` | User | Add a new manual expense (`TRANSPORT`, `STAY`, `ACTIVITY`, `MEAL`, `MISCELLANEOUS`) |
| `PUT` | `/api/expenses/:id` | User | Update expense amount, description, category, or date |
| `DELETE` | `/api/expenses/:id` | User | Delete expense record |

### 🌐 Public Sharing & Community (`/api/public`, `/api/community`)
| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `POST` | `/api/trips/:id/publish` | User | Set `isPublic = true` and generate random `shareToken` |
| `POST` | `/api/trips/:id/unpublish` | User | Revert trip back to private |
| `GET` | `/api/public/trips/:shareToken` | Public | Fetch read-only public itinerary (404 if private) |
| `POST` | `/api/public/trips/:shareToken/copy` | User | Deep-copy trip, stops, items, and expenses to current user |
| `GET` | `/api/community/trips` | Public | List public trips with `?search=&country=&maxBudget=&maxDays=&sortBy=` |

### ⚡ Admin Management (`/api/admin`)
| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `GET` | `/api/admin/stats` | **ADMIN** | Telemetry, popular cities/activities, and trip creation timeline |
| `GET` | `/api/admin/users` | **ADMIN** | List all registered users (excluding password hashes) |
| `DELETE` | `/api/admin/users/:id` | **ADMIN** | Delete a user and cascade delete their trips |
| `GET` | `/api/admin/trips` | **ADMIN** | List all platform itineraries |
| `DELETE` | `/api/admin/trips/:id` | **ADMIN** | Delete any trip |

---

## 🧪 Comprehensive Verification & Testing Flow

1. **Explore the Dashboard (`/dashboard`)**:
   - Log in as `demo@globetrotter.com` / `demo123`.
   - View seeded journeys (*Goa Beach & Coastal Adventure*, *Golden Triangle Heritage Odyssey*, *Kerala Backwaters*).
   - Test bookmarking destinations to your bucket list.

2. **Test Itinerary Builder & Drag-and-Drop (`/trips/1/itinerary`)**:
   - Switch between **List View** and **Timeline View**.
   - Click **+ Add Activity** $\rightarrow$ Search for Goa activities $\rightarrow$ schedule date and custom cost.
   - Drag items up/down to reorder with `@dnd-kit`. Sort order is saved immediately.
   - Switch to the **Calendar Schedule** tab (`/trips/1/calendar`) to view events on FullCalendar.

3. **Test Budget Tracker & Analytics (`/trips/1/budget`)**:
   - Inspect summary cards (Total Budget, Estimated Cost, Remaining, Avg/Day, Utilization progress bar).
   - Add a manual Transport expense (*e.g., Goa Flight ₹6,500*) or Stay expense (*₹12,000*).
   - Observe automatic updates across the **Recharts Category Pie Chart** and **Daily Spending Bar Chart**.
   - Verify that exceeding the daily target triggers the **⚠️ Budget Advisory** banner with over-budget amounts.
   - Test filtering and searching in the **Recorded Expenses** table.

4. **Test Public Sharing & Trip Cloning (`/public/trips/:shareToken`)**:
   - Click **Share & Publish** $\rightarrow$ Publish trip and copy the shareable link.
   - Open `/public/trips/goa-vacation-2026` in browser.
   - Verify the read-only state (no editing actions, clean creator profile, route, and activities).
   - Click **[Copy This Trip]** $\rightarrow$ clones the trip into your account with title `"Goa Beach & Coastal Adventure Copy"`.

5. **Test Community Hub (`/community`)**:
   - Open `/community` to view public itineraries.
   - Test search keywords (*"Goa"*, *"Taj"*), country filters, max budget sliders, and sort order.

6. **Test Admin Console & Security (`/admin`)**:
   - Log in as standard user $\rightarrow$ attempt navigating to `/admin` $\rightarrow$ blocked by **403 / Admin Privileges Required**.
   - Log in as `admin@globetrotter.com` / `admin123` $\rightarrow$ access `/admin`.
   - Inspect 5 KPI metric cards, Recharts visualizations, User management directory, and Platform trip table.

---
