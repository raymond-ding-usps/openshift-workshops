# Scripts

This directory contains utility scripts.

## print-gliderecord-fields.js

A simple script to print all field values from a single GlideRecord in ServiceNow.

### Purpose

Print all fields and their values from one record in one table.

### Usage in ServiceNow

1. Open a Background Script in ServiceNow (System Definition > Scripts - Background)
2. Get your record using GlideRecord:

```javascript
var gr = new GlideRecord('incident');
gr.get('INC0010001'); // Get a specific record by sys_id or number
```

3. Copy and paste the script content, or run:

```javascript
var fields = gr.getFields();

gs.info('========================================');
gs.info('Table: ' + gr.getTableName());
gs.info('Record: ' + gr.getDisplayValue());
gs.info('========================================');

for (var i = 0; i < fields.size(); i++) {
    var field = fields.get(i);
    var fieldName = field.getName();
    var fieldValue = gr.getValue(fieldName);
    
    gs.info(fieldName + ' = ' + fieldValue);
}

gs.info('========================================');
gs.info('Total Fields: ' + fields.size());
gs.info('========================================');
```

### Output Format

```
========================================
Table: incident
Record: INC0010001
========================================
sys_id = 1234567890abcdef
number = INC0010001
short_description = Network connectivity issue
priority = 3
state = 1
assigned_to = abc123
...
========================================
Total Fields: 45
========================================
```

### Examples

**Print fields from an incident:**
```javascript
var gr = new GlideRecord('incident');
gr.get('INC0010001');
// Run the script
```

**Print fields from a user:**
```javascript
var gr = new GlideRecord('sys_user');
gr.get('admin');
// Run the script
```

**Print fields from any table:**
```javascript
var gr = new GlideRecord('cmdb_ci_computer');
gr.get('sys_id_here');
// Run the script
```
