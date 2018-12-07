import { h, Component } from 'preact';
import Header from './header';

export default  class Layout extends Component {

	constructor() {
		super()
		this.timeout = undefined
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
					{ this.props.children }
				</main>
			</div>
		);
	}
}
