class Task {
  id = crypto.randomUUID()
  createdAt = new Date().toString()

  constructor({ title, description, assignee, status = 'todo' }) {
    this.title = title
    this.description = description
    this.assignee = assignee
    this.status = status
  }
}

export { Task }