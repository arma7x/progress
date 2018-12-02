export default class Toast {

	constructor(container) {
		this.container = container
	}

	show(text) {
		if (document.getElementById("snackbar") !== null) {
			document.getElementById("snackbar").remove();
		}
		const snackbar = document.createElement("div");
		snackbar.id = 'snackbar'
		snackbar.className = "animated faster fadeInUp";
		snackbar.appendChild(document.createTextNode(text));
		document.getElementById(this.container).appendChild(snackbar);
		setTimeout(() => { 
			snackbar.className = "animated faster fadeOutDown";
			setTimeout(() => {
				snackbar.remove();
			}, 600);
		}, 3000);
	}
}
