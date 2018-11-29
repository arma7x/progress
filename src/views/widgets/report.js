import { h, Component } from 'preact';
import { Line } from 'progressbar.js';

export default class Report extends Component {

	constructor() {
		super()
		this.state = {
			id: '',
			task: {},
			advanced: false
		}
		this.timeout = undefined
		this.line = undefined
	}

	componentDidMount() {
		const { id, task, advanced } = this.props
		this.setState({ id, task, advanced })
	}

	componentWillUnmount() {
		if (this.timeout !== undefined) {
			clearTimeout(this.timeout)
		}
		if (this.line !== undefined)
			this.line.destroy()
	}

	renderReport() {
		const large = {
			easing: 'easeInOut',
			color: '#663AB6',
			trailColor: '#bbb',
			strokeWidth: 3,
			text: {
				style: {
					width: '100%',
					display: 'flex',
					flexDirection: 'row',
					justifyContent: 'space-between',
					fontFamily: '"Roboto", "Helvetica Neue", Helvetica, Arial, sans-serif',
					fontSize: '0.8rem',
					fontWeight: 'bold',
					position: 'absolute',
					padding: 0,
					margin: '5px 0 0 0'
				}
			},
		}
		const now = new Date()
		const start_date = new Date(this.state.task.reboot_history[0][0])
		const end_date = new Date(this.state.task.reboot_history[0][0])
		end_date.setDate(start_date.getDate() + this.state.task.reboot_history[0][1])
		const remain = Math.ceil((end_date.getTime() - now.getTime()) / (1000*60*60*24))
		this.timeout = setTimeout(() => {
			if (this.line !== undefined)
				this.line.destroy()
			if (document.getElementById(`line${this.state.id}`) !== null) {
				this.line = new Line(`#line${this.state.id}`, large)
				this.line.animate((this.state.task.reboot_history[0][1] - remain) / this.state.task.reboot_history[0][1])
				this.line.setText(`<div>REBOOT: ${this.state.task.reboot_history.length}</div><div>${Math.ceil(((this.state.task.reboot_history[0][1] - remain) / this.state.task.reboot_history[0][1]) * 100).toFixed(0)}%</div>`)
			}
		}, 100);
		if (this.props.wrapper && this.state.advanced) {
			const badge = Object.assign({}, this.props.wrapper)
			badge.children = [(<div class="row">
				<div class="col-xs-4">
					<img src={this.state.task.icon} style="border-top-left-radius:2px;border-bottom-left-radius:2px;margin:0px;"/>
				</div>
				<div class="col-xs-8" style="padding:5px;padding-right:15px">
					<div style="height:75%;display:flex;flex-direction:column;justify-content:space-between;">
						<strong>#{this.state.task.name}</strong>
						<h5 class="badge">Achievement {(this.state.task.reboot_history[0][1] - remain)}/{this.state.task.reboot_history[0][1]} Days</h5>
						<div id={`line${this.state.id}`}></div>
					</div>
				</div>
			</div>)]
			const info = Object.assign({}, this.props.wrapper)
			info.children = [(<div class="row"><div class="col-xs-12">INFO</div></div>)]
			const reboot = Object.assign({}, this.props.wrapper)
			reboot.children = [(<div class="row"><div class="col-xs-12">REBOOT</div></div>)]
			return (
				<div>{badge}{info}{reboot}</div>
			)
		}
		return (
			<div class="row" style="padding:0px;">
				<div class="col-xs-4">
					<img src={this.state.task.icon} style="border-top-left-radius:2px;border-bottom-left-radius:2px;margin:0px;"/>
				</div>
				<div class="col-xs-8" style="padding:5px;padding-right:15px">
					<div style="height:75%;display:flex;flex-direction:column;justify-content:space-between;">
						<strong>#{this.state.task.name}</strong>
						<h5 class="badge">Achievement {(this.state.task.reboot_history[0][1] - remain)}/{this.state.task.reboot_history[0][1]} Days</h5>
						<div id={`line${this.state.id}`}></div>
					</div>
				</div>
			</div>
		)
	}

	render() {
		return this.state.task.name !== undefined ? this.renderReport() : <div>Loading</div>
	}
}
