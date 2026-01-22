// ОБЯЗАТЕЛЬНО: импорт стилей (чтобы Parcel их собрал)
import '../scss/app.scss';

// Импорт Bootstrap компонентов
import { Modal, Dropdown } from 'bootstrap';


// =======================
// Task constructor
// =======================
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

// =======================
// Variables
// =======================
const TASKS_STORAGE_KEY = 'tasks'

let state = { data: [] }
let taskToDeleteId = null
let deleteAll = false

const buttonAddTaskElement = document.querySelector('#buttonAddTodo')
const buttonDeleteAllDoneElement = document.querySelector('#buttonDeleteAll')
const boardElement = document.querySelector('#board')

// Модалки
const deleteModalElement = document.getElementById('deleteModal')
const deleteModalInstance = new bootstrap.Modal(deleteModalElement)
const deleteModalConfirmButton = deleteModalElement.querySelector('.btn-danger')

const addTaskModalElement = document.getElementById('addTaskModal')
const addTaskModalInstance = new bootstrap.Modal(addTaskModalElement)
const saveTaskButton = document.getElementById('saveTaskButton')

// Форма
const taskForm = document.getElementById('taskForm')
const taskTitleInput = document.getElementById('taskTitle')
const taskDescriptionInput = document.getElementById('taskDescription')
const taskAssigneeInput = document.getElementById('taskAssignee')

// =======================
// Init
// =======================
init()

function init() {
    setState({ data: getDataFromStorage() })
    initClock()

    // Listeners
    buttonAddTaskElement.addEventListener('click', () => addTaskModalInstance.show())
    saveTaskButton.addEventListener('click', handleSaveTask)
    buttonDeleteAllDoneElement.addEventListener('click', handleClickDeleteAll)
    boardElement.addEventListener('click', handleClickTask)
    boardElement.addEventListener('change', handleChangeTaskStatus)
    deleteModalConfirmButton.addEventListener('click', handleConfirmDelete)
}

// =======================
// Handlers
// =======================
function handleSaveTask() {
    const title = taskTitleInput.value.trim()
    const description = taskDescriptionInput.value.trim()
    const assigneeRaw = taskAssigneeInput.value.trim()

    if (!title || !assigneeRaw) {
        alert('Пожалуйста, заполните Title и Assignee')
        return
    }

    // Можно вводить нескольких исполнителей через запятую
    const assignee = assigneeRaw.split(',').map(s => s.trim()).filter(Boolean)

    const newTask = new Task({ title, description, assignee })

    const newData = structuredClone(state.data)
    newData.push(newTask)
    setState({ data: newData })

    // Сброс формы и закрытие модалки
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
    if (!deleteBtn) return

    const taskElement = deleteBtn.closest('.task')
    taskToDeleteId = taskElement.dataset.id
    deleteAll = false
    deleteModalInstance.show()
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

// =======================
// Helpers
// =======================
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
        clock.textContent = `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`
    }
    update()
    setInterval(update, 60000)
}

// =======================
// Render
// =======================
function buildTemplateTask({ id, title, description, assignee, status, createdAt }) {
    const assigneeText = Array.isArray(assignee) ? assignee.join(', ') : assignee

    return `
    <article class="task" data-id="${id}">
      <div class="task__header">
        <h4 class="task__title">${title}</h4>
        <div class="dropdown">
          <button class="btn btn-link p-0" type="button" data-bs-toggle="dropdown">⋮</button>
          <ul class="dropdown-menu dropdown-menu-end">
            <li><a class="dropdown-item edit-task" href="#">Edit</a></li>
            <li><hr class="dropdown-divider"></li>
            <li><a class="dropdown-item text-danger delete-task-btn" href="#">Delete</a></li>
          </ul>
        </div>
      </div>
      <p class="task__description">${description}</p>
      <select class="task__status">
        <option value="todo" ${status === 'todo' ? 'selected' : ''}>todo</option>
        <option value="inProgress" ${status === 'inProgress' ? 'selected' : ''}>in progress</option>
        <option value="done" ${status === 'done' ? 'selected' : ''}>done</option>
      </select>
      <div class="task__information">
        <p>${assigneeText}</p>
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

    updateCounters(tasks)
}

function updateCounters(tasks) {
    document.querySelector('.todo .badge').textContent = tasks.filter(t => t.status === 'todo').length
    document.querySelector('.inProgress .badge').textContent = tasks.filter(t => t.status === 'inProgress').length
    document.querySelector('.done .badge').textContent = tasks.filter(t => t.status === 'done').length
}

console.log('App loaded');