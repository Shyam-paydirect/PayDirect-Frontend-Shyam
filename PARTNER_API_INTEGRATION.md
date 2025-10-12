# Partner API Integration

This document describes the integration of the new `/partners` API endpoint into the PayDirect frontend application.

## Overview

The partner account creation functionality has been updated to use the new API endpoint:
- **Endpoint**: `POST http://localhost:7015/partners`
- **Headers**: 
  - `Content-Type: application/json`
  - `Xflow-Account: account_F0A_1759166669125_GuHWS_000` (configurable via localStorage)

## Changes Made

### 1. Service Layer Updates (`src/services/partner-account.service.ts`)

#### New Interface
```typescript
export interface NewPartnerData {
  email: string;
  legal_name: string;
  name: string;
  nickname: string;
  business_type: string;
  city: string;
  country: string;
  address_line1: string;
  postal_code: string;
  state: string;
  account_id: string;
}
```

#### New Methods
- `createPartner(partnerData: NewPartnerData)`: Direct method to create partners using the new API
- `transformToNewFormat(accountData: PartnerAccountData, accountId: string)`: Transforms old format to new API format
- `getXflowAccountHeader()`: Gets Xflow-Account header from localStorage or uses default

#### Updated Configuration
- Base URL changed from `http://localhost:3001/api` to `http://localhost:7015`
- Added support for `Xflow-Account` header

### 2. Form Component Updates (`src/components/partner-account/partner-account-form.tsx`)

#### New Field
- Added `account_id` field to the form
- Added validation for the account_id field
- Updated form data interface to include account_id

#### Form Layout
The account_id field is displayed in the Business Details section alongside other partner information.

## API Request Format

The new API expects the following JSON structure:

```json
{
  "email": "partner@supplier.com",
  "legal_name": "Supplier Company Ltd",
  "name": "Supplier Company",
  "nickname": "Main Supplier 1234567890",
  "business_type": "company",
  "city": "London",
  "country": "GB",
  "address_line1": "456 Business Ave",
  "postal_code": "SW1A 1AA",
  "state": "England",
  "account_id": "acct_1234567890"
}
```

## Configuration

### Xflow-Account Header
The `Xflow-Account` header can be configured in two ways:

1. **Default Value**: `account_F0A_1759166669125_GuHWS_000`
2. **localStorage**: Set `xflow-account` key in localStorage for custom account

```javascript
// Set custom account
localStorage.setItem('xflow-account', 'your_custom_account_id');
```

### Base URL
The base URL can be configured via environment variable:
```bash
NEXT_PUBLIC_API_BASE_URL=http://localhost:7015
```

## Testing

A test script is provided (`test-partner-api.js`) to verify the API integration:

```bash
node test-partner-api.js
```

## Error Handling

The integration includes comprehensive error handling:
- Network errors
- API response errors
- Validation errors
- User-friendly error messages via toast notifications

## Backward Compatibility

The existing `createPartnerAccount` method has been updated to use the new API while maintaining the same interface, ensuring backward compatibility with existing code.

## Usage Example

```typescript
import partnerAccountService from '../services/partner-account.service';

// Create a new partner
const partnerData = {
  business_details: {
    email: 'partner@example.com',
    legal_name: 'Example Company Ltd',
    physical_address: {
      city: 'London',
      country: 'GB',
      line1: '123 Business St',
      line2: '',
      postal_code: 'SW1A 1AA',
      state: 'England'
    },
    type: 'company'
  },
  nickname: 'Example-Partner',
  type: 'partner',
  account_id: 'acct_1234567890'
};

try {
  const response = await partnerAccountService.createPartnerAccount(partnerData);
  console.log('Partner created:', response);
} catch (error) {
  console.error('Error creating partner:', error.message);
}
```
