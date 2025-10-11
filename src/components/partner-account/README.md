# Partner Account Creation

This component provides a comprehensive form for creating partner accounts in the PayDirect system.

## Features

- **Complete Form Validation**: All required fields are validated with real-time error messages
- **Responsive Design**: Works seamlessly on desktop and mobile devices
- **Material-UI Integration**: Consistent styling with the rest of the application
- **API Integration**: Ready for backend integration with proper error handling
- **Toast Notifications**: User-friendly success and error messages

## Form Fields

### Business Details
- **Email Address**: Validated email format
- **Legal Name**: Company or individual legal name
- **Business Type**: Dropdown with options (Company, Individual, Partnership, LLC)

### Physical Address
- **Address Line 1**: Street address
- **Address Line 2**: Additional address information (optional)
- **City**: City name
- **State/Province**: State or province
- **Postal Code**: ZIP or postal code
- **Country**: Dropdown with common countries

### Account Information
- **Account Nickname**: Custom identifier for the account

## API Payload Structure

The form generates the following JSON structure for API submission:

```json
{
  "business_details": {
    "email": "contact@acme-business.com",
    "legal_name": "Acme Business Pvt. Ltd.",
    "physical_address": {
      "city": "San Francisco",
      "country": "US",
      "line1": "185 Berry St",
      "line2": "Suite 100",
      "postal_code": "94107",
      "state": "CA"
    },
    "type": "company"
  },
  "nickname": "Acme-Business-USD",
  "type": "partner"
}
```

## Usage

The component is integrated into the main dashboard and can be accessed via:
- Sidebar navigation: "Create Partner Account"
- Direct routing: `/dashboard?component=partner-account`

## Service Integration

The component uses `PartnerAccountService` for API communication:
- `createPartnerAccount()`: Creates a new partner account
- `getPartnerAccounts()`: Fetches all partner accounts
- `getPartnerAccountById()`: Fetches specific account details

## Styling

The component uses CSS modules for styling:
- `partner-account-form.module.css`: Main component styles
- Responsive design with mobile-first approach
- Consistent with application theme

## Validation Rules

- **Email**: Must be a valid email format
- **Legal Name**: Required field
- **Address Fields**: All address fields are required
- **Nickname**: Required field for account identification

## Error Handling

- Real-time validation with field-specific error messages
- API error handling with user-friendly messages
- Loading states during form submission
- Success notifications with form reset

## Future Enhancements

- File upload for business documents
- Multi-step form wizard
- Account preview before submission
- Integration with existing account management
