# Countdown Timer Database Update Fix

## Issue Description

When the countdown timer was disabled in the PromoBarX editor, the database was not being updated correctly. The `countdown_enabled` field remained set to `1` (enabled) even when the user unchecked the "Enable Countdown Timer" option.

## Root Cause

The issue was in the boolean field sanitization logic in `includes/class-topbar-database.php`. When form data is submitted via AJAX, boolean values are often sent as strings:

- `'true'` for enabled
- `'false'` for disabled

The original code used a simple truthy check:
```php
$sanitized[$field] = $data[$field] ? 1 : 0;
```

This caused problems because:
- The string `'false'` is truthy in PHP (non-empty string)
- So `'false'` was being converted to `1` instead of `0`

## Solution

Updated the boolean field sanitization to properly handle both boolean and string values:

```php
// Sanitize boolean fields
$boolean_fields = ['countdown_enabled', 'close_button_enabled'];
foreach ($boolean_fields as $field) {
    if (isset($data[$field])) {
        // Handle both boolean and string values
        $value = $data[$field];
        if (is_string($value)) {
            // Convert string values to boolean
            $sanitized[$field] = in_array(strtolower($value), ['true', '1', 'yes', 'on']) ? 1 : 0;
        } else {
            // Handle boolean and numeric values
            $sanitized[$field] = $value ? 1 : 0;
        }
    }
}
```

## What This Fix Does

1. **String Detection**: Checks if the value is a string
2. **String Conversion**: For strings, converts common truthy values (`'true'`, `'1'`, `'yes'`, `'on'`) to `1`, everything else to `0`
3. **Boolean/Numeric Handling**: For non-strings, uses the original logic
4. **Comprehensive Coverage**: Handles all common boolean representations

## Testing

The fix was tested with various scenarios:
- ✅ Boolean `true` → Database `1`
- ✅ Boolean `false` → Database `0`
- ✅ String `'true'` → Database `1`
- ✅ String `'false'` → Database `0`
- ✅ String `'1'` → Database `1`
- ✅ String `'0'` → Database `0`
- ✅ Empty string `''` → Database `0`

## Files Modified

- `includes/class-topbar-database.php` - Updated boolean field sanitization logic

## Impact

This fix ensures that:
1. Countdown timer enable/disable state is correctly saved to the database
2. The UI accurately reflects the saved state
3. Both boolean and string representations are handled properly
4. The fix applies to both `countdown_enabled` and `close_button_enabled` fields

## Date Fixed

August 24, 2025
