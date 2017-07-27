var List = List || (function () {
	let sideCount = 0;
	let numOfSides = 0;
	let liste = document.getElementById("elementList");
	let buttonDiv = document.getElementById("buttons");

	function setSidecountLabel(val, numOfSides) {
		//sideCount + 1, damit Anzeige bei 1 anfängt
		document.getElementById("sideCount").innerHTML = `${val + 1}/${numOfSides}`;
	}

	function getListItemHeight(data) {
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
			let listItemHeight = getListItemHeight(data);

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

	//alle Kindelemente eines Elements löschen
	function deleteChildren(element) {
		while (element.firstChild) {
			element.removeChild(element.firstChild);
		}
	}

	function increment() {
		//sideCount zwischen 0 und numOfSides halten
		sideCount++;
		sideCount %= numOfSides;

		//Seitenzahl-Label aktuallisieren
		setSidecountLabel(sideCount, numOfSides);
	}

	function decrement() {
		//sideCount zwischen 0 und numOfSides halten
		sideCount--;
		if (sideCount < 0) {
			sideCount += numOfSides;
		}
		sideCount %= numOfSides;

		//Seitenzahl-Label aktuallisieren
		setSidecountLabel(sideCount, numOfSides);
	}

	module.exports.increment = increment;
	module.exports.decrement = decrement;
	module.exports.createList = createList;
	module.exports.deleteChildren = deleteChildren;
	module.exports.liste = liste;
})();
