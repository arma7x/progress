import { render } from 'preact';
import './index.sass';

let elem, App;

const init = () => {
	App = require('./views').default;
	elem = render(App, document.getElementById('root'), elem);
}

init();

if (process.env.NODE_ENV !== 'production') {
	require('preact/devtools');
	if (module.hot) {
		module.hot.accept('./views', init);
	}
}
