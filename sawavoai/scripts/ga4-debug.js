// GA4 Debug Utility - Paste this in browser console
(function() {
  console.log('🔍 GA4 Debugging Utility Started');
  console.log('==================================');
  
  // Check if gtag is loaded
  if (typeof window.gtag === 'function') {
    console.log('✅ gtag function is available');
  } else {
    console.log('❌ gtag function NOT available');
    return;
  }
  
  // Check dataLayer
  if (window.dataLayer && window.dataLayer.length > 0) {
    console.log('✅ dataLayer exists with', window.dataLayer.length, 'entries');
    console.log('📊 Latest dataLayer entries:', window.dataLayer.slice(-5));
  } else {
    console.log('❌ dataLayer is empty or missing');
  }
  
  // Check GA measurement ID
  const gaMeasurementId = 'G-09VR8RFFQK';
  console.log('📊 Using measurement ID:', gaMeasurementId);
  
  // Send test events
  console.log('🚀 Sending test events...');
  
  // Event 1: Basic test
  window.gtag('event', 'debug_test_basic', {
    event_category: 'debug',
    event_label: 'console_test',
    value: 1
  });
  
  // Event 2: Page view
  window.gtag('event', 'page_view', {
    page_title: document.title,
    page_location: window.location.href,
    page_path: window.location.pathname
  });
  
  // Event 3: User engagement
  window.gtag('event', 'user_engagement', {
    engagement_time_msec: 5000
  });
  
  console.log('✅ Test events sent! Check GA4 Real-time reports');
  console.log('🌐 Current URL:', window.location.href);
  console.log('📱 User Agent:', navigator.userAgent.substring(0, 80) + '...');
  console.log('🕒 Timestamp:', new Date().toISOString());
  
  // Check for network requests
  setTimeout(() => {
    console.log('💡 TIP: Check Network tab for requests to:');
    console.log('   - www.googletagmanager.com');
    console.log('   - www.google-analytics.com');
    console.log('   - analytics.google.com');
  }, 1000);
  
  console.log('==================================');
  console.log('🎯 Next Steps:');
  console.log('1. Go to Google Analytics Real-time reports');
  console.log('2. Look for active users (should show 1)');
  console.log('3. Check events in real-time stream');
  console.log('4. Verify location shows correctly');
})();
