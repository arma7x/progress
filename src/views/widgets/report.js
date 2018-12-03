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
		if (logs.length === 1) {
			null
		} else {
			return (
				<div class="row center-xs">
					<strong style="margin:5px 0 -5px 0">REBOOT LOGS</strong>
					<div class="col-xs-12" style="padding:20px;">
					{
						logs.map((value, index) => {
							if (index !== (logs.length - 1)) {
								const start_date = new Date(value[0])
								const end_date = new Date(logs[index+1][0])
								const remain = Math.ceil((start_date.getTime() - end_date.getTime()) / (1000*60*60*24))
								return (<div class="center-xs">
									<small class="badge badge__primary">
										<b>{start_date.toDateString()}</b>
									</small>
									<div style="margin-top:6px"><i class="material-icons">&#xe5db;</i></div>
									<div class="badge" style="text-align:left;border-radius:2px;width:95%;margin:auto;padding:5px">
										<div class="row">
											<div class="col-xs-4">
												<h5>TARGET</h5>
												<small>{logs[index+1][1]} Days</small>
											</div>
											<div class="col-xs-4">
												<h5>RESULT</h5>
												<small>{remain} Days</small>
											</div>
											<div class="col-xs-4">
												<h5>PROGRESS</h5>
												<small>{Math.ceil((remain/logs[index+1][1]) * 100).toFixed(0)}%</small>
											</div>
										</div>
										<div>
											<h5>NOTE</h5>
											<small>{logs[index][2]}</small>
										</div>
									</div>
									<div><i class="material-icons">&#xe5db;</i></div>
									{
										index === (logs.length - 2) &&
										<small class="badge badge__primary"><b>{end_date.toDateString()}</b></small>
									}
								</div>)
							}
						})
					}
					</div>
				</div>
			)
		}
	}

	renderBadgeContent() {
		return <div class="row">
			<div class="col-xs-4">
				<img id={`icon${this.state.id}`} src={this.state.task.icon} style="border-top-left-radius:2px;border-bottom-left-radius:2px;margin:0px;"/>
			</div>
			<div class="col-xs-8" style="padding: 5px 15px 5px 0px">
				<div style="height:75%;display:flex;flex-direction:column;justify-content:space-between;">
					<h5>#{this.state.task.name.toUpperCase()}</h5>
					<strong class="badge">PROGRESS {(this.state.task.target - this.state.remain)}/{this.state.task.target} Days</strong>
					<div id={`line${this.state.id}`}></div>
				</div>
			</div>
		</div>
	}

	renderInfoContent() {
		return <div class="row">
			<div class="col-xs-12" style="padding: 7px 14px">
				<div class="row">
					<div class="col-xs-5">
						<div>
							<h5>START</h5>
							<strong class="badge">{this.state.start_date.toLocaleDateString()}</strong>
						</div>
						<div>
							<h5>END</h5>
							<strong class="badge">{this.state.end_date.toLocaleDateString()}</strong>
						</div>
					</div>
					<div class="col-xs-7">
						<div style="display:flex;flex-direction:row-reverse;justify-content:space-between;">
							<div>
								<h5>PENDING</h5>
								<strong class="badge">{this.state.remain < 0 ? 0 : this.state.remain} Days</strong>
							</div>
							<div>
								<h5>TARGET</h5>
								<strong class="badge">{this.state.task.target} Days</strong>
							</div>
						</div>
						<div>
							<h5>SUCCEED</h5>
							<strong class="badge">{
								(this.state.task.target - this.state.remain) > this.state.task.target
								? `${this.state.task.target} + ${-(this.state.remain)}`
								: (this.state.task.target - this.state.remain)
							} Days</strong>
						</div>
					</div>
				</div>
				<div>
				</div>
			</div>
		</div>
	}

	renderReport() {
		const { id, task } = this.state
		setTimeout(() => {
			const icon = document.getElementById(`icon${this.state.id}`)
			icon.height = icon.width
		}, 100);
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
				this.line.setText(`<div>REBOOT: ${task.reboot_history.length > 1 ? (task.reboot_history.length -1) : 0}</div><div>${Math.ceil(((task.target - remain) / task.target) * 100).toFixed(0)}%</div>`)
			}
		}, 100);
		this.setState({ start_date, end_date, remain});
	}

	render() {
		if (this.state.task.name !== undefined) {
			if (this.state.advanced) {
				const rebootContent = this.renderRebootLog(this.state.task.reboot_history)
				if (this.props.wrapper) {
					const badge = Object.assign({}, this.props.wrapper)
					badge.children = [this.renderBadgeContent()]
					const info = Object.assign({}, this.props.wrapper)
					info.children = [this.renderInfoContent()]
					const reboot = Object.assign({}, this.props.wrapper)
					reboot.children = [rebootContent]
					return (<div>{badge}{info}{rebootContent === null ? null : reboot}</div>)
				} else {
					return (<div>{this.renderBadgeContent()}{this.renderInfoContent()}{rebootContent === null ? null : rebootContent}</div>)
				}
			}
			if (this.props.wrapper) {
				const badge = Object.assign({}, this.props.wrapper)
				badge.children = [this.renderBadgeContent()]
				return badge
			} else {
				return this.renderBadgeContent()
			}
		} else {
			return <div>Loading</div>
		}
	}
}
