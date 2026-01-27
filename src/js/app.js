import '../scss/app.scss'
import { Modal, Dropdown } from 'bootstrap'

let users = []

async function fetchUsers () {
  try {
    const response = await fetch('https://jsonplaceholder.typicode.com/users')

    if (String(response.status).startsWith(4) || String(response.status).startsWith(5)) {
      throw new Error(`Error ${response.status}: ${response.statusText}`)
    }

    const data = await response.json()
     
    return data.map(user => user.name)

  } catch (error) {
    console.warn(error)
  }
}

async function init() {
  users = await fetchUsers()
  setState({ data: getDataFromStorage() })
  initClock()
  initDropdowns()
  initAssigneeSelect()

  // Listeners
  buttonAddTaskElement.addEventListener('click', () => addTaskModalInstance.show())
  saveTaskButton.addEventListener('click', handleFormSubmit)
  buttonDeleteAllDoneElement.addEventListener('click', handleClickDeleteAll)
  boardElement.addEventListener('click', handleClickTask)
  boardElement.addEventListener('change', handleChangeTaskStatus)
  deleteModalConfirmButton.addEventListener('click', handleConfirmDelete)

  return users
}

// Constructor
class Task {
  id = crypto.randomUUID()
  createdAt = new Date().toString()

  constructor({ title, description, assignee, status = 'todo' }) {
    this.title = title
    this.description = description
    this.assignee = assignee
    this.status = status
  }
}

//Veriables
const TASKS_STORAGE_KEY = 'tasks'
let state = { data: [] }
let taskToDeleteId = null
let deleteAll = false

// DOM
const buttonAddTaskElement = document.getElementById('buttonAddTodo')
const buttonDeleteAllDoneElement = document.getElementById('buttonDeleteAll')
const boardElement = document.getElementById('board')

const deleteModalElement = document.getElementById('deleteModal')
const deleteModalInstance = new Modal(deleteModalElement)
const deleteModalConfirmButton = deleteModalElement.querySelector('.btn-danger')

const addTaskModalElement = document.getElementById('addTaskModal')
const addTaskModalInstance = new Modal(addTaskModalElement)
const saveTaskButton = document.getElementById('saveTaskButton')

const taskForm = document.getElementById('taskForm')
const taskTitleInput = document.getElementById('taskTitle')
const taskDescriptionInput = document.getElementById('taskDescription')
const taskAssigneeInput = document.getElementById('taskAssignee') // select одного разработчика

// Init
init()



// Инициализация dropdown
function initDropdowns() {
  document.querySelectorAll('.dropdown-toggle').forEach(el => new Dropdown(el))
}

// Инициализация select с разработчиками
function initAssigneeSelect() {
  taskAssigneeInput.innerHTML = '' // очищаем
  users.forEach(userName => {
    const option = document.createElement('option')
    option.value = userName
    option.textContent = userName
    taskAssigneeInput.appendChild(option)
  })
}

// Handlers
function handleFormSubmit() {
  const title = taskTitleInput.value.trim()
  const description = taskDescriptionInput.value.trim()
  const assignee = taskAssigneeInput.value

  if (!title || !assignee) {
    alert('Пожалуйста, заполните Title и Assignee')
    return
  }

  const newTask = new Task({ title, description, assignee })
  const newData = structuredClone(state.data)
  newData.push(newTask)
  setState({ data: newData })

  taskForm.reset()
  addTaskModalInstance.hide()
}

function handleClickDeleteAll() {
  deleteAll = true
  taskToDeleteId = null
  deleteModalInstance.show()
}

function handleClickTask(event) {
  const deleteBtn = event.target.closest('.delete-task-btn')
  if (deleteBtn) {
    const taskElement = deleteBtn.closest('.task')
    taskToDeleteId = taskElement.dataset.id
    deleteAll = false
    deleteModalInstance.show()
    return
  }

  const editBtn = event.target.closest('.edit-task')
  if (editBtn) {
    const taskElement = editBtn.closest('.task')
    const taskId = taskElement.dataset.id
    const task = state.data.find(t => t.id === taskId)
    if (task) {
      taskTitleInput.value = task.title
      taskDescriptionInput.value = task.description || ''
      taskAssigneeInput.value = task.assignee 

      saveTaskButton.onclick = () => handleUpdateTask(taskId)
      addTaskModalInstance.show()
    }
  }
}

function handleUpdateTask(taskId) {
  const title = taskTitleInput.value.trim()
  const description = taskDescriptionInput.value.trim()
  const assignee = taskAssigneeInput.value

  if (!title || !assignee) {
    alert('Пожалуйста, заполните Title и Assignee')
    return
  }

  const index = getIndexTaskById(taskId)
  if (index !== -1) {
    const newData = structuredClone(state.data)
    newData[index] = { ...newData[index], title, description, assignee }
    setState({ data: newData })
  }

  saveTaskButton.onclick = handleFormSubmit
  taskForm.reset()
  addTaskModalInstance.hide()
}

function handleConfirmDelete() {
  if (deleteAll) {
    setState({ data: state.data.filter(t => t.status !== 'done') })
  } else if (taskToDeleteId) {
    const index = getIndexTaskById(taskToDeleteId)
    if (index !== -1) {
      const newData = structuredClone(state.data)
      newData.splice(index, 1)
      setState({ data: newData })
    }
  }

  taskToDeleteId = null
  deleteAll = false
  deleteModalInstance.hide()
}

function handleChangeTaskStatus(event) {
  const select = event.target.closest('.task__status')
  if (!select) return

  const taskElement = select.closest('.task')
  const index = getIndexTaskById(taskElement.dataset.id)
  const newData = structuredClone(state.data)
  newData[index].status = select.value
  setState({ data: newData })
}

// Helpers
function setState(newState) {
  state = { ...state, ...newState }
  saveDataToStorage()
  render(state.data)
}

function saveDataToStorage() {
  localStorage.setItem(TASKS_STORAGE_KEY, JSON.stringify(state.data))
}

function getDataFromStorage() {
  const data = localStorage.getItem(TASKS_STORAGE_KEY)
  return data ? JSON.parse(data).map(item => new Task(item)) : []
}

function getIndexTaskById(id) {
  return state.data.findIndex(t => t.id === id)
}

function prepareCreatedAtDate(dateString) {
  return new Intl.DateTimeFormat('ru-RU', {
    day: 'numeric',
    month: 'long',
    hour: 'numeric',
    minute: 'numeric',
    hour12: false
  }).format(new Date(dateString))
}

function initClock() {
  const clock = document.querySelector('.header__clock')
  const update = () => {
    const d = new Date()
    clock.textContent = `${String(d.getHours()).padStart(2,'0')}:${String(d.getMinutes()).padStart(2,'0')}`
  }
  update()
  setInterval(update, 60000)
}

// Render
function buildTemplateTask({ id, title, description, assignee, status, createdAt }) {
  return `
    <article class="task" data-id="${id}">
      <div class="task__header">
        <h4 class="task__title">${title}</h4>
        <div class="dropdown">
          <button class="btn btn-link p-0 dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false">⋮</button>
          <ul class="dropdown-menu dropdown-menu-end">
            <li><button class="dropdown-item edit-task" type="button">Edit</button></li>
            <li><hr class="dropdown-divider"></li>
            <li><button class="dropdown-item text-danger delete-task-btn" type="button">Delete</button></li>
          </ul>
        </div>
      </div>
      <p class="task__description">${description}</p>
      <select class="task__status form-select form-select-sm">
        <option value="todo" ${status === 'todo' ? 'selected' : ''}>todo</option>
        <option value="inProgress" ${status === 'inProgress' ? 'selected' : ''}>in progress</option>
        <option value="done" ${status === 'done' ? 'selected' : ''}>done</option>
      </select>
      <div class="task__information">
        <p>${assignee}</p>
        <time>${prepareCreatedAtDate(createdAt)}</time>
      </div>
    </article>
  `
}

function render(tasks) {
  const todo = document.querySelector('.todo .category__body')
  const inProgress = document.querySelector('.inProgress .category__body')
  const done = document.querySelector('.done .category__body')

  todo.innerHTML = ''
  inProgress.innerHTML = ''
  done.innerHTML = ''

  tasks.forEach(task => {
    const html = buildTemplateTask(task)
    if (task.status === 'todo') todo.insertAdjacentHTML('beforeend', html)
    if (task.status === 'inProgress') inProgress.insertAdjacentHTML('beforeend', html)
    if (task.status === 'done') done.insertAdjacentHTML('beforeend', html)
  })

  initDropdowns()
  updateCounters(tasks)
}

function updateCounters(tasks) {
  document.querySelector('.todo .badge').textContent = tasks.filter(t => t.status === 'todo').length
  document.querySelector('.inProgress .badge').textContent = tasks.filter(t => t.status === 'inProgress').length
  document.querySelector('.done .badge').textContent = tasks.filter(t => t.status === 'done').length
}

console.log('App loaded')