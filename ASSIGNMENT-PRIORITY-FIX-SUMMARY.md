# Assignment Priority Fix Summary

## Problem Description
The user reported that when updating assignment priorities in the dashboard, the priority value was always sent as 1 to the backend, even though they changed it in the UI.

**User's exact message:**
> "assignments [{"id":"166","assignment_type":"page","target_id":"10","target_value":"Promo bar test x","priority":1}] when update the priority then why the priority alwasy sent 1"

## Root Cause Analysis
The issue was caused by the `normalizePriorities()` function being called automatically before saving assignments. This function was designed to ensure sequential priority values (1, 2, 3, etc.) but was being called every time assignments were saved, which overrode any custom priority values set by the user.

### Key Issues Found:

1. **Automatic Normalization in Save Process**: The `savePromoBar()` function was calling `normalizePriorities()` before saving, which reset all priorities to sequential numbers.

2. **Automatic Normalization After Removal**: The `removeAssignment()` function was also calling `normalizePriorities()` after removing an assignment.

3. **Priority Loss During Loading**: When assignments were loaded from the database, they might not have had proper priority values assigned.

## Solution Implemented

### 1. Fixed Save Process (`src/admin/index.jsx`)
**Before:**
```javascript
// Normalize priorities before saving
if (currentAssignments.length > 0) {
    console.log('Normalizing priorities before save...');
    normalizePriorities();
    data.assignments = JSON.stringify(currentAssignments);
}
```

**After:**
```javascript 
// Save assignments with their current priority values (don't normalize automatically)
if (currentAssignments.length > 0) {
    console.log('Saving assignments with current priorities:', currentAssignments.map(a => ({ id: a.id, priority: a.priority })));
    data.assignments = JSON.stringify(currentAssignments);
}
```

### 2. Fixed Assignment Loading (`src/admin/index.jsx`)
**Before:**
```javascript
// Ensure all assignments have proper IDs
currentAssignments = assignments.map(assignment => ({
    ...assignment,
    id: assignment.id || `db_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
}));
```

**After:**
```javascript
// Ensure all assignments have proper IDs and priority values
currentAssignments = assignments.map((assignment, index) => ({
    ...assignment,
    id: assignment.id || `db_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    priority: assignment.priority || (index + 1) // Ensure priority exists
}));
```

### 3. Fixed Assignment Removal (`src/admin/index.jsx`)
**Before:**
```javascript
// Normalize priorities after removal to ensure they are sequential
if (currentAssignments.length > 0) {
    normalizePriorities();
} else {
    updateAssignmentsList();
}
```

**After:**
```javascript
// Update the display after removal (don't normalize priorities automatically)
updateAssignmentsList();
```

## How the Fix Works

1. **Preserves User-Set Priorities**: When a user changes a priority value in the input field, the `updateAssignmentPriority()` function updates the assignment's priority in the `currentAssignments` array.

2. **No Automatic Normalization**: The save process no longer calls `normalizePriorities()` automatically, so user-set priorities are preserved.

3. **Manual Normalization Available**: Users can still manually normalize priorities using the "Normalize" button if they want sequential priorities.

4. **Proper Loading**: When assignments are loaded from the database, they are ensured to have priority values (defaulting to index + 1 if missing).

## Testing

A test file (`test-priority-fix.html`) was created to verify the fix works correctly. The test demonstrates:

- Priority values are preserved when updated manually
- Priority values are preserved when assignments are moved up/down
- Priority values are preserved when assignments are removed
- Priority values are preserved during the save process
- Manual normalization still works when explicitly requested

## Expected Behavior After Fix

1. **User sets priority to 5**: The assignment keeps priority 5
2. **User saves**: The assignment is saved with priority 5 (not reset to 1)
3. **User moves assignment up/down**: Priorities are swapped correctly
4. **User removes assignment**: Remaining assignments keep their current priorities
5. **User clicks "Normalize"**: All priorities become sequential (1, 2, 3, etc.)

## Files Modified

- `src/admin/index.jsx` - Main JavaScript file containing the assignment management logic

## Files Created for Testing

- `test-priority-fix.html` - Standalone test to verify priority functionality
- `test-assignment-priority-debug.php` - PHP test script for database debugging
- `ASSIGNMENT-PRIORITY-FIX-SUMMARY.md` - This summary document

## Verification

To verify the fix is working:

1. Open the promo bar editor in WordPress admin
2. Add or edit assignments
3. Change priority values manually using the input fields
4. Save the promo bar
5. Reload the page and check that the priority values are preserved
6. Use the browser's developer tools to check the network requests and verify the correct priority values are being sent

The fix ensures that assignment priorities are now properly preserved and sent to the backend with the correct values that the user sets in the UI.
