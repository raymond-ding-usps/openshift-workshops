# Installation Guide - After Action Report "New" Button

## Quick Start

### Import Update Set (Recommended)
1. Download the `update_set_after_action_report_new_button.xml` file
2. Log in to your ServiceNow instance
3. Navigate to: **System Update Sets > Retrieved Update Sets**
4. Click **Import Update Set from XML**
5. Select the downloaded XML file
6. Click **Upload**
7. Once uploaded, click on the update set name
8. Click **Preview Update Set**
9. Review for conflicts (there should be none for a new UI Action)
10. Click **Commit Update Set**
11. Wait for the commit to complete

### Verify Installation
1. Navigate to **Problem > All**
2. Open any Problem record
3. Look for the **"New After Action Report"** button in the form header
4. The button should appear alongside other form buttons (Update, Delete, etc.)

## What Gets Created

### UI Action Details
- **Button Label**: "New After Action Report"
- **Location**: Problem form header (appears when viewing/editing a Problem record)
- **Behavior**: Opens a new After Action Report form in a new window/tab with the current Problem pre-linked
- **Visibility**: Shows on existing Problem records (Show Update = true)

### Button Placement
The button will appear in the form header section of the Problem record, typically in this location:

```
[Problem Form Header]
[Update] [Delete] [Additional Actions ▼] [New After Action Report] ← New button here
```

## Functionality

When clicked, the button will:
1. Capture the current Problem record's sys_id
2. Open a new browser window/tab
3. Navigate to the After Action Report form with:
   - A new (unsaved) After Action Report record
   - The Problem field pre-populated with the current Problem record
4. User can then fill in the remaining fields and save the After Action Report

## Technical Implementation

The UI Action uses a client script that:
```javascript
function onClick() {
    // Get the current Problem record's sys_id
    var problemSysId = g_form.getUniqueValue();
    
    // Build URL to create new After Action Report with Problem pre-filled
    var url = 'sn_problem_after_action_report.do?sys_id=-1&sysparm_query=problem=' + problemSysId;
    
    // Open in new window
    window.open(url, '_blank');
}
```

## Troubleshooting

### Button Doesn't Appear
1. Clear your browser cache
2. Verify the UI Action is Active (System Definition > UI Actions > Search for "New After Action Report")
3. Check that the user has permissions to create After Action Reports
4. Verify you're looking at a Problem record (not a list view)

### Button Appears But Doesn't Work
1. Check browser console for JavaScript errors
2. Verify the After Action Report table name is correct for your instance
3. Ensure the Problem field exists on the After Action Report table

### After Action Report Table Name
If your instance uses a different table name for After Action Reports, update the URL in the client script:
- Default: `sn_problem_after_action_report`
- Update the `url` variable to match your table name

## Rollback
To remove this change:
1. Navigate to **System Definition > UI Actions**
2. Search for "New After Action Report"
3. Set **Active** to false or delete the record
4. Clear cache and refresh

## Support
For issues related to this fix, check:
- ServiceNow table name for After Action Reports in your instance
- User permissions for Problem and After Action Report tables
- UI Action configuration in System Definition > UI Actions
