# File Upload API Guide

## The Issue with Content-Type Headers

### ❌ WRONG - Don't do this:
```javascript
const formData = new FormData();
formData.append('file', file);
formData.append('purpose', 'finance_document');

axios.post('/files', formData, {
  headers: {
    'Content-Type': 'application/json'  // ❌ WRONG!
  }
});
```

### ✅ CORRECT - Do this instead:
```javascript
const formData = new FormData();
formData.append('file', file);
formData.append('purpose', 'finance_document');

axios.post('/files', formData, {
  headers: {
    'Xflow-Account': 'account_F0A_1759166669125_GuHWS_000'
    // ✅ Let axios set Content-Type automatically
  }
});
```

## Why This Matters

1. **FormData** contains binary file data and form fields
2. **application/json** is for JSON text data only
3. When you send FormData with `Content-Type: application/json`, the server receives malformed data
4. The server expects `Content-Type: multipart/form-data; boundary=...` for file uploads

## What Axios Does Automatically

When you send FormData without setting Content-Type, axios automatically:
1. Sets `Content-Type: multipart/form-data`
2. Adds a unique boundary parameter
3. Properly formats the request body

## Example of Correct Request

```bash
curl -X POST http://43.205.26.213:7015/files \
  -H "Xflow-Account: account_F0A_1759166669125_GuHWS_000" \
  -F "file=@/path/to/your/document.pdf" \
  -F "purpose=finance_document"
```

The `-F` flag in curl automatically sets the correct Content-Type header.

## Debugging Tips

1. Check browser console for FormData contents
2. Use Network tab to see actual request headers
3. Verify the API endpoint is correct
4. Test with minimal data first (file + purpose only)

