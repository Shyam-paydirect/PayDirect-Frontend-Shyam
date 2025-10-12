# API Connection Troubleshooting Guide

## Problem
Your frontend is getting network errors when trying to connect to the server running on IP 43.205.26.213:7015.

## Solutions

### Solution 1: Direct Connection (Current Configuration)

I've configured the API to connect directly to your server at IP 43.205.26.213:7015.

**What I've done:**
- Updated `next.config.ts` to proxy `/api/partners` to `http://43.205.26.213:7015/partners`
- Updated the partner account service to use `http://43.205.26.213:7015` as the base URL

**To use this:**
1. Restart your Next.js development server: `npm run dev`
2. The frontend will now connect directly to `http://43.205.26.213:7015`

### Solution 2: Environment Variable Override (If needed)

If you need to use a different IP address, you can override it:

1. Create a `.env.local` file in your project root:
```bash
NEXT_PUBLIC_API_BASE_URL=http://43.205.26.213:7015
```

2. Restart your development server

### Solution 3: Server CORS Configuration

If you're still getting CORS errors, you need to configure your server to allow requests from your frontend.

Add these headers to your server response:
```
Access-Control-Allow-Origin: http://localhost:3000
Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS
Access-Control-Allow-Headers: Content-Type, Authorization, Xflow-Account
```

### Solution 4: Check Server Status

Run this command to test if your server is accessible:
```bash
curl -X GET http://43.205.26.213:7015/health
```

Or test the partners endpoint:
```bash
curl -X POST http://43.205.26.213:7015/partners \
  -H "Content-Type: application/json" \
  -H "Xflow-Account: account_F0A_1759166669125_GuHWS_000" \
  -d '{
    "email": "test@example.com",
    "legal_name": "Test Company",
    "name": "Test Company",
    "nickname": "test-company",
    "business_type": "company",
    "city": "Test City",
    "country": "US",
    "address_line1": "123 Test St",
    "postal_code": "12345",
    "state": "Test State",
    "account_id": "acct_test123"
  }'
```

## Debugging Steps

1. **Check browser console** for detailed error messages
2. **Check network tab** in browser dev tools to see the actual request/response
3. **Check server logs** for any errors
4. **Verify server is running** on port 7015

## Common Issues

- **CORS errors**: Server needs to allow requests from frontend origin
- **Connection refused**: Server not running or wrong port
- **404 errors**: Endpoint not found on server
- **Timeout errors**: Server taking too long to respond

## Testing

I've added detailed logging to the partner account service. Check the browser console for:
- Base URL being used
- Request details
- Response details
- Error information

This will help identify exactly where the connection is failing.
