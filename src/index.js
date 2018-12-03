import { render } from 'preact';
// import 'babel-polyfill';
import './index.sass';

let elem, App;
function init() {
	if (document.getElementById('fallback') !== null)
			document.getElementById('fallback').remove()
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
