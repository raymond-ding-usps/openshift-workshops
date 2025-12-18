# Troubleshooting Guide: Missing "New" Button on Custom Table Related List

## Quick Diagnostic Checklist

Use this checklist to quickly identify the cause of the missing "New" button:

- [ ] User has the correct role(s)
- [ ] ACL for 'create' operation exists and is active
- [ ] Related list configuration includes the New button
- [ ] Custom table allows creation
- [ ] No UI Policy is hiding the button
- [ ] No Client Script is removing the button
- [ ] Browser cache has been cleared
- [ ] ServiceNow cache has been cleared

## Step-by-Step Troubleshooting

### Step 1: Verify User Permissions

```javascript
// Run this in Scripts - Background
var tableName = 'u_custom_table'; // Replace with your table name
var gr = new GlideRecord(tableName);
gs.print('Can Create: ' + gr.canCreate());
gs.print('Can Read: ' + gr.canRead());
gs.print('Can Write: ' + gr.canWrite());
gs.print('User Roles: ' + gs.getUser().getRoles());
```

**Expected Output:**
- Can Create: true
- Can Read: true
- Can Write: true

**If "Can Create" is false:** User lacks the necessary role or ACL is blocking creation.

### Step 2: Check ACL Configuration

```javascript
// Run this in Scripts - Background
var tableName = 'u_custom_table'; // Replace with your table name
var aclGr = new GlideRecord('sys_security_acl');
aclGr.addQuery('name', tableName);
aclGr.addQuery('operation', 'create');
aclGr.query();

if (aclGr.next()) {
    gs.print('ACL Found: ' + aclGr.getValue('sys_id'));
    gs.print('Active: ' + aclGr.getValue('active'));
    gs.print('Script: ' + aclGr.getValue('script'));
} else {
    gs.print('No CREATE ACL found for table: ' + tableName);
}
```

**Expected Output:**
- ACL Found: [sys_id]
- Active: true
- Script: [ACL script content]

**If no ACL found:** Create a new ACL using the provided templates.

### Step 3: Verify Related List Configuration

```javascript
// Run this in Scripts - Background
var parentTable = 'problem';
var relatedTable = 'u_custom_table'; // Replace with your table name

var relListGr = new GlideRecord('sys_ui_related_list');
relListGr.addQuery('name', relatedTable);
relListGr.addQuery('parent', parentTable);
relListGr.query();

if (relListGr.next()) {
    gs.print('Related List Found: ' + relListGr.getValue('sys_id'));
    gs.print('New Button: ' + relListGr.getValue('new_button'));
    gs.print('Omit New Button: ' + relListGr.getValue('omit_new_button'));
    gs.print('Create Roles: ' + relListGr.getValue('create_roles'));
} else {
    gs.print('No related list configuration found');
}
```

**Expected Output:**
- Related List Found: [sys_id]
- New Button: true
- Omit New Button: false
- Create Roles: [list of roles]

**If New Button is false or Omit New Button is true:** Update the related list configuration.

### Step 4: Check for UI Policies

```javascript
// Run this in Scripts - Background
var tableName = 'problem';
var uiPolicyGr = new GlideRecord('sys_ui_policy');
uiPolicyGr.addQuery('table', tableName);
uiPolicyGr.addQuery('active', 'true');
uiPolicyGr.query();

gs.print('Active UI Policies on ' + tableName + ':');
while (uiPolicyGr.next()) {
    gs.print('- ' + uiPolicyGr.getValue('short_description') + ' (' + uiPolicyGr.getValue('sys_id') + ')');
}
```

**Action:** Review each UI Policy to ensure none are affecting the related list.

### Step 5: Check for Client Scripts

```javascript
// Run this in Scripts - Background
var tableName = 'problem';
var csGr = new GlideRecord('sys_script_client');
csGr.addQuery('table', tableName);
csGr.addQuery('active', 'true');
csGr.query();

gs.print('Active Client Scripts on ' + tableName + ':');
while (csGr.next()) {
    var script = csGr.getValue('script');
    if (script.indexOf('setRelatedListNewButton') > -1 || 
        script.indexOf('hideRelatedList') > -1) {
        gs.print('- FOUND RELATED LIST MANIPULATION: ' + csGr.getValue('name'));
    }
}
```

**Action:** Review any client scripts that manipulate related lists.

### Step 6: Verify Table Configuration

```javascript
// Run this in Scripts - Background
var tableName = 'u_custom_table'; // Replace with your table name
var tableGr = new GlideRecord('sys_db_object');
tableGr.addQuery('name', tableName);
tableGr.query();

if (tableGr.next()) {
    gs.print('Table Found: ' + tableGr.getValue('label'));
    gs.print('Create Access: ' + tableGr.getValue('create_access'));
    gs.print('Access: ' + tableGr.getValue('access'));
    gs.print('Extensible: ' + tableGr.getValue('is_extendable'));
} else {
    gs.print('Table not found: ' + tableName);
}
```

**Expected Output:**
- Table Found: [Table Label]
- Create Access: true or empty (not false)
- Access: public or appropriate value

### Step 7: Clear Caches

```javascript
// Run this in Scripts - Background
// Clear server-side cache
gs.flushCache();
gs.print('Server cache cleared');

// Note: User must manually clear browser cache
gs.print('Please clear your browser cache and refresh the page');
```

**Manual Steps:**
1. Clear browser cache (Ctrl+Shift+Delete or Cmd+Shift+Delete)
2. Log out of ServiceNow
3. Close browser
4. Reopen browser and log back in

### Step 8: Test with Admin Role

1. Impersonate a user with 'admin' role
2. Navigate to a Problem record
3. Check if the "New" button appears on the custom table related list

**If button appears for admin but not for other roles:** This is definitely a role/ACL issue.

### Step 9: Check Service Operations Workspace Configuration

For Service Operations Workspace specifically:

1. Navigate to **Workspace Administration**
2. Search for "Problem" workspace
3. Open the workspace configuration
4. Check the related list component for your custom table
5. Verify the component configuration includes the "New" action

### Step 10: Review Update Set

If the custom table was recently installed via an update set:

```javascript
// Run this in Scripts - Background
var tableName = 'u_custom_table'; // Replace with your table name

// Check if ACLs were included
var aclGr = new GlideRecord('sys_security_acl');
aclGr.addQuery('name', tableName);
aclGr.query();
gs.print('ACLs for ' + tableName + ': ' + aclGr.getRowCount());

// Check if related list was included
var relListGr = new GlideRecord('sys_ui_related_list');
relListGr.addQuery('name', tableName);
relListGr.query();
gs.print('Related Lists for ' + tableName + ': ' + relListGr.getRowCount());
```

**Action:** Ensure the update set included all necessary configurations.

## Common Scenarios and Solutions

### Scenario 1: Button was working, now it's gone
**Likely Cause:** Recent update, ACL change, or role modification
**Solution:** Review recent update sets and system changes

### Scenario 2: Button only appears for admin
**Likely Cause:** Missing or incorrect ACL
**Solution:** Review and update ACLs using the provided templates

### Scenario 3: Button appears on standard lists but not in workspace
**Likely Cause:** Workspace-specific configuration
**Solution:** Update workspace configuration for the related list component

### Scenario 4: Button appears for some users but not others
**Likely Cause:** Role-based access issue
**Solution:** Verify role assignments and ACL role requirements match

### Scenario 5: Custom table is new, button never appeared
**Likely Cause:** Missing ACL and/or related list configuration
**Solution:** Create ACLs and configure related list using provided templates

## Advanced Debugging

### Enable Debug Logging

1. Navigate to **System Diagnostics > Debug Log**
2. Enable debug for:
   - Security (ACL)
   - UI (Related Lists)
   - Scripts (Business Rules, Client Scripts)
3. Reproduce the issue
4. Review debug logs

### Check Session Debug Output

```javascript
// Add this to a Business Rule or Client Script temporarily
gs.log('Related List Debug - User: ' + gs.getUserName() + 
       ', Can Create: ' + new GlideRecord('u_custom_table').canCreate());
```

### Network Tab Inspection

1. Open browser Developer Tools (F12)
2. Go to Network tab
3. Load the Problem record
4. Look for any 403 Forbidden or 401 Unauthorized responses
5. Check the response for related list data

## Still Not Working?

If you've tried all the above steps and the issue persists:

1. **Document the issue:**
   - Affected users and their roles
   - Custom table name
   - Problem record number
   - Screenshots showing missing button
   - Results from diagnostic scripts

2. **Create a test case:**
   - Create a sub-production instance clone
   - Test the configuration in the clone
   - Document the exact steps to reproduce

3. **Contact ServiceNow Support:**
   - Open a support case
   - Provide all documentation
   - Include diagnostic script results
   - Reference this guide

4. **Check ServiceNow Community:**
   - Search for similar issues
   - Post in the appropriate forum
   - Include relevant details (no sensitive data)

## Prevention Checklist

To prevent this issue in future implementations:

- [ ] Always create ACLs when creating custom tables
- [ ] Test with multiple user roles before deploying
- [ ] Include all related configurations in update sets
- [ ] Document role requirements
- [ ] Follow ServiceNow best practices for ACL creation
- [ ] Test in sub-production before production deployment
- [ ] Create automated tests for critical functionality
- [ ] Maintain documentation of custom table configurations

## Additional Resources

- ServiceNow Documentation: Access Control Lists
- ServiceNow Documentation: Related Lists
- ServiceNow Community Forums
- ServiceNow Now Learning (training resources)
