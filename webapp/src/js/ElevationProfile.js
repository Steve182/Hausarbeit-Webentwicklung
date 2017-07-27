var ElevationProfile = ElevationProfile || (function () {
	function createElevationProfile(coords) {
		let line = document.getElementById("line");
		let svg = document.getElementById("elevationProfile");

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

	module.exports.createElevationProfile = createElevationProfile;
})();
