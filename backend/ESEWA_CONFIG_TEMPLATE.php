<?php
/**
 * eSewa Payment Configuration
 * 
 * UPDATE THESE CREDENTIALS FOR YOUR ENVIRONMENT
 */

// ==========================================
// DEVELOPMENT/TESTING (UAT)
// ==========================================

// For UAT/Testing, use these values:
// define('ESEWA_MERCHANT_CODE', 'EPAYTEST');
// define('ESEWA_API_URL', 'https://uat.esewa.com.np/epay/transaction/initiate/');
// define('ESEWA_VERIFY_URL', 'https://uat.esewa.com.np/epay/transaction/status/');

// Test account credentials:
// Email: test@esewa.com.np
// Password: test

// ==========================================
// PRODUCTION
// ==========================================

// For production, use these values:
// define('ESEWA_MERCHANT_CODE', 'YOUR_ACTUAL_MERCHANT_CODE');
// define('ESEWA_API_URL', 'https://esewa.com.np/epay/transaction/initiate/');
// define('ESEWA_VERIFY_URL', 'https://esewa.com.np/epay/transaction/status/');

// ==========================================
// REDIRECT URLS (Update for your domain)
// ==========================================

// For development:
// define('ESEWA_SUCCESS_URL', 'http://localhost/project/#/payment-success');
// define('ESEWA_FAILURE_URL', 'http://localhost/project/#/payment-failure');

// For production:
// define('ESEWA_SUCCESS_URL', 'https://yourdomain.com/#/payment-success');
// define('ESEWA_FAILURE_URL', 'https://yourdomain.com/#/payment-failure');

// ==========================================
// FILES TO UPDATE
// ==========================================

// 1. backend/initiateEsewaPayment.php
//    Lines 7-9: Update MERCHANT_CODE, SUCCESS_URL, FAILURE_URL, API_URL
//    
// 2. backend/verifyEsewaPayment.php
//    Lines 5-6: Update MERCHANT_CODE, VERIFY_URL

// ==========================================
// TESTING THE INTEGRATION
// ==========================================

// 1. Run migration:
//    Visit: http://localhost/project/backend/migratePayments.php
//
// 2. Test payment flow:
//    - Go to: http://localhost/project/
//    - Select a movie and show
//    - Select seats and click "Book"
//    - Follow payment process on eSewa
//
// 3. Check payment records:
//    - Database: cinema_booking.payments
//    - Check status, amount, and esewa_ref_id

// ==========================================
// SIGNATURE GENERATION (Reference)
// ==========================================

// eSewa uses SHA-256 signature verification
// Fields in order: amt, psc, pdc, txAmt, total, pid, scd
// 
// Example signature generation:
// $message = "500,0,0,0,500,42,EPAYTEST";
// $signature = hash('sha256', $message);

// ==========================================
// TROUBLESHOOTING
// ==========================================

// Issue: "Invalid merchant code"
// Solution: Verify ESEWA_MERCHANT_CODE matches your registered code
//
// Issue: "Signature mismatch"
// Solution: Check field order and values in signature generation
//
// Issue: "Payment verification failed"
// Solution: Check ESEWA_VERIFY_URL and merchant code
// Check payment ID exists in database
//
// Issue: "Redirect not working"
// Solution: Verify ESEWA_SUCCESS_URL and ESEWA_FAILURE_URL
// Check that URLs are accessible from eSewa servers
//

?>
