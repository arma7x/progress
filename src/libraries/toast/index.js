export default class Toast {

	constructor(container) {
		this.container = container
	}

	show(text) {
		if (document.getElementById("snackbar") !== null) {
			document.getElementById("snackbar").remove();
		}
		const snackbarContainer = document.createElement("div");
		snackbarContainer.id = 'snackbar'
		snackbarContainer.className = "row center-xs animated faster fadeInUp";
		snackbarContainer.style.margin = '0px'
		const snackbarChild = document.createElement("div");
		snackbarChild.className = "text"
		snackbarChild.appendChild(document.createTextNode(text));
		snackbarContainer.appendChild(snackbarChild);
		document.getElementById(this.container).appendChild(snackbarContainer);
		setTimeout(() => { 
			snackbarContainer.className = "row center-xs animated faster fadeOutDown";
			setTimeout(() => {
				snackbarContainer.remove();
			}, 600);
		}, 3000);
	}
}
