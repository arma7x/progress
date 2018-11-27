import { h, Component } from 'preact';
import { Link } from 'preact-router';
import { SemiCircle, Circle } from 'progressbar.js';

export default class Counter extends Component {

	counterDay = null;
	counterMin = null;
	counterSec = null;
	counterHour = null;

	constructor() {
		super()
		this.timer = undefined
	}

	componentDidMount() {
		const large = {
			easing: 'easeInOut',
			color: '#ED6A5A',
			trailColor: '#bbb',
			strokeWidth: 15,
			text: {
				style: {
					fontFamily: '"Roboto", "Helvetica Neue", Helvetica, Arial, sans-serif',
					fontSize: '1.2rem',
					fontWeight: 'bold',
					position: 'absolute',
					left: '50%',
					top: '50%',
					padding: 0,
					margin: 0,
					transform: {
						prefix: true,
						value: 'translate(-50%, -50%)'
					}
				}
			},
		}
		const small = JSON.parse(JSON.stringify(large));
		small.text.style.fontSize = '0.8rem'
		small.text.style.fontWeight = 'normal'
		small.text.style.position = 'relative'
		this.counterDay = new Circle('#counterDay', {...large, color: '#4885ed'});
		this.counterHour = new SemiCircle('#counterHour', {...small, color: ' #db3236'});
		this.counterMin = new SemiCircle('#counterMin', {...small, color: '#f4c20d'});
		this.counterSec = new SemiCircle('#counterSec', {...small, color: '#3cba54'});
		const { task } = this.props;
		this.timer = setInterval(() => {
			const now = new Date()
			const start_date = new Date(task.reboot_history[0])
			const end_date = new Date(task.reboot_history[0])
			end_date.setDate(start_date.getDate() + task.target)
			const remain = Math.ceil((end_date.getTime() - now.getTime()) / (1000*60*60*24))
			const day = now.getDate()
			const hour = now.getHours()
			const minute = now.getMinutes()
			const second = now.getSeconds()
			this.counterDay.animate((task.target - remain) / task.target);
			this.counterDay.setText(`${(task.target - remain)}/${task.target}<br>Days`);
			this.counterHour.animate(hour/24);
			this.counterHour.setText(`${hour} <br>${now.toLocaleString().split(' ')[2]}`);
			this.counterMin.animate(minute/60);
			this.counterMin.setText(`${minute} <br>Minutes`);
			this.counterSec.animate(second/60);
			this.counterSec.setText(`${second} <br>Seconds`);
		},1000);
	}

	componentWillUnmount() {
		if (this.timer !== undefined) {
			clearInterval(this.timer);
		}
	}

	render () {
		return (
			<div>
				<div class="row">
					<div class="col-xs-12">
						<div class="row center-xs">
							<div id="counterDay" style="width:150px;height:150px;"></div>
						</div>
					</div>
				</div>
				<div class="row">
					<div class="col-xs-4">
						<div class="row center-xs">
							<div id="counterHour" style="margin:15px 15px 0px 15px;width:80px;height:80px;"></div>
						</div>
					</div>
					<div class="col-xs-4">
						<div class="row center-xs">
							<div id="counterMin" style="margin:15px 15px 0px 15px;width:80px;height:80px;"></div>
						</div>
					</div>
					<div class="col-xs-4">
						<div class="row center-xs">
							<div id="counterSec" style="margin:15px 15px 0px 15px;width:80px;height:80px;"></div>
						</div>
					</div>
				</div>
			</div>
		)
	};
}
