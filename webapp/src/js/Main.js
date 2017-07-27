let request = require("request");
let google = require("google-maps");

//Tracks
let data;

let liste = document.getElementById("elementList");
let buttonDiv = document.getElementById("buttons");

let nameDiv = document.getElementById("nameDiv");

let map;
let route;
let coords;
let bounds;

let sideCount = 0;
let numOfSides = 0;

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

	//Tracks für Liste laden
	loadTours();
}

//globalen click-Listener an Liste anmelden
liste.onclick = function (event) {
	let id = event.target.getAttribute("id");
	request({
		//nur ausgewählten Track laden
		url: `http://${window.location.host}/api/tracks:${id}`,
		json: true
	}, function (error, response) {
		if (error) {
			console.log(`Failed to fetch route ${id}:${error}`);
		}
		else if (!isNaN(parseInt(id))) {
			//Antwort vom Server in JSON parsen
			let data = JSON.parse(JSON.stringify(response.body));

			//aus erhaltener JSON richtige Koordinaten basteln
			coords = parseCoords(data.features[0].geometry.coordinates);

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

			//richtig zoomen
			map.fitBounds(bounds);

			//Höhenprofil erstellen
			createElevationProfile(coords);

			//Namen komplett anzeigen
			nameDiv.innerHTML = event.target.innerHTML;
			nameDiv.style.display = "inline-block";
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

function createElevationProfile(coords) {
	let line = document.getElementById("line");
	let svg = document.getElementById("heightProfile");

	//Höhe und Breite des SVG-Elements
	//notwendig, da clientHeight, clientWidth für Firefox nicht funktioniert
	let height = svg.clientHeight || svg.parentNode.clientHeight;
	let width = svg.clientWidth || svg.parentNode.clientWidth;

	let highest = getHighestPoint(coords);

	//x-Koordinaten mappen
	let xScale = width / coords.length;

	//erster Punkt (bei maximaler Höhe, damit Kurve richtig ausgefüllt ist)
	let points = `0,${height},`;

	//alle Punkte durchlaufen
	for (let i = 0; i < coords.length; ++i) {
		//y-Koordinate mappen
		let value = (coords[i].height / highest) * height;

		//Wert von SVG-Höhe abziehen, da ansonsten "Negativprofil"
		points += `${i},${height - value},`;
	}

	//letzter Punkt (bei maximaler Höhe, damit Kurve richtig ausgefüllt ist)
	points += `${coords.length},${height}`;

	//Points setzen
	line.setAttribute("points", points);

	//in x-Richtung skalieren -> immer gleiche Breite
	line.setAttribute("transform", `scale(${xScale},1)`);
}

//höchsten Punkt eines Koordinatensets herausfinden
function getHighestPoint(coords) {
	let highest = 0;
	for (let i = 0; i < coords.length; ++i) {
		if (coords[i].height > highest) {
			highest = coords[i].height;
		}
	}

	return highest;
}

/*
//Punkte zusammenfassen
function sumupHeightValues(coords) {
	//erster Punkt ist Referenzpunkt
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
*/

function loadTours() {
	request({
		url: `http://${window.location.host}/api/tracks?short=true`,
		json: true
	}, function (error, response) {
		if (error) {
			console.log(`Failed to fetch routes: ${error}`);
		}
		else {
			//Antwort vom Server in JSON parsen
			data = JSON.parse(response.body);
			createList(data);
		}
	});
}

window.onresize = function () {
	//zuerst alles löschen und zurücksetzen
	deleteChildren(liste);
	sideCount = 0;

	setSidecountLabel(sideCount, numOfSides);

	//Liste neu aufbauen
	createList(data);
};

document.getElementById("left").onclick = function () {
	//sideCount zwischen 0 und numOfSides halten
	sideCount--;
	if (sideCount < 0) {
		sideCount += numOfSides;
	}
	sideCount %= numOfSides;

	setSidecountLabel(sideCount, numOfSides);
	createList(data);
};

document.getElementById("right").onclick = function () {
	//sideCount zwischen 0 und numOfSides halten
	sideCount++;
	sideCount %= numOfSides;

	setSidecountLabel(sideCount, numOfSides);

	createList(data);
};

function setSidecountLabel(val, numOfSides) {
	//sideCount + 1, damit Anzeige bei 1 anfängt
	document.getElementById("sideCount").innerHTML = `${val + 1}/${numOfSides}`;
}

//alle Kindelemente eines Elements löschen
function deleteChildren(element) {
	while (element.firstChild) {
		element.removeChild(element.firstChild);
	}
}

function getListItemHeight() {
	//Dummy-listItem erstellen
	let listItem = document.createElement("LI");
	listItem.appendChild(document.createTextNode(data[0].name));
	listItem.setAttribute("class", "tourItem");
	liste.appendChild(listItem);

	//Höhe herausfinden und Dummy-listItem wieder löschen
	let listItemHeight = document.getElementsByClassName("tourItem")[0].clientHeight;
	liste.removeChild(liste.firstChild);

	return listItemHeight;
}

function createList(data) {
	if (window.innerHeight < buttonDiv.clientHeight + 50) {
		setSidecountLabel(-1, 0);
	}
	else {
		//alte Liste löschen
		deleteChildren(liste);

		//listItem-Höhe herausfinden
		let listItemHeight = getListItemHeight();

		//Anzahl Elemente für eine Seite = Fensterhöhe : Itemhöhe - 2 -> Buttons oben abziehen
		let numOfElements = Math.floor((window.innerHeight - buttonDiv.clientHeight - 10) / listItemHeight);

		//Anzahl der Seiten berechnen
		numOfSides = Math.floor(data.length / numOfElements);

		//wenn Anzahl der Seiten nicht genau aufgeht->noch eine Seite hinzufügen
		if (data.length % numOfElements !== 0) {
			numOfSides++;
		}

		//so viele Elemente einfügen wie möglich
		for (let i = 0; i < numOfElements; ++i) {
			//wenn Ende von data erreicht ist aufhören
			if (!data[(sideCount * numOfElements) + i]) {
				break;
			}
			else {
				//neues listItem erstellen und an Liste anhängen
				let listItem = document.createElement("LI");
				listItem.appendChild(document.createTextNode(data[(sideCount * numOfElements) + i].name));
				listItem.setAttribute("id", data[(sideCount * numOfElements) + i].id);
				listItem.setAttribute("class", `tourItem${i % 2}`);
				liste.appendChild(listItem);
			}
		}

		setSidecountLabel(sideCount, numOfSides);
	}
}

main();
