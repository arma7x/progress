import { h, Component } from 'preact';
import { Link } from 'preact-router';
import Card from '../widgets/card';
import Counter from '../widgets/counter';
import DatePicker from '../widgets/calendar';

export default class Home extends Component {

	constructor() {
		super()
		this.state = {
			datePickerOpened: false
		}
		this.openDatePicker = this.openDatePicker.bind(this);
		this.closeDatePicker = this.closeDatePicker.bind(this);
		this.dateReceiver = this.dateReceiver.bind(this);
	}

	componentDidMount() {
		document.title = `${document.title} - Home`
	}

	addEvent() {
		this.props.redux.dispatch({ type: 'INCREMENT' })
	}

	openDatePicker() {
		this.setState({ datePickerOpened: true });
	}

	closeDatePicker() {
		this.setState({ datePickerOpened: false });
	}

	toggleDarkTheme() {
		document.body.classList.toggle('darkTheme');
	}

	dateReceiver(date) {
		this.setState({ pickedDate: date });
	}

	render () {
		const { datePickerOpened } = this.state;

		return (
			<div className="page page__home">
				<Card>
					<Counter/>
				</Card>
				<Card>
					<form>
						<h1>Task</h1>
						<div class="group">
							<input type="text" required="required"/>
							<span class="highlight"></span>
							<span class="bar"></span>
							<label>Please give this task a name ?</label>
						</div>
						<div class="group">
							<input type="text" value={this.state.pickedDate ? this.state.pickedDate.toLocaleDateString() : ''} onClick={this.openDatePicker} required="required"/>
							<span class="highlight"></span>
							<span class="bar"></span>
							<label>When will you start this task ?</label>
						</div>
						<div class="group">
							<input type="number" required="required"/>
							<span class="highlight"></span>
							<span class="bar"></span>
							<label>Number of days to achieve ?</label>
						</div>
						<button type="submit"style="color:#ffffff;" onClick={() => this.addEvent()}>
							LET'S START
						</button>
						<DatePicker closeFunction={this.closeDatePicker} opened={datePickerOpened} dateReceiver={this.dateReceiver} />
					</form>
				</Card>
			</div>
		)
	};
}
