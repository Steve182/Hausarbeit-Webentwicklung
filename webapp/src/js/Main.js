let MapLoader = require("./MapLoader");
let List = require("./List");
let ElevationProfile = require("./ElevationProfile");
let request = require("request");

//Tracks
let data;

let nameDiv = document.getElementById("nameDiv");

//let sideCount = 0;
//let numOfSides = 0;

function main() {
	MapLoader.initMap();

	//Tracks für Liste laden
	loadTours();
}

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

			//Daten nach Async-Task hier weiter verarbeiten
			List.createList(data);
		}
	});
}

//globalen click-Listener an Liste anmelden
List.liste.onclick = function (event) {
	let id = event.target.getAttribute("id");
	//Prüfen, ob Element oder Liste angeklickt wurde
	if (!isNaN(parseInt(id))) {
		request({
			//nur ausgewählten Track laden
			url: `http://${window.location.host}/api/tracks:${id}`,
			json: true
		}, function (error, response) {
			if (error) {
				console.log(`Failed to fetch route ${id}:${error}`);
			}
			else {
				//Antwort vom Server in JSON parsen
				let data = JSON.parse(JSON.stringify(response.body));
				MapLoader.showTour(data);

				//Höhenprofil erstellen
				ElevationProfile.createElevationProfile(MapLoader.coords);

				//Namen komplett anzeigen
				nameDiv.innerHTML = event.target.innerHTML;
				nameDiv.style.display = "inline-block";
			}
		});
	}
};

document.getElementById("left").onclick = function () {
	//Seitenzahl runterzählen
	List.decrement();
	List.createList(data);
};

document.getElementById("right").onclick = function () {
	//Seitenzahl hochzählen
	List.increment();
	List.createList(data);
};

window.onresize = function () {
	//zuerst alles löschen und zurücksetzen
	List.deleteChildren(List.liste);

	//Liste neu aufbauen
	List.createList(data);

	//richtig zoomen
	MapLoader.updateZoom();

	//Höhenprofil aktuallisieren
	ElevationProfile.createElevationProfile(MapLoader.coords);
};

main();
