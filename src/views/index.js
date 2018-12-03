import { h } from 'preact'
import { Router } from 'preact-router';

import Layout from './widgets/layout';
import Home from './pages/home';
import Task from './pages/task';
import Error404 from './pages/errors/404';
import redux from '../libraries/redux';
import { task_db } from '../libraries/db';

const navigate = new Event('navigate');

task_db.keys()
.then((data) => {
	redux.dispatch({ type: 'POPULATE_TASK_DB', data })
})
.catch((e) => {
	console.trace(e);
})

export default (
	<Layout redux={redux}>
		<Router onChange={(e) => {
			redux.dispatch({ type: 'SET_ROUTE_URL', value: e.url })
			window.dispatchEvent(navigate)
		}}>
			<Home path="/" redux={redux}/>
			<Task path="/task/:id" redux={redux}/>
			<Error404 default />
		</Router>
	</Layout>
);
