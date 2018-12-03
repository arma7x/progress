import { h, Component } from 'preact';
import Card from '../widgets/card';
import Counter from '../widgets/counter';
import Report from '../widgets/report';
import Error404 from './errors/404';
import { task_db } from '../../libraries/db';
import Toast from '../../libraries/toast';

const Toaster = new Toast('app')
const now = new Date()

export default class Task extends Component {

	constructor() {
		super();
		this.state = {
			id: '',
			task: {},
			busy: true,
		}
	}

	componentDidMount() {
		setTimeout(() => {
			this.setState({ busy: false })
		}, 600);
		this.props.redux.dispatch({ type: 'SET_ROUTE_TITLE', value: 'Task' })
		task_db.get(this.props.id)
		.then((task) => {
			if (task !== undefined) {
				this.setState({task, id: this.props.id})
				document.title = task.name
				this.props.redux.dispatch({ type: 'SET_ROUTE_TITLE', value: task.name })
			}
		})
		.catch((e) => {
			console.trace(e);
		})
	}

	delTask() {
		if (prompt(`Confirm by enter '${this.state.task.name}'`) === this.state.task.name) {
			task_db.delete(this.state.id)
			.then(() => {
				Toaster.show(`Successfully remove task ${this.state.task.name}`)
				this.props.redux.dispatch({ type: 'DELETE_TASK_DB', key: this.state.id })
				window.history.back()
			})
			.catch((e) => {
				Toaster.show('Operation fail')
				console.trace(e);
			})
		} else {
			Toaster.show('Operation fail')
		}
	}

	rebootTask() {
		const { id, task } = this.state;
		const reason = prompt('Maybe a note to your future self ?');
		if (confirm('Are you sure to reboot ?')) {
			if (task.reboot_history[0][0] < now.toLocaleDateString()) {
				const updated_task =  {...task, reboot_history: [[now.toLocaleDateString(), task.target, (reason ? reason : '')], ...task.reboot_history], updated_at: now.getTime() }
				task_db.set(this.state.id, updated_task)
				.then(() => {
					Toaster.show(`Successfully reboot task ${task.name}`)
					this.setState({ task: updated_task })
					this.props.redux.dispatch({ type: 'PUT_TASK_DB', key: this.state.id, value: updated_task })
				})
				.catch((e) => {
					Toaster.show('Operation fail')
					console.trace(e);
				})
			}
		}
	}

	extendTask() {
		const { id, task } = this.state;
		const days = parseInt(prompt('Please enter number of days to extend ?'))
		if (isNaN(days)) {
			Toaster.show('Invalid input data')
			return
		}
		const remain = -(Math.ceil((new Date(new Date(task.reboot_history[0][0]).setDate((new Date(task.reboot_history[0][0])).getDate() + task.target)).getTime() - now.getTime()) / (1000*60*60*24)))
		if (days <= remain) {
			Toaster.show(`Day must greater than ${remain}`)
			return
		}
		const updated_task =  {...task, target: task.target + days, updated_at: now.getTime() }
		task_db.set(this.state.id, updated_task)
		.then(() => {
			Toaster.show(`Successfully extend ${task.name} to ${updated_task.target} days`)
			this.setState({ task: updated_task })
			this.props.redux.dispatch({ type: 'PUT_TASK_DB', key: this.state.id, value: updated_task })
		})
		.catch((e) => {
			Toaster.show('Operation fail')
			console.trace(e);
		})
	}

	render() {
		const { id, task } = this.state;

		return (
			<div className="page page__task">
				{
					task.name ? 
					<div>
						<Card style={`background:url(${task.icon});background-size:cover;background-repeat:no-repeat;background-position: center center;`}>
							<Counter task={task}/>
						</Card>
						<Report id={id} task={task} advanced={true} wrapper={<Card style="padding:0px;" />}/>
							{
								this.state.busy === false &&
							<div style="display:flex;flex-direction:row-reverse;">
								<div class="fab-cascade">
									<span class="fab-action-button animated slow fadeIn">
										<i class="fab-action-button__icon material-icons">&#xe8b8;</i>
									</span>
									<ul class="fab-menu-buttons">
										<li class="fab-menu-buttons__item">
											<a onClick={() => this.delTask()} class="fab-menu-buttons__link" style="background-color:#db3236;color:#fff;" data-tooltip="Delete">
												<i class="material-icons">&#xE872;</i>
											</a>
										</li>
										{
											task.reboot_history[0][0] < now.toLocaleDateString() &&
											<li class="fab-menu-buttons__item">
												<a onClick={() => this.rebootTask()} class="fab-menu-buttons__link" style="background-color:#f4c20d;color:#fff;" data-tooltip="Reboot">
													<i class="material-icons">&#xe5d5;</i>
												</a>
											</li>
										}
										{
											((Math.ceil((new Date(new Date(task.reboot_history[0][0]).setDate((new Date(task.reboot_history[0][0])).getDate() + task.target)).getTime() - now.getTime()) / (1000*60*60*24))) <= 0) &&
											<li class="fab-menu-buttons__item">
												<a onClick={() => this.extendTask()} class="fab-menu-buttons__link" style="background-color:#3cba54;color:#fff;" data-tooltip="Extend">
													<i class="material-icons">&#xe145;</i>
												</a>
											</li>
										}
									</ul>
								</div>
							</div>
							}
					</div> : 
					<Error404/>
				}
			</div>
		);
		
	}
}
