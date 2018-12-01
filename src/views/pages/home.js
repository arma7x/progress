import { h, Component } from 'preact';
import { Link } from 'preact-router';
import objectHash from 'object-hash';
import Card from '../widgets/card';
import CardLink from '../widgets/card-link';
import DatePicker from '../widgets/calendar';
import Modal from '../widgets/modal';
import { task_db } from '../../libraries/db';
import Report from '../widgets/report';

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
	}

	componentDidMount() {
		if (document.getElementById('fallback') !== null)
			document.getElementById('fallback').remove()
		this.props.redux.dispatch({ type: 'SET_ROUTE_TITLE', value: 'Spree' })
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
			alert('Please give a simple name ?');
			return
		}
		if (this.state.task_target < 1) {
			alert('Number of days to achieve ?');
			return
		}
		if ((/^((0?[1-9]|1[012])[- /.](0?[1-9]|[12][0-9]|3[01])[- /.](19|20)?[0-9]{2})*$/.test(this.state.task_date)) === false) {
			alert('When will you start ?');
			return
		}
		const value = {
			icon: this.state.task_icon,
			name: this.state.task_name.trim(),
			target: this.state.task_target,
			reboot_history: [[this.state.task_date,this.state.task_target]],
			insert_at: new Date().getTime(),
			updated_at: new Date().getTime(),
			note: '',
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
		const { datePickerOpened, modalOpened, task_icon, task_name, task_target, task_date, task_list, } = this.state;

		return (
			<div className="page page__home">
				{ 
					modalOpened === false &&
					<div style="display: flex;flex-direction:row-reverse;">
						<button class="fab animated slow fadeIn" onClick={() => {this.setState({ modalOpened: true })}}>
							<i class="material-icons">&#xE145;</i>
						</button>
					</div>
				}
				{
					task_list.map(i => 
						<Report id={i.key} task={i} advanced={false} wrapper={<CardLink href={`/task/${i.key}`} style="padding:0px;" />} />
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
								<input type="text" value={task_name} onInput={(e) => this.setState({task_name: e.target.value})} required="required"/>
								<span class="highlight"></span>
								<span class="bar"></span>
								<label>Please give a simple name ?</label>
							</div>
							<div class="group">
								<input type="number" value={task_target}onInput={(e) => this.setState({task_target: parseInt(e.target.value)})} required="required"/>
								<span class="highlight"></span>
								<span class="bar"></span>
								<label>Number of days to achieve ?</label>
							</div>
							<div class="group">
								<input type="text" value={task_date} onClick={this.openDatePicker} onInput={(e) => this.setState({task_date: e.target.value})} required="required"/>
								<span class="highlight"></span>
								<span class="bar"></span>
								<label>When will you start ?</label>
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
