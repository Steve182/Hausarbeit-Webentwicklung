let request = require("request");
let google = require("google-maps");

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
		new g.maps.Map(document.getElementById("map"), options);
		console.log("Map initialized!");
	});
	loadTours();
}

let liste = document.getElementById("elementList");

/*liste.onclick(function (event) {
});*/

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
			for (let item in data) {
				let route = JSON.parse(data[item]);
				let listItem = document.createElement("LI");
				listItem.appendChild(document.createTextNode(route.features[0].properties.name));
				listItem.setAttribute("class", "tourItem");
				liste.appendChild(listItem);
			}
		}
	});
}

main();
//Schlüssel: AIzaSyDHMcOZm-IQCO9n9fExRpuOOfc8I32JvvE
