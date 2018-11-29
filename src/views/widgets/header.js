import { h, Component } from 'preact';
import { Link } from 'preact-router';

export default class Header extends Component {

	constructor() {
		super()
		this.state = {
			title: '',
			url: '/',
		}
		this.unsubscribe = undefined
		this.timeout = undefined
	}

	componentDidMount() {
		window.addEventListener('navigate', (e) => {
			const navHeader = document.getElementById('navHeader')
			if (navHeader !== null) {
				if (this.props.redux.getState().route.url === '\/')
					navHeader.className = "col-md-offset-4 col-md-4 animated faster fadeOutLeft"
				else
					navHeader.className = "col-md-offset-4 col-md-4 animated faster fadeOutRight"
				this.timeout = setTimeout(() => {
					if (this.props.redux.getState().route.url === '\/')
						navHeader.className = "col-md-offset-4 col-md-4 animated faster fadeInRight"
					else
						navHeader.className = "col-md-offset-4 col-md-4 animated faster fadeInLeft"
				}, 200);
			}
		}, false);
		if (this.unsubscribe === undefined) {
			this.unsubscribe = this.props.redux.subscribe(() => {
				document.title = this.props.redux.getState().route.title
				this.setState({ title: this.props.redux.getState().route.title })
				this.timeout = setTimeout(() => {
					this.setState({ url: this.props.redux.getState().route.url })
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
		const icon ='data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAIAAAACACAYAAADDPmHLAAAABmJLR0QAAAAAAAD5Q7t/AAAACXBIWXMAAAsTAAALEwEAmpwYAAAAB3RJTUUH4gsFBgw0XtoWAQAAAb9JREFUeNrt3cENgzAABEGO/ntOPvnQAHK04xK8I7CNJa4rPD6/UZ6DleM/JmIbANH4ZQQTv41g4rcRTPw2gonfRjDx2wgmfhvBxG8jmPhtBBO/jWDiewKIbw0gvl2A+M4BxG/F/2sA4ocBiB8GIH4YgPhhAOKHAYgfBiB+GID4YQDihwGIHwYgfhiA+GEA4ocBiB8GIH4YgPhhAOKHAYgfBiB+GID4YQDihwGIHwYgfhiA+GEA4ocBiB8GIH4YgPhhAOKHAYgfBiB+GID4YQDihwGIHwYgfhiA+GEA4ocBiB8GIH4YQP2femkA4ocBiB8GIH4YgPhhAOKHAYgfBiB+e9ymwCvAK8AiEALbQAgAgAAACACAAAAIAHgLgQshhwOAAAAIAIAAAAgAgAAACACAAAAIAIAAAAgAgAAACACAAAAIAIAAAAgAgAAACACAAAAIAIAAAAgAgAAACACAAAAIAIAAAAgAgAAACACAAAAIAIAAAAgAgAAACACAAAAIAIAAAAgAgAAACACAAAAIADgFgSdAGIE1QBiBXUAYgXOAMAIngWEEvgWEEfgaGEbgPkAYgRtBYQSuiEcR1P+N+AVpKwRSoxRD+AAAAABJRU5ErkJggg=='

		const { url, title } = this.state
		return (
			<header className="header">
				<div id="navHeader" class="col-md-offset-4 col-md-4 animated faster fadeIn">
				{
					url !== '/' &&
					<nav style="float:left;">
						<Link href="/">
							<img src={icon} style="width:25px;height:25px;"/>
						</Link>
					</nav>
				}
				<h1>{ title.toUpperCase() }</h1>
				</div>
			</header>
		)
	}
}
