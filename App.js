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