# ServiceNow - After Action Report "New" Button Fix

## Issue Description
In ServiceNow Service Operations Workspace, the "New" button was missing from the Problem-related record "After Action Reports" form. This button existed in the Xanadu version but was missing in Zurich.

## Solution
This fix adds a UI Action to the Problem table that creates a "New After Action Report" button on Problem forms.

## Files
- `ui_actions/new_after_action_report.xml` - UI Action definition for the "New After Action Report" button

## Installation Instructions

### Method 1: Manual Import via Update Set
1. Log in to your ServiceNow instance as an administrator
2. Navigate to **System Update Sets > Retrieved Update Sets**
3. Click **Import Update Set from XML**
4. Upload the `new_after_action_report.xml` file
5. Preview and commit the update set
6. Navigate to any Problem record to verify the "New After Action Report" button appears

### Method 2: Direct UI Action Creation
1. Log in to your ServiceNow instance as an administrator
2. Navigate to **System Definition > UI Actions**
3. Click **New**
4. Fill in the fields according to the values in `new_after_action_report.xml`:
   - **Name**: New After Action Report
   - **Table**: problem
   - **Action name**: new_after_action_report
   - **Active**: true
   - **Form button**: true
   - **Show update**: true
   - **Client**: true
   - **Order**: 100
5. Copy the client script from the XML file into the **Client script** field
6. Save the record
7. Navigate to any Problem record to verify the button appears

## Verification
After installation:
1. Navigate to **Problem > All** in ServiceNow
2. Open any existing Problem record
3. Verify that the "New After Action Report" button appears in the form header
4. Click the button to verify it opens a new After Action Report form with the Problem pre-populated as the related record

## Technical Details
- **Table**: problem
- **UI Action Type**: Form Button
- **Client Script**: Yes (opens new After Action Report form in new window/tab)
- **Related Table**: sn_problem_after_action_report (After Action Report)
- **Relationship**: Sets the problem field on the new After Action Report to the current Problem record

## Compatibility
- ServiceNow Zurich release and later
- Restores functionality that was present in Xanadu release

## Notes
- This UI Action only appears on Problem forms (not in lists)
- The button opens the new After Action Report form in a new browser window/tab
- The current Problem record is automatically linked to the new After Action Report
