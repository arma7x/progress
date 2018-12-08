import { h } from 'preact'
import { Router } from 'preact-router';
import LiquidRoute, {SlideLeft} from '../libraries/LiquidRoute';
import Layout from './widgets/layout';
import Home from './pages/home';
import Task from './pages/task';
import Error404 from './pages/errors/404';
import redux from '../libraries/redux';
import { task_db } from '../libraries/db';

task_db.keys()
.then((data) => {
	redux.dispatch({ type: 'INIT_TASK_DB', data })
})
.catch((e) => {
	console.trace(e);
})

export default (
	<Layout redux={redux}>
		<Router onChange={(e) => {
			const header = document.getElementById('header')
			if (header !== null) {
				header.className = "col-md-offset-4 col-md-4 animated animated_fastest fadeOutLeft"
				this.timeout = setTimeout(() => {
					header.className = "col-md-offset-4 col-md-4 animated animated_fastest fadeInRight"
				}, 300);
			}
			redux.dispatch({ type: 'SET_ROUTE_URL', value: e.url }) 
		}}>
			<LiquidRoute animator={SlideLeft} path="/" component={Home} redux={redux}/>
			<LiquidRoute animator={SlideLeft} path="/task/:id" component={Task} redux={redux}/>
			<LiquidRoute animator={SlideLeft} component={Error404} redux={redux} default/>
		</Router>
	</Layout>
);

if (document.getElementById('fallback') !== null)
	document.getElementById('fallback').remove()
