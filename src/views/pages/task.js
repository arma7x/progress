import { h, Component } from 'preact';
import Card from '../widgets/card';
import Counter from '../widgets/counter';
import Error404 from './errors/404';
import { task_db } from '../../libraries/db';
// import 'babel-polyfill';

export default class Task extends Component {

	constructor() {
		super();
		this.state = {
			task: {}
		}
	}

	componentDidMount() {
		document.title = `Task`
		const { id } = this.props;
		task_db.get(id)
		.then((task) => {
			if (task !== undefined) {
				this.setState({task})
				document.title = `Task - ${task.name}`
			}
		})
		.catch((e) => {
			console.trace(e);
		})
	}

	render() {
		const { id } = this.props;
		const { task } = this.state;

		return (
			<div className="page page__task">
				{
					task.name ? 
					<div>
						<Card>
							<h2><strong style="text-align:center;">{task.name !== undefined ? task.name : '#'}</strong></h2>
							<Counter task={task}/>
						</Card>
						<Card>
							{JSON.stringify(task, null, 2)}
						</Card>
					</div> : 
					<Error404/>
				}
			</div>
		);
		
	}
}
