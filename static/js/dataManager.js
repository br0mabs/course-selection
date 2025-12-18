// dataManager.js - Manages data storage and history

// Global list to store all API calls
let apiCallHistory = [];

// Global object to store all class information
let classData = {
    courses: {},  // Keyed by "TERM-SUBJECT-CATALOG" (e.g., "1259-MATH-135")
    lastUpdated: null
};

/**
 * Stores class information from API response
 * @param {string} term - The term number
 * @param {string} subject - The course subject
 * @param {string} catalogNumber - The catalog number
 * @param {Object} apiResponse - The raw API response data
 * @returns {string} The key used to store the data
 */
function storeClassData(term, subject, catalogNumber, apiResponse) {
    const key = `${term}-${subject}-${catalogNumber}`;
    
    classData.courses[key] = {
        term: term,
        subject: subject,
        catalogNumber: catalogNumber,
        courseName: `${subject} ${catalogNumber}`,
        rawData: apiResponse,
        classes: parseClassSections(apiResponse),
        fetchedAt: new Date().toISOString()
    };
    
    classData.lastUpdated = new Date().toISOString();
    
    console.log(`Stored class data for ${key}:`, classData.courses[key]);
    
    return key;
}

/**
 * Parses class sections from API response
 * @param {Object} apiResponse - The raw API response
 * @returns {Array} Array of parsed class sections
 */
function parseClassSections(apiResponse) {
    // This will depend on your API structure
    // Adjust based on the actual response format
    if (!apiResponse || !Array.isArray(apiResponse)) {
        return [];
    }
    
    return apiResponse.map(section => ({
        classNumber: section.classNumber || null,
        component: section.courseComponent || null,
        enrollmentCapacity: section.maxEnrollmentCapacity || 0,
        enrollmentTotal: section.enrolledStudents || 0,
        meetingTimes: section.scheduleData[0].classMeetingWeekPatternCode || null,
        classStart: section.scheduleData[0].classMeetingStartTime || null,
        classEnd: section.scheduleData[0].classMeetingEndTime || null
    }));
}

/**
 * Gets stored class data by key
 * @param {string} term - The term number
 * @param {string} subject - The course subject
 * @param {string} catalogNumber - The catalog number
 * @returns {Object|null} The stored class data or null
 */
function getClassData(term, subject, catalogNumber) {
    const key = `${term}-${subject}-${catalogNumber}`;
    return classData.courses[key] || null;
}

/**
 * Gets all stored class data
 * @returns {Object} All class data
 */
function getAllClassData() {
    return classData;
}

/**
 * Gets all courses as an array
 * @returns {Array} Array of all course data
 */
function getAllCourses() {
    return Object.values(classData.courses);
}

/**
 * Clears all stored class data
 */
function clearClassData() {
    classData = {
        courses: {},
        lastUpdated: null
    };
    console.log('All class data cleared');
}

/**
 * Adds a schedule request to history
 * @param {string} term - The term number
 * @param {Array<string>} courses - Array of courses
 * @returns {Object} The saved request object
 */
function saveScheduleRequest(term, courses) {
    const scheduleRequest = {
        timestamp: new Date().toISOString(),
        term: term,
        courses: courses
    };
    
    apiCallHistory.push(scheduleRequest);
    
    console.log('Schedule Request:', scheduleRequest);
    console.log('API Call History:', apiCallHistory);
    
    return scheduleRequest;
}

/**
 * Gets all schedule requests from history
 * @returns {Array} Array of all schedule requests
 */
function getHistory() {
    return apiCallHistory;
}

/**
 * Clears all history
 */
function clearHistory() {
    apiCallHistory = [];
    console.log('History cleared');
}

/**
 * Gets the most recent schedule request
 * @returns {Object|null} The most recent request or null if empty
 */
function getLatestRequest() {
    return apiCallHistory.length > 0 ? apiCallHistory[apiCallHistory.length - 1] : null;
}

/**
 * Exports all data (class data + history) as JSON string
 * @returns {string} JSON string of all data
 */
function exportAllDataAsJson() {
    return JSON.stringify({
        classData: classData,
        history: apiCallHistory
    }, null, 2);
}

/**
 * Exports only class data as JSON string
 * @returns {string} JSON string of class data
 */
function exportClassDataAsJson() {
    return JSON.stringify(classData, null, 2);
}
