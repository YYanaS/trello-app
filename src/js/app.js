import '../scss/app.scss'
import { Modal, Dropdown } from 'bootstrap'

// Variables
const TASKS_STORAGE_KEY = 'tasks'
let state = { data: [] }
let users = []
let currentEditingTaskId = null

async function fetchUsers() {
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
}

init()

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
const taskAssigneeInput = document.getElementById('taskAssignee')

// Listeners
buttonAddTaskElement.addEventListener('click', () => addTaskModalInstance.show())
taskForm.addEventListener('submit', handleTaskFormSubmit)
buttonDeleteAllDoneElement.addEventListener('click', handleClickDeleteAll)
boardElement.addEventListener('click', handleBoardClick)
boardElement.addEventListener('change', handleChangeTaskStatus)

// Инициализация dropdown
function initDropdowns() {
  document.querySelectorAll('.dropdown-toggle').forEach(element => new Dropdown(element))
}

// Открытия модалки для редактирования
function openEditTaskModal(taskId) {
  const task = state.data.find(t => t.id === taskId)
  if (!task) return

  taskTitleInput.value = task.title
  taskDescriptionInput.value = task.description || ''
  taskAssigneeInput.value = task.assignee

  currentEditingTaskId = taskId
  addTaskModalInstance.show()
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
function handleTaskFormSubmit(event) {
  event.preventDefault()

  const formData = new FormData(taskForm)
  const title = formData.get('title')?.trim()
  const description = formData.get('description')?.trim()
  const assignee = formData.get('assignee')

  if (!title || !assignee) {
    alert('Please fill the Title and select the Assignee')
    return
  }

  if (currentEditingTaskId) {
    const task = state.data.find(t => t.id === currentEditingTaskId)
    if (task) {
      task.title = title
      task.description = description
      task.assignee = assignee
    }
  } else {
    const newTask = new Task({ title, description, assignee })
    state.data.push(newTask)
  }

  setState({ data: state.data })
  taskForm.reset()
  addTaskModalInstance.hide()
  currentEditingTaskId = null
}

function handleBoardClick(event) {
  const deleteBtn = event.target.closest('.delete-task-btn')
  if (deleteBtn) {
    const taskId = deleteBtn.closest('.task').dataset.id
    handleClickDeleteTask(taskId)
    return
  }

  const editBtn = event.target.closest('.edit-task')
  if (editBtn) {
    const taskId = editBtn.closest('.task').dataset.id
    openEditTaskModal(taskId)
    return
  }
}

function handleClickDeleteTask(taskId) {
  deleteModalConfirmButton.onclick = () => {
    const index = getIndexTaskById(taskId)
    if (index !== -1) {
      state.data.splice(index, 1)
      setState({ data: state.data })
    }
    deleteModalInstance.hide()
  }
  deleteModalInstance.show()
}

function handleClickDeleteAll() {
  deleteModalConfirmButton.onclick = () => {
    setState({ data: state.data.filter(t => t.status !== 'done') })
    deleteModalInstance.hide()
  }
  deleteModalInstance.show()
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
  return state.data.findIndex(task => task.id === id)
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
    clock.textContent = new Date().toTimeString().slice(0, 5)
  }
  
  // Обновляем каждую минуту, начиная со следующей целой минуты
  setTimeout(() => {
    update()
    setInterval(update, 60000)
  }, 60000 - new Date().getSeconds() * 1000)
  
  update() 
}

// Render
function buildTemplateTask({ id, title, description, assignee, status, createdAt }) {
  return `
    <article class="task task__${status}" data-id="${id}" draggable="true">
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
  document.querySelector('.todo .category__body').innerHTML = ''
  document.querySelector('.inProgress .category__body').innerHTML = ''
  document.querySelector('.done .category__body').innerHTML = ''
  
  // Потом распределяем задачи
  const containers = {
    todo: document.querySelector('.todo .category__body'),
    inProgress: document.querySelector('.inProgress .category__body'),
    done: document.querySelector('.done .category__body')
  }
  
  tasks.forEach(task => {
    const container = containers[task.status]
    if (container) {
      container.insertAdjacentHTML('beforeend', buildTemplateTask(task))
    }
  })
  
  initDropdowns()
  updateCounters(tasks)
}

function updateCounters(tasks) {
  document.querySelector('.todo .category__counter').textContent = tasks.filter(t => t.status === 'todo').length
  document.querySelector('.inProgress .category__counter').textContent = tasks.filter(t => t.status === 'inProgress').length
  document.querySelector('.done .category__counter').textContent = tasks.filter(t => t.status === 'done').length
}

//Перетаскивание
let draggedTask = null

// Начало перемещения задачи
boardElement.addEventListener('dragstart', (element) => {
  if (element.target.classList.contains('task')) {
    draggedTask = element.target // Запоминаем, какую задачу тащим
    draggedTask.style.opacity = '0.5'
  }
})

// Конец перемещения задачи
boardElement.addEventListener('dragend', (element) => {
  if (draggedTask) {
    draggedTask.style.opacity = '1'
    draggedTask = null
  }
})

// Куда можно переместить
boardElement.addEventListener('dragover', (element) => {
  element.preventDefault() //Разрешаем "отпустить" задачу в этой области
})

// Когда бросаем
boardElement.addEventListener('drop', (element) => {
  element.preventDefault()
  
  // Проверка на наличии "калонки" и "самой задачи"
  const column = element.target.closest('.category')
  if (!column || !draggedTask) return
  
  // Определяем новый статус задачи на основе класса колонки
  let newStatus = ''
  if (column.classList.contains('todo')) newStatus = 'todo'
  if (column.classList.contains('inProgress')) newStatus = 'inProgress'  
  if (column.classList.contains('done')) newStatus = 'done'
  
  // Находим задачу в массиве, если нашли, меняем статус
  const taskId = draggedTask.dataset.id
  const taskIndex = state.data.findIndex(task => task.id === taskId)
  
  if (taskIndex !== -1) {
    state.data[taskIndex].status = newStatus
    setState({ data: state.data })
  }
})