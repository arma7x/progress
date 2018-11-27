import { h, Component } from 'preact';
import { Link } from 'preact-router';

export default class Header extends Component {

	constructor() {
		super()
		this.state = {
			goback: false
		}
	}
	componentDidMount() {
		window.addEventListener('navigate', (e) => { 
			this.setState({ goback: (window.location.pathname !== '\/')})
		}, false);
	}

	render() {
		const icon ='data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAIAAAACACAYAAADDPmHLAAAABmJLR0QAAAAAAAD5Q7t/AAAACXBIWXMAAAsTAAALEwEAmpwYAAAAB3RJTUUH4gsFBgw0XtoWAQAAAb9JREFUeNrt3cENgzAABEGO/ntOPvnQAHK04xK8I7CNJa4rPD6/UZ6DleM/JmIbANH4ZQQTv41g4rcRTPw2gonfRjDx2wgmfhvBxG8jmPhtBBO/jWDiewKIbw0gvl2A+M4BxG/F/2sA4ocBiB8GIH4YgPhhAOKHAYgfBiB+GID4YQDihwGIHwYgfhiA+GEA4ocBiB8GIH4YgPhhAOKHAYgfBiB+GID4YQDihwGIHwYgfhiA+GEA4ocBiB8GIH4YgPhhAOKHAYgfBiB+GID4YQDihwGIHwYgfhiA+GEA4ocBiB8GIH4YQP2femkA4ocBiB8GIH4YgPhhAOKHAYgfBiB+e9ymwCvAK8AiEALbQAgAgAAACACAAAAIAHgLgQshhwOAAAAIAIAAAAgAgAAACACAAAAIAIAAAAgAgAAACACAAAAIAIAAAAgAgAAACACAAAAIAIAAAAgAgAAACACAAAAIAIAAAAgAgAAACACAAAAIAIAAAAgAgAAACACAAAAIAIAAAAgAgAAACACAAAAIADgFgSdAGIE1QBiBXUAYgXOAMAIngWEEvgWEEfgaGEbgPkAYgRtBYQSuiEcR1P+N+AVpKwRSoxRD+AAAAABJRU5ErkJggg=='

		return (
			<header className="header">
				{
					this.state.goback &&
					<nav style="float:left;">
						<a onClick={() => window.history.go(-1)}>
							<img src={icon} style="width:25px;height:25px;"/>
						</a>
					</nav>
				}
				<h1>Insanity</h1>
			</header>
		)
	}
}
