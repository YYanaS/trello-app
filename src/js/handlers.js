import { Task } from './task.js'
import { getUsers } from './users.js'

import {
  addTaskModalInstanceElement,
  taskFormElement,
  deleteModalInstanceElement,
  deleteModalConfirmButtonElement,
  taskTitleElement,
  taskDescriptionElement,
  taskAssigneeElement,
} from './dom.js'

import {
  state,
  setState,
} from './state.js'

import {
  getIndexTaskById,
} from './helpers.js'

let currentEditingTaskId = null //id задачи, если мы её редактируем, если null, создаем новую задачу

//Обработчик открытия модального окна для редактирования задачи (Edit task)
function openEditTaskModal(taskId) {
  const task = state.data.find(task => task.id === taskId)
  if (!task) return

  taskTitleElement.value = task.title
  taskDescriptionElement.value = task.description || '' //если пользователь не ввел описание, записывается пустая строка
  taskAssigneeElement.value = task.assignee

  currentEditingTaskId = taskId
  addTaskModalInstanceElement.show()
}
//Обработчик открытия модального окна для добавления задачи (Add task)
function handleClickAddTaskButton() {
  addTaskModalInstanceElement.show() //открываем модальное окно
}

//Обработчик сохранения данных из формы
function handleTaskFormSubmit(event) {
  event.preventDefault()

  const formData = new FormData(taskFormElement) //собираем все поля формы
  const title = formData.get('title')?.trim()
  const description = formData.get('description')?.trim()
  const assignee = formData.get('assignee')

  if (!title || !assignee) {
    alert('Please fill the Title and select the Assignee')
    return
  }

  if (currentEditingTaskId) {
    const task = state.data.find(task => task.id === currentEditingTaskId)
    if (task) {
      task.title = title
      task.description = description
      task.assignee = assignee
    }
  } else {
    state.data.push(new Task({ title, description, assignee })) //создаем задачу и добавляем её в массив state.data
  }

  setState({ data: state.data })
  taskFormElement.reset() //очищаем поля формы
  addTaskModalInstanceElement.hide() //закрываем модальное окно
  currentEditingTaskId = null
}

//Обработчик для отслеживания всех кликов по доске
function handleBoardClick(event) {
  //Если пользовтель кликнул по кнопке delete запускаем функцию для удаления задачи
  const deleteBtn = event.target.closest('.delete-task-btn')
  if (deleteBtn) {
    const taskId = deleteBtn.closest('.task').dataset.id
    handleClickDeleteTask(taskId)
    return
  }

  //Если пользовтель кликнул по кнопке edit запускаем функцию для редактирования задачи
  const editBtn = event.target.closest('.edit-task')
  if (editBtn) {
    const taskId = editBtn.closest('.task').dataset.id
    openEditTaskModal(taskId)
  }
}

//Обработчик удаления задачи при нажатии на (Delete)
function handleClickDeleteTask(taskId) {
  // Замыкание функции,  запоминаем taskId, переданный в handleClickDeleteTask
  deleteModalConfirmButtonElement.onclick = () => {
    const index = getIndexTaskById(taskId)
    if (index !== -1) {
      state.data.splice(index, 1)
      setState({ data: state.data })
    }
    deleteModalInstanceElement.hide()
  }

  deleteModalInstanceElement.show()
}

//Обработчик удаления выполненных задач при нажатии на (Delete)
function handleClickDeleteAll() {
  deleteModalConfirmButtonElement.onclick = () => {
    setState({
      data: state.data.filter(task => task.status !== 'done'),
    })
    deleteModalInstanceElement.hide()
  }

  deleteModalInstanceElement.show()
}

// Обработчик изменения статуса задачи
function handleChangeTaskStatus(event) {
  const select = event.target.closest('.task__status')
  if (!select) return

  const taskElement = select.closest('.task')
  const index = getIndexTaskById(taskElement.dataset.id)
  if (index === -1) return

  const newData = structuredClone(state.data) //Создаем глубокую копию, чтобы не изменять сам массив
  newData[index].status = select.value
  setState({ data: newData })
}

// Добавление пользователей в Select
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
  handleClickAddTaskButton,
  handleTaskFormSubmit,
  handleBoardClick,
  handleClickDeleteTask,
  handleClickDeleteAll,
  handleChangeTaskStatus,
  initAssigneeSelect,
}