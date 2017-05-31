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
	console.log("Map initialized!");
}

function loadTours() {
	request({
		url: "http://localhost:8080/tracks",
		json: true
	}, function (error, response, body) {
		if (error) {
			console.log("Failed to fetch routes: " + error);
		}
		else {
			console.log(response);
			let data = JSON.parse(response.body);
			/*for (let item in data) {
				console.log(item + ": " + data[item]);
			}*/
		}
	});
}

main();
//Schlüssel: AIzaSyDHMcOZm-IQCO9n9fExRpuOOfc8I32JvvE
