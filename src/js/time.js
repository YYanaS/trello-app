function initClock() {
  const clock = document.querySelector('.header__clock')
  const update = () => {
    clock.textContent = new Date().toTimeString().slice(0, 5)
  }

  // Обновляем каждую минуту, начиная со следующей целой минуты
  setTimeout(() => {
    update()
    setInterval(update, 60000)
  }, 60000 - new Date().getSeconds() * 1000)

  update()
}

export { initClock }