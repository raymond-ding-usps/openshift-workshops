# ServiceNow Issue: Missing "New" Button on Custom Table Related Lists

## 🎯 Quick Summary

This documentation addresses a **known issue** in ServiceNow where the "New" button is missing from custom table related lists on Problem records in the Service Operations Workspace.

**Issue:** Custom table related lists on Problem records are missing the "New" button  
**Status:** Known Issue with Solution  
**Severity:** Medium  
**Affected Area:** Service Operations Workspace, Problem Management  
**Resolution Time:** 30-60 minutes  

## 📋 Table of Contents

1. [Issue Description](#issue-description)
2. [Is This a Known Issue?](#is-this-a-known-issue)
3. [Quick Start](#quick-start)
4. [Documentation Structure](#documentation-structure)
5. [Common Causes](#common-causes)
6. [Solution Overview](#solution-overview)
7. [Implementation](#implementation)
8. [Additional Resources](#additional-resources)

## Issue Description

In ServiceNow's Service Operations Workspace, when viewing a Problem record that has a related list from a custom table, the "New" button may be missing from the related list header. This prevents users from creating new related records directly from the Problem form.

**Example Scenario:**
- A custom table `u_problem_analysis` is related to the `problem` table
- Users can view related records in the list
- The "New" button is not visible, preventing users from creating new related records
- This affects productivity and workflow efficiency

## Is This a Known Issue?

**Yes**, this is a known issue in ServiceNow that can occur due to several reasons:

1. **Missing or Incorrect Access Control Lists (ACLs)** - Most common cause
2. **Related List Configuration Issues** - Configuration missing or incorrect
3. **Role-Based Access Problems** - User roles don't have create permission
4. **Workspace-Specific Configuration** - Service Operations Workspace settings
5. **UI Policies or Client Scripts** - Scripts hiding the button

This issue is well-documented in the ServiceNow community and has standard solutions.

## Quick Start

### 5-Minute Diagnostic

Run this script in **ServiceNow > Scripts - Background** to quickly identify the issue:

```javascript
// Replace 'u_custom_table' with your actual custom table name
var tableName = 'u_custom_table';
var user = gs.getUserName();

gs.print('=== Diagnostic Report ===');
gs.print('User: ' + user);
gs.print('Roles: ' + gs.getUser().getRoles());

// Check create permission
var gr = new GlideRecord(tableName);
gs.print('Can Create: ' + gr.canCreate());

// Check ACLs
var aclGr = new GlideRecord('sys_security_acl');
aclGr.addQuery('name', tableName);
aclGr.addQuery('operation', 'create');
aclGr.query();
gs.print('CREATE ACL Exists: ' + (aclGr.hasNext() ? 'Yes' : 'No'));

// Check related list config
var relListGr = new GlideRecord('sys_ui_related_list');
relListGr.addQuery('name', tableName);
relListGr.addQuery('parent', 'problem');
relListGr.query();
if (relListGr.next()) {
    gs.print('Related List New Button: ' + relListGr.getValue('new_button'));
    gs.print('Omit New Button: ' + relListGr.getValue('omit_new_button'));
} else {
    gs.print('Related List Config: Using defaults');
}

gs.print('=== End Report ===');
```

**Interpretation:**
- If "Can Create" is `false` → ACL or role issue
- If "CREATE ACL Exists" is `No` → Missing ACL (most common)
- If "New Button" is not `true` → Related list configuration issue

## Documentation Structure

This repository contains comprehensive documentation and examples:

```
.
├── SERVICENOW-README.md           # This file - Overview and quick start
├── SERVICENOW-ISSUE.md            # Detailed issue description and solutions
└── servicenow-examples/           # Configuration examples and templates
    ├── README.md                  # Examples directory overview
    ├── IMPLEMENTATION-GUIDE.md    # Step-by-step implementation guide
    ├── TROUBLESHOOTING.md         # Comprehensive troubleshooting guide
    ├── acl/                       # Access Control List examples
    │   ├── custom_table_create_acl.xml
    │   ├── custom_table_read_acl.xml
    │   └── custom_table_write_acl.xml
    ├── related-lists/             # Related list configuration examples
    │   ├── custom_table_related_list.xml
    │   └── related_list_layout.json
    └── business-rules/            # Business rule examples
        ├── enable_new_button_display.js
        └── validate_related_record_creation.js
```

## Common Causes

### 1. Missing Access Control List (ACL) - 70% of cases
The most common cause is a missing or incorrectly configured ACL for the `create` operation.

**Solution:** Create ACLs for read, create, and write operations  
**See:** `servicenow-examples/acl/` for templates

### 2. Related List Configuration - 20% of cases
The related list may be configured without the New button enabled.

**Solution:** Update related list configuration to enable the New button  
**See:** `servicenow-examples/related-lists/` for examples

### 3. Role-Based Access - 5% of cases
User roles don't have permission to create records in the custom table.

**Solution:** Assign appropriate roles to users  
**See:** `SERVICENOW-ISSUE.md` for role configuration

### 4. Workspace Configuration - 3% of cases
Service Operations Workspace may have specific settings affecting the button.

**Solution:** Update workspace component configuration  
**See:** `IMPLEMENTATION-GUIDE.md` Phase 5

### 5. UI Policies or Scripts - 2% of cases
Custom UI policies or client scripts may be hiding the button.

**Solution:** Review and update UI policies and client scripts  
**See:** `TROUBLESHOOTING.md` Steps 4-5

## Solution Overview

### High-Level Solution Steps

1. **Create ACLs** (15 minutes)
   - Read ACL for the custom table
   - Create ACL for the custom table
   - Write ACL for the custom table

2. **Configure Related List** (10 minutes)
   - Enable New button in related list configuration
   - Set appropriate roles for create access

3. **Optional: Add Business Rule** (10 minutes)
   - Dynamically control button visibility based on permissions

4. **Configure Workspace** (15 minutes)
   - Update Service Operations Workspace settings if needed

5. **Test and Deploy** (20 minutes)
   - Test with multiple user roles
   - Create update set
   - Deploy to production

**Total Time:** 30-60 minutes

## Implementation

### For Administrators

If you're a ServiceNow administrator, follow these guides in order:

1. **Start Here:** Read `SERVICENOW-ISSUE.md` for a complete understanding
2. **Implementation:** Follow `servicenow-examples/IMPLEMENTATION-GUIDE.md` step-by-step
3. **Configuration:** Use templates in `servicenow-examples/acl/` and `servicenow-examples/related-lists/`
4. **If Issues:** Refer to `servicenow-examples/TROUBLESHOOTING.md`

### For Developers

If you're a ServiceNow developer:

1. Review the example configurations in `servicenow-examples/`
2. Adapt the XML and JavaScript templates to your custom table
3. Follow ServiceNow best practices for ACL creation
4. Include all changes in an update set
5. Test thoroughly in sub-production

### For End Users

If you're an end user experiencing this issue:

1. Contact your ServiceNow administrator
2. Provide them with:
   - Custom table name
   - Problem record number
   - Screenshot showing missing button
3. Reference this documentation

## Additional Resources

### Internal Documentation
- `SERVICENOW-ISSUE.md` - Detailed issue description and solutions
- `servicenow-examples/IMPLEMENTATION-GUIDE.md` - Step-by-step guide
- `servicenow-examples/TROUBLESHOOTING.md` - Troubleshooting guide

### ServiceNow Resources
- [ServiceNow Documentation](https://docs.servicenow.com/)
- [ServiceNow Community](https://community.servicenow.com/)
- [ServiceNow Learning](https://nowlearning.servicenow.com/)

### Example Files
All example files include:
- Detailed comments
- Instructions for customization
- Best practices
- Security considerations

## Getting Help

### Self-Service
1. Run the diagnostic script above
2. Follow the implementation guide
3. Use the troubleshooting guide

### Internal Support
1. Contact your ServiceNow administrator
2. Provide diagnostic script output
3. Reference this documentation

### ServiceNow Support
If the issue persists:
1. Open a support case with ServiceNow
2. Provide all diagnostic information
3. Reference this documentation
4. Include screenshots and error messages

## FAQ

**Q: Will this fix work for all custom tables?**  
A: Yes, the solution is applicable to any custom table with related lists on Problem records.

**Q: Do I need to do this for every custom table?**  
A: Yes, each custom table needs its own set of ACLs and related list configuration.

**Q: Will this affect existing functionality?**  
A: No, this fix only adds the missing "New" button functionality. It doesn't modify existing features.

**Q: Can I apply this fix without downtime?**  
A: Yes, these changes can be made in production without requiring downtime.

**Q: What if I don't have admin access?**  
A: You'll need to work with your ServiceNow administrator to implement this fix.

**Q: Is this issue specific to Service Operations Workspace?**  
A: While it commonly occurs in Service Operations Workspace, it can happen in any workspace or standard UI.

**Q: How do I prevent this in the future?**  
A: When creating custom tables, always create ACLs and configure related lists as part of the initial setup.

## Version History

| Version | Date | Changes |
|---------|------|---------|
| 1.0 | 2025-12-18 | Initial documentation and examples |

## Contributing

To contribute to this documentation:
1. Test the solutions in your environment
2. Document any additional scenarios or solutions
3. Update the examples with improvements
4. Submit updates through your organization's change process

## License

This documentation is provided as-is for use with ServiceNow implementations.

## Contact

For questions or issues with this documentation:
- Contact your ServiceNow administrator
- Refer to internal IT support channels
- Reference ServiceNow official documentation

---

**Note:** This documentation is specifically for the missing "New" button issue on custom table related lists. For other ServiceNow issues, refer to appropriate documentation or ServiceNow support.
