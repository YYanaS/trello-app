import { Modal } from 'bootstrap'

//Получение DOM-элементов
const buttonAddTaskElement = document.getElementById('buttonAddTodo')
const buttonDeleteAllDoneElement = document.getElementById('buttonDeleteAll')
const boardElement = document.getElementById('board')

const deleteModalElement = document.getElementById('deleteModal')
const deleteModalInstanceElement = new Modal(deleteModalElement) // Экземпляр Bootstrap модалки для управления её отображением
const deleteModalConfirmButtonElement = deleteModalElement.querySelector('.btn-danger')

const addTaskModalElement = document.getElementById('addTaskModal')
const addTaskModalInstanceElement = new Modal(addTaskModalElement) // Экземпляр Bootstrap модалки для управления её отображением
const saveTaskButtonElement = document.getElementById('saveTaskButton')

const taskFormElement = document.getElementById('taskForm')
const taskTitleElement = document.getElementById('taskTitle')
const taskDescriptionElement = document.getElementById('taskDescription')
const taskAssigneeElement = document.getElementById('taskAssignee')

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