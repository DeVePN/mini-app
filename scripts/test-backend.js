#!/usr/bin/env node

/**
 * Backend Integration Test Script
 *
 * Tests the DeVPN backend API to verify it's accessible and returning data
 * Run with: node scripts/test-backend.js
 */

const https = require('https');
const fs = require('fs');
const path = require('path');

// ANSI color codes for terminal output
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
};

// Load environment variables from .env.local
function loadEnv() {
  try {
    const envPath = path.join(__dirname, '..', '.env.local');
    const envContent = fs.readFileSync(envPath, 'utf8');
    const lines = envContent.split('\n');

    for (const line of lines) {
      const trimmed = line.trim();
      if (trimmed && !trimmed.startsWith('#')) {
        const [key, ...valueParts] = trimmed.split('=');
        const value = valueParts.join('=').trim();
        process.env[key.trim()] = value;
      }
    }
  } catch (error) {
    console.log(`${colors.yellow}⚠️  Could not load .env.local${colors.reset}`);
  }
}

// Load env first
loadEnv();

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'https://backend-production-d2656.up.railway.app/api';

console.log(`${colors.bright}${colors.cyan}╔════════════════════════════════════════════╗${colors.reset}`);
console.log(`${colors.bright}${colors.cyan}║  DeVPN Backend Integration Test${colors.reset}           ${colors.bright}${colors.cyan}║${colors.reset}`);
console.log(`${colors.bright}${colors.cyan}╚════════════════════════════════════════════╝${colors.reset}\n`);

console.log(`${colors.blue}Backend URL:${colors.reset} ${BACKEND_URL}\n`);

// Test results storage
const results = {
  passed: 0,
  failed: 0,
  warnings: 0,
};

/**
 * Make HTTP request
 */
function makeRequest(url) {
  return new Promise((resolve, reject) => {
    const startTime = Date.now();

    https.get(url, (res) => {
      let data = '';

      res.on('data', (chunk) => {
        data += chunk;
      });

      res.on('end', () => {
        const responseTime = Date.now() - startTime;
        resolve({
          statusCode: res.statusCode,
          headers: res.headers,
          body: data,
          responseTime,
        });
      });
    }).on('error', (error) => {
      reject(error);
    });
  });
}

/**
 * Test 1: Backend Reachability
 */
async function testBackendReachable() {
  console.log(`${colors.bright}Test 1: Backend Reachability${colors.reset}`);

  try {
    const response = await makeRequest(BACKEND_URL + '/nodes');

    if (response.statusCode === 200) {
      console.log(`${colors.green}✅ Backend is reachable${colors.reset}`);
      console.log(`   Response time: ${response.responseTime}ms`);
      results.passed++;
      return true;
    } else {
      console.log(`${colors.red}❌ Unexpected status code: ${response.statusCode}${colors.reset}`);
      results.failed++;
      return false;
    }
  } catch (error) {
    console.log(`${colors.red}❌ Backend is not reachable${colors.reset}`);
    console.log(`   Error: ${error.message}`);
    results.failed++;
    return false;
  }
}

/**
 * Test 2: Nodes Endpoint
 */
async function testNodesEndpoint() {
  console.log(`\n${colors.bright}Test 2: Nodes Endpoint${colors.reset}`);

  try {
    const response = await makeRequest(BACKEND_URL + '/nodes');

    if (response.statusCode !== 200) {
      console.log(`${colors.red}❌ Nodes endpoint failed (${response.statusCode})${colors.reset}`);
      results.failed++;
      return null;
    }

    // Try to parse JSON
    let data;
    try {
      data = JSON.parse(response.body);
    } catch (e) {
      console.log(`${colors.red}❌ Response is not valid JSON${colors.reset}`);
      console.log(`   Response: ${response.body.substring(0, 100)}...`);
      results.failed++;
      return null;
    }

    console.log(`${colors.green}✅ Nodes endpoint working${colors.reset}`);
    console.log(`   Response is valid JSON`);

    if (Array.isArray(data)) {
      console.log(`${colors.green}✅ Returns array${colors.reset}`);
      console.log(`   Found ${data.length} node(s)`);

      if (data.length === 0) {
        console.log(`${colors.yellow}⚠️  Database is empty (no nodes registered)${colors.reset}`);
        results.warnings++;
      } else {
        results.passed += 2;
      }
    } else {
      console.log(`${colors.red}❌ Response is not an array${colors.reset}`);
      results.failed++;
    }

    results.passed++;
    return data;
  } catch (error) {
    console.log(`${colors.red}❌ Nodes endpoint test failed${colors.reset}`);
    console.log(`   Error: ${error.message}`);
    results.failed++;
    return null;
  }
}

/**
 * Test 3: Data Format Validation
 */
async function testDataFormat(nodes) {
  console.log(`\n${colors.bright}Test 3: Data Format Validation${colors.reset}`);

  if (!nodes || nodes.length === 0) {
    console.log(`${colors.yellow}⚠️  Skipping (no nodes to validate)${colors.reset}`);
    results.warnings++;
    return;
  }

  const sampleNode = nodes[0];
  const requiredFields = [
    'id',
    'region',
    'country',
    'city',
    'endpoint',
    'price_per_gb',
    'price_per_minute',
    'bandwidth_mbps',
  ];

  console.log(`Validating first node...`);

  let allFieldsPresent = true;
  for (const field of requiredFields) {
    if (sampleNode.hasOwnProperty(field)) {
      console.log(`${colors.green}✅ Has field: ${field}${colors.reset}`);
    } else {
      console.log(`${colors.red}❌ Missing field: ${field}${colors.reset}`);
      allFieldsPresent = false;
    }
  }

  if (allFieldsPresent) {
    console.log(`${colors.green}✅ All required fields present${colors.reset}`);
    results.passed++;
  } else {
    console.log(`${colors.red}❌ Some required fields missing${colors.reset}`);
    results.failed++;
  }

  // Check data types
  console.log(`\nValidating field types...`);

  if (typeof sampleNode.id === 'number') {
    console.log(`${colors.green}✅ ID is number (will be transformed to string)${colors.reset}`);
    results.passed++;
  } else {
    console.log(`${colors.red}❌ ID is not a number: ${typeof sampleNode.id}${colors.reset}`);
    results.failed++;
  }

  if (typeof sampleNode.price_per_gb === 'string') {
    console.log(`${colors.green}✅ price_per_gb is string (nanoTON)${colors.reset}`);
    results.passed++;
  } else {
    console.log(`${colors.yellow}⚠️  price_per_gb should be string, got: ${typeof sampleNode.price_per_gb}${colors.reset}`);
    results.warnings++;
  }
}

/**
 * Test 4: CORS Configuration
 */
async function testCORS() {
  console.log(`\n${colors.bright}Test 4: CORS Configuration${colors.reset}`);

  try {
    const response = await makeRequest(BACKEND_URL + '/nodes');

    const corsHeader = response.headers['access-control-allow-origin'];

    if (corsHeader) {
      console.log(`${colors.green}✅ CORS headers present${colors.reset}`);
      console.log(`   Access-Control-Allow-Origin: ${corsHeader}`);

      if (corsHeader === '*' || corsHeader.includes('localhost')) {
        console.log(`${colors.green}✅ Allows localhost (good for development)${colors.reset}`);
        results.passed++;
      } else {
        console.log(`${colors.yellow}⚠️  May not allow localhost${colors.reset}`);
        results.warnings++;
      }
    } else {
      console.log(`${colors.yellow}⚠️  No CORS headers found${colors.reset}`);
      console.log(`   This may cause issues in browser`);
      results.warnings++;
    }

    results.passed++;
  } catch (error) {
    console.log(`${colors.red}❌ CORS test failed${colors.reset}`);
    results.failed++;
  }
}

/**
 * Test 5: Response Time
 */
async function testResponseTime() {
  console.log(`\n${colors.bright}Test 5: Response Time${colors.reset}`);

  try {
    const times = [];
    console.log(`Running 3 requests...`);

    for (let i = 0; i < 3; i++) {
      const response = await makeRequest(BACKEND_URL + '/nodes');
      times.push(response.responseTime);
      console.log(`  Request ${i + 1}: ${response.responseTime}ms`);
    }

    const avgTime = times.reduce((a, b) => a + b, 0) / times.length;
    console.log(`Average response time: ${avgTime.toFixed(0)}ms`);

    if (avgTime < 500) {
      console.log(`${colors.green}✅ Good response time${colors.reset}`);
      results.passed++;
    } else if (avgTime < 1000) {
      console.log(`${colors.yellow}⚠️  Acceptable response time${colors.reset}`);
      results.warnings++;
    } else {
      console.log(`${colors.red}❌ Slow response time${colors.reset}`);
      results.failed++;
    }
  } catch (error) {
    console.log(`${colors.red}❌ Response time test failed${colors.reset}`);
    results.failed++;
  }
}

/**
 * Main test runner
 */
async function runTests() {
  let nodes = null;

  // Run tests sequentially
  const isReachable = await testBackendReachable();

  if (isReachable) {
    nodes = await testNodesEndpoint();
    await testDataFormat(nodes);
    await testCORS();
    await testResponseTime();
  } else {
    console.log(`\n${colors.red}❌ Backend not reachable, skipping remaining tests${colors.reset}`);
  }

  // Print summary
  console.log(`\n${colors.bright}${colors.cyan}╔════════════════════════════════════════════╗${colors.reset}`);
  console.log(`${colors.bright}${colors.cyan}║  Test Summary${colors.reset}                              ${colors.bright}${colors.cyan}║${colors.reset}`);
  console.log(`${colors.bright}${colors.cyan}╚════════════════════════════════════════════╝${colors.reset}\n`);

  console.log(`${colors.green}✅ Passed: ${results.passed}${colors.reset}`);
  console.log(`${colors.red}❌ Failed: ${results.failed}${colors.reset}`);
  console.log(`${colors.yellow}⚠️  Warnings: ${results.warnings}${colors.reset}`);

  console.log();

  if (results.failed === 0) {
    console.log(`${colors.bright}${colors.green}🎉 All tests passed! Integration is working.${colors.reset}\n`);
    process.exit(0);
  } else {
    console.log(`${colors.bright}${colors.red}❌ Some tests failed. Check integration setup.${colors.reset}\n`);
    console.log(`See INTEGRATION_TESTING_GUIDE.md for troubleshooting.\n`);
    process.exit(1);
  }
}

// Run tests
runTests().catch((error) => {
  console.error(`${colors.red}Fatal error:${colors.reset}`, error);
  process.exit(1);
});
