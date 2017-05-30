	let trier = { lat: 49.761784, lng: 6.659463 };

	let options = {
		zoom: 11,
		center: trier
	};
	function initMap() {
		new google.maps.Map(document.getElementById("map"), options);
	}

	function loadTours() {
		console.log("");
	}

	initMap();
//Schlüssel: AIzaSyDHMcOZm-IQCO9n9fExRpuOOfc8I32JvvE
