import { h, Component } from 'preact';
import { Link } from 'preact-router';
import objectHash from 'object-hash'
import Card from '../widgets/card';
import CardLink from '../widgets/card-link';
import DatePicker from '../widgets/calendar';
import Modal from '../widgets/modal';
import { task_db } from '../../libraries/db';
import { Line } from 'progressbar.js';

export default class Home extends Component {

	constructor() {
		super()
		this.state = {
			task_list: [],
			datePickerOpened: false,
			modalOpened: false,
			task_icon: '',
			task_name: '',
			task_target: 0,
			task_date: new Date().toLocaleDateString(),
		}
		this.timeout = undefined
		this.unsubscribe = undefined
		this.openDatePicker = this.openDatePicker.bind(this);
		this.closeDatePicker = this.closeDatePicker.bind(this);
		this.dateReceiver = this.dateReceiver.bind(this);
		this.line = []
	}

	componentDidMount() {
		this.props.redux.dispatch({ type: 'SET_UI_TITLE', value: 'Insanity' })
		this.setState({ task_icon: this.props.redux.getState().ui.icon });
		this.sortTaskList()
		if (this.unsubscribe === undefined) {
			this.unsubscribe = this.props.redux.subscribe(() => {
				this.sortTaskList()
			})
		}
	}

	componentWillUnmount() {
		if (this.timeout !== undefined) {
			clearTimeout(this.timeout)
		}
		if (this.unsubscribe !== undefined)
			this.unsubscribe()
		this.line.forEach((line, key) => {
			if (line !== undefined)
				line.destroy()
		})
	}

	sortTaskList() {
		let task_list = []
		Object.entries(this.props.redux.getState().task_db).forEach(([key, value]) => {
			task_list.push({...value, key});
		})
		if (task_list.length > 0) {
			task_list.sort((a, b) => {return a.insert_at - b.insert_at});
			this.setState({task_list});
		}
	}

	processIcon() {
		const icon = document.getElementById('select-icon');
		if (icon.files.length > 0) {
			const freader = new FileReader();
			freader.onload = (e) => {
				this.setState({ task_icon: e.target.result });
			};
			freader.readAsDataURL(icon.files[0]);
		}
	}

	addTask() {
		if (this.state.task_name.trim().length === 0) {
			alert('Please give this task a simple name ?');
			return
		}
		if (this.state.task_target < 1) {
			alert('Number of days to achieve ?');
			return
		}
		if ((/^((0?[1-9]|1[012])[- /.](0?[1-9]|[12][0-9]|3[01])[- /.](19|20)?[0-9]{2})*$/.test(this.state.task_date)) === false) {
			alert('When will you start this task ?');
			return
		}
		const value = {
			icon: this.state.task_icon,
			name: this.state.task_name.trim(),
			target: this.state.task_target,
			reboot_history: [this.state.task_date],
			insert_at: new Date().getTime(),
		}
		task_db.set(objectHash(value), value)
		.then(() => {
			this.props.redux.dispatch({ type: 'PUT_TASK_DB', key: objectHash(value), value })
			this.setState({ modalOpened: false })
		})
		.catch((e) => {
			console.trace(e);
		})
	}

	cancelTask() {
		this.setState({ 
			task_icon: this.props.redux.getState().ui.icon,
			task_name: '',
			task_target: 0,
			task_date: new Date().toLocaleDateString(),
		});
	}

	renderBadge(task) {
		const large = {
			easing: 'easeInOut',
			color: '#663AB6',
			trailColor: '#bbb',
			strokeWidth: 3,
			text: {
				style: {
					fontFamily: '"Roboto", "Helvetica Neue", Helvetica, Arial, sans-serif',
					fontSize: '0.8rem',
					fontWeight: 'bold',
					position: 'absolute',
					right: '0',
					top: '0',
					padding: 0,
					margin: '13px -10px 0px 0px',
					transform: {
						prefix: true,
						value: 'translate(-50%, -50%)'
					}
				}
			},
		}
		const now = new Date()
		const start_date = new Date(task.reboot_history[0])
		const end_date = new Date(task.reboot_history[0])
		end_date.setDate(start_date.getDate() + task.target)
		const remain = Math.ceil((end_date.getTime() - now.getTime()) / (1000*60*60*24))
		this.timeout = setTimeout(() => {
			if (this.line[task.key] !== undefined)
				this.line[task.key].destroy()
			if (document.getElementById(`line${task.key}`) !== null) {
				this.line[task.key] = new Line(`#line${task.key}`, large)
				this.line[task.key].animate((task.target - remain) / task.target)
				this.line[task.key].setText(`${Math.ceil(((task.target - remain) / task.target) * 100).toFixed(0)}%(${task.reboot_history.length})`)
			}
		}, 100);
		return (
			<div class="row" style="padding:0px;">
				<div class="col-xs-4">
					<img src={task.icon} style="border-top-left-radius:2px;border-bottom-left-radius:2px;margin:0px;"/>
				</div>
				<div class="col-xs-8" style="padding:5px;padding-right:15px">
					<div style="height:75%;display:flex;flex-direction:column;justify-content:space-between;">
						<strong>#{task.name}</strong>
						<h5 class="badge">Achievement {(task.target - remain)}/{task.target} Days</h5>
						<div id={`line${task.key}`}></div>
					</div>
				</div>
			</div>
		)
	}

	openDatePicker() {
		this.setState({ datePickerOpened: true });
	}

	closeDatePicker() {
		this.setState({ datePickerOpened: false });
	}

	dateReceiver(date) {
		this.setState({ task_date: date.toLocaleDateString() });
	}

	render () {
		const { 
			datePickerOpened,
			modalOpened,
			task_icon,
			task_name,
			task_target,
			task_date,
			task_list,
		} = this.state;

		return (
			<div className="page page__home">
				{ 
					modalOpened === false &&
					<div style="display: flex;flex-direction:row-reverse;">
						<button class="fab animated slow fadeIn" onClick={() => {this.setState({ modalOpened: true })}}>
							<i class="material-icons icon">&#xE145;</i>
						</button>
					</div>
				}
				{
					task_list.map(i => 
						<CardLink href={`/task/${i.key}`} style="padding:0px;">
							{this.renderBadge(i)}
						</CardLink>
					)
				}
				<Modal visible={modalOpened} onClosed={() => this.cancelTask()} onOpened={() => this.cancelTask()}>
					<Card>
						<form onSubmit={e => { e.preventDefault(); }}>
							<div class="icon-placeholder">
								<span>
									<input id="select-icon" type="file" accept="image/*" 
										onChange={() => this.processIcon() }
									/>
									<img onClick={() => 
										document.getElementById('select-icon').click()
									} src={task_icon} style="border-radius:50%;width:120px;height:120px"/>
								</span>
							</div>
							<div class="group">
								<input type="text" value={task_name} onInput={(e) => this.setState({task_name: e.target.value})}/>
								<span class="highlight"></span>
								<span class="bar"></span>
								<label>Please give this task a simple name ?</label>
							</div>
							<div class="group">
								<input type="number" value={task_target}onInput={(e) => this.setState({task_target: parseInt(e.target.value)})}/>
								<span class="highlight"></span>
								<span class="bar"></span>
								<label>Number of days to achieve ?</label>
							</div>
							<div class="group">
								<input type="text" value={task_date} onClick={this.openDatePicker} onInput={(e) => this.setState({task_date: e.target.value})}/>
								<span class="highlight"></span>
								<span class="bar"></span>
								<label>When will you start this task ?</label>
							</div>
							<button style="color:#ffffff;" onClick={() => this.addTask()}>
								LET'S START
							</button>
							<button style="color:#ffffff;" onClick={() => this.setState({ modalOpened: false })}>
								CANCEL
							</button>
							<DatePicker closeFunction={this.closeDatePicker} opened={datePickerOpened} dateReceiver={this.dateReceiver} />
						</form>
					</Card>
				</Modal>
			</div>
		)
	};
}
