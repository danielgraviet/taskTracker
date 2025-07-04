// script.js

// --- DOM Element Selection ---
const taskForm = document.getElementById('task-form');
const taskIdInput = document.getElementById('task-id');
const dateInput = document.getElementById('date');
const companyInput = document.getElementById('company');
const descriptionInput = document.getElementById('description');
const categoryInput = document.getElementById('category');
const taskListDiv = document.getElementById('task-list');
const cancelEditBtn = document.getElementById('cancel-edit');

// Search/Sort controls
const searchInput = document.getElementById('search-input');
const sortBySelect = document.getElementById('sort-by');
const sortOrderSelect = document.getElementById('sort-order');
const filterSortBtn = document.getElementById('filter-sort-btn');
const resetBtn = document.getElementById('reset-btn');

// pagination dom elements
const paginationControlsDiv = document.getElementById("pagination-controls");
const prevPageBtn = document.getElementById("prev-page-btn");
const nextPageBtn = document.getElementById("next-page-btn");
const pageInfoSpan = document.getElementById("page-info");


// --- Configuration ---
// !!! IMPORTANT: Change this URL to where your backend API is running !!!
const API_URL = 'https://tasktrackerbackend-2xhi.onrender.com/api/tasks'; // Default backend port is 5000 or 5001
const LOCAL_API_URL = 'http://localhost:5001/api/tasks';
const localDevelopment = false; // change this flag when needed

const API_TO_USE = localDevelopment ? LOCAL_API_URL : API_URL;

let currentPage = 1;
let totalPages = 1;
let currentFiltersAndSort = {};
const ITEMS_PER_PAGE = 10;


// --- Utility Functions ---

// Format date for display (e.g., YYYY-MM-DD)
function formatDateForDisplay(isoDateString) {
    if (!isoDateString) return 'N/A';
    try {
        // Create date object - it will be in UTC
        const date = new Date(isoDateString);
        // Get year, month (0-indexed), and day in UTC
        const year = date.getUTCFullYear();
        const month = String(date.getUTCMonth() + 1).padStart(2, '0'); // Months are 0-11
        const day = String(date.getUTCDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    } catch (e) {
        console.error("Error formatting date for display:", isoDateString, e);
        return 'Invalid Date';
    }
}

// Format date for setting value of input type="date" (needs YYYY-MM-DD)
function formatDateForInput(isoDateString) {
     // The display format is already YYYY-MM-DD in UTC, which is what the input needs
    return formatDateForDisplay(isoDateString);
}

// --- Core API Interaction & UI Functions ---

// Fetch tasks from API and display them in the list
async function fetchAndDisplayTasks(params = {}, pageToFetch = 1) {
    taskListDiv.innerHTML = 'Loading tasks...'; // Show loading indicator
    let url = API_TO_USE;

    currentFiltersAndSort = { ...params };
    const queryParams = {
        ...params,
        page: pageToFetch,
        limit: ITEMS_PER_PAGE // Uses the constant ITEMS_PER_PAGE
    };

    try {
        // Construct query string from params object if it's not empty
        const queryString = new URLSearchParams(queryParams).toString();
        if (queryString) {
            url = `${API_TO_USE}?${queryString}`;
        }

        console.log("Fetching tasks from:", url); // Log the URL being fetched

        const response = await fetch(url);
        if (!response.ok) {
            // Try to get error message from backend response if possible
            let errorMsg = `HTTP error! status: ${response.status}`;
            try {
                 const errorData = await response.json();
                 errorMsg += ` - ${errorData.msg || JSON.stringify(errorData)}`;
            } catch (jsonError) {
                 // If response is not JSON, use default message
            }
            throw new Error(errorMsg);
        }

        const paginatedResponse = await response.json();

        if (!paginatedResponse || typeof paginatedResponse !== 'object' || !Array.isArray(paginatedResponse.tasks) ||
            typeof paginatedResponse.currentPage !== 'number' || typeof paginatedResponse.totalPages !== 'number' || typeof paginatedResponse.totalItems !== 'number') {
            console.error("Invalid paginated response structure:", paginatedResponse);
            throw new Error("Invalid response format from server. Expected paginated data with 'tasks', 'currentPage', 'totalPages', 'totalItems'.");
        }

        const { tasks, currentPage: backendCurrentPage, totalPages: backendTotalPages, totalItems } = paginatedResponse;

        taskListDiv.innerHTML = '';
        currentPage = backendCurrentPage;
        totalPages = backendTotalPages;

        if (tasks.length === 0) {
            taskListDiv.innerHTML = '<p>No tasks found matching your criteria.</p>';
            return;
        }

        tasks.forEach(task => {
            const taskElement = document.createElement('div');
            taskElement.classList.add('task-item');
            // Use backticks (`) for template literals to easily embed variables
            taskElement.innerHTML = `
                <div class="task-details">
                    <p><strong>Date:</strong> ${formatDateForDisplay(task.date)}</p>
                    <p><strong>Company:</strong> ${escapeHTML(task.company)}</p>
                    <p><strong>Description:</strong> ${escapeHTML(task.description)}</p>
                    <p><strong>Category:</strong> ${escapeHTML(task.category)}</p>
                    <p><small>ID: ${escapeHTML(task._id)} | Created: ${formatDateForDisplay(task.createdAt)}</small></p>
                </div>
                <div class="task-actions">
                    <button class="edit-btn" onclick="editTask('${task._id}')">Edit</button>
                    <button class="delete-btn" onclick="deleteTask('${task._id}')">Delete</button>
                </div>
            `;
            taskListDiv.appendChild(taskElement);
        });

        updatePaginationControls(currentPage, totalPages, totalItems);
        if (paginationControlsDiv && totalItems > 0) {
            paginationControlsDiv.style.display = 'flex';
        } else if (paginationControlsDiv) {
            paginationControlsDiv.style.display = 'none';
        }
    } catch (error) {
        console.error('Error fetching or displaying tasks:', error);
        taskListDiv.innerHTML = `<p style="color: red;">Error loading tasks: ${error.message}. Please ensure the backend server is running and the API URL is correct.</p>`;
    }
}

function updatePaginationControls(page, totalPgs, totalItms) {
    // console.log('updatePaginationControls called with - page:', page, 'totalPgs:', totalPgs, 'totalItms:', totalItms);
    if (!pageInfoSpan || !prevPageBtn || !nextPageBtn || !paginationControlsDiv) {
        // console.error('Pagination DOM elements not all found!');
        return;
    }

    if (totalItms === 0) {
        // console.log('updatePaginationControls: totalItms is 0, hiding controls.');
        pageInfoSpan.textContent = 'No tasks';
        prevPageBtn.disabled = true;
        nextPageBtn.disabled = true;
        paginationControlsDiv.style.display = 'none';
        return;
    }
    // console.log('updatePaginationControls: totalItms > 0, attempting to show controls.');
    // paginationControlsDiv.style.display = 'flex'; // Handled in fetchAndDisplayTasks
    pageInfoSpan.textContent = `Page ${page} of ${totalPgs} (${totalItms} items)`;
    prevPageBtn.disabled = page <= 1;
    nextPageBtn.disabled = page >= totalPgs;
}

// Handle form submission for creating or updating tasks
async function handleFormSubmit(event) {
    event.preventDefault(); // Prevent default page reload

    const taskData = {
        // Get value from date input; it should be in 'YYYY-MM-DD' format
        date: dateInput.value,
        company: companyInput.value.trim(),
        description: descriptionInput.value.trim(),
        category: categoryInput.value,
    };

    // Simple frontend validation (can be more robust)
    if (!taskData.date || !taskData.company || !taskData.description || !taskData.category) {
         alert('Please fill out all required fields (Date, Company, Description, Category).');
         return;
    }


    const taskId = taskIdInput.value; // Get ID from hidden field (if editing)
    const method = taskId ? 'PUT' : 'POST';
    const url = taskId ? `${API_TO_USE}/${taskId}` : API_TO_USE;

    console.log(`Sending ${method} request to ${url} with data:`, taskData);

    try {
        const response = await fetch(url, {
            method: method,
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(taskData),
        });

        if (!response.ok) {
             // Try to get error details from backend response
             let errorMsg = `HTTP error! status: ${response.status}`;
             try {
                 const errorData = await response.json();
                 // Format validation errors nicely if present
                 if (errorData.errors) {
                     errorMsg += ": Validation Failed - ";
                     errorMsg += Object.entries(errorData.errors).map(([field, err]) => `${field}: ${err.message}`).join(', ');
                 } else {
                     errorMsg += ` - ${errorData.msg || JSON.stringify(errorData)}`;
                 }

             } catch (jsonError) {
                  // Response might not be JSON, stick with status
             }
             throw new Error(errorMsg);
        }

        // const result = await response.json(); // Get the saved/updated task data (optional)
        // console.log('Task saved/updated successfully:', result);

        clearForm(); // Clear the form fields
        await fetchAndDisplayTasks({}, 1); // Refresh the task list (await to ensure it finishes)
        alert(`Task successfully ${taskId ? 'updated' : 'added'}!`); // User feedback


    } catch (error) {
        console.error(`Error saving task (ID: ${taskId || 'New'}):`, error);
        // Provide more specific feedback if possible
        alert(`Error saving task: ${error.message}`);
    }
}

// Populate the form with data for editing a specific task
async function editTask(id) {
    console.log('Attempting to edit task ID:', id);
    try {
        const response = await fetch(`${API_TO_USE}/${id}`);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const task = await response.json();

        // Populate the form fields
        taskIdInput.value = task._id; // Set the hidden ID field
        dateInput.value = formatDateForInput(task.date); // Format for input type=date
        companyInput.value = task.company;
        descriptionInput.value = task.description;
        categoryInput.value = task.category;

        cancelEditBtn.style.display = 'inline-block'; // Show the cancel edit button
        taskForm.querySelector('button[type="submit"]').textContent = 'Update Task'; // Change button text
        taskForm.querySelector('h2').textContent = 'Edit Task'; // Change form title

        window.scrollTo({ top: 0, behavior: 'smooth' }); // Scroll to top to easily see the populated form

    } catch (error) {
        console.error('Error fetching task for editing:', error);
        alert('Could not load task details for editing. Please try again.');
    }
}

// Delete a task after confirmation
async function deleteTask(id) {
    if (!confirm(`Are you sure you want to delete task ID: ${id}? This action cannot be undone.`)) {
        return; // Stop if user clicks 'Cancel' on the confirmation dialog
    }

    console.log('Attempting to delete task ID:', id);
    try {
        const response = await fetch(`${API_TO_USE}/${id}`, {
            method: 'DELETE',
        });

        if (!response.ok) {
            let errorMsg = `HTTP error! status: ${response.status}`;
             try {
                 const errorData = await response.json();
                 errorMsg += ` - ${errorData.msg || JSON.stringify(errorData)}`;
             } catch (jsonError) { /* Ignore if not JSON */ }
            throw new Error(errorMsg);
        }

        // const result = await response.json(); // Get the success message (optional)
        // console.log(result.msg);

        alert('Task deleted successfully!'); // User feedback
        const pageToFetchAfterDelete = (taskListDiv.querySelectorAll('.task-item').length === 1 && currentPage > 1)
                            ? currentPage - 1
                            : currentPage;
        await fetchAndDisplayTasks(currentFiltersAndSort, pageToFetchAfterDelete);

    } catch (error) {
        console.error('Error deleting task:', error);
        alert(`Error deleting task: ${error.message}`);
    }
}

// Clear the form, reset button texts, and hide cancel button
function clearForm() {
    taskForm.reset(); // Resets all form fields to their default values
    taskIdInput.value = ''; // Explicitly clear the hidden ID field
    cancelEditBtn.style.display = 'none'; // Hide the cancel button
    taskForm.querySelector('button[type="submit"]').textContent = 'Save Task'; // Reset button text
    taskForm.querySelector('h2').textContent = 'Add Task'; // Reset form title
    // Ensure date is also cleared if reset() doesn't cover it reliably
    dateInput.value = '';
}


// --- Filtering and Sorting Functions ---

// Apply current filters and sorting options
function applyFiltersAndSort() {
    const params = {};
    const searchTerm = searchInput.value.trim();
    const sortBy = sortBySelect.value;
    const sortOrder = sortOrderSelect.value;

    if (searchTerm) {
        params.search = searchTerm;
    }
    if (sortBy) {
        params.sortBy = sortBy;
        params.order = sortOrder; // Only include order if sortBy is present
    }
    // Future: Add dedicated category/company filters here if needed
    // if (categoryFilterSelect.value) { params.category = categoryFilterSelect.value; }

    console.log('Applying filters/sort with params:', params);
    fetchAndDisplayTasks(params, 1);
}

// Reset all filters and sorting to default and refresh list
function resetFiltersAndSort() {
     searchInput.value = '';
     sortBySelect.value = 'date'; // Reset sort criteria to default
     sortOrderSelect.value = 'desc';// Reset sort order to default
     // Reset any other filter inputs here
     console.log('Resetting filters and sorting.');
     fetchAndDisplayTasks({}, 1); // Fetch with default settings (no params)
}

// Basic HTML escaping function to prevent XSS
function escapeHTML(str) {
    if (typeof str !== 'string') return str; // Return non-strings as is
    return str.replace(/[&<>"']/g, function (match) {
        const escape = {
            '&': '&',
            '<': '<',
            '>': '>',
            '"': '"',
        };
        return escape[match];
    });
}


// --- Event Listeners ---
// Use DOMContentLoaded to ensure the DOM is fully loaded before attaching listeners
document.addEventListener('DOMContentLoaded', () => {
    if (taskForm) {
        taskForm.addEventListener('submit', handleFormSubmit);
    } else { console.error("Task form not found!"); }

    if (cancelEditBtn) {
        cancelEditBtn.addEventListener('click', clearForm);
    } else { console.error("Cancel edit button not found!"); }

     if (filterSortBtn) {
        filterSortBtn.addEventListener('click', applyFiltersAndSort);
    } else { console.error("Filter/Sort button not found!"); }

     if (resetBtn) {
        resetBtn.addEventListener('click', resetFiltersAndSort);
    } else { console.error("Reset button not found!"); }

    // pagination
    if (prevPageBtn) {
        prevPageBtn.addEventListener('click', () => {
            if (currentPage > 1) {
                // Call fetchAndDisplayTasks with the previous page number
                // and the currently active filters/sort options
                fetchAndDisplayTasks(currentFiltersAndSort, currentPage - 1);
            }
        });
    } else { console.error("Previous page button not found!"); }

    if (nextPageBtn) {
        nextPageBtn.addEventListener('click', () => {
            if (currentPage < totalPages) {
                // Call fetchAndDisplayTasks with the next page number
                // and the currently active filters/sort options
                fetchAndDisplayTasks(currentFiltersAndSort, currentPage + 1);
            }
        });
    } else { console.error("Next page button not found!"); }

    // --- Initial Data Load ---
    fetchAndDisplayTasks({}, 1); // Load tasks when the page is ready
});

// Make editTask and deleteTask globally accessible so onclick handlers in HTML can find them
// (Alternatively, attach event listeners dynamically in fetchAndDisplayTasks)
window.editTask = editTask;
window.deleteTask = deleteTask;