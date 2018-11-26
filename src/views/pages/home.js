import { h, Component } from 'preact';
import { Link } from 'preact-router';
import objectHash from 'object-hash'
import Card from '../widgets/card';
import CardLink from '../widgets/card-link';
import Counter from '../widgets/counter';
import DatePicker from '../widgets/calendar';
import Modal from '../widgets/modal';
import { task_db } from '../../libraries/db';

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
		this.openDatePicker = this.openDatePicker.bind(this);
		this.closeDatePicker = this.closeDatePicker.bind(this);
		this.dateReceiver = this.dateReceiver.bind(this);
	}

	componentDidMount() {
		document.title = `${document.title} - Home`
		this.processTaskList()
		this.props.redux.subscribe(() => {
			this.processTaskList()
		})
	}

	processTaskList() {
		let task_list = []
		Object.entries(this.props.redux.getState().task_db).forEach(([key, value]) => {
			task_list.push({...value, key});
		})
		this.setState({task_list});
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

	selectIcon() {
		document.getElementById('select-icon').click();
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
				{false && <Card>
					<Counter/>
				</Card>
				}
				{
					task_list.map(i =>
						<CardLink href={ `/blog/article${i.key}` } style="padding:0px;">
							<div class="row" style="padding:0px;">
								<div class="col-xs-4">
									<img src={i.icon} style="border-top-left-radius:2px;border-bottom-left-radius:2px;margin:0px;"/>
								</div>
								<div class="col-xs-4" style="padding:0px">
									<strong>#{i.name}</strong>
								</div>
							</div>
						</CardLink>
					)
				}
				<button style="color:#ffffff;" onClick={() => {this.setState({ modalOpened: true })}}>ADD NEW TASK</button>
				<Modal visible={this.state.modalOpened} onClosed={() => this.cancelTask()} onOpened={() => this.cancelTask()}>
					<Card>
						<form onSubmit={e => { e.preventDefault(); }}>
							<div class="icon-placeholder">
								<span>
									<input id="select-icon" type="file" accept="image/*" 
										onChange={() => this.processIcon() }
									/>
									<img onClick={() => this.selectIcon()} src={task_icon} style="border-radius:50%;width:120px;height:120px"/>
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
