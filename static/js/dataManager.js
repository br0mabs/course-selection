// dataManager.js - Manages data storage and history

// Global list to store all API calls
let apiCallHistory = [];

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
 * Exports history as JSON string
 * @returns {string} JSON string of history
 */
function exportHistoryAsJson() {
    return JSON.stringify(apiCallHistory, null, 2);
}
