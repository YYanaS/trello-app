let users = []

//Получение массива пользователей по API
async function fetchUsers() {
  try {
    const response = await fetch('https://jsonplaceholder.typicode.com/users') // Выполняем HTTP-запрос к API для получения данных пользователей
    if (!response.ok) throw new Error(`Error ${response.status}: ${response.statusText}`) // Проверяем статус ответа: если не в диапазоне 200-299 - выбрасываем ошибку
    const data = await response.json()
    users = data.map(user => user.name)
    return users
  } catch (error) { //Сюда попадаем, если в try возникла ошибка
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
