// app.js - Main application logic that ties everything together

/**
 * Main function to generate schedules based on user input
 */
async function generateSchedules() {
    // Get user inputs
    const term = getTermNumber();
    const courses = getCourseValues();
    
    // Validate inputs
    if (!term) {
        alert('Please enter a term number!');
        return;
    }
    
    if (courses.length === 0) {
        alert('Please enter at least one course!');
        return;
    }
    
    // Save request to history
    saveScheduleRequest(term, courses);
    
    // Update UI - show loading state
    setGenerateButtonDisabled(true);
    showLoader();
    clearResponse();
    
    try {
        // Make API calls for all courses
        const results = await makeMultipleApiCalls(term, courses);
        // directly accessing is blocked by CORS
        //fetchCourseData("1261", "MATH", "136");
    
        // Hide loader and show results
        hideLoader();
        showSuccessResponse(
            `Generated ${results.length} Schedules for ${courses.length} Course(s)`,
            results
        );
        
    } catch (error) {
        // Handle errors
        hideLoader();
        showErrorResponse('Error', error.message);
        
    } finally {
        // Re-enable button
        setGenerateButtonDisabled(false);
    }
}

/**
 * Legacy function - kept for backwards compatibility
 * This was the original single API call function
 */
async function callApi() {
    const term = getTermNumber();
    const courses = getCourseValues();
    
    saveScheduleRequest(term, courses);
    
    setGenerateButtonDisabled(true);
    showLoader();
    clearResponse();
    
    try {
        let url = '/call-api?';
        if (term) {
            url += `term=${encodeURIComponent(term)}`;
        }
        courses.forEach(course => {
            url += `&param=${encodeURIComponent(course)}`;
        });
        
        const response = await fetch(url, { method: 'GET' });
        const data = await response.json();
        
        hideLoader();
        
        if (data.success) {
            showSuccessResponse('Success!', data.data);
        } else {
            showErrorResponse('Error', data.error);
        }
        
    } catch (error) {
        hideLoader();
        showErrorResponse('Error', error.message);
        
    } finally {
        setGenerateButtonDisabled(false);
    }
}
