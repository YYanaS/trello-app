import { Modal } from 'bootstrap'

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

export {
  buttonAddTaskElement,
  buttonDeleteAllDoneElement,
  boardElement,
  deleteModalElement,
  deleteModalInstance,
  deleteModalConfirmButton,
  addTaskModalElement,
  addTaskModalInstance,
  saveTaskButton,
  taskForm,
  taskTitleInput,
  taskDescriptionInput,
  taskAssigneeInput,
}