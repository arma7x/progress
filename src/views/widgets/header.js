import { h, Component } from 'preact';
import { Link } from 'preact-router';

export default class Header extends Component {

	constructor() {
		super()
		this.state = {
			title: '',
			url: '/',
			back_button: '',
			github_svg: '',
		}
		this.unsubscribe = undefined
		this.timeout = undefined
	}

	componentDidMount() {
		if (this.unsubscribe === undefined) {
			this.unsubscribe = this.props.redux.subscribe(() => {
				document.title = this.props.redux.getState().route.title
				this.setState({ title: this.props.redux.getState().route.title })
				this.timeout = setTimeout(() => {
					this.setState({ 
						url: this.props.redux.getState().route.url,
						back_button: this.props.redux.getState().ui.back_button,
						github_svg: this.props.redux.getState().ui.github_svg,
					})
				}, 200);
			})
		}
	}

	componentWillUnmount() {
		if (this.timeout !== undefined)
			clearTimeout(this.timeout)
		if (this.unsubscribe !== undefined)
			this.unsubscribe()
	}

	render() {

		const { url, title, back_button, github_svg } = this.state
		return (
			<header className="header">
				<div id="header" class="col-md-offset-4 col-md-4 animated faster fadeIn">
					<nav>
						{
							url !== '/' &&
							<a style="float:left" onClick={() => window.history.back() }>
								<img src={back_button} style="width:25px;height:25px;"/>
							</a>
						}
						<h1>{ title.toUpperCase() }</h1>
						<a href="https://github.com/arma7x/progress" style="text-decoration:none;float:right;padding-top:10px;" target="_blank" rel="noopener">
							<svg style="width:30px;height:30px;" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 499.36" focusable="false">
								<title>GitHub</title>
								<path d={github_svg} fill="currentColor" fill-rule="evenodd"></path>
							</svg>
						</a>
					</nav>
				</div>
			</header>
		)
	}
}
