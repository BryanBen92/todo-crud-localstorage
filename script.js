// Wait for the DOM to be fully loaded before running any code
document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const taskForm = document.getElementById('taskForm');
    const taskIdInput = document.getElementById('taskId');
    const taskNameInput = document.getElementById('taskName');
    const taskTypeInput = document.getElementById('taskType');
    const taskDescInput = document.getElementById('taskDesc');
    const taskColorInput = document.getElementById('taskColor');
    const saveBtn = document.getElementById('saveBtn');
    const clearFormBtn = document.getElementById('clearFormBtn');
    const clearAllBtn = document.getElementById('clearAllBtn');
    const searchInput = document.getElementById('searchInput');
    const taskListContainer = document.getElementById('taskList');
  
    // Check if DOM elements are correctly selected
    console.log('Task form:', taskForm);
    console.log('Task list container:', taskListContainer);
    
    // Array to store tasks
    let tasks = [];
  
    // Load tasks from localStorage
    function loadTasks() {
        const savedTasks = localStorage.getItem('todoTasks');
        if (savedTasks) {
            try {
                tasks = JSON.parse(savedTasks);
                console.log('Tasks loaded from localStorage:', tasks);
            } catch (error) {
                console.error('Error parsing tasks from localStorage:', error);
                tasks = [];
            }
        }
    }
  
    // Save tasks to localStorage
    function saveTasks() {
        localStorage.setItem('todoTasks', JSON.stringify(tasks));
        console.log('Tasks saved to localStorage:', tasks);
    }
  
    // Display tasks in the task list
    function displayTasks() {
        // Clear the task list container
        taskListContainer.innerHTML = '';
        
        console.log('Displaying tasks:', tasks);
        
        // If no tasks, show a message
        if (tasks.length === 0) {
            taskListContainer.innerHTML = '<p>No tasks found. Add a new task!</p>';
            return;
        }
        
        // Loop through tasks and create task cards
        tasks.forEach(function(task) {
            // Create task card element
            const taskCard = document.createElement('div');
            taskCard.className = 'task-card';
            taskCard.style.backgroundColor = task.color;
            
            // Set text color based on background color
            const color = task.color.replace('#', '');
            const r = parseInt(color.substr(0, 2), 16);
            const g = parseInt(color.substr(2, 2), 16);
            const b = parseInt(color.substr(4, 2), 16);
            const brightness = (r * 299 + g * 587 + b * 114) / 1000;
            
            if (brightness < 128) {
                taskCard.style.color = 'white';
            }
            
            // Create task card content
            taskCard.innerHTML = `
                <div class="task-header">
                    <span class="task-type">${task.type}</span>
                </div>
                <h3 class="task-name">${task.name}</h3>
                <p class="task-desc">${task.description}</p>
                <div class="task-actions">
                    <button class="edit-btn" data-id="${task.id}">Edit</button>
                    <button class="delete-btn" data-id="${task.id}">Delete</button>
                </div>
            `;
            
            // Add task card to the task list container
            taskListContainer.appendChild(taskCard);
        });
        
        // Add event listeners to the edit and delete buttons
        const editButtons = document.querySelectorAll('.edit-btn');
        editButtons.forEach(function(button) {
            button.addEventListener('click', editTask);
        });
        
        const deleteButtons = document.querySelectorAll('.delete-btn');
        deleteButtons.forEach(function(button) {
            button.addEventListener('click', deleteTask);
        });
    }
  
    // Add a new task
    function addTask(event) {
        event.preventDefault();
        
        // Get the task data from the form
        const taskName = taskNameInput.value.trim();
        const taskType = taskTypeInput.value;
        const taskDesc = taskDescInput.value.trim();
        const taskColor = taskColorInput.value;
        const taskId = taskIdInput.value;
        
        // Validate the task data
        if (!taskName || !taskType) {
            alert('Please enter task name and select type');
            return;
        }
        
        // Create task object
        const task = {
            name: taskName,
            type: taskType,
            description: taskDesc,
            color: taskColor
        };
        
        // Check if we're editing or adding a new task
        if (taskId) {
            // Editing an existing task
            task.id = taskId;
            const index = tasks.findIndex(t => t.id === taskId);
            
            if (index !== -1) {
                tasks[index] = task;
                console.log('Task updated:', task);
            }
        } else {
            // Adding a new task
            task.id = Date.now().toString();
            tasks.push(task);
            console.log('New task added:', task);
        }
        
        // Save tasks to localStorage
        saveTasks();
        
        // Display tasks
        displayTasks();
        
        // Reset the form
        resetForm();
    }
  
    // Edit a task
    function editTask(event) {
        // Get the task ID from the button
        const taskId = event.target.getAttribute('data-id');
        console.log('Editing task with ID:', taskId);
        
        // Find the task in the tasks array
        const task = tasks.find(t => t.id === taskId);
        
        if (task) {
            // Fill the form with the task data
            taskIdInput.value = task.id;
            taskNameInput.value = task.name;
            taskTypeInput.value = task.type;
            taskDescInput.value = task.description;
            taskColorInput.value = task.color;
            
            // Change the button text
            saveBtn.textContent = 'Update Task';
            
            // Scroll to the form
            taskForm.scrollIntoView({behavior: 'smooth'});
        }
    }
  
    // Delete a task
    function deleteTask(event) {
        // Get the task ID from the button
        const taskId = event.target.getAttribute('data-id');
        console.log('Deleting task with ID:', taskId);
        
        // Confirm deletion
        if (confirm('Are you sure you want to delete this task?')) {
            // Remove the task from the tasks array
            tasks = tasks.filter(task => task.id !== taskId);
            
            // Save tasks to localStorage
            saveTasks();
            
            // Display tasks
            displayTasks();
        }
    }
  
    // Reset the form
    function resetForm() {
        taskIdInput.value = '';
        taskForm.reset();
        saveBtn.textContent = 'Save Task';
    }
  
    // Clear all tasks
    function clearAllTasks() {
        if (tasks.length === 0) {
            alert('No tasks to clear');
            return;
        }
        
        if (confirm('Are you sure you want to delete all tasks?')) {
            // Clear the tasks array
            tasks = [];
            
            // Save tasks to localStorage
            saveTasks();
            
            // Display tasks
            displayTasks();
        }
    }
  
    // Search tasks
    function searchTasks() {
        const searchTerm = searchInput.value.toLowerCase();
        
        if (!searchTerm) {
            // If search term is empty, display all tasks
            displayTasks();
            return;
        }
        
        // Filter tasks by search term
        const filteredTasks = tasks.filter(task => 
            task.name.toLowerCase().includes(searchTerm) ||
            task.type.toLowerCase().includes(searchTerm) ||
            task.description.toLowerCase().includes(searchTerm)
        );
        
        // Display filtered tasks
        console.log('Filtered tasks:', filteredTasks);
        
        // Clear the task list container
        taskListContainer.innerHTML = '';
        
        // If no tasks match the search term, show a message
        if (filteredTasks.length === 0) {
            taskListContainer.innerHTML = '<p>No tasks match your search.</p>';
            return;
        }
        
        // Loop through filtered tasks and create task cards
        filteredTasks.forEach(function(task) {
            // Create task card element
            const taskCard = document.createElement('div');
            taskCard.className = 'task-card';
            taskCard.style.backgroundColor = task.color;
            
            // Set text color based on background color
            const color = task.color.replace('#', '');
            const r = parseInt(color.substr(0, 2), 16);
            const g = parseInt(color.substr(2, 2), 16);
            const b = parseInt(color.substr(4, 2), 16);
            const brightness = (r * 299 + g * 587 + b * 114) / 1000;
            
            if (brightness < 128) {
                taskCard.style.color = 'white';
            }
            
            // Create task card content
            taskCard.innerHTML = `
                <div class="task-header">
                    <span class="task-type">${task.type}</span>
                </div>
                <h3 class="task-name">${task.name}</h3>
                <p class="task-desc">${task.description}</p>
                <div class="task-actions">
                    <button class="edit-btn" data-id="${task.id}">Edit</button>
                    <button class="delete-btn" data-id="${task.id}">Delete</button>
                </div>
            `;
            
            // Add task card to the task list container
            taskListContainer.appendChild(taskCard);
        });
        
        // Add event listeners to the edit and delete buttons
        const editButtons = document.querySelectorAll('.edit-btn');
        editButtons.forEach(function(button) {
            button.addEventListener('click', editTask);
        });
        
        const deleteButtons = document.querySelectorAll('.delete-btn');
        deleteButtons.forEach(function(button) {
            button.addEventListener('click', deleteTask);
        });
    }
  
    // Add event listeners
    taskForm.addEventListener('submit', addTask);
    clearFormBtn.addEventListener('click', resetForm);
    clearAllBtn.addEventListener('click', clearAllTasks);
    searchInput.addEventListener('input', searchTasks);
  
    // Load tasks from localStorage and display them
    loadTasks();
    displayTasks();
    
    console.log('To-Do App initialized');
  });