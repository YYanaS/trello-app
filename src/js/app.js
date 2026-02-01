import '../scss/app.scss'

import { 
  buttonAddTaskElement,
  buttonDeleteAllDoneElement,
  boardElement,
  addTaskModalInstance,
  taskForm
} from './dom.js'

import { 
  setState,
  handleTaskFormSubmit,
  handleBoardClick,
  handleClickDeleteAll,
  handleChangeTaskStatus,
  initDragAndDrop,
  initAssigneeSelect
} from './handlers.js'

import { getDataFromStorage } from './storage.js'
import { fetchUsers } from './users.js'
import { initClock } from './time.js' 

async function initApp() {
  await fetchUsers()         // получаем пользователей с API
  initAssigneeSelect()       // заполняем select
  setState({ data: getDataFromStorage() })

  buttonAddTaskElement.addEventListener('click', () => addTaskModalInstance.show())
  taskForm.addEventListener('submit', handleTaskFormSubmit)
  buttonDeleteAllDoneElement.addEventListener('click', handleClickDeleteAll)
  boardElement.addEventListener('click', handleBoardClick)
  boardElement.addEventListener('change', handleChangeTaskStatus)

  // drag & drop
  initDragAndDrop()
}

initApp()
initClock()