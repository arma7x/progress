import { h, Component } from 'preact';

export default class Modal extends Component {

	constructor() {
		super()
		this.state = {
			visible: false,
			height: ''
		}
		this.onOpened = undefined
		this.onClosed = undefined
	}

	componentDidMount() {
		this._init(this.props);
	}

	componentWillReceiveProps(props) {
		this._init(props);
	}

	_init(props) {
		if (props.visible !== undefined && props.visible !== this.state.visible) {
			this.setState({ visible: props.visible })
			if (props.visible === true) {
				const content = document.getElementById('content')
				if ((window.innerHeight > content.offsetHeight) === false) {
					this.setState({ height: `${content.offsetHeight+20}px` })
				} else {
					this.setState({ height: `${window.innerHeight}px` })
				}
			}
			if (props.visible === true && this.onOpened !== undefined) {
				this.onOpened();
			} else if (props.visible === false && this.onClosed !== undefined) {
				this.onClosed();
			}
		}
		if (props.onOpened !== undefined && typeof props.onOpened === "function") {
			this.onOpened = props.onOpened
		}
		if (props.onClosed !== undefined && typeof props.onClosed === "function") {
			this.onClosed = props.onClosed
		}
	}

	render () {
		const { visible, height } = this.state;
		
		if (visible) {
			return (
				<div class="modal" style={`height:${height}`}>
					<div class={"col-md-offset-4 col-md-4 animated faster slideInDown"}>
						{this.props.children ? this.props.children : null}
					</div>
				</div>
			)
		} else {
			return null
		}
	};
}
