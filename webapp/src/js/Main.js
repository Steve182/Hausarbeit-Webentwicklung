let request = require("request");
let google = require("google-maps");

let liste = document.getElementById("elementList");
let heightProfile = document.getElementById("heightProfile");

let map;
let route;
let bounds;

function main() {
	//Schlüssel zur Nutzung der Google API
	google.KEY = "AIzaSyDHMcOZm-IQCO9n9fExRpuOOfc8I32JvvE";

	//Map laden
	google.load(function (g) {
		//Trier als "Startpunkt" angeben
		let trier = { lat: 49.761784, lng: 6.659463 };
		let options = {
			zoom: 11,
			center: trier
		};
		//neues Map-Objekt mit Trier als Startpunkt erzeugen und in das Element mit der id "map" setzen
		map = new g.maps.Map(document.getElementById("map"), options);

		//bounds initialisieren
		bounds = new g.maps.LatLngBounds();

		//route initialisieren (path wird später bei Aufruf eines Tracks gesetzt)
		route = new g.maps.Polyline({
			path: [],
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

//globalen click-Listener an Liste anmelden
liste.onclick = function (event) {
	let id = event.target.getAttribute("id");
	request({
		//nur ausgewählten Track laden
		url: "http://localhost:8080/api/tracks:" + id,
		json: true
	}, function (error, response) {
		if (error) {
			console.log("Failed to fetch route " + id + ": " + error);
		}
		else {
			//Antwort vom Server in JSON parsen
			let data = JSON.parse(JSON.stringify(response.body));

			//aus erhaltener JSON richtige Koordinaten basteln
			let coords = parseCoords(data.features[0].geometry.coordinates);

			//Koordinaten des gewählten Tracks als Pfad der Polyline setzen
			route.setPath(coords);

			//bounds neu initialisieren, da ansonsten die Bounds der vorher ausgewählten Tracks noch mitgenommen werden
			google.load(function (g) {
				bounds = new g.maps.LatLngBounds();
			});

			//bounds setzen (für center und zoom)
			for (let i = 0; i < coords.length; ++i) {
				bounds.extend(coords[i]);
			}

			//richtig zoomen etc.
			map.fitBounds(bounds);

			//Höhenprofil erstellen
			createElevationProfile(sumupHeightValues(coords));
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
			lng: coords[i][0],
			height: coords[i][2]
		};
		parsedCoords.push(coord);
	}

	return parsedCoords;
}

//Höhenprofil erstellen
function createElevationProfile(coords) {
	let line = document.getElementById("line");
	let points = line.getAttribute("points");

	//SVG-Breite durch Anzahl Koordinaten->Kurvenbreite immer gleich
	let xFactor = 200 / coords.length;

	//erster Punkt
	points = "10, 90,";

	//alle Punkte durchlaufen
	for (let i = 0; i < coords.length; i++) {
		//y-Wert auf SVG mappen
		let value = 90 - ((coords[i] / 100) * 10);

		//immer abwechselnd x und y Koordinate eines Punktes der Linie
		points += `${Math.round(10 + (i * xFactor))}, ${Math.round(value)},`;
	}

	//letzter Punkt
	points += `${10 + ((coords.length - 1) * xFactor)},90`;

	//Punkte als Attribut setzen
	line.setAttribute("points", points);
}

/*
function getLowestPoint(coords) {
	let lowest = 9000;
	for (let i = 0; i < coords.length; ++i) {
		if (coords[i] < lowest) {
			lowest = coords[i];
		}
	}

	//wenn ein niedrigster Punkt gefunden wurde diesen zurückgeben
	if (lowest !== 9000) {
		return lowest;
	}

	return null;
}

function getHighestPoint(coords) {
	let highest = 0;
	for (let i = 0; i < coords.length; ++i) {
		if (coords[i] > highest) {
			highest = coords[i];
		}
	}

	return highest;
}
*/

//Punkte zusammenfassen
function sumupHeightValues(coords) {
	let val = coords[0].height;
	let newCoords = [];
	newCoords.push(val);

	//alle Punkte durchlaufen, wenn Differenz größer als 5 -> ins Array packen
	for (let i = 0; i < coords.length; ++i) {
		if (coords[i].height < val - 5 || coords[i].height > val + 5) {
			newCoords.push(coords[i].height);
			val = coords[i].height;
		}
	}

	return newCoords;
}

function loadTours() {
	request({
		url: "http://localhost:8080/api/tracks?short=true",
		json: true
	}, function (error, response) {
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
