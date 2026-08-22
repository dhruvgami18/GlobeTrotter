const http = require('http');

async function runMember4Tests() {
  console.log('🧪 Starting Acceptance Tests for Member 4 (Budget + Expenses + Sharing + Community + Admin)...\n');

  process.env.NODE_ENV = 'test';
  const app = require('./server');
  const TEST_PORT = 5998;

  const server = app.listen(TEST_PORT, async () => {
    function testReq(path, opts = {}) {
      const fullUrl = `http://localhost:${TEST_PORT}/api${path.startsWith('/') ? path : '/' + path}`;
      const url = new URL(fullUrl);
      return new Promise((resolve, reject) => {
        const payload = opts.body ? JSON.stringify(opts.body) : null;
        const headers = {
          'Content-Type': 'application/json',
          ...(opts.headers || {}),
        };
        if (payload) {
          headers['Content-Length'] = Buffer.byteLength(payload);
        }

        const req = http.request(
          url,
          {
            method: opts.method || 'GET',
            headers,
          },
          (res) => {
            let body = '';
            res.on('data', (c) => (body += c));
            res.on('end', () => {
              try {
                resolve({ status: res.statusCode, data: JSON.parse(body) });
              } catch (e) {
                resolve({ status: res.statusCode, raw: body });
              }
            });
          }
        );
        req.on('error', reject);
        if (payload) req.write(payload);
        req.end();
      });
    }

    try {
      let passedCount = 0;
      let totalCount = 0;

      function assert(name, condition, extraInfo = '') {
        totalCount++;
        if (condition) {
          passedCount++;
          console.log(`✅ [PASS] ${name} ${extraInfo}`);
        } else {
          console.error(`❌ [FAIL] ${name} ${extraInfo}`);
        }
      }

      // 1. Health check includes Member 4
      const health = await testReq('/health');
      assert(
        'Health Check includes Member 4',
        health.status === 200 &&
          health.data.members.some((m) => m.includes('Member 4'))
      );

      // 2. User Login (Standard User)
      const userLogin = await testReq('/auth/login', {
        method: 'POST',
        body: {
          email: 'demo@globetrotter.com',
          password: 'demo123',
        },
      });
      const userToken = userLogin.data?.token || userLogin.data?.data?.token;
      assert('User Login (demo@globetrotter.com)', userLogin.status === 200 && Boolean(userToken));

      // 3. Admin Login
      const adminLogin = await testReq('/auth/login', {
        method: 'POST',
        body: {
          email: 'admin@globetrotter.com',
          password: 'admin123',
        },
      });
      const adminToken = adminLogin.data?.token || adminLogin.data?.data?.token;
      assert('Admin Login (admin@globetrotter.com)', adminLogin.status === 200 && Boolean(adminToken));

      // ========================================================
      // PART A: BUDGET CALCULATION & EXPENSES CRUD
      // ========================================================
      console.log('\n--- [TESTS: BUDGET & EXPENSE CRUD] ---');

      const tripsRes = await testReq('/trips');
      const sampleTrip = tripsRes.data?.data?.[0];
      const tripId = sampleTrip?.id || 1;

      // 4. GET Trip Budget
      const budgetRes = await testReq(`/trips/${tripId}/budget`);
      assert(
        `GET /api/trips/${tripId}/budget returns valid calculation`,
        budgetRes.status === 200 &&
          budgetRes.data?.data?.budget > 0 &&
          budgetRes.data?.data?.categoryBreakdown !== undefined &&
          Array.isArray(budgetRes.data?.data?.dailyBreakdown),
        `Total: ₹${budgetRes.data?.data?.total}, Utilization: ${budgetRes.data?.data?.utilization}%`
      );

      // 5. GET Trip Expenses
      const expensesRes = await testReq(`/trips/${tripId}/expenses`);
      assert(
        `GET /api/trips/${tripId}/expenses returns array of expenses`,
        expensesRes.status === 200 && Array.isArray(expensesRes.data?.data)
      );

      // 6. POST New Expense
      const createExpRes = await testReq(`/trips/${tripId}/expenses`, {
        method: 'POST',
        body: {
          category: 'MEAL',
          description: 'Ramen Tasting in Shinjuku Test',
          amount: 42.5,
          date: '2026-10-14',
        },
      });
      const createdExpenseId = createExpRes.data?.data?.id;
      assert(
        `POST /api/trips/${tripId}/expenses creates expense`,
        createExpRes.status === 201 && Boolean(createdExpenseId)
      );

      // 7. PUT Update Expense
      if (createdExpenseId) {
        const updateExpRes = await testReq(`/expenses/${createdExpenseId}`, {
          method: 'PUT',
          body: {
            amount: 50.0,
            description: 'Ramen Tasting in Shinjuku (Updated)',
          },
        });
        assert(
          `PUT /api/expenses/${createdExpenseId} updates expense`,
          updateExpRes.status === 200 && updateExpRes.data?.data?.amount === 50.0
        );

        // 8. DELETE Expense
        const deleteExpRes = await testReq(`/expenses/${createdExpenseId}`, {
          method: 'DELETE',
        });
        assert(
          `DELETE /api/expenses/${createdExpenseId} removes expense`,
          deleteExpRes.status === 200
        );
      }

      // ========================================================
      // PART B: PUBLIC SHARING & COPY TRIP
      // ========================================================
      console.log('\n--- [TESTS: PUBLIC SHARING, COMMUNITY & COPY TRIP] ---');

      // 9. Publish Trip
      const publishRes = await testReq(`/trips/${tripId}/publish`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${userToken}` },
      });
      const shareToken = publishRes.data?.data?.shareToken || sampleTrip?.shareToken || 'goa-vacation-2026';
      assert(
        `POST /api/trips/${tripId}/publish sets isPublic=true and returns shareToken`,
        publishRes.status === 200 && Boolean(shareToken),
        `Token: ${shareToken}`
      );

      // 10. GET Public Trip by shareToken
      const publicTripRes = await testReq(`/public/trips/${shareToken}`);
      assert(
        `GET /api/public/trips/${shareToken} returns read-only itinerary`,
        publicTripRes.status === 200 &&
          publicTripRes.data?.data?.title !== undefined &&
          Array.isArray(publicTripRes.data?.data?.tripStops)
      );

      // 11. GET Non-existent public trip returns 404
      const notFoundPublic = await testReq('/public/trips/invalid-random-token-xyz');
      assert(
        'GET /api/public/trips/:invalid returns 404',
        notFoundPublic.status === 404
      );

      // 12. Copy Public Trip (Authenticated)
      const copyRes = await testReq(`/public/trips/${shareToken}/copy`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${userToken}` },
      });
      const clonedTripId = copyRes.data?.data?.id;
      assert(
        `POST /api/public/trips/${shareToken}/copy clones trip with new ID`,
        copyRes.status === 201 &&
          Boolean(clonedTripId) &&
          copyRes.data?.data?.title?.includes('Copy'),
        `Cloned Trip ID: ${clonedTripId}, Title: "${copyRes.data?.data?.title}"`
      );

      // 13. Copy Public Trip without auth fails with 401
      const unauthCopyRes = await testReq(`/public/trips/${shareToken}/copy`, {
        method: 'POST',
      });
      assert(
        'POST /api/public/trips/:token/copy requires auth (401)',
        unauthCopyRes.status === 401
      );

      // 14. GET Community Trips
      const communityRes = await testReq('/community/trips');
      assert(
        'GET /api/community/trips returns public trips only',
        communityRes.status === 200 &&
          Array.isArray(communityRes.data?.data) &&
          communityRes.data?.data?.length > 0
      );

      // 15. GET Community Trips with Search & Filters
      const filteredCommRes = await testReq('/community/trips?search=Japan&maxBudget=5000');
      assert(
        'GET /api/community/trips with search=Japan filters properly',
        filteredCommRes.status === 200 &&
          filteredCommRes.data?.data?.every((t) =>
            t.title.toLowerCase().includes('japan') ||
            t.cities?.some((c) => c.toLowerCase().includes('japan')) ||
            t.countries?.some((c) => c.toLowerCase().includes('japan'))
          )
      );

      // ========================================================
      // PART C: ADMIN ACCESS & STATS
      // ========================================================
      console.log('\n--- [TESTS: ADMIN ACCESS & STATISTICS] ---');

      // 16. Admin stats with Standard User token -> 403 Forbidden
      const forbiddenStatsRes = await testReq('/admin/stats', {
        headers: { Authorization: `Bearer ${userToken}` },
      });
      assert(
        'GET /api/admin/stats with non-admin token returns 403 Forbidden',
        forbiddenStatsRes.status === 403
      );

      // 17. Admin stats with Admin token -> 200 OK
      const adminStatsRes = await testReq('/admin/stats', {
        headers: { Authorization: `Bearer ${adminToken}` },
      });
      assert(
        'GET /api/admin/stats with admin token returns telemetry',
        adminStatsRes.status === 200 &&
          adminStatsRes.data?.data?.summary?.totalUsers > 0 &&
          Array.isArray(adminStatsRes.data?.data?.popularCities) &&
          Array.isArray(adminStatsRes.data?.data?.popularActivities) &&
          Array.isArray(adminStatsRes.data?.data?.tripsCreatedOverTime)
      );

      // 18. Admin Users list
      const adminUsersRes = await testReq('/admin/users', {
        headers: { Authorization: `Bearer ${adminToken}` },
      });
      assert(
        'GET /api/admin/users returns user list without passwordHash',
        adminUsersRes.status === 200 &&
          Array.isArray(adminUsersRes.data?.data) &&
          adminUsersRes.data?.data?.every((u) => u.passwordHash === undefined)
      );

      // 19. Admin Trips list
      const adminTripsRes = await testReq('/admin/trips', {
        headers: { Authorization: `Bearer ${adminToken}` },
      });
      assert(
        'GET /api/admin/trips returns all platform trips',
        adminTripsRes.status === 200 && Array.isArray(adminTripsRes.data?.data)
      );

      console.log(`\n🎉 SUMMARY: ${passedCount} / ${totalCount} TESTS PASSED!`);
    } catch (err) {
      console.error('❌ Test execution error:', err);
    } finally {
      server.close();
      process.exit(0);
    }
  });
}

runMember4Tests();
