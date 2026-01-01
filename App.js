let tasks = [];
let filter = 'all';

// Load tasks from Local Storage on startup
function loadTodos() {
  const storedTasks = localStorage.getItem('tasks');
  if (storedTasks) {
    tasks = JSON.parse(storedTasks);
  } else {
    tasks = [];
  }
}
// Save tasks to Local Storage
function saveTodos() {
  localStorage.setItem('tasks', JSON.stringify(tasks));
}

function isValidTask(name) {
  return name.trim().length >= 5 && isNaN(parseInt(name.trim()[0], 10));
}

function renderTasks() {
  const taskList = document.getElementById("taskList");
  taskList.innerHTML = "";

  const filteredTasks = tasks.filter(task => {
    if (filter === 'all') return true;
    if (filter === 'done') return task.done;
    if (filter === 'todo') return !task.done;
  });

  filteredTasks.forEach((task) => {
    const taskItem = document.createElement("div");
    taskItem.className = "task-item";

    const taskText = document.createElement("div");
    taskText.className = "task-text";
    taskText.textContent = task.text;
    if (task.done) taskText.classList.add("done");

    const actions = document.createElement("div");
    actions.className = "task-actions";

    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.checked = task.done;
    checkbox.onchange = () => {
      const foundTask = tasks.find(t => t.id === task.id);
      if (foundTask) {
        foundTask.done = checkbox.checked;
        saveTodos();
        renderTasks();
      }
    }; 


       const editBtn = document.createElement("button");
    editBtn.innerHTML = "✍";
    editBtn.className = "edit";
    editBtn.onclick = () => {
      openModal({
        title: "Rename Task",
        msg: "",
        confirm: (newName) => {
          if (isValidTask(newName)) {
            const foundTask = tasks.find(t => t.id === task.id);
            if (foundTask) {
              foundTask.text = newName.trim();
              saveTodos();
              renderTasks();
            }
          }
        },
        needsInput: true,
        defaultInput: task.text
      });
    };

    const deleteBtn = document.createElement("button");
    deleteBtn.innerHTML = "🗑️";
    deleteBtn.className = "delete";
    deleteBtn.onclick = () => {
      openModal({
        title: "Delete Task?",
        msg: "Are you sure you want to delete this task?",
        confirm: () => {
          const taskIndex = tasks.findIndex(t => t.id === task.id);
          if (taskIndex > -1) {
            tasks.splice(taskIndex, 1);
            saveTodos();
            renderTasks();
          }
        },
        needsInput: false
      });
    };

    actions.appendChild(checkbox);
    actions.appendChild(editBtn);
    actions.appendChild(deleteBtn);

    taskItem.appendChild(taskText);
    taskItem.appendChild(actions);
    taskList.appendChild(taskItem);
  });
}

function filterTasks(type) {
  filter = type;
  renderTasks();
}

function deleteDoneTasks() {
  tasks = tasks.filter(t => !t.done);
  saveTodos();
  renderTasks();
}

function handleDeleteAll() {
  if (tasks.length > 0) {
    openModal({
      title: "Delete All Tasks?",
      msg: "Are you sure? if not press cancel.",
      confirm: () => {
        tasks = [];
        saveTodos();
        renderTasks();
      },
      needsInput: false
    });
  }
}

function handleAddTask() {
  const input = document.getElementById("taskInput");
  const msg = document.getElementById("validationMsg");
  const text = input.value.trim();

  if (!isValidTask(text)) {
    msg.textContent = "Task must be ≥ 5 characters and not start with a number.";
    msg.classList.remove("hidden");
    return;
  }
  msg.classList.add("hidden");

  tasks.push({
    id: Date.now(),
    text,
    done: false
  });

  