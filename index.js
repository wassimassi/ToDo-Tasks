var myInput = document.getElementById('myInput')
var myBtn = document.getElementById('myBtn')
var content = document.getElementById('content')

var data = [
    {id: 1, name: 'mustafa', completed: false},
    {id: 2, name: 'ahmad', completed: false},
    {id: 3, name: 'youseef', completed: false},
    {id: 4, name: 'khaled', completed: false},
    {id: 5, name: 'moneer', completed: false},
]

let editingId = null;

// render the list of tasks based on data array
function Draw(data) {
    content.innerHTML = ''
    data.map((e) => {
        const isEditing = editingId === e.id;
        content.innerHTML += `
            <div class="list-group-item list-group-item-action d-flex justify-content-between align-items-center 
                ${e.completed ? 'bg-light' : ''} 
                ${isEditing ? 'bg-warning bg-opacity-25 border-warning' : ''}"
                 onclick="${e.completed ? '' : `startEdit(${e.id}, '${e.name}')`}"
                 style="${e.completed ? '' : 'cursor: pointer;'}"
                 id="task-${e.id}">
                <div class="d-flex align-items-center" 
                     style="pointer-events: none;">
                    <span class="${e.completed ? 'text-decoration-line-through text-muted' : ''} 
                          ${isEditing ? 'fw-bold' : ''}">
                        ${e.name}
                    </span>
                </div>
                <div class="btn-group" style="pointer-events: auto;">
                    <button onclick="event.stopPropagation(); toggleComplete(${e.id})" 
                            class="btn ${e.completed ? 'btn-secondary' : 'btn-success'} btn-sm"
                            ${e.completed ? 'disabled' : ''}>
                        <i class="bi ${e.completed ? 'bi-check-circle-fill' : 'bi-check-circle'}"></i>
                    </button>
                    <button onclick="event.stopPropagation(); Delete(${e.id})" 
                            class="btn btn-danger btn-sm">
                        <i class="bi bi-trash"></i>
                    </button>
                </div>
            </div>`
    })
    
    // Update button text based on editing state
    myBtn.innerHTML = editingId ? '<i class="bi bi-pencil"></i> Update' : '<i class="bi bi-plus-lg"></i> Add';
    
    // Add editing class to input when editing
    // if (editingId) {
    //     myInput.classList.add('border-warning');
    // } else {
    //     myInput.classList.remove('border-warning');
    // }
}

window.onload = Draw(data)

myBtn.addEventListener('click', handleSubmit)
myInput.addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
        handleSubmit();
    }
})
// handle add or edit
function handleSubmit() {
    if (editingId) {
        updateTask();
    } else {
        Add();
    }
}
// add task
function Add() {
    if(myInput.value.trim() == '') {
        showAlert('Please enter a task!', 'danger');
        return;
    }

    let lastId = data.length > 0 ? data[data.length - 1].id : 0;
    data.push({
        id: lastId + 1, 
        name: myInput.value.trim(),
        completed: false
    })
    
    Draw(data)
    myInput.value = ''
    showAlert('Task added successfully!', 'success');
}
// delete task
function Delete(id) {
    var index = data.findIndex(e => e.id === id)
    data.splice(index, 1)
    
    if (editingId === id) {
        cancelEdit();
    }
    
    Draw(data)
    showAlert('Task deleted!', 'warning');
}
// handle complete task
function toggleComplete(id) {
    const task = data.find(e => e.id === id);
    if (task && !task.completed) {
        task.completed = true;
        
        if (editingId === id) {
            cancelEdit();
        }
        
        Draw(data);
        showAlert('Task completed!', 'info');
    }
}
// start editing
function startEdit(id, currentName) {
    // If clicking the same task that's being edited, do nothing
    if (editingId === id) return;
    
    editingId = id;
    myInput.value = currentName;
    myInput.focus();
    Draw(data);
    
    // Scroll the edited task into view if needed
    const taskElement = document.getElementById(`task-${id}`);
    if (taskElement) {
        taskElement.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
}
// update task
function updateTask() {
    const newName = myInput.value.trim();
    
    if (newName === '') {
        showAlert('Please enter a task name!', 'danger');
        return;
    }
    
    const task = data.find(e => e.id === editingId);
    if (task) {
        task.name = newName;
        cancelEdit();
        showAlert('Task updated!', 'success');
    }
}
// cancel editing
function cancelEdit() {
    editingId = null;
    myInput.value = '';
    Draw(data);
}

// Add event listener for Escape key to cancel editing
document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape' && editingId !== null) {
        cancelEdit();
    }
});

// show alert
function showAlert(message, type) {
    const alertDiv = document.createElement('div');
    alertDiv.className = `alert alert-${type} alert-dismissible fade show`;
    alertDiv.innerHTML = `
        ${message}
        <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
    `;
    
    const cardBody = content.parentElement;
    cardBody.insertBefore(alertDiv, cardBody.firstChild);
    
    setTimeout(() => {
        alertDiv.remove();
    }, 3000);
} 