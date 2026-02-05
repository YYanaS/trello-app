import {state} from "./state";

//Фоматирование даты
function prepareCreatedAtDate(dateString) {
    return new Intl.DateTimeFormat('ru-RU', {
        day: 'numeric',
        month: 'long',
        hour: 'numeric',
        minute: 'numeric',
        hour12: false
    }).format(new Date(dateString))
}

// Функция для поиска индекса задачи по её id
function getIndexTaskById(id) {
    return state.data.findIndex(task => task.id === id)
}

export {
    prepareCreatedAtDate,
    getIndexTaskById,
}