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


            completedTasks.forEach(item => {
                const div = document.createElement('div');
                div.classList.add('task-row');
                div.innerHTML = `
                    <span>${item.taskNumber}</span>
                    <span>${item.taskName}</span>
                    <span>${item.taskDate}</span>
                    <span>${item.taskDone ? 'Yes' : 'No'}</span>
                    <button onclick="markTaskNotDone(${item.taskNumber})">Mark as Not Done</button>
                `;
                completedDiv.appendChild(div);
            });

            pendingTasks.forEach(item => {
                const div = document.createElement('div');
                div.classList.add('task-row');
                
                div.innerHTML = `
                     <span>${item.taskNumber}</span>
                    <span>${item.taskName}</span>
                    <span>${item.taskDate}</span>
                    <span>${item.taskDone ? 'Yes' : 'No'}</span>
                    <button onclick="markTaskDone(${item.taskNumber})">Mark Done</button>
                `;
                pendingDiv.appendChild(div);
            });
        })
        .catch(error => {
            console.error('Error fetching data:', error);
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