class Task {
  constructor({ id, title, description, assignee, status = 'todo', createdAt }) {
    this.id = id || crypto.randomUUID()
    this.title = title
    this.description = description
    this.assignee = assignee
    this.status = status
    this.createdAt = createdAt || new Date().toString()
  }
}

export { Task }