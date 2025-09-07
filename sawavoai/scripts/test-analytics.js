#!/usr/bin/env node

/**
 * Google Analytics 4 CLI Testing Script
 * Usage: node scripts/test-analytics.js [command]
 */

const https = require('https');
const { URL } = require('url');

const GA_MEASUREMENT_ID = 'G-09VR8RFFQK';

// Test if GA4 is receiving data
async function testGA4Connection() {
  console.log('🔍 Testing Google Analytics 4 Connection...');
  console.log(`📊 Measurement ID: ${GA_MEASUREMENT_ID}`);
  
  try {
    // Test if gtag.js script is accessible
    const scriptUrl = `https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`;
    
    const response = await fetch(scriptUrl);
    if (response.ok) {
      console.log('✅ GA4 script is accessible');
      console.log(`📈 Script URL: ${scriptUrl}`);
    } else {
      console.log('❌ GA4 script not accessible');
    }
    
    // Check measurement protocol endpoint
    console.log('\n🔬 Testing Measurement Protocol...');
    console.log('ℹ️  To send test events, you need an API secret from GA4 Admin panel');
    console.log('📝 Go to: Google Analytics > Admin > Data Streams > [Your Stream] > Measurement Protocol > Create');
    
  } catch (error) {
    console.error('❌ Error testing GA4:', error.message);
  }
}

// Test real-time data collection
async function testRealTimeEvents() {
  console.log('📊 Real-time Event Testing Instructions:');
  console.log('1. Open your browser console on your website');
  console.log('2. Run this command to send a test event:');
  console.log(`
gtag('event', 'cli_test_event', {
  'custom_parameter': 'test_from_cli',
  'event_category': 'testing',
  'event_label': 'cli_verification'
});
  `);
  console.log('3. Check GA4 Real-time reports for the event');
}

// Check current configuration
async function checkConfig() {
  console.log('⚙️  Current Analytics Configuration:');
  console.log(`📊 Measurement ID: ${GA_MEASUREMENT_ID}`);
  
  // Check if .env files contain GA settings
  const fs = require('fs');
  const path = require('path');
  
  const envFiles = ['.env', '.env.local', '.env.production'];
  
  for (const envFile of envFiles) {
    const envPath = path.join(process.cwd(), envFile);
    if (fs.existsSync(envPath)) {
      const content = fs.readFileSync(envPath, 'utf8');
      if (content.includes('GA') || content.includes('ANALYTICS')) {
        console.log(`📁 Found analytics config in ${envFile}`);
        const gaLines = content.split('\n').filter(line => 
          line.includes('GA') || line.includes('ANALYTICS')
        );
        gaLines.forEach(line => console.log(`   ${line}`));
      }
    }
  }
}

// Browser-based testing suggestions
function browserTestInstructions() {
  console.log('🌐 Browser Testing Instructions:');
  console.log('1. Open your website in browser');
  console.log('2. Open Developer Tools (F12)');
  console.log('3. Go to Console tab');
  console.log('4. Check for GA initialization:');
  console.log('   window.gtag || window.dataLayer');
  console.log('5. Send test event:');
  console.log(`   gtag('event', 'test_event', { test_param: 'cli_test' })`);
  console.log('6. Check Network tab for GA requests');
  console.log('7. Verify in GA4 Real-time reports');
}

// Main CLI handler
function main() {
  const command = process.argv[2] || 'help';
  
  switch (command) {
    case 'test':
      testGA4Connection();
      break;
    case 'realtime':
      testRealTimeEvents();
      break;
    case 'config':
      checkConfig();
      break;
    case 'browser':
      browserTestInstructions();
      break;
    case 'help':
    default:
      console.log('🔧 Google Analytics 4 CLI Testing Tool');
      console.log('');
      console.log('Commands:');
      console.log('  test     - Test GA4 connection and script accessibility');
      console.log('  realtime - Show real-time event testing instructions');
      console.log('  config   - Check current analytics configuration');
      console.log('  browser  - Show browser-based testing instructions');
      console.log('  help     - Show this help message');
      console.log('');
      console.log('Examples:');
      console.log('  node scripts/test-analytics.js test');
      console.log('  node scripts/test-analytics.js realtime');
      break;
  }
}

main();
