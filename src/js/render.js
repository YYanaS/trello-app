import { Dropdown } from 'bootstrap'

import {
  prepareCreatedAtDate,
} from './helpers.js'


//Функция для создания HTML-шаблона задачи
function buildTemplateTask({ id, title, description, assignee, status, createdAt }) {
  return `
    <article class="task task__${status}" data-id="${id}" draggable="true">
      <div class="task__header">
        <h4 class="task__title">${title}</h4>
        <div class="dropdown">
          <button class="btn btn-link p-0 dropdown-toggle" type="button"
            data-bs-toggle="dropdown">⋮</button>
          <ul class="dropdown-menu dropdown-menu-end">
            <li><button class="dropdown-item edit-task" type="button">Edit</button></li>
            <li><hr class="dropdown-divider"></li>
            <li><button class="dropdown-item text-danger delete-task-btn"
              type="button">Delete</button></li>
          </ul>
        </div>
      </div>
      <p class="task__description">${description}</p>
      <select class="task__status form-select form-select-sm">
        <option value="todo" ${status === 'todo' ? 'selected' : ''}>todo</option>
        <option value="inProgress" ${status === 'inProgress' ? 'selected' : ''}>in progress</option>
        <option value="done" ${status === 'done' ? 'selected' : ''}>done</option>
      </select>
      <div class="task__information">
        <p>${assignee}</p>
        <time>${prepareCreatedAtDate(createdAt)}</time>
      </div>
    </article>
  `
}

//Функция для рендеринга всех задач по категориям
function render(tasks) {
  document.querySelector('.todo .category__body').innerHTML = ''
  document.querySelector('.inProgress .category__body').innerHTML = ''
  document.querySelector('.done .category__body').innerHTML = ''

  // Контейнеры для каждой категории
  const containers = {
    todo: document.querySelector('.todo .category__body'),
    inProgress: document.querySelector('.inProgress .category__body'),
    done: document.querySelector('.done .category__body')
  }

  // Добавляем каждую задачу в соответствующий контейнер
  tasks.forEach(task => {
    containers[task.status]?.insertAdjacentHTML('beforeend', buildTemplateTask(task))
  })

  // Инициализируем dropdown-меню для каждой кнопки
  document.querySelectorAll('.dropdown-toggle').forEach(el => new Dropdown(el))
  updateCounters(tasks)
}

//Функция для обновления счетчиков задач по категориям
function updateCounters(tasks) {
  document.querySelector('.todo .category__counter').textContent =
      tasks.filter(task => task.status === 'todo').length
  document.querySelector('.inProgress .category__counter').textContent =
      tasks.filter(task => task.status === 'inProgress').length
  document.querySelector('.done .category__counter').textContent =
      tasks.filter(task => task.status === 'done').length
}

export {
  buildTemplateTask,
  render,
  updateCounters
}
