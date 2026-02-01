let users = []

async function fetchUsers() {
  try {
    const response = await fetch('https://jsonplaceholder.typicode.com/users')
    if (!response.ok) throw new Error(`Error ${response.status}: ${response.statusText}`)
    const data = await response.json()
    users = data.map(user => user.name)
    return users
  } catch (error) {
    console.warn(error)
    return []
  }
}

function getUsers() {
  return users
}

export { 
    fetchUsers, 
    getUsers,
}
