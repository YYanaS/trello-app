import { saveDataToStorage } from './storage.js'
import { render } from './render.js'

//Состояние всего приложения
let state = {
    data: []
}

function setState(newState) {
    state = { ...state, ...newState } //Берем свойсва объекта state и записываем новые из объекта newState, если свойства есть, обновляем их
    saveDataToStorage(state.data)
    render(state.data)
}

export {
    state,
    setState,
}