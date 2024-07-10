class Task {
    constructor(id, name, status) {
        this.id = id
        this.name = name;
        this.status = status;
    }
}

let Tasks = []

function addTask(e) {
    e.preventDefault();
    const taskTitle = document.querySelector('#form2');

    if(getTasks()) {
        Tasks = []
        const localTasks = getTasks()
        localTasks.forEach(task => {
            Tasks.push(task)
        });
    }

    const newTask = new Task(Tasks.length + 1, taskTitle.value, 1);
    taskTitle.value = '';

    localStorage.clear();

    Tasks.push(newTask);   

    localStorage.setItem('tasks', JSON.stringify(Tasks));
    
    showAllTasks()
    showNotCompletedTasks();
}

function getTasks() {
    const tasks = JSON.parse(localStorage.getItem('tasks'));
    if (!tasks) return false;
    return tasks;
}

function showAllTasks() {
    const ul = document.querySelector('#all-tasks');
    ul.innerHTML = '';

    const tasks = getTasks();
    tasks.forEach((task, index) => {
        const li = document.createElement('li');
        li.className = 'list-group-item d-flex align-items-center justify-content-between border-0 mb-2 rounded';
        li.style.backgroundColor = '#f4f6f7';
        
        const input = document.createElement('input');
        input.className = 'form-check-input me-2';
        input.type = 'checkbox';
        input.setAttribute('onclick', 'checkTask(event)')
        input.id = index;

        const span = document.createElement('span');
        span.innerText = task.name;

        const divInput = document.createElement('div');
        divInput.className = 'input-div'
        divInput.appendChild(input);
        divInput.appendChild(span);
        
        const trashIcon = document.createElement('i');
        trashIcon.className = 'fa-solid fa-trash';
        trashIcon.style.cursor = 'pointer';
        trashIcon.id = index;
        trashIcon.setAttribute('onclick', 'deleteTask(event)')
        
        const editIcon = document.createElement('i');
        editIcon.className = 'fa-solid fa-pencil me-3';
        editIcon.style.cursor = 'pointer';
        editIcon.id = index;
        editIcon.setAttribute('onclick', 'editTask(event)')

        const divIcons = document.createElement('div');
        divIcons.appendChild(editIcon);
        divIcons.appendChild(trashIcon);
        

        if(task.status === 2) {
            input.checked = 'true';
            span.className = 'text-decoration-line-through'
        }
        
        li.appendChild(divInput);
        li.appendChild(divIcons);
        ul.appendChild(li);
    })
}

function checkTask(e) {
    const taskId = e.target.id;
    const span = e.target.nextElementSibling;

    let tasks = getTasks();
    const taskStatus = tasks[taskId].status;
    
    if(taskStatus == 1) {
        span.className = 'text-decoration-line-through';
        tasks[taskId].status = 2;
    }
    else {
        span.classList.remove('text-decoration-line-through');
        tasks[taskId].status = 1;
    }

    localStorage.clear();
    localStorage.setItem('tasks', JSON.stringify(tasks));

    showAllTasks();
    showCompletedTasks();
    showNotCompletedTasks();
}

function deleteTask(e) {
    const taskId = e.target.id;

    let tasks = getTasks();
    tasks.splice(taskId, 1);
    
    localStorage.clear();
    localStorage.setItem('tasks', JSON.stringify(tasks));

    showAllTasks();
    showCompletedTasks();
    showNotCompletedTasks();
}

function editTask(e) {
    const taskId = e.target.id;
    let tasks = getTasks();

    const inputDiv = e.target.parentNode.previousElementSibling
    const span = inputDiv.lastChild;
    const spanValue = span.innerHTML;
    inputDiv.removeChild(span);
    
    const input = document.createElement('input')
    input.type = 'text';
    input.value = spanValue;
    input.addEventListener('keydown', function(event) {
        if(event.keyCode === 13) {
            tasks[taskId].name = input.value;
            localStorage.clear();
            localStorage.setItem('tasks', JSON.stringify(tasks));

            showAllTasks();
            showCompletedTasks();
            showNotCompletedTasks();
        }
    })

    inputDiv.appendChild(input);
}

function changeTabs(e) {
    const tabs = document.querySelectorAll('.nav-link');
    tabs.forEach(tab => {
        tab.classList.remove('active')
    })

    const panes = document.querySelectorAll('.tab-pane');
    panes.forEach(pane => {
        pane.classList.remove('show')
        pane.classList.remove('active')
    })

    const activeTab = e.target;
    activeTab.classList.add('active');
    
    const activePane = document.querySelector('#' + activeTab.getAttribute('aria-controls'));
    activePane.classList.add('active');
    activePane.classList.add('show');
}

function showCompletedTasks() {
    const ul = document.querySelector('#completed-tasks');
    ul.innerHTML = '';

    const tasksDiv = document.querySelectorAll('.input-div');
    tasksDiv.forEach((task, index) => {
        const li = document.createElement('li');
        li.className = 'list-group-item d-flex align-items-center justify-content-between border-0 mb-2 rounded';
        li.style.backgroundColor = '#f4f6f7';
        
        if(task.firstChild.checked) {
            const input = task.firstChild;
            const span = task.lastChild;
            const id = input.id;

            const newInput = document.createElement('input');
            newInput.className = 'form-check-input me-2';
            newInput.type = 'checkbox';
            newInput.checked = 'true';
            newInput.setAttribute('onclick', 'checkTask(event)')
            newInput.id = id;

            const newSpan = document.createElement('span');
            newSpan.innerText = span.innerHTML;
            newSpan.className = 'text-decoration-line-through'

            const divInput = document.createElement('div');
            divInput.id = 'input-div'
            divInput.appendChild(newInput);
            divInput.appendChild(newSpan);

            const trashIcon = document.createElement('i');
            trashIcon.className = 'fa-solid fa-trash';
            trashIcon.style.cursor = 'pointer';
            trashIcon.id = index;
            trashIcon.setAttribute('onclick', 'deleteTask(event)')

            const editIcon = document.createElement('i');
            editIcon.className = 'fa-solid fa-pencil me-3';
            editIcon.style.cursor = 'pointer';
            editIcon.id = index;
            editIcon.setAttribute('onclick', 'editTask(event)')

            const divIcons = document.createElement('div');
            divIcons.appendChild(editIcon);
            divIcons.appendChild(trashIcon);
            
            li.appendChild(divInput);
            li.appendChild(divIcons);
            ul.appendChild(li);
        }
    });
}

function showNotCompletedTasks() {
    const ul = document.querySelector('#not-completed-tasks');
    ul.innerHTML = '';

    const tasksDiv = document.querySelectorAll('.input-div');
    tasksDiv.forEach(task => {
        const li = document.createElement('li');
        li.className = 'list-group-item d-flex align-items-center justify-content-between border-0 mb-2 rounded';
        li.style.backgroundColor = '#f4f6f7';

        if(!task.firstChild.checked) {
            const input = task.firstChild;
            const span = task.lastChild;
            const id = input.id;
            
            const newInput = document.createElement('input');
            newInput.className = 'form-check-input me-2';
            newInput.type = 'checkbox';
            newInput.setAttribute('onclick', 'checkTask(event)')
            newInput.id = id;
        
            const newSpan = document.createElement('span');
            newSpan.innerText = span.innerHTML;

            const divInput = document.createElement('div');
            divInput.appendChild(newInput);
            divInput.appendChild(newSpan);
            
            const trashIcon = document.createElement('i');
            trashIcon.className = 'fa-solid fa-trash';
            trashIcon.style.cursor = 'pointer';
            trashIcon.id = id;
            trashIcon.setAttribute('onclick', 'deleteTask(event)')
            
            const editIcon = document.createElement('i');
            editIcon.className = 'fa-solid fa-pencil me-3';
            editIcon.style.cursor = 'pointer';
            editIcon.id = id;
            editIcon.setAttribute('onclick', 'editTask(event)')

            const divIcons = document.createElement('div');
            divIcons.appendChild(editIcon);
            divIcons.appendChild(trashIcon);

            li.appendChild(divInput);
            li.appendChild(divIcons);
            ul.appendChild(li);
        }  
    })
}

showAllTasks();
showCompletedTasks();
showNotCompletedTasks();