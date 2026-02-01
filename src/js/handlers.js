import { Task } from './Task.js'
import { saveDataToStorage } from './storage.js'
import { render } from './render.js'
import { getUsers } from './users.js'


import {
  boardElement,
  addTaskModalInstanceElement,
  taskFormElement,
  deleteModalInstanceElement,
  deleteModalConfirmButtonElement,
  taskTitleElement,
  taskDescriptionElement,
  taskAssigneeElement,
} from './dom.js'

let state = { data: [] }
let currentEditingTaskId = null
let draggedTask = null

function setState(newState) {
  state = { ...state, ...newState }
  saveDataToStorage(state.data)
  render(state.data)
}

function openEditTaskModal(taskId) {
  const task = state.data.find(task => task.id === taskId)
  if (!task) return

  taskTitleElement.value = task.title
  taskDescriptionElement.value = task.description || ''
  taskAssigneeElement.value = task.assignee

  currentEditingTaskId = taskId
  addTaskModalInstanceElement.show()
}

function handleClickAddTaskButton() {
  addTaskModalInstanceElement.show()
}

function handleTaskFormSubmit(event) {
  event.preventDefault()
  const formData = new FormData(taskFormElement)
  const title = formData.get('title')?.trim()
  const description = formData.get('description')?.trim()
  const assignee = formData.get('assignee')

  if (!title || !assignee) return alert('Please fill the Title and select the Assignee')

  if (currentEditingTaskId) {
    const task = state.data.find(task => task.id === currentEditingTaskId)
    if (task) Object.assign(task, { title, description, assignee })
  } else {
    state.data.push(new Task({ title, description, assignee }))
  }

  setState({ data: state.data })
  taskFormElement.reset()
  addTaskModalInstanceElement.hide()
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
  deleteModalConfirmButtonElement.onclick = () => {
    const index = getIndexTaskById(taskId)
    if (index !== -1) state.data.splice(index, 1)
    setState({ data: state.data })
    deleteModalInstanceElement.hide()
  }
  deleteModalInstanceElement.show()
}

function handleClickDeleteAll() {
  deleteModalConfirmButtonElement.onclick = () => {
    setState({ data: state.data.filter(task => task.status !== 'done') })
    deleteModalInstanceElement.hide()
  }
  deleteModalInstanceElement.show()
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

function getIndexTaskById(id) {
  return state.data.findIndex(task => task.id === id)
}

//Drag & Drop 
function initDragAndDrop() {
  boardElement.addEventListener('dragstart', (event) => {
    if (event.target.classList.contains('task')) {
      draggedTask = event.target
      draggedTask.style.opacity = '0.5'
    }
  })

  boardElement.addEventListener('dragend', () => {
    if (draggedTask) draggedTask.style.opacity = '1'
    draggedTask = null
  })

  boardElement.addEventListener('dragover', (event) => event.preventDefault())

  boardElement.addEventListener('drop', (event) => {
    event.preventDefault()
    const column = event.target.closest('.category')
    if (!column || !draggedTask) return

    let newStatus = ''
    if (column.classList.contains('todo')) newStatus = 'todo'
    if (column.classList.contains('inProgress')) newStatus = 'inProgress'
    if (column.classList.contains('done')) newStatus = 'done'

    const taskId = draggedTask.dataset.id
    const taskIndex = state.data.findIndex(t => t.id === taskId)
    if (taskIndex !== -1) {
      state.data[taskIndex].status = newStatus
      setState({ data: state.data })
    }
  })
}

function initAssigneeSelect() {
  const users = getUsers()
  taskAssigneeElement.innerHTML = ''
  users.forEach(userName => {
    const option = document.createElement('option')
    option.value = userName
    option.textContent = userName
    taskAssigneeElement.appendChild(option)
  })
}

export {
  state,
  setState,
  handleClickAddTaskButton,
  openEditTaskModal,
  handleTaskFormSubmit,
  handleBoardClick,
  handleClickDeleteTask,
  handleClickDeleteAll,
  handleChangeTaskStatus,
  getIndexTaskById,
  initDragAndDrop,
  initAssigneeSelect,
}
