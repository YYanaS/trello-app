import { Task } from './task.js'

const TASKS_STORAGE_KEY = 'tasks'

function saveDataToStorage(data) {
  localStorage.setItem(TASKS_STORAGE_KEY, JSON.stringify(data))
}

function getDataFromStorage() {
  const data = localStorage.getItem(TASKS_STORAGE_KEY)
  return data ? JSON.parse(data).map(item => new Task(item)) : []
}

export {
  saveDataToStorage,
  getDataFromStorage,
}
