import { Modal } from 'bootstrap'

//Получение DOM-элементов
const buttonAddTaskElement = document.querySelector('#buttonAddTodo')
const buttonDeleteAllDoneElement = document.querySelector('#buttonDeleteAll')
const boardElement = document.querySelector('#board')

const deleteModalElement = document.querySelector('#deleteModal')
const deleteModalInstanceElement = new Modal(deleteModalElement)
const deleteModalConfirmButtonElement = deleteModalElement.querySelector('.btn-danger')

const addTaskModalElement = document.querySelector('#addTaskModal')
const addTaskModalInstanceElement = new Modal(addTaskModalElement)
const saveTaskButtonElement = document.querySelector('#saveTaskButton')

const taskFormElement = document.querySelector('#taskForm')
const taskTitleElement = document.querySelector('#taskTitle')
const taskDescriptionElement = document.querySelector('#taskDescription')
const taskAssigneeElement = document.querySelector('#taskAssignee')

export {
  buttonAddTaskElement,
  buttonDeleteAllDoneElement,
  boardElement,
  deleteModalElement,
  deleteModalInstanceElement,
  deleteModalConfirmButtonElement,
  addTaskModalElement,
  addTaskModalInstanceElement,
  saveTaskButtonElement,
  taskFormElement,
  taskTitleElement,
  taskDescriptionElement,
  taskAssigneeElement,
}