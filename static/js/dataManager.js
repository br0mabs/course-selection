// dataManager.js - Manages data storage and history

// Global list to store all API calls
let apiCallHistory = [];

// global object to store 

/**
 * Stores class information from API response
 * @param {string} term - The term number
 * @param {string} subject - The course subject
 * @param {string} catalogNumber - The catalog number
 * @param {Object} apiResponse - The raw API response data
 * @returns {string} The key used to store the data
 */
function storeClassData(classData, term, subject, catalogNumber, apiResponse) {
    const key = `${term}-${subject}-${catalogNumber}`;
    
    classData.courses[key] = {
        term: term,
        subject: subject,
        catalogNumber: catalogNumber,
        courseName: `${subject} ${catalogNumber}`,
        rawData: apiResponse,
        classes: parseClassSections(apiResponse, term, subject, catalogNumber),
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
function parseClassSections(apiResponse, term, subject, catalogNumber) {
    // This will depend on your API structure
    // Adjust based on the actual response format
    if (!apiResponse || !Array.isArray(apiResponse)) {
        return [];
    }
    
    return apiResponse.map(section => ({
        termCode: term || null,
        subjectCode: subject || null,
        catalogNumber: catalogNumber || null,
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
function getClassData(classData, term, subject, catalogNumber) {
    const key = `${term}-${subject}-${catalogNumber}`;
    return classData.courses[key] || null;
}

/**
 * Gets all stored class data
 * @returns {Object} All class data
 */
function getAllClassData(classData) {
    return classData;
}

/**
 * Gets all courses as an array
 * @returns {Array} Array of all course data
 */
function getAllCourses(classData) {
    return Object.values(classData.courses);
}

/**
 * Clears all stored class data
 */
function clearClassData(classData) {
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
function exportAllDataAsJson(classData) {
    return JSON.stringify({
        classData: classData,
        history: apiCallHistory
    }, null, 2);
}

/**
 * Exports only class data as JSON string
 * @returns {string} JSON string of class data
 */
function exportClassDataAsJson(classData) {
    return JSON.stringify(classData, null, 2);
}


// we need to split into LEC,TUT,TST as well
// so bascially we have to select one from each

/**
 * 
 * @param {Object} classData data of classes
 * @returns {Array} array of list of classes (for each course)
 */
function arrayify(classData) {
    const baseArray = []
    for (const course in classData.courses) {
        dict = {}
        for (const session of classData.courses[course].classes) {
            // exempt online
            if (session.meetingTimes === "NNNNNNN") continue;
            if (!dict[session.component]) {
                dict[session.component] = [];
            } else if (session.component === "TST") {
                // only allow one TST -- ex. if physics based its the same time anyways
                // we will except online
                continue;
            }
            dict[session.component].push(session);
        }
        tmp = []
        for (key in dict) {
            baseArray.push(dict[key])
        }
    }
    return baseArray;
}


// how should we specify time so that its easy to compare
// a list of sessions, with start time, end time, and date
// since there are only 7 days, we should just hard code an array of dates
// we should just have an array of length 7, storing lists of dates
// recursive formula, passing an array
// x

// we need to first get it into an iterable format
// this means we have to have a master array
// then we have to add each object into a list, and then push them into the master array
// then we can iterate over each object, which we will then put into another array

// we want to parse ISO-8601  into [HH, mm] format
function parseTime(rawdate) {
    arr = rawdate.split("T")[1].split(":")
    arr.pop()
    return arr
}

// converts a date in [HH, mm] format to an integer time rep
function convertToSingular(time) {
    return parseInt(time[0]) * 60 + parseInt(time[1]);
}

// how should we display time
// [start, end] tuples
// then check each one

function findAllSchedules(baseArray) {
    const ans = [];
    const tmp = [[], [], [], [], [], [], []];
    let counter = 0;
    function helper(index, current, schedule) {
        if (index === baseArray.length) {
            ans.push([...current]);
            counter += 1;
            return;
        }
        for (const item of baseArray[index]) {
            const check = [convertToSingular(parseTime(item.classStart)), convertToSingular(parseTime(item.classEnd))]
            let ok = true;
            // check which times are a hit
            for (var i = 0; i < 7; ++i) {
                if (item.meetingTimes[i] == 'Y') {
                    // we then have to check the timing
                    // we will convert time into a single rep with hour * 60 + minute
                    // and then check each interval in that day

                    // [0] = begin, [1] = end
                    for (const classSection of schedule[i]) {
                        // disjoint
                        if (check[1] <= classSection[0] || check[0] >= classSection[1]) continue;
                        // otherwise bad
                        ok = false;
                        break;
                    }
                    if (!ok) break;
                }
            }
            if (!ok) continue;
            current.push(item);
            for (var i = 0; i < 7; ++i) {
                if (item.meetingTimes[i] == 'Y') {
                    schedule[i].push(check);
                }
            }
            helper(index + 1, current, schedule);
            current.pop();
            for (var i = 0; i < 7; ++i) {
                if (item.meetingTimes[i] == 'Y') {
                    schedule[i].pop();
                }
            }
        }
    }

    helper(0, [], tmp);
    console.log(counter);
    return ans;
}

// issue to fix: TST's on different days show up as conflict, since same date of week and time
// look into how UWFlow is able to get the date.