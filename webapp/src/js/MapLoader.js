let google = require("google-maps");

var MapLoader = MapLoader || (function () {
	let map;
	let route;
	let coords;
	let bounds;
	let trackSet;

	function initMap() {
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
	}

	function showTour(data) {
		//aus erhaltener JSON richtige Koordinaten basteln
		coords = parseCoords(data.features[0].geometry.coordinates);
		module.exports.coords = coords;

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
		trackSet = true;

		//richtig zoomen
		updateZoom();
	}

	function updateZoom() {
		//Prüfen, ob Track gesetzt, da sonst in den Ozean gezoomt wird
		if (trackSet) {
			map.fitBounds(bounds);
		}
	}

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

	module.exports.coords = coords;
	module.exports.initMap = initMap;
	module.exports.showTour = showTour;
	module.exports.updateZoom = updateZoom;
})();
