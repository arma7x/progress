import { h } from 'preact';
import Header from './header';

export default function (props) {
	return (
		<div id="app">
			<Header />
			<main id="content">
				<div class="col-md-offset-4 col-md-4">
				{ props.children }
				</div>
			</main>
		</div>
	);
}
