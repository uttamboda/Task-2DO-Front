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

                const apiDataDiv = document.getElementById('apiData');
                apiDataDiv.innerHTML = '';  // Clear any existing content

                data.forEach(item => {
                    const div = document.createElement('div');
                    div.innerHTML = `
                        <h3>Task Number: ${item.taskNumber}</h3>
                        <p>Task Name: ${item.taskName}</p>
                        <p>Task Date: ${item.taskDate}</p>
                        <p>Task Done: ${item.taskDone ? 'Yes' : 'No'}</p>
                    `;
                    apiDataDiv.appendChild(div);
                });
            })
            .catch(error => {
                console.error('Error fetching data:', error);
            });
    }

    fetchData();

    document.getElementById('taskForm').addEventListener('submit', function(event) {
        event.preventDefault(); 
    
        const taskNumber = document.getElementById('taskNumber').value; 
        const taskName = document.getElementById('taskName').value;
        const taskDate = document.getElementById('taskDate').value;
        const taskDone = document.getElementById('taskDone').checked;
    
        const taskData = {
            taskNumber: taskNumber,  
            taskName: taskName,
            taskDate: taskDate,
            taskDone: taskDone
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