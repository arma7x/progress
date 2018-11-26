import { h } from 'preact';

export default function (props) {
	return <div className="card" style={props.style}>{ props.children }</div>
}
