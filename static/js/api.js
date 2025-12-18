// api.js - Handles all API call logic

/**
 * Makes a single API call to the backend
 * @param {string} term - The term number
 * @param {string} subject - The course subject (e.g., "MATH")
 * @param {string} catalogNumber - The catalog number (e.g., "135")
 * @returns {Promise<Object>} The API response
 */
async function makeApiCall(term, subject = '', catalogNumber = '') {
    try {
        // Build URL with parameters
        let url = `/call-api?term=${encodeURIComponent(term)}`;
        if (subject) url += `&subject=${encodeURIComponent(subject)}`;
        if (catalogNumber) url += `&catalog_number=${encodeURIComponent(catalogNumber)}`;
        
        const response = await fetch(url, { method: 'GET' });
        const data = await response.json();
        
        return {
            success: data.success,
            data: data.data || null,
            error: data.error || null
        };
    } catch (error) {
        return {
            success: false,
            data: null,
            error: error.message
        };
    }
}

/**
 * Makes API calls for multiple courses
 * @param {string} term - The term number
 * @param {Array<string>} courses - Array of course strings
 * @returns {Promise<Array>} Array of results for each course
 */
async function makeMultipleApiCalls(term, courses) {
    const results = [];
    
    for (const course of courses) {
        // Split course into subject and catalog number if needed
        // Handles formats: "MATH 135", "MATH", "135"
        const parts = course.split(/\s+/);
        const subject = parts[0] || '';
        const catalogNumber = parts[1] || '';
        
        const result = await makeApiCall(term, subject, catalogNumber);
        
        results.push({
            course: course,
            subject: subject,
            catalogNumber: catalogNumber,
            success: result.success,
            data: result.data,
            error: result.error
        });
    }
    
    return results;
}
