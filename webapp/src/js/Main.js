let request = require("request");
let google = require("google-maps");

let map;
let route;

function main() {
	//Schlüssel zur Nutzung der Google API
	google.KEY = "AIzaSyDHMcOZm-IQCO9n9fExRpuOOfc8I32JvvE";
	google.load(function (g) {
		//Trier als "Startpunkt" angeben
		let trier = { lat: 49.761784, lng: 6.659463 };
		let options = {
			zoom: 11,
			center: trier
		};
		//neues Map-Objekt mit Trier als Startpunkt erzeugen und in das Element mit der di "map" setzen
		map = new g.maps.Map(document.getElementById("map"), options);

		route = new g.maps.Polyline({
			path: null,
			geodesic: true,
			strokeColor: "#FF0000",
			strokeOpacity: 1.0,
			strokeWeight: 2
		});

		route.setMap(map);

		console.log("Map initialized!");
	});
	loadTours();
}

let liste = document.getElementById("elementList");

liste.onclick = function (event) {
	let id = event.target.getAttribute("id");
	request({
		url: "http://localhost:8080/api/tracks:" + id,
		json: true
	}, function (error, response, body) {
		if (error) {
			console.log("Failed to fetch route " + id + ": " + error);
		}
		else {
			//Antwort vom Server in JSON parsen
			let data = JSON.parse(JSON.stringify(response.body));
			route.setPath(parseCoords(data.features[0].geometry.coordinates));
		}
	});
};

//aus JSON-Datei Koordinaten bauen, die Google akzeptiert
function parseCoords(coords) {
	let parsedCoords = [];
	for (let i = 0; i < coords.length; i++) {
		let coord = {
			//Koordinaten umdrehen
			lat: coords[i][1],
			lng: coords[i][0]
		};
		parsedCoords.push(coord);
	}

	return parsedCoords;
}

function loadTours() {
	request({
		url: "http://localhost:8080/api/tracks?short=true",
		json: true
	}, function (error, response, body) {
		if (error) {
			console.log("Failed to fetch routes: " + error);
		}
		else {
			//Antwort vom Server in JSON parsen
			let data = JSON.parse(response.body);
			//Über jeden Track interieren
			for (let item in data) {
				let listItem = document.createElement("LI");
				listItem.appendChild(document.createTextNode(data[item].name));
				listItem.setAttribute("id", data[item].id);
				listItem.setAttribute("class", "tourItem");
				liste.appendChild(listItem);
			}
		}
	});
}

main();
//Schlüssel: AIzaSyDHMcOZm-IQCO9n9fExRpuOOfc8I32JvvE
