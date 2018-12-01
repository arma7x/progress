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

	componentDidUpdate(prevProps, prevState) {
		if ((prevProps.task.target !== this.props.task.target) || (prevProps.task.reboot_history[0][0] !== this.props.task.reboot_history[0][0])) {
			this.setState({ task: this.props.task })
			this.renderReport()
		}
	}

	componentWillUnmount() {
		if (this.timeout !== undefined) {
			clearTimeout(this.timeout)
		}
		if (this.line !== undefined)
			this.line.destroy()
	}

	renderRebootLog(logs) {
		logs.map((value, index) => {
			if (index !== (logs.length - 1)) {
				const start_date = new Date(value[0])
				const end_date = new Date(logs[index+1][0])
				const remain = Math.ceil((start_date.getTime() - end_date.getTime()) / (1000*60*60*24))
				console.group(start_date.toLocaleDateString() + ' - ' + end_date.toLocaleDateString());
				console.log('START ' + end_date.toLocaleDateString());
				console.log('END ' + start_date.toLocaleDateString());
				console.log('TARGET ' + logs[index+1][1] + ' Days ');
				console.log('ACHIEVED ' + remain + ' Days ');
				console.log('NOTE ' + logs[index][2]);
				console.log(Math.ceil((remain/logs[index+1][1]) * 100).toFixed(0)+'%');
				console.groupEnd(start_date.toLocaleDateString() + ' - ' + end_date.toLocaleDateString());
			}
		})
		if (logs.length === 1) {
			return <div>NO REBOOT</div>
		} else {
			return <div><p>{JSON.stringify(logs, null, 2)}</p></div>
		}
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
				const badgeContent = <div class="row">
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
				const infoContent = <div class="row">
					<div class="col-xs-12" style="padding: 7px 14px">
						<div class="row">
							<div class="col-xs-5">
								<div>
									<strong>START</strong>
									<h5 class="badge">{this.state.start_date.toLocaleDateString()}</h5>
								</div>
								<div>
									<strong>END</strong>
									<h5 class="badge">{this.state.end_date.toLocaleDateString()}</h5>
								</div>
							</div>
							<div class="col-xs-7">
								<div style="display:flex;flex-direction:row-reverse;justify-content:space-between;">
									<div>
										<strong>REMAIN</strong>
										<h5 class="badge">{this.state.remain < 0 ? 0 : this.state.remain} Days</h5>
									</div>
									<div>
										<strong>TARGET</strong>
										<h5 class="badge">{this.state.task.target} Days</h5>
									</div>
								</div>
								<div>
									<strong>ACHIEVED</strong>
									<h5 class="badge">{
										(this.state.task.target - this.state.remain) > this.state.task.target
										? `${this.state.task.target} + ${-(this.state.remain)}`
										: (this.state.task.target - this.state.remain)
									} Days</h5>
								</div>
							</div>
						</div>
						<div>
						</div>
					</div>
				</div>
				const rebootContent = <div class="row">
					<div class="col-xs-12">
						{this.renderRebootLog(this.state.task.reboot_history)}
					</div>
				</div>
				if (this.props.wrapper) {
					const badge = Object.assign({}, this.props.wrapper)
					badge.children = [badgeContent]
					const info = Object.assign({}, this.props.wrapper)
					info.children = [infoContent]
					const reboot = Object.assign({}, this.props.wrapper)
					reboot.children = [rebootContent]
					return (<div>{badge}{info}{reboot}</div>)
				} else {
					console.log(2);
					return (<div>{badgeContent}{infoContent}{rebootContent}</div>)
				}
			}
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
