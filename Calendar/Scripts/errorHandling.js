function addErrorToStorage(e) {
	if (localStorage.length == 0) {
		e += " || datestamp: " + new Date();
		localStorage.setItem('Error 1', e);
	} else {
		var key = "Error " + (localStorage.length+1);
		e += " || datestamp: " + new Date();
		localStorage.setItem(key, e);
	}
}

function logLocalStorage() {
	for (key in localStorage) {
		console.log(key + ": " + localStorage.getItem(key));
	}
}

function clearLocalStorage() {
	localStorage.clear();
}