# Scripts

This directory contains utility scripts for the OpenShift Workshops project.

## print-gliderecord-fields.js

A utility script for printing all field values from a GlideRecord object in ServiceNow.

### Purpose

This script provides three different methods to print all field values from a GlideRecord object:

1. **printGlideRecordFields** - Detailed output with field names, values, and display values
2. **printGlideRecordFieldsAlternative** - Alternative method using element iteration
3. **printGlideRecordFieldsCompact** - Compact one-line output per field

### Usage in ServiceNow

#### Example 1: Print fields from a single record

```javascript
var gr = new GlideRecord('incident');
gr.get('INC0010001'); // Get a specific record by sys_id or number
printGlideRecordFields(gr);
```

#### Example 2: Print fields from all records matching a query

```javascript
var gr = new GlideRecord('incident');
gr.addQuery('active', true);
gr.query();
while (gr.next()) {
    printGlideRecordFields(gr);
}
```

#### Example 3: Using the compact version

```javascript
var gr = new GlideRecord('sys_user');
gr.get('admin');
printGlideRecordFieldsCompact(gr);
```

### Output Format

The detailed version (`printGlideRecordFields`) outputs:

```
========================================
GlideRecord Field Values
Table: incident
========================================
Field: number
  Value: INC0010001
---
Field: short_description
  Value: Network connectivity issue
---
Field: priority
  Value: 3
  Display Value: 3 - Moderate
---
...
========================================
Total Fields: 45
========================================
```

### Running Outside ServiceNow

For demonstration or testing purposes, you can run the script in a Node.js environment:

```bash
node scripts/print-gliderecord-fields.js
```

This will display usage examples and documentation.

### Integration

To use these functions in your ServiceNow scripts:

1. Copy the function code into a Script Include, or
2. Include the script in your Business Rule, UI Action, or other server-side script
3. Call the appropriate function with your GlideRecord object

### Notes

- This script requires a ServiceNow environment with the `gs` (GlideSystem) object
- All three functions handle null/undefined GlideRecord objects gracefully
- The functions use `gs.info()` for logging, which appears in the system logs
