const HOST = "http://localhost:8080";

function markTaskNotDone(taskNumber) {
    fetch(HOST +`/tasks/${taskNumber}`)
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to fetch task details!');
            }
            return response.json();
        })
        .then(task => {
            task.taskDone = false;

            return fetch(HOST + '/tasks', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(task),
            });
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to update task!');
            }
            console.log(`Task ${taskNumber} marked as not done.`);

            fetchData(); 
        })
        .catch(error => {
            console.error('Error marking task as not done:', error);
            alert('Failed to mark task as not done!');
        });
}

function markTaskDone(taskNumber) {
    fetch(HOST + `/tasks/${taskNumber}`)
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to fetch task details!');
            }
            return response.json();
        })
        .then(task => {
            task.taskDone = true;

            return fetch(HOST + '/tasks', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(task),
            });
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to update task!');
            }
            console.log(`Task ${taskNumber} marked as done.`);

            fetchData(); 
        })
        .catch(error => {
            console.error('Error marking task as done:', error);
            alert('Failed to mark task as done!');
        });
}

document.addEventListener('DOMContentLoaded', function () {

    fetchData();

    document.getElementById('taskForm').addEventListener('submit', function(event) {
        event.preventDefault(); 
    

        const taskName = document.getElementById('taskName').value;
        const taskDate = document.getElementById('taskDate').value;
       
        const taskData = {
            taskName: taskName,
            taskDate: taskDate 
        };
    
        console.log(taskData); 
    
        fetch(HOST + '/tasks', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(taskData),
        })
            .then(response => {
                if (response.ok) {
                    return response.text().then(text => {
                        if (text) {
                            return JSON.parse(text);
                        }
                        return {};
                    });
                } else {
                    throw new Error('Failed to submit task!');
                }
            })
            .then(data => {
                console.log('Task submitted:', data);
                alert('Task submitted successfully!');

                window.location.href = 'index.html';

                fetchData();
            })
            .catch(error => {
                console.error('Error:', error);
                alert('Failed to submit task!');
            });
    });
});


document.addEventListener("DOMContentLoaded", async () => {
    try {
        const response = await fetch("https://raw.githubusercontent.com/dwyl/quotes/refs/heads/main/quotes.json");
        const quotes = await response.json();

        const randomIndex = Math.floor(Math.random() * quotes.length);
        const randomQuote = quotes[randomIndex];

        document.getElementById("quoteText").textContent = `"${randomQuote.text}"`;
        document.getElementById("quoteAuthor").textContent = `- ${randomQuote.author || "Unknown"}`;
    } catch (error) {
        console.error("Error fetching quote:", error);
        document.getElementById("quoteText").textContent = "Could not load quote.";
        document.getElementById("quoteAuthor").textContent = "";
    }
});


function fetchData() {
    fetch(HOST + '/tasks')
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            console.log(data);

            const completedDiv = document.getElementById('completedTasks');
            const pendingDiv = document.getElementById('pendingTasks');

            completedDiv.innerHTML = '';
            pendingDiv.innerHTML = '';

            const completedTasks = data.filter(item => item.taskDone === true);
            const pendingTasks = data.filter(item => item.taskDone === false);

            function createTaskDiv(item) {
                const div = document.createElement('div');
                div.classList.add('task-row');
                div.setAttribute('draggable', 'true'); 
                div.setAttribute('id', `task-${item.taskNumber}`); 

                div.innerHTML = `
                    <span class="task-number">${item.taskNumber}</span>
                    <span class="task-name">${item.taskName}</span>
                    <span class="task-date">${item.taskDate}</span>
                    <span class="task-done">${item.taskDone ? '✔' : '✖'}</span>
                    <button onclick="editTask(${item.taskNumber})">Edit</button>

                `;

                div.addEventListener('dragstart', dragStart);
                return div;
            }

            completedTasks.forEach(item => {
                const div = createTaskDiv(item);
                completedDiv.appendChild(div);
            });

            pendingTasks.forEach(item => {
                const div = createTaskDiv(item);
                pendingDiv.appendChild(div);
            });

            completedDiv.addEventListener('dragover', allowDrop);
            completedDiv.addEventListener('drop', (event) => dropTask(event, 'completed', data));

            pendingDiv.addEventListener('dragover', allowDrop);
            pendingDiv.addEventListener('drop', (event) => dropTask(event, 'pending', data));
        })
        .catch(error => {
            console.error('Error fetching data:', error);
        });
}

function allowDrop(event) {
    event.preventDefault(); 
}

function dragStart(event) {
    event.dataTransfer.setData('text', event.target.id);
}

function dropTask(event, targetSection, data) {
    event.preventDefault();

    const taskId = event.dataTransfer.getData('text');
    const taskElement = document.getElementById(taskId);
    const isCompleted = targetSection === 'completed'; 

    if (isCompleted) {
        document.getElementById('completedTasks').appendChild(taskElement);
    } else {
        document.getElementById('pendingTasks').appendChild(taskElement);
    }

    const taskNumber = parseInt(taskId.split('-')[1], 10);

    const taskData = data.find(item => item.taskNumber === taskNumber);

    if (taskData) {
        const updatedTask = {
            taskNumber: taskData.taskNumber,
            taskName: taskData.taskName,
            taskDate: taskData.taskDate,
            taskDone: isCompleted, 
        };

       
        fetch(`${HOST}/tasks`, {
            method: 'PUT', 
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(updatedTask), 
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to update task state');
            }
            console.log(`Task ${taskNumber} successfully updated to ${isCompleted ? 'completed' : 'pending'}`);
        })
        .catch(error => {
            console.error('Error updating task state:', error);
        });
    } else {
        console.error('Task data not found for taskNumber', taskNumber);
    }
}

function editTask(taskNumber) {
    window.location.href = `/editTask.html?taskNumber=${taskNumber}`;
}

document.addEventListener("DOMContentLoaded", () => {
    const urlParams = new URLSearchParams(window.location.search);
    const taskNumber = urlParams.get("taskNumber");

    if (taskNumber) {
        fetchTaskDetails(taskNumber);
    }
});

async function fetchTaskDetails(taskNumber) {
    try {
        const response = await fetch(`${HOST}/tasks/${taskNumber}`);
        const task = await response.json();

        document.getElementById("taskName").value = task.taskName;
        document.getElementById("taskDate").value = task.taskDate;
    } catch (error) {
        console.error("Failed to fetch task details:", error);
    }
}

async function saveTask() {
    const urlParams = new URLSearchParams(window.location.search);
    const taskNumber = urlParams.get("taskNumber");

    const updatedTask = {
        taskNumber: parseInt(taskNumber, 10),
        taskName: document.getElementById("taskName").value,
        taskDate: document.getElementById("taskDate").value,
    };

    try {
        const response = await fetch(`${HOST}/tasks`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(updatedTask),
        });

        if (response.ok) {
            alert("Task updated successfully!");
            window.location.href = "index.html";
        } else {
            throw new Error("Failed to update task");
        }
    } catch (error) {
        console.error("Error updating task:", error);
    }
}
