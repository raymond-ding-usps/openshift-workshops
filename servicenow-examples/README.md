# ServiceNow Configuration Examples

This directory contains example configurations for fixing the missing "New" button issue on custom table related records in ServiceNow Service Operations Workspace.

## Directory Structure

```
servicenow-examples/
├── acl/                    # Access Control List examples
├── related-lists/          # Related list configuration examples
├── business-rules/         # Business rule examples
└── README.md              # This file
```

## Usage

These examples are templates that should be adapted to your specific ServiceNow instance:

1. **Replace placeholders** (e.g., `u_custom_table`) with your actual table names
2. **Adjust roles** according to your organization's role structure
3. **Test in sub-production** before deploying to production
4. **Include in update sets** for proper change management

## Quick Start

1. Review the main issue documentation: `../SERVICENOW-ISSUE.md`
2. Identify which configuration needs to be updated (ACL, related list, etc.)
3. Use the appropriate example file as a template
4. Customize for your environment
5. Test thoroughly before production deployment

## Important Notes

- Always backup existing configurations before making changes
- Test with multiple user roles to ensure proper access
- Document all changes in your organization's change management system
- Follow your organization's ServiceNow governance policies

## Support

For issues or questions:
- Refer to ServiceNow documentation
- Check the ServiceNow Community
- Contact your ServiceNow administrator
- Open a ticket with ServiceNow support if needed
