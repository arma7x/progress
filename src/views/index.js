import { h } from 'preact'
import { Router } from 'preact-router';

import Layout from './widgets/layout';
import Home from './pages/home';
import Article from './pages/article';
import Error404 from './pages/errors/404';
import Credit from './pages/credit';
import Blog from './pages/blog';
import store from '../libraries/redux';

store.subscribe(() =>
  console.log(store.getState())
)

// track pages on route change
// const onChange = obj => window.ga && ga.send('pageview', { dp:obj.url });  onChange={ // onChange }

export default (
	<Layout>
		<Router>
			<Home path="/" redux={store}/>
			<Blog path="/blog" />
			<Article path="/blog/:title" />
			<Credit path="/credit" />
			<Error404 default />
		</Router>
	</Layout>
);
