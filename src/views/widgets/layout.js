import { h, Component } from 'preact';
import Header from './header';

export default  class Layout extends Component {

	constructor() {
		super()
		this.timeout = undefined
	}

	componentDidMount() {
		window.addEventListener('navigate', (e) => {
			const content = document.getElementById('content')
			if (content !== null) {
				if (this.props.redux.getState().route.url === '\/')
					content.className = "col-md-offset-4 col-md-4 animated faster fadeOutRight"
				else
					content.className = "col-md-offset-4 col-md-4 animated faster fadeOutLeft"
				content.style.visibility = 'hidden'
				this.timeout = setTimeout(() => {
					content.style.visibility = 'visible'
					if (this.props.redux.getState().route.url === '\/')
						content.className = "col-md-offset-4 col-md-4 animated faster fadeInLeft"
					else
						content.className = "col-md-offset-4 col-md-4 animated faster fadeInRight"
					this.timeout = setTimeout(() => {
						content.className = "col-md-offset-4 col-md-4"
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
				<main id="content" class="col-md-offset-4 col-md-4 animated faster fadeIn">
					{ this.props.children }
				</main>
			</div>
		);
	}
}
