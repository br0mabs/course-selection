// api.js - Handles all API call logic

/**
 * Makes a single API call to the backend
 * @param {string} term - The term number
 * @param {string} subject - The course subject (e.g., "MATH")
 * @param {string} catalogNumber - The catalog number (e.g., "135")
 * @returns {Promise<Object>} The API response
 */
async function makeApiCall(classData, term, subject = '', catalogNumber = '') {
    try {
        // Build URL with parameters
        let url = `/call-api?term=${encodeURIComponent(term)}`;
        if (subject) url += `&subject=${encodeURIComponent(subject)}`;
        if (catalogNumber) url += `&catalog_number=${encodeURIComponent(catalogNumber)}`;
        
        const response = await fetch(url, { method: 'GET' });
        const data = await response.json();
        
        // If successful, store the class data
        if (data.success && data.data) {
            storeClassData(classData, term, subject, catalogNumber, data.data);
        }
        
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

    let classData = {
        courses: {},
        lastUpdated: null
    };

    const results = [];
    
    for (const course of courses) {
        // Split course into subject and catalog number if needed
        // Handles formats: "MATH 135", "MATH", "135"
        const parts = course.split(/\s+/);
        const subject = parts[0] || '';
        const catalogNumber = parts[1] || '';
        
        const result = await makeApiCall(classData, term, subject, catalogNumber);

        // we will take the results array and instead return valid course combinations
        
        results.push({
            course: course,
            subject: subject,
            catalogNumber: catalogNumber,
            success: result.success,
            data: result.data,
            error: result.error
        });
    }

    // here we should process the class data
    console.log(classData)
    getTests(classData);

    baseArray = arrayify(classData)
    console.log(baseArray);

    console.log(findAllSchedules(baseArray))

    // after arrayify we need to get one from each one.
    // so we iterate through each, and select indices
    // we should process as we go

    // we slowly fill up schedule, and also remember which indices we have chosen




    //console.log("trol");
    //console.log(classData);
    return results;
}

