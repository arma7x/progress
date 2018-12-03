import { h } from 'preact';
import Card from '../../widgets/card';

export default function (props) {
	return (
		<div className="page page__404">
			<Card>
				<div class="animated heartBeat">
					<h1>404 Page</h1>
					<p>Looks like you were given a bad link ;-)</p>
				</div>
			</Card>
		</div>
	);
}
