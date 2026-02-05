import { boardElement } from './dom.js'
import { state, setState } from './state.js'

let draggedTask = null

// Обработчики событий

//Обработчик начала перетаскивания элемента
function handleDragStart(event) {
    if (event.target.classList.contains('task')) {
        draggedTask = event.target
        draggedTask.style.opacity = '0.5' // визуальный эффект
    }
}

//Обработчик конца перетаскивания элемента
function handleDragEnd() {
    if (draggedTask) draggedTask.style.opacity = '1'
    draggedTask = null
}

//Разренение отпустить задачу
function handleDragOver(event) {
    event.preventDefault() // отмена стандартного поведения
}

//Обработчик перемещения задачи
function handleDrop(event) {
    event.preventDefault()

    const column = event.target.closest('.category')
    if (!column || !draggedTask) return

    const task = state.data.find(t => t.id === draggedTask.dataset.id)
    if (!task) return

    // Обновляем статус задачи в зависимости от колонки, в которую её переместили
    if (column.classList.contains('todo')) task.status = 'todo'
    if (column.classList.contains('inProgress')) task.status = 'inProgress'
    if (column.classList.contains('done')) task.status = 'done'

    // Перерисовываем доску
    setState({ data: state.data })
}

// Инициализация Drag & Drop
function initDragAndDrop() {
    boardElement.addEventListener('dragstart', handleDragStart)
    boardElement.addEventListener('dragend', handleDragEnd)
    boardElement.addEventListener('dragover', handleDragOver)
    boardElement.addEventListener('drop', handleDrop)
}
export { initDragAndDrop }
