import { h, Component } from 'preact';
import { Link } from 'preact-router';
import objectHash from 'object-hash'
import Card from '../widgets/card';
import CardLink from '../widgets/card-link';
import DatePicker from '../widgets/calendar';
import Modal from '../widgets/modal';
import { task_db } from '../../libraries/db';
import { Line } from 'progressbar.js';

const icon = 'data:image/jpeg;base64,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'

export default class Home extends Component {

	constructor() {
		super()
		this.state = {
			task_list: [],
			datePickerOpened: false,
			modalOpened: false,
			task_icon: icon,
			task_name: '',
			task_target: 0,
			task_date: new Date().toLocaleDateString(),
		}
		this.unsubscribe = undefined
		this.openDatePicker = this.openDatePicker.bind(this);
		this.closeDatePicker = this.closeDatePicker.bind(this);
		this.dateReceiver = this.dateReceiver.bind(this);
		this.line = []
	}

	componentDidMount() {
		this.sortTaskList()
		if (this.unsubscribe === undefined) {
			this.unsubscribe = this.props.redux.subscribe(() => {
				this.sortTaskList()
			})
		}
	}

	componentWillUnmount() {
		if (this.unsubscribe !== undefined) {
			this.unsubscribe();
		}
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
			task_icon: icon,
			task_name: '',
			task_target: 0,
			task_date: new Date().toLocaleDateString(),
		});
	}

	generateBadge(task) {
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
		setTimeout(() => {
			if (this.line[task.key] !== undefined)
				this.line[task.key].destroy()
			this.line[task.key] = new Line(`#line${task.key}`, large)
			this.line[task.key].animate((task.target - remain) / task.target)
			this.line[task.key].setText(`${Math.ceil(((task.target - remain) / task.target) * 100).toFixed(0)}%`)
		},1000);
		return (
			<div class="col-xs-8" style="padding:5px;padding-right:15px">
				<div style="height:75%;display:flex;flex-direction:column;justify-content:space-between;">
				<strong>#{task.name}</strong>
				<h5 class="badge">Achievement {(task.target - remain)}/{task.target} Days</h5>
				<div id={`line${task.key}`}></div>
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
						<button class="fab" onClick={() => {this.setState({ modalOpened: true })}}>
							<i class="material-icons icon">&#xE145;</i>
						</button>
					</div>
				}
				{
					task_list.map(i =>
						<CardLink href={`/task/${i.key}`} style="padding:0px;">
							<div class="row" style="padding:0px;">
								<div class="col-xs-4">
									<img src={i.icon} style="border-top-left-radius:2px;border-bottom-left-radius:2px;margin:0px;"/>
								</div>
								{this.generateBadge(i)}
							</div>
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
