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

            const apiDataDiv = document.getElementById('apiData');
            apiDataDiv.innerHTML = ''; 

            
            data.forEach(item => {
                const div = document.createElement('div');
                div.innerHTML = `
                    <h3>Task Number: ${item.tasknumber}</h3>
                    <p>Task Name: ${item.taskName}</p>
                    <p>Task Date: ${item.taskDate}</p>
                    <p>Task Done: ${item.taskdone ? 'Yes' : 'No'}</p>
                `;
                apiDataDiv.appendChild(div);
            });
        })
        .catch(error => {
            console.error('Error fetching data:', error);
        });
}
fetchData();