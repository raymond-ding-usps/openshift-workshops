# ServiceNow Issue: Missing "New" Button for Custom Table Related Records

## Issue Description
In the Service Operations Workspace, when viewing a "Problem" record that has a related record from a custom table, the "New" button is missing from the related list. This prevents users from creating new related records directly from the Problem form.

## Known Issue
Yes, this is a known issue in ServiceNow that can occur due to several reasons:

### Common Causes

1. **Access Control List (ACL) Restrictions**
   - The user may not have the `create` permission on the custom table
   - The ACL may be restricted to specific roles that the user doesn't have

2. **Related List Configuration**
   - The related list may have been configured without the "New" button
   - The `omit_new_button` attribute may be set to `true`

3. **Table Configuration**
   - The custom table may not allow creation through related lists
   - The table may be read-only for the user's role

4. **Workspace Configuration**
   - Service Operations Workspace may have specific UI policies affecting the related list

## Solution

### 1. Check and Update Access Control Lists (ACLs)

**Step 1:** Navigate to **System Security > Access Control (ACL)**

**Step 2:** Search for ACLs related to your custom table (e.g., `u_custom_table`)

**Step 3:** Ensure the following ACLs exist with appropriate roles:
- **Operation:** `create`
- **Type:** `record`
- **Table:** Your custom table name

**Example ACL Configuration:**
```javascript
// ACL Rule Script
gs.hasRole('itil') || gs.hasRole('problem_manager')
```

### 2. Configure the Related List

**Step 1:** Open the Problem record form

**Step 2:** Right-click on the related list header

**Step 3:** Select **Configure > List Layout**

**Step 4:** Ensure the following settings:
- **New button:** Checked/Enabled
- **Edit button:** Checked/Enabled (if needed)

### 3. Check Related List Definition

**Step 1:** Navigate to **System Definition > Related Lists**

**Step 2:** Find the related list for your custom table on the Problem table

**Step 3:** Verify the following fields:
- **Related List Type:** Standard or other appropriate type
- **New Button:** Not disabled
- **Create Roles:** Contains the appropriate roles

### 4. Verify Table Dictionary Settings

**Step 1:** Navigate to **System Definition > Tables**

**Step 2:** Open your custom table

**Step 3:** Check the following:
- **Create access:** Ensure the table allows creation
- **Access:** Verify the table is not read-only

### 5. Update Service Operations Workspace Configuration

For Service Operations Workspace specifically:

**Step 1:** Navigate to **Workspace Administration**

**Step 2:** Find the Problem workspace configuration

**Step 3:** Check the related list component for your custom table

**Step 4:** Ensure the component has the "New" action enabled

## Code Examples

### Creating a Custom Related List with New Button

```xml
<?xml version="1.0" encoding="UTF-8"?>
<related_list>
    <name>u_custom_table</name>
    <parent>problem</parent>
    <relationship>u_problem</relationship>
    <new_button>true</new_button>
    <edit_button>true</edit_button>
    <related_field>u_problem</related_field>
</related_list>
```

### ACL Script for Custom Table Create Operation

```javascript
// Name: u_custom_table.create
// Type: record
// Operation: create
// Script:
(function() {
    // Allow problem managers and ITIL users to create records
    return gs.hasRole('problem_manager') || gs.hasRole('itil');
})();
```

### Business Rule to Ensure Related List Visibility

```javascript
// Name: Set Custom Table Related List Visibility
// Table: problem
// When: Display
// Script:
(function() {
    var customTable = 'u_custom_table';
    var user = gs.getUser();
    
    // Check if user has permission to create in custom table
    var gr = new GlideRecord(customTable);
    if (gr.canCreate()) {
        // Enable the new button
        g_form.setRelatedListNewButton(customTable, true);
    }
})();
```

## Verification Steps

After implementing the solution:

1. Log out and log back into ServiceNow
2. Navigate to a Problem record in Service Operations Workspace
3. Scroll to the custom table related list
4. Verify the "New" button appears in the related list header
5. Click "New" to ensure you can create a new related record
6. Verify the new record is properly linked to the Problem record

## Additional Resources

- [ServiceNow Documentation: Related Lists](https://docs.servicenow.com/)
- [ServiceNow Documentation: Access Control Lists](https://docs.servicenow.com/)
- [ServiceNow Community: Service Operations Workspace](https://community.servicenow.com/)

## Troubleshooting

If the issue persists after following the above steps:

1. **Clear Cache:** Clear your browser cache and ServiceNow cache
2. **Check Impersonation:** If testing with impersonation, verify the impersonated user has the correct roles
3. **Review UI Policies:** Check if any UI policies are hiding the button
4. **Check Client Scripts:** Verify no client scripts are removing the button
5. **Contact Support:** If the issue persists, contact ServiceNow support with:
   - Custom table name
   - Problem record number
   - User role information
   - Screenshots of the issue

## Prevention

To prevent this issue in the future:

1. Always test ACLs when creating custom tables
2. Document required roles for custom table access
3. Include related list configurations in update sets
4. Test with different user roles before deploying to production
5. Use consistent naming conventions for custom tables and fields

## Notes

- This issue commonly occurs after:
  - Creating a new custom table
  - Modifying ACLs
  - Updating the Service Operations Workspace
  - Cloning instances
- Always test in a sub-production instance first
- Keep a backup of working configurations before making changes
