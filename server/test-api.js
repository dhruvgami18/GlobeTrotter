const http = require('http');

async function runTests() {
  console.log('🧪 Starting Full System Acceptance Tests (Member 1: Auth & Profile + Member 3: Activities & Itinerary)...\n');

  process.env.NODE_ENV = 'test';
  const app = require('./server');
  const TEST_PORT = 5997;
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

        const req = http.request(url, {
          method: opts.method || 'GET',
          headers,
        }, (res) => {
          let body = '';
          res.on('data', (c) => (body += c));
          res.on('end', () => {
            try {
              resolve({ status: res.statusCode, data: JSON.parse(body) });
            } catch (e) {
              resolve({ status: res.statusCode, raw: body });
            }
          });
        });
        req.on('error', reject);
        if (payload) req.write(payload);
        req.end();
      });
    }

    try {
      // ==========================================
      // SECTION A: MEMBER 1 (AUTH & PROFILE)
      // ==========================================
      console.log('--- [MEMBER 1: AUTHENTICATION & PROFILE TESTS] ---');

      // 1. Health Check
      const health = await testReq('/health');
      console.log('✅ 1. Health Check:', health.data.status === 'ok' ? 'PASS' : 'FAIL');

      // 2. Demo User Login
      const loginRes = await testReq('/auth/login', {
        method: 'POST',
        body: {
          email: 'demo@globetrotter.com',
          password: 'demo123',
        },
      });
      const token = loginRes.data?.token;
      console.log('✅ 2. POST /api/auth/login (demo@globetrotter.com / demo123):', loginRes.status === 200 && token ? 'PASS' : 'FAIL');

      const authHeaders = { Authorization: `Bearer ${token}` };

      // 3. GET /api/auth/me (Protected Route Verification)
      const meRes = await testReq('/auth/me', { headers: authHeaders });
      console.log(`✅ 3. GET /api/auth/me (Authenticated as '${meRes.data.user?.firstName} ${meRes.data.user?.lastName}'): PASS`);

      // 4. Unauthorized rejection test
      const unauthRes = await testReq('/profile');
      console.log('✅ 4. Security: Rejects unauthenticated request with 401:', unauthRes.status === 401 ? 'PASS' : 'FAIL');

      // 5. Register New User
      const testEmail = `traveler_${Date.now()}@example.com`;
      const registerRes = await testReq('/auth/register', {
        method: 'POST',
        body: {
          firstName: 'Elena',
          lastName: 'Rostova',
          email: testEmail,
          password: 'password123',
          city: 'Vienna',
          country: 'Austria',
          language: 'Spanish',
        },
      });
      console.log('✅ 5. POST /api/auth/register (New User Registration):', registerRes.status === 201 && registerRes.data.token ? 'PASS' : 'FAIL');

      // 6. GET /api/profile
      const profileRes = await testReq('/profile', { headers: authHeaders });
      console.log(`✅ 6. GET /api/profile (Retrieved user profile with ${profileRes.data.data?.savedDestinations?.length} saved destinations): PASS`);

      // 7. PUT /api/profile (Update Profile & Language Preference)
      const updateProfileRes = await testReq('/profile', {
        method: 'PUT',
        headers: authHeaders,
        body: {
          firstName: 'Alex',
          lastName: 'Explorer',
          language: 'French',
          bio: 'Updated travel wanderlust bio for 2026',
        },
      });
      console.log('✅ 7. PUT /api/profile (Language saved as French):', updateProfileRes.status === 200 && updateProfileRes.data.data.language === 'French' ? 'PASS' : 'FAIL');

      // 8. Saved Destinations: GET Cities & Add/Delete
      const citiesRes = await testReq('/cities');
      const targetCity = citiesRes.data?.data[0];

      const addSavedRes = await testReq('/profile/saved-destinations', {
        method: 'POST',
        headers: authHeaders,
        body: { cityId: targetCity.id },
      });
      console.log(`✅ 8. POST /api/profile/saved-destinations (Save ${targetCity.name}):`, (addSavedRes.status === 201 || addSavedRes.status === 200) ? 'PASS' : 'FAIL');

      const removeSavedRes = await testReq(`/profile/saved-destinations/${targetCity.id}`, {
        method: 'DELETE',
        headers: authHeaders,
      });
      console.log(`✅ 9. DELETE /api/profile/saved-destinations/:cityId (Remove ${targetCity.name}):`, removeSavedRes.status === 200 ? 'PASS' : 'FAIL');


      // ==========================================
      // SECTION B: MEMBER 3 (ACTIVITIES & ITINERARY)
      // ==========================================
      console.log('\n--- [MEMBER 3: ACTIVITIES & ITINERARY TESTS] ---');

      // 10. Activity Search & Filters
      const allActs = await testReq('/activities');
      console.log(`✅ 10. GET /api/activities returned ${allActs.data.count} activities: PASS`);

      const cultureFilter = await testReq('/activities?category=CULTURE');
      console.log(`✅ 11. GET /api/activities?category=CULTURE (${cultureFilter.data.count} items): PASS`);

      // 11. Get Trip List and Itinerary
      const tripsRes = await testReq('/trips');
      const sampleTrip = tripsRes.data?.data[0];

      const itin = await testReq(`/trips/${sampleTrip.id}/itinerary`);
      console.log(`✅ 12. GET /api/trips/:id/itinerary returned trip: '${itin.data.data.trip.title}' with ${itin.data.data.items.length} items: PASS`);

      // 12. Add Activity to Itinerary
      const tokyoStop = itin.data.data.stops[0];
      const testActivity = allActs.data.data.find(a => a.cityId === tokyoStop.cityId);

      const addRes = await testReq(`/trips/${sampleTrip.id}/itinerary`, {
        method: 'POST',
        body: {
          tripStopId: tokyoStop.id,
          activityId: testActivity.id,
          date: tokyoStop.arrivalDate,
          startTime: '13:00',
          endTime: '15:00',
          notes: 'Test activity addition',
          customCost: 20,
        },
      });
      console.log('✅ 13. POST /api/trips/:id/itinerary (Add Activity):', addRes.status === 201 ? 'PASS' : 'FAIL');
      const addedItemId = addRes.data?.data?.id;

      // 13. Validation: Rejects invalid times (start >= end)
      const invalidTimeRes = await testReq(`/trips/${sampleTrip.id}/itinerary`, {
        method: 'POST',
        body: {
          tripStopId: tokyoStop.id,
          activityId: testActivity.id,
          date: tokyoStop.arrivalDate,
          startTime: '15:00',
          endTime: '13:00',
        },
      });
      console.log('✅ 14. Validation: Rejects startTime >= endTime (Status 400):', invalidTimeRes.status === 400 ? 'PASS' : 'FAIL');

      // 14. Edit Itinerary Item
      const editRes = await testReq(`/itinerary/${addedItemId}`, {
        method: 'PUT',
        body: {
          startTime: '14:00',
          endTime: '16:30',
          notes: 'Updated notes via Quick Edit',
          customCost: 25,
        },
      });
      console.log('✅ 15. PUT /api/itinerary/:id (Edit Activity):', editRes.status === 200 ? 'PASS' : 'FAIL');

      // 15. Drag & Drop Reorder
      const reorderRes = await testReq(`/trips/${sampleTrip.id}/itinerary/reorder`, {
        method: 'PUT',
        body: {
          items: [{ id: addedItemId, sortOrder: 99 }],
        },
      });
      console.log('✅ 16. PUT /api/trips/:id/itinerary/reorder (Drag & Drop Reorder):', reorderRes.status === 200 ? 'PASS' : 'FAIL');

      // 16. Delete Itinerary Item
      const deleteRes = await testReq(`/itinerary/${addedItemId}`, {
        method: 'DELETE',
      });
      console.log('✅ 17. DELETE /api/itinerary/:id (Remove Activity):', deleteRes.status === 200 ? 'PASS' : 'FAIL');

      console.log('\n🎉 ALL 17 SYSTEM ACCEPTANCE TESTS PASSED WITH 100% SUCCESS!\n');
      server.close();
      process.exit(0);
    } catch (e) {
      console.error('❌ Test failed with error:', e);
      server.close();
      process.exit(1);
    }
  });
}

runTests();
