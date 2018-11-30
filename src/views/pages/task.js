import { h, Component } from 'preact';
import Card from '../widgets/card';
import Counter from '../widgets/counter';
import Report from '../widgets/report';
import Error404 from './errors/404';
import { task_db } from '../../libraries/db';
// import 'babel-polyfill';

export default class Task extends Component {

	constructor() {
		super();
		this.state = {
			id: '',
			task: {}
		}
	}

	componentDidMount() {
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

	render() {
		const { id, task } = this.state;

		return (
			<div className="page page__task">
				{
					task.name ? 
					<div>
						<button style="color:#fff;" onClick={() => {
							const newtask =  {...task, target: task.target + 20}
							this.setState({ task: newtask })
						}}>ADD +20</button>
						<Card>
							<h2><strong style="text-align:center;">{task.name !== undefined ? task.name : '#'}</strong></h2>
							<Counter task={task}/>
						</Card>
						<Report id={id} task={task} advanced={true} wrapper={<Card style="padding:0px;" />}/>
					</div> : 
					<Error404/>
				}
			</div>
		);
		
	}
}
