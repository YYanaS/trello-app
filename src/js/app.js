import '../scss/app.scss'

import {
  buttonAddTaskElement,
  buttonDeleteAllDoneElement,
  boardElement,
  taskFormElement,
} from './dom.js'

import {
  setState,
} from './state.js'

import {
  handleClickAddTaskButton,
  handleTaskFormSubmit,
  handleBoardClick,
  handleClickDeleteAll,
  handleChangeTaskStatus,
  initAssigneeSelect,
} from './handlers.js'

import { initDragAndDrop } from './dragAndDrop.js'
import { getDataFromStorage } from './storage.js'
import { fetchUsers } from './users.js'
import { initClock } from './time.js'


//Функция инициализации приложения
async function initApp() {
  await fetchUsers()          // получаем пользователей с API
  initAssigneeSelect()        // заполняем select
  setState({ data: getDataFromStorage() }) //Получаем задачи из localStorage и устанавливаем их в состояние приложения

  // Обработчики событий
  buttonAddTaskElement.addEventListener('click', handleClickAddTaskButton)
  taskFormElement.addEventListener('submit', handleTaskFormSubmit)
  buttonDeleteAllDoneElement.addEventListener('click', handleClickDeleteAll)
  boardElement.addEventListener('click', handleBoardClick)
  boardElement.addEventListener('change', handleChangeTaskStatus)

  // drag & drop
  initDragAndDrop()
}

initApp() //Запуск приложения
initClock() //Инициализация часов