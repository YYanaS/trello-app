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

    // Определяем новый статус
    let newStatus = ''
    if (column.classList.contains('todo')) newStatus = 'todo'
    if (column.classList.contains('inProgress')) newStatus = 'inProgress'
    if (column.classList.contains('done')) newStatus = 'done'

    // Проверка лимита для inProgress
    if (newStatus === 'inProgress' && task.status !== 'inProgress') {
        const inProgressCount = state.data.filter(t => t.status === 'inProgress').length
        if (inProgressCount >= 10) {
            alert('Нельзя больше 10 задач в колонке "In Progress"!')
            return
        }
    }

    // Обновляем статус задачи
    task.status = newStatus

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
