/**
 * Business Rule: Validate Related Record Creation
 * 
 * Table: u_custom_table (replace with your custom table name)
 * When: Before Insert
 * Order: 100
 * Active: true
 * 
 * Purpose: Validates that a related record being created from a Problem
 *          has the proper reference set and user has appropriate permissions
 * 
 * Instructions:
 * 1. Replace 'u_custom_table' with your actual custom table name
 * 2. Replace 'u_problem' with your actual reference field name
 * 3. Create this as a Before Insert Business Rule on your custom table
 * 4. Adjust validation logic as needed
 */

(function executeRule(current, previous /*null when async*/) {
    
    // Configuration
    var problemFieldName = 'u_problem'; // Replace with your actual reference field name
    var requiredRoles = ['itil', 'problem_manager']; // Adjust roles as needed
    
    // Check if this record is being created from a Problem record
    if (current.isNewRecord()) {
        
        // Validation 1: Ensure the problem reference is set
        if (!current[problemFieldName] || current[problemFieldName].nil()) {
            gs.addErrorMessage('A related Problem record must be specified');
            current.setAbortAction(true);
            return;
        }
        
        // Validation 2: Verify the problem record exists
        var problemGr = new GlideRecord('problem');
        if (!problemGr.get(current[problemFieldName])) {
            gs.addErrorMessage('The specified Problem record does not exist');
            current.setAbortAction(true);
            return;
        }
        
        // Validation 3: Check if user has appropriate role
        var hasRequiredRole = false;
        for (var i = 0; i < requiredRoles.length; i++) {
            if (gs.hasRole(requiredRoles[i])) {
                hasRequiredRole = true;
                break;
            }
        }
        
        if (!hasRequiredRole && !gs.hasRole('admin')) {
            gs.addErrorMessage('You do not have the required role to create this record');
            current.setAbortAction(true);
            return;
        }
        
        // Optional: Set default values
        if (!current.assigned_to || current.assigned_to.nil()) {
            current.assigned_to = gs.getUserID();
        }
        
        // Optional: Log for audit trail (use gs.debug() for less noise, gs.info() for audit)
        gs.debug('Custom table record created from Problem: ' + current[problemFieldName] + 
                 ' by user: ' + gs.getUserName());
    }
    
})(current, previous);
