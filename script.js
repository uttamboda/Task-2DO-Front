const HOST = "http://localhost:8080";

document.addEventListener('DOMContentLoaded', function () {
    // Fetch data from the API
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
                    div.innerHTML = `
                        <h3>Task Number: ${item.taskNumber}</h3>
                        <p>Task Name: ${item.taskName}</p>
                        <p>Task Date: ${item.taskDate}</p>
                        <p>Task Done: ${item.taskDone ? 'Yes' : 'No'}</p>
                    `;
                    completedDiv.appendChild(div);
                });
    
                pendingTasks.forEach(item => {
                    const div = document.createElement('div');
                    div.innerHTML = `
                        <h3>Task Number: ${item.taskNumber}</h3>
                        <p>Task Name: ${item.taskName}</p>
                        <p>Task Date: ${item.taskDate}</p>
                        <p>Task Done: ${item.taskDone ? 'Yes' : 'No'}</p>
                    `;
                    pendingDiv.appendChild(div);
                });
            })
            .catch(error => {
                console.error('Error fetching data:', error);
            });
    }
    

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
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(taskData)
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
        })
        .catch(error => {
            console.error('Error:', error);
            alert('Failed to submit task!');
        });
    });
});    