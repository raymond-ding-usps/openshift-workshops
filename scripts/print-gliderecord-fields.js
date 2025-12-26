#!/usr/bin/env node

/**
 * GlideRecord Field Values Printer
 * 
 * This script demonstrates how to print all field values from a GlideRecord object.
 * GlideRecord is a ServiceNow API class used for database operations.
 * 
 * Usage:
 *   In ServiceNow environment: gs.include('print-gliderecord-fields');
 *                              printGlideRecordFields(gr);
 *   
 *   For testing/demo: node print-gliderecord-fields.js
 */

/**
 * Prints all field values from a GlideRecord object
 * @param {Object} gr - The GlideRecord object to print
 */
function printGlideRecordFields(gr) {
    if (!gr) {
        gs.error('GlideRecord object is null or undefined');
        return;
    }

    // Get all field names from the GlideRecord
    var fields = gr.getFields();
    
    gs.info('========================================');
    gs.info('GlideRecord Field Values');
    gs.info('Table: ' + gr.getTableName());
    gs.info('========================================');
    
    // Iterate through all fields and print their values
    for (var i = 0; i < fields.size(); i++) {
        var field = fields.get(i);
        var fieldName = field.getName();
        var fieldValue = gr.getValue(fieldName);
        var displayValue = gr.getDisplayValue(fieldName);
        
        // Print field name and value
        gs.info('Field: ' + fieldName);
        gs.info('  Value: ' + fieldValue);
        
        // If display value is different, print it too
        if (displayValue && displayValue !== fieldValue) {
            gs.info('  Display Value: ' + displayValue);
        }
        
        gs.info('---');
    }
    
    gs.info('========================================');
    gs.info('Total Fields: ' + fields.size());
    gs.info('========================================');
}

/**
 * Alternative method using element iteration
 * @param {Object} gr - The GlideRecord object to print
 */
function printGlideRecordFieldsAlternative(gr) {
    if (!gr) {
        gs.error('GlideRecord object is null or undefined');
        return;
    }

    gs.info('========================================');
    gs.info('GlideRecord Field Values (Alternative Method)');
    gs.info('Table: ' + gr.getTableName());
    gs.info('========================================');
    
    // Iterate through elements
    var elements = gr.getElements();
    for (var i = 0; i < elements.length; i++) {
        var element = elements[i];
        var fieldName = element.getName();
        
        gs.info(fieldName + ': ' + gr[fieldName]);
    }
    
    gs.info('========================================');
}

/**
 * Compact version - prints field name and value on one line
 * @param {Object} gr - The GlideRecord object to print
 */
function printGlideRecordFieldsCompact(gr) {
    if (!gr) {
        gs.error('GlideRecord object is null or undefined');
        return;
    }

    gs.info('Table: ' + gr.getTableName());
    
    var fields = gr.getFields();
    for (var i = 0; i < fields.size(); i++) {
        var field = fields.get(i);
        var fieldName = field.getName();
        gs.info(fieldName + ' = ' + gr.getValue(fieldName));
    }
}

// Example usage in ServiceNow:
// var gr = new GlideRecord('incident');
// gr.get('INC0010001'); // Get a specific record
// printGlideRecordFields(gr);

// For demonstration purposes (non-ServiceNow environment)
if (typeof gs === 'undefined') {
    console.log('This script is designed to run in a ServiceNow environment.');
    console.log('');
    console.log('Example usage in ServiceNow:');
    console.log('');
    console.log('var gr = new GlideRecord(\'incident\');');
    console.log('gr.get(\'INC0010001\'); // Get a specific record');
    console.log('printGlideRecordFields(gr);');
    console.log('');
    console.log('Or for all records in a query:');
    console.log('');
    console.log('var gr = new GlideRecord(\'incident\');');
    console.log('gr.addQuery(\'active\', true);');
    console.log('gr.query();');
    console.log('while (gr.next()) {');
    console.log('    printGlideRecordFields(gr);');
    console.log('}');
}

// Export functions for use in other scripts
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        printGlideRecordFields: printGlideRecordFields,
        printGlideRecordFieldsAlternative: printGlideRecordFieldsAlternative,
        printGlideRecordFieldsCompact: printGlideRecordFieldsCompact
    };
}
