const form = document.querySelector('#add-task');
const list = document.querySelector('#list');
const formInput = document.querySelector('input[type="text"]')

// Add new element and append it to its parent
const addToTask = function (elem, text, parent, clas=null, ) {
    const newElem = document.createElement(elem);
    newElem.innerText = text;
    let listItemText;
    if (elem === 'li') {
        let randomID = Math.floor(Math.random() * 10000);
        newElem.setAttribute('data-id', randomID);
        listItemText = newElem.innerText
    }
    if (clas) {
        newElem.classList.add(clas);
    }
    parent.append(newElem);
    return [newElem, listItemText];
}

function updateLocalStorage (target, action) {
    for (let i = 0; i < tasks.length; i++) {
        if (tasks[i].id === target.parentElement.dataset.id) {
            tasks[i][action] = !tasks[i][action];
            localStorage.setItem('todos', JSON.stringify(tasks))
        }
    }
}

// Remove task object from local storage
function removeTaskFromLocalStorage (id) {
    const index = tasks.findIndex(task => task.id === id)
    tasks.splice(index, 1);
    localStorage.setItem('todos', JSON.stringify(tasks));
}

// Check for saved info from local storage; if null, set to empty array
const tasks = JSON.parse(localStorage.getItem('todos')) || [];

// Retrieve from local Storage
for (let i = 0; i < tasks.length; i++) {
    let newListItem = document.createElement('li');
    newListItem.innerText = tasks[i].task;
    newListItem.dataset.id = tasks[i].id;
    newListItem.isCompleted = tasks[i].isCompleted ? true : false;
    newListItem.isUrgent = tasks[i].isUrgent ? true : false;
    if (newListItem.isCompleted) {
        newListItem.classList.add('completed')
    }
    if (newListItem.isUrgent) {
        newListItem.classList.add('important')
    }
    addToTask('button', 'Remove Task', newListItem, 'remove');
    addToTask('button', 'Mark Urgent', newListItem, 'urgent');
    addToTask('button', 'Complete Task', newListItem, 'complete');
    list.append(newListItem);
}

// Event listener for form submission
form.addEventListener('submit', function (event) {
    event.preventDefault();

    // Add new task to list and reset form value
    const [newTask, newTaskText] = addToTask('li', `${formInput.value} `, list);
    formInput.value = '';

    // Add remove, urgent, and complete button to each task
    addToTask('button', 'Remove Task', newTask, 'remove');
    addToTask('button', 'Mark Urgent', newTask, 'urgent');
    addToTask('button', 'Complete Task', newTask, 'complete');

    tasks.push({ task: newTaskText, isCompleted: false, isUrgent: false, id: newTask.dataset.id });
    localStorage.setItem('todos', JSON.stringify(tasks));
})

// Add event listener to each button
list.addEventListener('click', function(event) {
    if (event.target.tagName === 'BUTTON' && event.target.classList.contains('remove')) {
        removeTaskFromLocalStorage(event.target.parentElement.dataset.id);
        event.target.parentElement.remove()
    } else if (event.target.tagName === 'BUTTON' && event.target.classList.contains('urgent')) {
        event.target.parentElement.classList.toggle('important');
        updateLocalStorage(event.target, 'isUrgent');
    } else if (event.target.tagName === 'BUTTON' && event.target.classList.contains('complete')) {
        event.target.parentElement.classList.toggle('completed');
        updateLocalStorage(event.target, 'isCompleted');
    }
})
