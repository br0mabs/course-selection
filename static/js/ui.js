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
 * Shows success response with each schedule in its own element
 * @param {string} title - The response title
 * @param {Array} data - Array of arrays of objects (schedules)
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
        
        const pre = document.createElement('pre');
        pre.textContent = JSON.stringify(schedule, null, 2);
        
        scheduleContent.appendChild(pre);
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
