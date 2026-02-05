import { Task } from './task.js'

const TASKS_STORAGE_KEY = 'tasks'

// Функция сохранения данных в localStorage
function saveDataToStorage(data) {
  localStorage.setItem(TASKS_STORAGE_KEY, JSON.stringify(data))
}

// Функция получения данных из localStorage
function getDataFromStorage() {
  const data = localStorage.getItem(TASKS_STORAGE_KEY)
  return data ? JSON.parse(data).map(item => new Task(item)) : [] //Если данные есть, парсим JSON и преобразуем каждый объект обратно в экземпляр класса Task
}

export {
  saveDataToStorage,
  getDataFromStorage,
}
