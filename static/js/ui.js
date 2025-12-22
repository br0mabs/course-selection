// ui.js - Handles all UI interactions and DOM manipulation

/**
 * Adds a new course input field
 */
function addField() {
    const container = document.getElementById('fieldsContainer');
    const fieldRow = document.createElement('div');
    fieldRow.className = 'field-row';
    fieldRow.innerHTML = `
        <input type="text" placeholder="">
        <button class="remove-btn" onclick="removeField(this)">×</button>
    `;
    container.appendChild(fieldRow);
}

/**
 * Removes a course input field
 * @param {HTMLElement} button - The remove button that was clicked
 */
function removeField(button) {
    const container = document.getElementById('fieldsContainer');
    const fieldRows = container.querySelectorAll('.field-row');
    
    // Keep at least one field
    if (fieldRows.length > 1) {
        button.parentElement.remove();
    } else {
        alert('You must have at least one course field!');
    }
}

/**
 * Shows the loader
 */
function showLoader() {
    const loader = document.getElementById('loader');
    loader.classList.add('show');
}

/**
 * Hides the loader
 */
function hideLoader() {
    const loader = document.getElementById('loader');
    loader.classList.remove('show');
}

/**
 * Formats time to standard 12 hour format
 * @param {string} time - Time in format ISO-8601 format
 * @returns {string} Formatted time like "9:30 AM" or "2:30 PM"
 */
function formatTime(time) {
    if (!time) return 'N/A';
    tmp = parseTime(time)
    const ampm = tmp[0] >= 12 ? 'PM' : 'AM';
    
    hours = tmp[0] % 12 || 12;
    minutes = tmp[1];
    
    return `${hours}:${minutes} ${ampm}`;
}

function parseMeeting(meetingTimes) {
    const arr = ["M", "T", "W", "Th", "F", "S", "Su"];
    let ans = "";
    for (let i = 0; i < meetingTimes.length; ++i) {
        if (meetingTimes[i] == "Y") {
            ans += arr[i];
        }
    }
    return ans;
}

/**
 * Gets enrollment status based on capacity
 * @param {number} total - Total enrolled students
 * @param {number} capacity - Maximum capacity
 * @returns {Object} Status object with class and text
 */
function getEnrollmentStatus(total, capacity) {
    const remaining = capacity - total;
    const percentFull = (total / capacity) * 100;
    if (remaining <= 0) {
        return { class: 'full', text: 'FULL' };
    } else if (percentFull >= 80) {
        return { class: 'limited', text: `${remaining} left` };
    } else {
        return { class: 'available', text: `${remaining} left` };
    }
}

/**
 * Creates a course card element
 * @param {Object} course - Course object with schedule data
 * @returns {HTMLElement} Course card element
 */
function createCourseCard(course) {
    const courseCard = document.createElement('div');
    courseCard.className = 'course-card';
    
    // Course title
    const courseTitle = document.createElement('div');
    courseTitle.className = 'course-title';
    courseTitle.textContent = `${course.subjectCode || 'N/A'} ${course.catalogNumber || 'N/A'} - ${course.component || 'N/A'}`;
    
    // Course details
    const courseDetails = document.createElement('div');
    courseDetails.className = 'course-details';
    
    // Class Number
    const classNumberItem = document.createElement('div');
    classNumberItem.className = 'detail-item';
    classNumberItem.innerHTML = `
        <span class="detail-label">Class #:</span>
        <span class="detail-value">${course.classNumber || 'N/A'}</span>
    `;
    
    // Meeting Times
    const meetingTimesItem = document.createElement('div');
    meetingTimesItem.className = 'detail-item';
    meetingTimesItem.innerHTML = `
        <span class="detail-label">Days:</span>
        <span class="detail-value">${parseMeeting(course.meetingTimes) || 'N/A'}</span>
    `;
    
    // Time Range
    const timeItem = document.createElement('div');
    timeItem.className = 'detail-item';
    timeItem.innerHTML = `
        <span class="detail-label">Time:</span>
        <span class="detail-value">${formatTime(course.classStart)} - ${formatTime(course.classEnd)}</span>
    `;
    
    // Enrollment
    const enrollmentItem = document.createElement('div');
    enrollmentItem.className = 'detail-item';
    const enrollStatus = getEnrollmentStatus(course.enrollmentTotal || 0, course.enrollmentCapacity || 0);
    enrollmentItem.innerHTML = `
        <span class="detail-label">Enrollment:</span>
        <span class="detail-value enrollment-status">
            ${course.enrollmentTotal || 0}/${course.enrollmentCapacity || 0}
            <span class="enrollment-badge ${enrollStatus.class}">${enrollStatus.text}</span>
        </span>
    `;
    
    courseDetails.appendChild(classNumberItem);
    courseDetails.appendChild(meetingTimesItem);
    courseDetails.appendChild(timeItem);
    courseDetails.appendChild(enrollmentItem);
    
    courseCard.appendChild(courseTitle);
    courseCard.appendChild(courseDetails);
    
    return courseCard;
}

/**
 * Shows success response with each schedule in its own element
 * @param {string} title - The response title
 * @param {Array} data - Array of arrays of course objects (schedules)
 */
function showSuccessResponse(title, data) {
    const response = document.getElementById('response');
    const responseHeader = document.getElementById('responseHeader');
    const responseTitle = document.getElementById('responseTitle');
    const responseContent = document.getElementById('responseContent');
    
    // Clear previous content
    responseContent.innerHTML = '';
    
    // Set header
    responseHeader.classList.remove('error');
    responseTitle.textContent = title;
    
    const schedulesContainer = document.createElement('div');
    schedulesContainer.className = 'schedules-container';
    
    // Create a separate element for each schedule
    data.forEach((schedule, index) => {
        const scheduleItem = document.createElement('div');
        scheduleItem.className = 'schedule-item';
        
        const scheduleHeader = document.createElement('div');
        scheduleHeader.className = 'schedule-header';
        scheduleHeader.textContent = `Schedule ${index + 1}`;
        
        const scheduleContent = document.createElement('div');
        scheduleContent.className = 'schedule-content';
        
        // Create a course card for each course in the schedule
        schedule.forEach(course => {
            const courseCard = createCourseCard(course);
            scheduleContent.appendChild(courseCard);
        });
        
        scheduleItem.appendChild(scheduleHeader);
        scheduleItem.appendChild(scheduleContent);
        schedulesContainer.appendChild(scheduleItem);
    });
    
    responseContent.appendChild(schedulesContainer);
    response.classList.add('show');
}

/**
 * Shows error response
 * @param {string} title - The error title
 * @param {string} errorMessage - The error message
 */
function showErrorResponse(title, errorMessage) {
    const response = document.getElementById('response');
    const responseHeader = document.getElementById('responseHeader');
    const responseTitle = document.getElementById('responseTitle');
    const responseContent = document.getElementById('responseContent');
    
    responseHeader.classList.add('error');
    responseTitle.textContent = title;
    
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error-message';
    errorDiv.textContent = errorMessage;
    
    responseContent.innerHTML = '';
    responseContent.appendChild(errorDiv);
    
    response.classList.add('show');
}

/**
 * Clears the response display
 */
function clearResponse() {
    const response = document.getElementById('response');
    response.classList.remove('show');
}

/**
 * Gets all course values from input fields
 * @returns {Array<string>} Array of course values
 */
function getCourseValues() {
    const inputs = document.querySelectorAll('.field-row input');
    const courses = [];
    
    inputs.forEach(input => {
        const value = input.value.trim();
        if (value) {
            courses.push(value);
        }
    });
    
    return courses;
}

/**
 * Gets the term number from input
 * @returns {string} The term number
 */
function getTermNumber() {
    return document.getElementById('termInput').value.trim();
}

/**
 * Enables or disables the generate schedules button
 * @param {boolean} disabled - Whether to disable the button
 */
function setGenerateButtonDisabled(disabled) {
    const button = document.getElementById('generateSchedulesBtn');
    button.disabled = disabled;
}
