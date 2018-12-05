import { h } from 'preact';
//import { Link } from 'preact-router';
import { Link } from '../../libraries/animatedRouter';

export default function (props) {
	return (
		<Link href={ props.href } className="card" style={props.style}>{ props.children }</Link>
	)
};
