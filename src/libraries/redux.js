import { createStore } from 'redux'
import { task_db } from './db.js'

let initState = {
	task_db: {},
}

function counter(state = initState, action) {
	switch (action.type) {
		case 'POPULATE_TASK_DB':
			state.task_db = action.data
			return state
		case 'PUT_TASK_DB':
			state.task_db[action.key] = action.value
			return state
		case 'DELETE_TASK_DB':
			delete state.task_db[action.key]
			return state
		default:
			return state
	}
}

export default createStore(counter)
