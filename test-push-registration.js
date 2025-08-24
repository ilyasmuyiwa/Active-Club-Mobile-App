#!/usr/bin/env node

/**
 * Simple test script to verify push token registration API
 * Run this with: node test-push-registration.js
 */

const API_BASE_URL = 'https://sportscorner.qa/rest/V1';
const TEST_MOBILE = '97470577110'; // Change this to your test mobile number

async function testPushTokenRegistration() {
  const testData = {
    mobile: TEST_MOBILE,
    pushToken: 'ExponentPushToken[test-token-from-script]',
    deviceType: 'ios'
  };

  console.log('🔔 TEST: Starting push token registration test...');
  console.log('🔔 TEST: API URL:', `${API_BASE_URL}/push-notification/register`);
  console.log('🔔 TEST: Test data:', JSON.stringify(testData, null, 2));

  try {
    const response = await fetch(`${API_BASE_URL}/push-notification/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(testData),
    });

    console.log('🔔 TEST: Response status:', response.status);
    console.log('🔔 TEST: Response status text:', response.statusText);
    
    // Get response headers
    const headers = {};
    response.headers.forEach((value, key) => {
      headers[key] = value;
    });
    console.log('🔔 TEST: Response headers:', JSON.stringify(headers, null, 2));

    const responseText = await response.text();
    console.log('🔔 TEST: Raw response body:', responseText);

    if (response.ok) {
      try {
        const jsonResponse = JSON.parse(responseText);
        console.log('🔔 TEST: SUCCESS! Parsed JSON response:', JSON.stringify(jsonResponse, null, 2));
      } catch (parseError) {
        console.log('🔔 TEST: Response is not valid JSON, but API call succeeded');
      }
    } else {
      console.error('🔔 TEST: API call failed');
      console.error('🔔 TEST: Error details:', responseText);
    }

  } catch (error) {
    console.error('🔔 TEST: Network error or exception:', error.message);
    console.error('🔔 TEST: Full error:', error);
  }
}

// Check if fetch is available (Node 18+)
if (typeof fetch === 'undefined') {
  console.error('🔔 TEST: This script requires Node.js 18+ with built-in fetch');
  console.error('🔔 TEST: Alternatively, install node-fetch: npm install node-fetch');
  process.exit(1);
}

testPushTokenRegistration();