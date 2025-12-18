# "New After Action Report" Button Preview

## Button Location and Appearance

The "New After Action Report" button will appear in the Problem form header, alongside other action buttons.

### Before Fix (Zurich - Missing Button)
```
┌─────────────────────────────────────────────────────────────┐
│ Problem PRB0012345                                          │
├─────────────────────────────────────────────────────────────┤
│ Form Actions:                                                │
│ [Update] [Delete] [Additional Actions ▼]                    │
│                                                              │
│ (No button to create After Action Report)                   │
└─────────────────────────────────────────────────────────────┘
```

### After Fix (Zurich with New Button)
```
┌─────────────────────────────────────────────────────────────┐
│ Problem PRB0012345                                          │
├─────────────────────────────────────────────────────────────┤
│ Form Actions:                                                │
│ [Update] [Delete] [Additional Actions ▼]                    │
│ [New After Action Report] ← NEW BUTTON                      │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

## Button Behavior

### When User Clicks "New After Action Report"

1. **New Window Opens**
   ```
   ┌─────────────────────────────────────────────────────┐
   │ After Action Report (New Record)                    │
   ├─────────────────────────────────────────────────────┤
   │ Problem: PRB0012345 (Auto-filled) ✓                │
   │                                                      │
   │ Title: [Empty - User fills this in]                │
   │                                                      │
   │ Description: [Empty - User fills this in]          │
   │                                                      │
   │ Root Cause: [Empty - User fills this in]           │
   │                                                      │
   │ [Submit] [Cancel]                                   │
   └─────────────────────────────────────────────────────┘
   ```

2. **Problem Field Pre-Populated**
   - The "Problem" reference field is automatically set to the current Problem record
   - User doesn't need to search for or manually link the Problem
   - Saves time and prevents errors

3. **User Completes Form**
   - User fills in remaining required fields
   - Clicks Submit to create the After Action Report
   - New report is immediately related to the Problem

## User Experience Flow

```
┌─────────────────┐
│ User viewing    │
│ Problem PRB0012345 │
└────────┬────────┘
         │
         ↓
┌────────────────────┐
│ Clicks "New After  │
│ Action Report"     │
│ button             │
└────────┬───────────┘
         │
         ↓
┌────────────────────┐
│ New browser window │
│ opens with AAR     │
│ form               │
└────────┬───────────┘
         │
         ↓
┌────────────────────┐
│ Problem field      │
│ already filled in  │
│ automatically      │
└────────┬───────────┘
         │
         ↓
┌────────────────────┐
│ User fills other   │
│ fields and saves   │
└────────┬───────────┘
         │
         ↓
┌────────────────────┐
│ After Action Report│
│ created and linked │
│ to Problem         │
└────────────────────┘
```

## Technical Details

### Button Properties
- **Style**: Primary (blue button, prominent display)
- **Order**: 100 (appears after standard buttons)
- **Type**: Form Button (appears on forms, not lists)
- **Hint**: "Create a new After Action Report for this Problem"
- **Active**: Yes

### Visibility Rules
- ✓ Shows when viewing/updating existing Problem records
- ✗ Does NOT show when creating new Problems
- ✗ Does NOT show in Problem list views
- ✗ Does NOT show in related lists

### Client Script Logic
```javascript
function onClick() {
    // 1. Get current Problem's unique ID
    var problemSysId = g_form.getUniqueValue();
    
    // 2. Build URL with Problem pre-filled
    var url = 'sn_problem_after_action_report.do?sys_id=-1&sysparm_query=problem=' + problemSysId;
    
    // 3. Open new form in new window
    window.open(url, '_blank');
}
```

## Compatibility

### ServiceNow Versions
- ✓ Zurich
- ✓ Vancouver (and later)
- ✓ Washington DC (and later)

### Restores Functionality From
- ✓ Xanadu (where this button originally existed)

## Notes
- Button opens form in **new window/tab** (user preference dependent)
- Does not navigate away from current Problem record
- Multiple After Action Reports can be created from same Problem
- Respects standard ServiceNow ACL permissions
