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