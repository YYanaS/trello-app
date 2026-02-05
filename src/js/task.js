//Класс задачи на доске
class Task {
  constructor({ id, title, description, assignee, status = 'todo', createdAt }) {
    this.id = id || crypto.randomUUID() //Если id не передан (новая задача), генерируем его
    this.title = title
    this.description = description
    this.assignee = assignee
    this.status = status
    this.createdAt = createdAt || new Date().toString() //Если время не передано, сохраняем текущее время
  }
}

export { Task }