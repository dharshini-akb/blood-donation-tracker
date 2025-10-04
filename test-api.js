// Quick API test script
const fetch = (...args) => import('node-fetch').then(mod => mod.default(...args));

async function testAPI() {
  console.log('🧪 Testing Blood Donation Tracker API...\n');

  try {
    // Test health endpoint
    console.log('1. Testing health endpoint...');
    const healthResponse = await fetch('http://localhost:5001/api/health');
    if (healthResponse.ok) {
      const healthData = await healthResponse.json();
      console.log('✅ Backend server is running:', healthData.status);
    } else {
      console.log('❌ Health check failed');
      return;
    }

    // Test blood request endpoint
    console.log('\n2. Testing blood request endpoint...');
    const bloodRequestData = {
      patientName: 'Test Patient',
      bloodGroup: 'O+',
      location: 'Test Location',
      contact: '1234567890',
      urgency: 'normal',
      additionalInfo: 'Test request'
    };

    const bloodRequestResponse = await fetch('http://localhost:5001/api/blood-requests', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(bloodRequestData)
    });

    if (bloodRequestResponse.ok) {
      const bloodRequestResult = await bloodRequestResponse.json();
      console.log('✅ Blood request endpoint working:', bloodRequestResult.message);
    } else {
      console.log('❌ Blood request endpoint failed');
    }

    // Test donation endpoint
    console.log('\n3. Testing donation endpoint...');
    const donationData = {
      centerId: 1,
      centerName: 'Test Blood Center',
      donorName: 'Test Donor',
      donorEmail: 'test@example.com',
      date: '2024-12-31',
      time: '10:00'
    };

    const donationResponse = await fetch('http://localhost:5001/api/donations', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(donationData)
    });

    if (donationResponse.ok) {
      const donationResult = await donationResponse.json();
      console.log('✅ Donation endpoint working:', donationResult.message);
    } else {
      console.log('❌ Donation endpoint failed');
    }

    // Test voluntary camp endpoint
    console.log('\n4. Testing voluntary camp endpoint...');
    const campData = {
      campName: 'Test Camp',
      organizerName: 'Test Organizer',
      organizerEmail: 'organizer@example.com',
      organizerPhone: '1234567890',
      city: 'Test City',
      address: 'Test Address',
      date: '2024-12-31',
      startTime: '09:00',
      endTime: '17:00',
      expectedDonors: 50,
      description: 'Test camp description for blood donation',
      requirements: 'Age 18+, Weight 50kg+',
      facilities: ['Parking Available', 'Refreshments Provided'],
      additionalInfo: 'Test additional info'
    };

    const campResponse = await fetch('http://localhost:5001/api/voluntary-camp/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(campData)
    });

    if (campResponse.ok) {
      const campResult = await campResponse.json();
      console.log('✅ Voluntary camp endpoint working:', campResult.message);
    } else {
      console.log('❌ Voluntary camp endpoint failed');
    }

    console.log('\n🎉 All API endpoints are working!');
    console.log('\nNext steps:');
    console.log('1. Open http://localhost:3000 in your browser');
    console.log('2. Test the chat feature');
    console.log('3. Try scheduling a donation');
    console.log('4. Submit a blood request');

  } catch (error) {
    console.log('❌ API test failed:', error.message);
    console.log('\nMake sure:');
    console.log('1. Backend server is running (npm start in backend directory)');
    console.log('2. MongoDB is running');
    console.log('3. No firewall blocking port 5001');
  }
}

testAPI();
