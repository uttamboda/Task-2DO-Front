function fetchData() {
    fetch('http://localhost:8080/task')
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

            const completedTasks = data.filter(item => item.taskdone === true);
            const pendingTasks = data.filter(item => item.taskdone === false);

            completedTasks.forEach(item => {
                const div = document.createElement('div');
                div.innerHTML = `
                    <h3>Task Number: ${item.tasknumber}</h3>
                    <p>Task Name: ${item.taskName}</p>
                    <p>Task Date: ${item.taskDate}</p>
                    <p>Task Done: ${item.taskdone ? 'Yes' : 'No'}</p>
                    <button onclick="markTaskNotDone(${item.tasknumber})">Mark as Not Done</button>

                `;
                completedDiv.appendChild(div);
            });

            pendingTasks.forEach(item => {
                const div = document.createElement('div');
                div.innerHTML = `
                    <h3>Task Number: ${item.tasknumber}</h3>
                    <p>Task Name: ${item.taskName}</p>
                    <p>Task Date: ${item.taskDate}</p>
                    <p>Task Done: ${item.taskdone ? 'Yes' : 'No'}</p>
                    <button onclick="markTaskDone(${item.tasknumber})">Mark as Done</button>
                `;
                pendingDiv.appendChild(div);
            });
        })
        .catch(error => {
            console.error('Error fetching data:', error);
        });
}

function markTaskNotDone(taskNumber) {
    fetch(`http://localhost:8080/task/${taskNumber}`)
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to fetch task details!');
            }
            return response.json();
        })
        .then(task => {
            task.taskdone = false;

            return fetch('http://localhost:8080/task', {
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
    fetch(`http://localhost:8080/task/${taskNumber}`)
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to fetch task details!');
            }
            return response.json();
        })
        .then(task => {
            task.taskdone = true;

            return fetch('http://localhost:8080/task', {
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

    document.getElementById('taskForm').addEventListener('submit', function (event) {
        event.preventDefault();

        const taskName = document.getElementById('taskName').value;
        const taskDate = document.getElementById('taskDate').value;

        const taskData = {
            taskName: taskName,
            taskDate: taskDate,
        };

        console.log(taskData);

        fetch('http://localhost:8080/task', {
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

                fetchData();
            })
            .catch(error => {
                console.error('Error:', error);
                alert('Failed to submit task!');
            });
    });
});
