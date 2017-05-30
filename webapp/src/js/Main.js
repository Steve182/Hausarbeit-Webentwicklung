var request = require("request");

function main() {
	initMap();
	loadTours();
}

function initMap() {
	let trier = { lat: 49.761784, lng: 6.659463 };

	let options = {
		zoom: 11,
		center: trier
	};

	new google.maps.Map(document.getElementById("map"), options);
}

function loadTours() {
	request({
		url: "http://localhost:8081/routes",
		json: true
	}, function (error, response, body) {
		if (error) {
			console.log("Failed to fetch routes: " + error);
		}
	});
}

main();
//Schlüssel: AIzaSyDHMcOZm-IQCO9n9fExRpuOOfc8I32JvvE
