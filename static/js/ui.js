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
 * Shows success response
 * @param {string} title - The response title
 * @param {Object} data - The data to display
 */
function showSuccessResponse(title, data) {
    const response = document.getElementById('response');
    const responseTitle = document.getElementById('responseTitle');
    const responseData = document.getElementById('responseData');
    
    response.classList.remove('error');
    response.classList.add('show', 'success');
    responseTitle.textContent = title;
    responseData.textContent = JSON.stringify(data, null, 2);
}

/**
 * Shows error response
 * @param {string} title - The error title
 * @param {string} errorMessage - The error message
 */
function showErrorResponse(title, errorMessage) {
    const response = document.getElementById('response');
    const responseTitle = document.getElementById('responseTitle');
    const responseData = document.getElementById('responseData');
    
    response.classList.remove('success');
    response.classList.add('show', 'error');
    responseTitle.textContent = title;
    responseData.textContent = errorMessage;
}

/**
 * Clears the response display
 */
function clearResponse() {
    const response = document.getElementById('response');
    response.classList.remove('show', 'success', 'error');
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
