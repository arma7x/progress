import { h } from 'preact';
import { Link } from 'preact-router';

export default function (props) {
	return (
		<Link href={ props.href } className="card" style={props.style}>{ props.children }</Link>
	)
};
