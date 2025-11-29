# eSewa Payment Integration - Setup Guide

## Overview
This cinema booking system now includes eSewa payment integration. Customers must complete payment through eSewa before their tickets are confirmed.

## Payment Flow

1. **Seat Selection**: Customer selects seats on the booking page
2. **Payment Initiation**: Customer clicks "Book" button → redirected to payment page
3. **eSewa Payment**: Customer is redirected to eSewa gateway to complete payment
4. **Payment Verification**: After successful payment, booking is confirmed with a confirmation code
5. **Booking Confirmation**: Customer receives confirmation code and can view in their bookings

## Setup Instructions

### 1. Database Setup
Run the migration to create the payments table:
```bash
# Via MySQL:
mysql -u root cinema_booking < backend/database.sql

# Or access migratePayments.php via browser:
http://localhost/project/backend/migratePayments.php
```

### 2. eSewa Configuration

**Update these files with your actual eSewa credentials:**

#### backend/initiateEsewaPayment.php (Line 7-9)
```php
define('ESEWA_MERCHANT_CODE', 'YOUR_MERCHANT_CODE'); // Change from 'EPAYTEST'
define('ESEWA_SUCCESS_URL', 'YOUR_DOMAIN/payment-success');
define('ESEWA_FAILURE_URL', 'YOUR_DOMAIN/payment-failure');
define('ESEWA_API_URL', 'https://esewa.com.np/epay/transaction/initiate/'); // Production URL
```

#### backend/verifyEsewaPayment.php (Line 5-6)
```php
define('ESEWA_MERCHANT_CODE', 'YOUR_MERCHANT_CODE');
define('ESEWA_VERIFY_URL', 'https://esewa.com.np/epay/transaction/status/'); // Production URL
```

### 3. Environment Considerations

**For Development/Testing:**
- Use eSewa UAT (User Acceptance Testing) URLs:
  - Payment: `https://uat.esewa.com.np/epay/transaction/initiate/`
  - Verification: `https://uat.esewa.com.np/epay/transaction/status/`
- Use merchant code: `EPAYTEST`
- Test with eSewa test account credentials

**For Production:**
- Use production URLs (without `uat.`)
- Use your actual merchant code
- Ensure HTTPS is enabled
- Update redirect URLs to your production domain

## Technical Details

### Payment Database Schema

**payments table**:
- `id`: Unique payment ID
- `user_id`: Customer ID
- `show_id`: Show/Cinema ID
- `seat_numbers`: Selected seats (comma-separated)
- `amount`: Payment amount
- `transaction_id`: Unique transaction reference (TXN + timestamp + user_id)
- `esewa_ref_id`: eSewa reference ID (returned after payment)
- `status`: Payment status (pending, completed, failed)
- `created_at`: Payment initiation time
- `completed_at`: Payment completion time

**bookings table updates**:
- Added `payment_id` column linking to payments table
- Bookings are only created after successful payment verification

### API Endpoints

#### 1. Initiate Payment
**POST** `/backend/initiateEsewaPayment.php`

Request:
```json
{
  "user_id": 1,
  "show_id": 5,
  "seat_numbers": ["A1", "A2"],
  "total_price": 500
}
```

Response:
```json
{
  "success": true,
  "payment_id": 42,
  "transaction_id": "TXN1704067200001",
  "esewa_data": {
    "amt": 500,
    "psc": 0,
    "pdc": 0,
    "txAmt": 0,
    "total": 500,
    "tAmt": 500,
    "pid": 42,
    "scd": "EPAYTEST",
    "su": "http://localhost/project/#/payment-success",
    "fu": "http://localhost/project/#/payment-failure",
    "sig": "hash_signature"
  },
  "esewa_url": "https://uat.esewa.com.np/epay/transaction/initiate/"
}
```

#### 2. Verify Payment
**POST** `/backend/verifyEsewaPayment.php`

Request:
```json
{
  "payment_id": 42,
  "esewa_ref_id": "0118K061"
}
```

Response (Success):
```json
{
  "success": true,
  "booking_id": 123,
  "confirmation_code": "ABC1XY2Z",
  "message": "Payment verified and booking confirmed!"
}
```

### Frontend Components

#### 1. SeatBooking.tsx
- Shows seat selection interface
- On "Book" button click, opens PaymentPage
- After payment success, displays PaymentSuccess page

#### 2. PaymentPage.tsx
- Shows payment summary
- "Pay with eSewa" button initiates payment
- Handles eSewa redirect
- Verifies payment upon return from eSewa

#### 3. PaymentSuccess.tsx
- Displays after successful payment
- Shows confirmation code (copyable)
- Options to view bookings or return home

#### 4. PaymentFailure.tsx
- Displays if payment fails
- Allows customer to try again
- Clears seat selection

## Testing Checklist

- [ ] Seat selection works correctly
- [ ] Payment page displays correct amount
- [ ] eSewa redirection works
- [ ] Payment success redirect handled
- [ ] Payment failure redirect handled
- [ ] Confirmation code generated after payment
- [ ] Booking created with payment_id reference
- [ ] Confirmation code visible in MyBookings
- [ ] Admin can see confirmation codes in ViewBookings
- [ ] Seats are locked after successful payment

## Security Considerations

1. **Signature Verification**: Always verify eSewa signatures
2. **HTTPS Only**: Use HTTPS in production
3. **Transaction ID**: Unique per payment to prevent duplicates
4. **Seat Locking**: Database transactions ensure seat locking
5. **User Validation**: Verify user ownership of bookings
6. **Amount Validation**: Verify requested amount matches seat selection

## Troubleshooting

### Payment Not Processing
- Check ESEWA_MERCHANT_CODE is correct
- Verify URLs are accessible from eSewa servers
- Check browser console for errors

### Signature Mismatch
- Ensure all required fields are included in signature generation
- Verify field order matches eSewa documentation
- Check hash algorithm (SHA-256)

### Booking Not Created
- Check payments table has record with status 'completed'
- Verify payment_id is correctly linked
- Check database constraints and foreign keys

### Seats Not Locked
- Ensure transactions are properly committed
- Check seat update query in verifyEsewaPayment.php
- Verify show_id and seat_numbers are correct

## Support Resources

- eSewa Documentation: https://developer.esewa.com.np/
- eSewa Test Credentials: Contact eSewa support
- Database: Check `cinema_booking` database for payment records

