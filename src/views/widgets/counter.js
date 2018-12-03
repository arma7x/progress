import { h, Component } from 'preact';
import { Link } from 'preact-router';
import { SemiCircle, Circle } from 'progressbar.js';

export default class Counter extends Component {

	constructor() {
		super()
		this.state = {
			task: {},
		}
		this.timer = undefined
		this.counterDay = undefined
		this.counterMin = undefined
		this.counterSec = undefined
		this.counterHour = undefined
	}

	componentDidMount() {
		const { task } = this.props
		this.setState({ task })
		this.calculateCounter()
	}

	componentDidUpdate(prevProps, prevState) {
		if ((prevProps.task.target !== this.props.task.target) || (prevProps.task.reboot_history[0][0] !== this.props.task.reboot_history[0][0])) {
			this.setState({ task: this.props.task })
			this.calculateCounter()
		}
	}

	componentWillUnmount() {
		this.clear()
	}

	clear() {
		if (this.counterDay !== undefined)
			this.counterDay.destroy()
		if (this.counterMin !== undefined)
			this.counterMin.destroy()
		if (this.counterSec !== undefined)
			this.counterSec.destroy()
		if (this.counterHour !== undefined)
			this.counterHour.destroy()
		if (this.timer !== undefined)
			clearInterval(this.timer)
	}

	calculateCounter() {
		this.clear()
		const { task } = this.state
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
		small.text.style.fontWeight = 'bold'
		small.text.style.position = 'relative'
		this.counterDay = new Circle('#counterDay', {...large, color: '#4885ed'});
		this.counterHour = new SemiCircle('#counterHour', {...small, color: ' #db3236'});
		this.counterMin = new SemiCircle('#counterMin', {...small, color: '#f4c20d'});
		this.counterSec = new SemiCircle('#counterSec', {...small, color: '#3cba54'});
		this.timer = setInterval(() => {
			const now = new Date()
			const start_date = new Date(task.reboot_history[0][0])
			const end_date = new Date(task.reboot_history[0][0])
			end_date.setDate(start_date.getDate() + task.target)
			const remain = Math.ceil((end_date.getTime() - now.getTime()) / (1000*60*60*24))
			const day = now.getDate()
			const hour = now.getHours()
			const minute = now.getMinutes()
			const second = now.getSeconds()
			this.counterDay.animate((task.target - remain) / task.target);
			this.counterDay.setText(`${(task.target - remain)}/${task.target}<br>Days`);
			this.counterHour.animate(hour/24);
			this.counterHour.setText(`${hour}<br>HOURS`);
			this.counterMin.animate(minute/60);
			this.counterMin.setText(`${minute}<br>MINUTESs`);
			this.counterSec.animate(second/60);
			this.counterSec.setText(`${second}<br>SECONDs`);
		},1000);
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
