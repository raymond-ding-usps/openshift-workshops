/**
 * Business Rule: Enable New Button for Custom Table Related List
 * 
 * Table: problem
 * When: Display
 * Order: 100
 * Active: true
 * 
 * Purpose: Ensures the "New" button is visible on the custom table related list
 *          when viewing a Problem record, based on user permissions
 * 
 * Instructions:
 * 1. Replace 'u_custom_table' with your actual custom table name
 * 2. Create this as a Display Business Rule on the problem table
 * 3. Set to run on all inserts/updates
 * 4. Test with different user roles
 */

(function() {
    // Configuration
    var customTableName = 'u_custom_table'; // Replace with your custom table name
    
    // Check if the current user has permission to create records in the custom table
    var gr = new GlideRecord(customTableName);
    
    if (gr.canCreate()) {
        // User has create permission, ensure the New button is visible
        g_form.setRelatedListNewButton(customTableName, true);
        
        // Optional: Log for debugging (remove in production or use gs.debug())
        gs.debug('New button enabled for ' + customTableName + ' related list for user: ' + gs.getUserName());
    } else {
        // User does not have create permission, hide the New button
        g_form.setRelatedListNewButton(customTableName, false);
        
        // Optional: Log for debugging (remove in production or use gs.debug())
        gs.debug('New button disabled for ' + customTableName + ' related list for user: ' + gs.getUserName() + ' (no create permission)');
    }
})();
