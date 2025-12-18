# Implementation Guide: Fix Missing "New" Button on Custom Table Related List

## Overview

This guide provides step-by-step instructions to fix the missing "New" button issue on custom table related records in ServiceNow Service Operations Workspace.

**Estimated Time:** 30-60 minutes  
**Skill Level:** Intermediate  
**Required Roles:** admin or similar administrative access

## Prerequisites

Before you begin, ensure you have:

- [ ] Administrative access to ServiceNow instance
- [ ] Knowledge of your custom table name (e.g., `u_custom_table`)
- [ ] Knowledge of the reference field name (e.g., `u_problem`)
- [ ] List of roles that should have create access
- [ ] Access to a sub-production instance for testing (recommended)

## Implementation Steps

### Phase 1: Assessment (10 minutes)

#### Step 1.1: Identify the Problem
1. Log into ServiceNow as an affected user
2. Navigate to **Service Operations Workspace**
3. Open a Problem record
4. Locate the custom table related list
5. Confirm the "New" button is missing

#### Step 1.2: Gather Information
Document the following:
- Custom table name: `________________`
- Reference field name: `________________`
- Affected user roles: `________________`
- Problem record number for testing: `________________`

#### Step 1.3: Test with Admin Role
1. Impersonate or log in as admin
2. Navigate to the same Problem record
3. Check if the "New" button appears for admin

**Result:**
- If button appears for admin: This is an ACL/role issue
- If button doesn't appear for admin: This is a configuration issue

### Phase 2: Create Access Control Lists (15 minutes)

#### Step 2.1: Create READ ACL

1. Navigate to **System Security > Access Control (ACL)**
2. Click **New**
3. Fill in the following:
   - **Name:** `u_custom_table` (your custom table name)
   - **Type:** record
   - **Operation:** read
   - **Active:** true
   - **Advanced:** true
4. In the **Script** field, paste:

```javascript
(function() {
    return gs.hasRole('problem_manager') || 
           gs.hasRole('itil') || 
           gs.hasRole('admin');
})();
```

5. Click **Submit**

#### Step 2.2: Create CREATE ACL

1. Click **New** to create another ACL
2. Fill in the following:
   - **Name:** `u_custom_table` (your custom table name)
   - **Type:** record
   - **Operation:** create
   - **Active:** true
   - **Advanced:** true
3. In the **Script** field, paste:

```javascript
(function() {
    return gs.hasRole('problem_manager') || 
           gs.hasRole('itil') || 
           gs.hasRole('admin');
})();
```

4. Click **Submit**

#### Step 2.3: Create WRITE ACL

1. Click **New** to create another ACL
2. Fill in the following:
   - **Name:** `u_custom_table` (your custom table name)
   - **Type:** record
   - **Operation:** write
   - **Active:** true
   - **Advanced:** true
3. In the **Script** field, paste:

```javascript
(function() {
    return gs.hasRole('problem_manager') || 
           gs.hasRole('itil') || 
           gs.hasRole('admin');
})();
```

4. Click **Submit**

#### Step 2.4: Verify ACLs

Run this script in **Scripts - Background**:

```javascript
var tableName = 'u_custom_table'; // Replace with your table name
var operations = ['read', 'create', 'write'];

operations.forEach(function(op) {
    var aclGr = new GlideRecord('sys_security_acl');
    aclGr.addQuery('name', tableName);
    aclGr.addQuery('operation', op);
    aclGr.addQuery('active', 'true');
    aclGr.query();
    
    if (aclGr.next()) {
        gs.print(op.toUpperCase() + ' ACL: FOUND and ACTIVE');
    } else {
        gs.print(op.toUpperCase() + ' ACL: MISSING or INACTIVE');
    }
});
```

**Expected Output:**
```
READ ACL: FOUND and ACTIVE
CREATE ACL: FOUND and ACTIVE
WRITE ACL: FOUND and ACTIVE
```

### Phase 3: Configure Related List (10 minutes)

#### Step 3.1: Manual Configuration (Option A)

1. Navigate to a Problem record
2. Scroll to the custom table related list
3. Right-click on the related list header
4. Select **Configure > List Layout**
5. Ensure the following are checked:
   - ☑ New button
   - ☑ Edit button
6. Click **Save**

#### Step 3.2: System Definition Configuration (Option B)

1. Navigate to **System Definition > Related Lists**
2. Search for your custom table related list on the problem table
3. If found, open the record and verify:
   - **New Button:** true
   - **Omit New Button:** false
   - **Create Roles:** itil,problem_manager
4. If not found, click **New** and create:
   - **Name:** u_custom_table
   - **Parent:** problem
   - **Related Field:** u_problem (your reference field)
   - **New Button:** true
   - **Edit Button:** true
   - **Create Roles:** itil,problem_manager
5. Click **Submit**

#### Step 3.3: Verify Related List Configuration

Run this script in **Scripts - Background**:

```javascript
var parentTable = 'problem';
var relatedTable = 'u_custom_table'; // Replace with your table name

var relListGr = new GlideRecord('sys_ui_related_list');
relListGr.addQuery('name', relatedTable);
relListGr.addQuery('parent', parentTable);
relListGr.query();

if (relListGr.next()) {
    gs.print('Related List Configuration:');
    gs.print('New Button: ' + relListGr.getValue('new_button'));
    gs.print('Omit New Button: ' + relListGr.getValue('omit_new_button'));
    gs.print('Create Roles: ' + relListGr.getValue('create_roles'));
} else {
    gs.print('No related list configuration found - using default settings');
}
```

### Phase 4: Optional Business Rule (10 minutes)

Create a business rule to dynamically control the New button based on permissions.

#### Step 4.1: Create Business Rule

1. Navigate to **System Definition > Business Rules**
2. Click **New**
3. Fill in the following:
   - **Name:** Enable New Button for Custom Table
   - **Table:** problem
   - **Active:** true
   - **When:** display
   - **Order:** 100
4. In the **Script** field, paste:

```javascript
(function() {
    var customTableName = 'u_custom_table'; // Replace with your table name
    var gr = new GlideRecord(customTableName);
    
    if (gr.canCreate()) {
        g_form.setRelatedListNewButton(customTableName, true);
    } else {
        g_form.setRelatedListNewButton(customTableName, false);
    }
})();
```

5. Click **Submit**

### Phase 5: Configure Service Operations Workspace (15 minutes)

#### Step 5.1: Access Workspace Configuration

1. Navigate to **Workspace Administration**
2. Search for "Problem" in the list of workspaces
3. Open the Problem workspace configuration

#### Step 5.2: Verify Related List Component

1. In the workspace configuration, find the related list component for your custom table
2. If it exists, open it and verify the configuration
3. Ensure the "New" action is enabled
4. Save any changes

#### Step 5.3: Alternative - Configure via UI Builder

1. If using UI Builder, navigate to **Workspace Experience > UI Builder**
2. Open the Problem workspace
3. Find the related list component for your custom table
4. In the component properties, ensure:
   - **Show New Button:** true
   - **Create Action:** enabled
5. Save and publish the workspace

### Phase 6: Testing (10 minutes)

#### Step 6.1: Clear Caches

1. Run in **Scripts - Background**:
```javascript
gs.flushCache();
```

2. Clear browser cache (Ctrl+Shift+Delete)
3. Log out of ServiceNow
4. Close browser

#### Step 6.2: Test with Affected User Role

1. Log in or impersonate a user with the appropriate role (e.g., itil)
2. Navigate to **Service Operations Workspace**
3. Open the Problem record you documented earlier
4. Verify the "New" button appears on the custom table related list

#### Step 6.3: Test Creating a Record

1. Click the "New" button
2. Fill in required fields
3. Verify the Problem reference is automatically populated
4. Save the record
5. Verify the new record appears in the related list

#### Step 6.4: Test with Multiple Roles

Repeat testing with:
- [ ] itil role
- [ ] problem_manager role
- [ ] problem_admin role (if applicable)
- [ ] Any other relevant roles

### Phase 7: Documentation and Deployment (10 minutes)

#### Step 7.1: Create Update Set

1. Navigate to **System Update Sets > Update Sets**
2. Create a new update set: "Fix Custom Table New Button"
3. Ensure all changes are captured:
   - ACLs (3 records)
   - Related list configuration (1 record)
   - Business rule (1 record, if created)
   - Workspace configuration (if modified)

#### Step 7.2: Test in Sub-Production

1. Clone production to sub-production (if not already done)
2. Apply the update set in sub-production
3. Perform full testing
4. Document any issues

#### Step 7.3: Deploy to Production

1. Schedule a deployment window
2. Create a back-out plan
3. Apply the update set to production
4. Verify functionality
5. Monitor for issues

#### Step 7.4: Document the Change

Create documentation including:
- Change summary
- Affected tables and roles
- Testing results
- Deployment date and time
- Known issues (if any)
- Rollback procedure

## Validation Checklist

Use this checklist to confirm the fix is complete:

- [ ] READ ACL exists and is active
- [ ] CREATE ACL exists and is active
- [ ] WRITE ACL exists and is active
- [ ] Related list configuration includes New button
- [ ] New button appears for users with appropriate roles
- [ ] Users can successfully create new related records
- [ ] New records are properly linked to the Problem record
- [ ] No console errors in browser
- [ ] Functionality works in Service Operations Workspace
- [ ] All changes are in an update set
- [ ] Testing completed in sub-production
- [ ] Documentation updated

## Rollback Procedure

If you need to roll back the changes:

### Option 1: Deactivate ACLs

1. Navigate to **System Security > Access Control (ACL)**
2. Find the ACLs you created
3. Set **Active** to false
4. Clear cache

### Option 2: Revert Update Set

1. Navigate to **System Update Sets > Retrieved Update Sets**
2. Find your update set
3. Click **Back out**
4. Follow the prompts to revert changes

### Option 3: Manual Reversion

1. Delete created ACLs
2. Revert related list configuration
3. Deactivate or delete business rule
4. Clear cache

## Troubleshooting

If the issue persists after implementation, refer to:
- `TROUBLESHOOTING.md` - Detailed troubleshooting guide
- ServiceNow support with case details
- ServiceNow Community forums

## Best Practices

- Always test in sub-production first
- Create comprehensive update sets
- Document all changes
- Include security in design from the start
- Follow the principle of least privilege for roles
- Regularly review and audit ACLs
- Keep track of custom configurations

## Support and Resources

- ServiceNow Documentation: https://docs.servicenow.com/
- ServiceNow Community: https://community.servicenow.com/
- Internal ServiceNow admin team
- This repository: See other files for examples and troubleshooting

## Success Criteria

The implementation is successful when:

1. ✓ "New" button appears on the custom table related list
2. ✓ Users with appropriate roles can create new related records
3. ✓ New records are correctly linked to the Problem record
4. ✓ No security vulnerabilities are introduced
5. ✓ All changes are documented and in an update set
6. ✓ Testing is complete and successful
7. ✓ Production deployment is successful

## Next Steps

After successful implementation:

1. Monitor for any issues in the first week
2. Gather user feedback
3. Document lessons learned
4. Update internal documentation
5. Consider applying the same fix to other tables if needed
6. Plan regular ACL audits
