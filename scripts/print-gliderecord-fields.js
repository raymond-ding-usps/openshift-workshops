#!/usr/bin/env node

/**
 * GlideRecord Field Values Printer
 * 
 * Simple script to print all field values from a single GlideRecord.
 * 
 * Usage in ServiceNow:
 *   var gr = new GlideRecord('incident');
 *   gr.get('INC0010001'); // Get a specific record
 *   
 *   // Then copy and run the code below, or call the function directly
 */

// Print all fields from the current GlideRecord
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
