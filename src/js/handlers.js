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

function handleTaskFormSubmit(event) {
  event.preventDefault()
  
  const formData = new FormData(taskFormElement) // собираем все поля формы
  const title = formData.get('title')?.trim()
  const description = formData.get('description')?.trim()
  const assignee = formData.get('assignee')
  const status = formData.get('status') || 'todo' // получаем статус из формы, по умолчанию "todo"

  if (!title || !assignee) {
    alert('Please fill the Title and select the Assignee')
    return
  }

  // Проверка лимита для inProgress
  if (!currentEditingTaskId && status === 'inProgress') { // проверяем только для новых задач
    const inProgressCount = state.data.filter(task => task.status === 'inProgress').length
    if (inProgressCount >= 10) {
      alert('Нельзя больше 10 задач в колонке "In Progress"!')
      return
    }
  }

  if (currentEditingTaskId) {
    // Редактирование существующей задачи
    const task = state.data.find(task => task.id === currentEditingTaskId)
    if (task) {
      task.title = title
      task.description = description
      task.assignee = assignee

      // Если редактируем и меняем статус на inProgress
      if (status === 'inProgress' && task.status !== 'inProgress') {
        const inProgressCount = state.data.filter(task => task.status === 'inProgress').length
        if (inProgressCount >= 10) {
          alert('Нельзя больше 10 задач в колонке "In Progress"!')
          return
        }
      }

      task.status = status
    }
  } else {
    state.data.push(new Task({ title, description, assignee, status }))
  }

  setState({ data: state.data })
  taskFormElement.reset()
  addTaskModalInstanceElement.hide()
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

function handleChangeTaskStatus(event) {
  const select = event.target.closest('.task__status')
  if (!select) return

  const taskElement = select.closest('.task')
  const index = getIndexTaskById(taskElement.dataset.id)
  if (index === -1) return

  const newData = structuredClone(state.data)

  // Лимит 10 задач в колонке inProgress
  if (select.value === 'inProgress') {
    const inProgressCount = newData.filter(task => task.status === 'inProgress').length
    if (inProgressCount >= 10) {
      alert('Нельзя больше 10 задач в колонке "In Progress"!')
      select.value = newData[index].status // Возвращаем select к предыдущему значению
      return
    }
  }

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