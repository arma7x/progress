import { h, Component } from 'preact';
import { Line } from 'progressbar.js';

export default class Report extends Component {

	constructor() {
		super()
		this.state = {
			id: '',
			task: {},
			advanced: false,
			start_date: new Date(),
			end_date: new Date(),
			remain: 0,
		}
		this.timeout = undefined
		this.line = undefined
	}

	componentDidMount() {
		const { id, task, advanced } = this.props
		this.setState({ id, task, advanced })
		this.renderReport()
	}

	componentWillUpdate({ id, task, advanced }) {
		this.setState({ id, task, advanced })
		this.renderReport()
	}

	componentDidUpdate(prevProps, prevState) {
		//console.group('REPORT');
		//console.log('PROPS PREV '+prevProps.task.target);
		//console.log('PROPS NOW '+this.props.task.target);
		//console.log('STATE PREV '+prevState.task.target);
		//console.log('STATE NOW '+this.state.task.target);
		if (prevProps.task.target != this.props.task.target) {
			this.setState({ task: this.props.task })
			this.renderReport()
		}
		//console.groupEnd('REPORT');
	}

	componentWillUnmount() {
		if (this.timeout !== undefined) {
			clearTimeout(this.timeout)
		}
		if (this.line !== undefined)
			this.line.destroy()
	}

	renderReport() {
		const { id, task } = this.state
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
		const start_date = new Date(task.reboot_history[0][0])
		const end_date = new Date(task.reboot_history[0][0])
		end_date.setDate(start_date.getDate() + task.target)
		const remain = Math.ceil((end_date.getTime() - now.getTime()) / (1000*60*60*24))
		this.timeout = setTimeout(() => {
			if (this.line !== undefined)
				this.line.destroy()
			if (document.getElementById(`line${id}`) !== null) {
				this.line = new Line(`#line${id}`, large)
				this.line.animate((task.target - remain) / task.target)
				this.line.setText(`<div>REBOOT: ${task.reboot_history.length > 1 ? task.reboot_history.length : 0}</div><div>${Math.ceil(((task.target - remain) / task.target) * 100).toFixed(0)}%</div>`)
			}
		}, 100);
		this.setState({ start_date, end_date, remain});
	}

	render() {
		if (this.state.task.name !== undefined) {
			if (this.state.advanced) {
				if (this.props.wrapper) {
					const badge = Object.assign({}, this.props.wrapper)
					badge.children = [(<div class="row">
						<div class="col-xs-4">
							<img src={this.state.task.icon} style="border-top-left-radius:2px;border-bottom-left-radius:2px;margin:0px;"/>
						</div>
						<div class="col-xs-8" style="padding:5px;padding-right:15px">
							<div style="height:75%;display:flex;flex-direction:column;justify-content:space-between;">
								<strong>#{this.state.task.name}</strong>
								<h5 class="badge">Achievement {(this.state.task.target - this.state.remain)}/{this.state.task.target} Days</h5>
								<div id={`line${this.state.id}`}></div>
							</div>
						</div>
					</div>)]
					const info = Object.assign({}, this.props.wrapper)
					info.children = [(<div class="row">
						<div class="col-xs-12">
							<div>START {this.state.start_date.toLocaleDateString()}</div>
							<div>END {this.state.end_date.toLocaleDateString()}</div>
							<div>TARGET {this.state.task.target} Days</div>
							<div>REMAIN {this.state.remain < 0 ? 0 : this.state.remain} Days</div>
							<div>SUCCEED {this.state.task.target - this.state.remain} Days</div>
						</div>
					</div>)]
					const reboot = Object.assign({}, this.props.wrapper)
					reboot.children = [(<div class="row"><div class="col-xs-12">REBOOT</div></div>)]
					return (<div>{badge}{info}{reboot}</div>)
				} else {
					return (<div>ADNVANCED WITHOUT WRAPPER</div>)
				}
			}
			if (this.props.wrapper) {const badge = Object.assign({}, this.props.wrapper)
				badge.children = [(<div class="row">
					<div class="col-xs-4">
						<img src={this.state.task.icon} style="border-top-left-radius:2px;border-bottom-left-radius:2px;margin:0px;"/>
					</div>
					<div class="col-xs-8" style="padding:5px;padding-right:15px">
						<div style="height:75%;display:flex;flex-direction:column;justify-content:space-between;">
							<strong>#{this.state.task.name}</strong>
							<h5 class="badge">Achievement {(this.state.task.target - this.state.remain)}/{this.state.task.target} Days</h5>
							<div id={`line${this.state.id}`}></div>
						</div>
					</div>
				</div>)]
				return badge
			} else {
				return (
					<div class="row" style="padding:0px;">
						<div class="col-xs-4">
							<img src={this.state.task.icon} style="border-top-left-radius:2px;border-bottom-left-radius:2px;margin:0px;"/>
						</div>
						<div class="col-xs-8" style="padding:5px;padding-right:15px">
							<div style="height:75%;display:flex;flex-direction:column;justify-content:space-between;">
								<strong>#{this.state.task.name}</strong>
								<h5 class="badge">Achievement {(this.state.task.target - this.state.remain)}/{this.state.task.target} Days</h5>
								<div id={`line${this.state.id}`}></div>
							</div>
						</div>
					</div>
				)
			}
		} else {
			return <div>Loading</div>
		}
	}
}
