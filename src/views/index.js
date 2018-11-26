import { h } from 'preact'
import { Router } from 'preact-router';

import Layout from './widgets/layout';
import Home from './pages/home';
import Article from './pages/article';
import Error404 from './pages/errors/404';
import Credit from './pages/credit';
import Blog from './pages/blog';
import redux from '../libraries/redux';
import { task_db } from '../libraries/db';

task_db.keys()
.then((data) => {
	redux.dispatch({ type: 'POPULATE_TASK_DB', data })
})
.catch((e) => {
	console.trace(e);
})

//task_db.delete('key')
//.then(() => {
	//redux.dispatch({ type: 'DELETE_TASK_DB', key: 'key' })
//})
//.catch((e) => {
	//console.trace(e);
//})

export default (
	<Layout>
		<Router>
			<Home path="/" redux={redux}/>
			<Blog path="/blog" />
			<Article path="/blog/:title" />
			<Credit path="/credit" />
			<Error404 default />
		</Router>
	</Layout>
);
