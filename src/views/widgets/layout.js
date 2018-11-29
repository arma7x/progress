import { h, Component } from 'preact';
import Header from './header';

export default  class Layout extends Component {

	constructor() {
		super()
		this.timeout = undefined
	}

	componentDidMount() {
		window.addEventListener('navigate', (e) => {
			const navBody = document.getElementById('navBody')
			if (navBody !== null) {
				if (this.props.redux.getState().route.url === '\/')
					navBody.className = "col-md-offset-4 col-md-4 animated faster fadeOutLeft"
				else
					navBody.className = "col-md-offset-4 col-md-4 animated faster fadeOutRight"
				this.timeout = setTimeout(() => {
					if (this.props.redux.getState().route.url === '\/')
						navBody.className = "col-md-offset-4 col-md-4 animated faster fadeInRight"
					else
						navBody.className = "col-md-offset-4 col-md-4 animated faster fadeInLeft"
					this.timeout = setTimeout(() => {
						navBody.className = "col-md-offset-4 col-md-4"
					}, 500);
				}, 200);
			}
		}, false);
	}

	componentWillUnmount() {
		if (this.timeout !== undefined)
			clearTimeout(this.timeout)
	}

	render() {
		return (
			<div id="app">
				<Header redux={this.props.redux}/>
				<main id="content">
					<div id="navBody" class="col-md-offset-4 col-md-4">
						{ this.props.children }
					</div>
				</main>
			</div>
		);
	}
}
