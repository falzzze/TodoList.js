const FORM = document.querySelector('#form');
const TASK_INPUT = document.querySelector('#taskInput');
const TASKS_LIST = document.querySelector('#tasksList');
const EMPTY_LIST = document.querySelector('#emptyList');

let tasks = [];

localStorage.getItem('tasks') ? tasks = JSON.parse(localStorage.getItem('tasks')) : false;

tasks.forEach((task) => renderTask(task));

checkEmptyList();


FORM.addEventListener('submit', addTask);
TASKS_LIST.addEventListener('click', deleteTask);
TASKS_LIST.addEventListener('click', doneTask);


function addTask(e) {
  e.preventDefault();

  const taskText = TASK_INPUT.value;

  const newTask = {
    id: Date.now(),
    text: taskText,
    done: false,
  };

  tasks.push(newTask);
  saveToLocalStorage();

  renderTask(newTask);

  TASK_INPUT.value = '';
  TASK_INPUT.focus();
  checkEmptyList();
};


function deleteTask(e) {
  if (e.target.dataset.action !== 'delete') return;
  const parentNode = e.target.closest('.list-group-item');

  const id = +parentNode.id;


  tasks = tasks.filter((task) => task.id !== id);

  saveToLocalStorage();
  
  parentNode.remove();

  checkEmptyList();
};


function doneTask(e) {
  if (e.target.dataset.action !== 'done') return;

  const parentNode = e.target.closest('.list-group-item');

  const id = +parentNode.id;
  const task = tasks.find((task) => task.id === id);

  task.done = !task.done;

  saveToLocalStorage();

  const taskTitle = parentNode.querySelector('.task-title');
  taskTitle.classList.toggle('task-title--done');
};


function checkEmptyList () {
  if (tasks.length === 0) {
    const emptyListHtml = `<li id="emptyList" class="list-group-item empty-list">
    <img src="./img/leaf.svg" alt="Empty" width="48" class="mt-3">
    <div class="empty-list__title">Список дел пуст</div>
    </li>
    `
    TASKS_LIST.insertAdjacentHTML('afterbegin', emptyListHtml)
  }

  if (tasks.length > 0) {
    const emptyListEl = document.querySelector('#emptyList');
    emptyListEl ? emptyListEl.remove() : null;
  }
};

function saveToLocalStorage() {
  localStorage.setItem('tasks', JSON.stringify(tasks))
};

function renderTask(task) {
  const cssClass = task.done ? "task-title task-title--done" : "task-title";

  const taskHtml = `
    <li id="${task.id}" class="list-group-item d-flex justify-content-between task-item">
      <span class="${cssClass}">${task.text}</span>
      <div class="task-item__buttons">
        <button type="button" data-action="done" class="btn-action">
          <img src="./img/tick.svg" alt="Done" width="18" height="18">
        </button>
        <button type="button" data-action="delete" class="btn-action">
          <img src="./img/cross.svg" alt="Done" width="18" height="18">
        </button>
      </div>
    </li>
  `;

  TASKS_LIST.insertAdjacentHTML('beforeend', taskHtml)
};