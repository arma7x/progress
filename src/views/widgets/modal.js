import { h, Component } from 'preact';

export default class Modal extends Component {

	constructor() {
		super()
		this.state = {
			visible: false
		}
		this.onOpened = undefined
		this.onClosed = undefined
	}

	_init(props) {
		if (props.visible !== undefined && props.visible !== this.props.visible) {
			this.setState({ visible: props.visible })
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

	componentDidMount() {
		this._init(this.props);
	}

	componentWillReceiveProps(props) {
		this._init(props);
	}

	render () {
		const { visible } = this.state;
		
		if (visible) {
			return (
				<div class="popup blur">
					<div class="col-md-offset-4 col-md-4">
						{this.props.children ? this.props.children : null}
					</div>
				</div>
			)
		} else {
			return null
		}
	};
}
