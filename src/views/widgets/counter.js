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
	}

	componentDidMount() {
		const large = {
			easing: 'easeInOut',
			color: '#ED6A5A',
			trailColor: '#bbb',
			strokeWidth: 10,
			text: {
				style: {
					fontFamily: '"Raleway", Helvetica, sans-serif',
					fontSize: '1.2rem',
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
		const small = Object.assign({}, large);
		small.text.style.fontSize = '0.8rem'
		small.text.style.position = 'relative'
		this.counterDay = new Circle('#counterDay', {...large, color: '#4885ed'});
		this.counterHour = new SemiCircle('#counterHour', {...small, color: ' #db3236'});
		this.counterMin = new SemiCircle('#counterMin', {...small, color: '#f4c20d'});
		this.counterSec = new SemiCircle('#counterSec', {...small, color: '#3cba54'});
		setInterval(() => {
			const now = new Date()
			const day = now.getDate()
			//var month = (now.getMonth() + 1)
			//var year = now.getFullYear()
			const hour = now.getHours()
			const minute = now.getMinutes()
			const second = now.getSeconds()
			this.counterDay.animate(day/60);
			this.counterDay.setText(`${day}/60 <br>Days`);
			this.counterHour.animate(hour/24);
			this.counterHour.setText(`${hour} <br>${now.toLocaleString().split(' ')[2]}`);
			this.counterMin.animate(minute/60);
			this.counterMin.setText(`${minute} <br>Minutes`);
			this.counterSec.animate(second/60);
			this.counterSec.setText(`${second} <br>Seconds`);
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
