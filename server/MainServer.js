const fs = require("fs");
const path = require("path");
const express = require("express");

let PORT = process.argv[2];
if (!PORT) {
	PORT = 8080;
}

//Express-Server erstellen
let httpServer = express();

httpServer.get("/api/tracks", (request, response) => {
	if (request.query.short && request.query.short === "true") {
		let data = [];
		console.log("Listing files in '" + __dirname + "/json/'...");
		let fileList = fs.readdirSync(__dirname + "/json/");
		for (let i = 0; i < fileList.length; i++) {
			let id = fileList[i].replace(".json", "");
			let track = JSON.parse(fs.readFileSync(__dirname + "/json/" + fileList[i], "utf8"));
			data.push({ id: id, name: track.features[0].properties.name });
		}
		response.json(JSON.stringify(data));
	}
	else {
		let data = [];
		console.log("Listing files in '" + __dirname + "/json/'...");
		let fileList = fs.readdirSync(__dirname + "/json/");
		for (let i = 0; i < fileList.length; i++) {
			data.push(fs.readFileSync(__dirname + "/json/" + fileList[i], "utf8"));
		}
		response.json(JSON.stringify(data));
	}
});

httpServer.get("/api/tracks:id", (request, response) => {
	//response.json(fs.readFileSync(__dirname + "/json/" + request.params.id.replace(":", "") + ".json"), "utf8");
	let obj = JSON.parse(fs.readFileSync(__dirname + "/json/" + request.params.id.replace(":", "") + ".json"));
	response.status(200).json(obj);
});

httpServer.get("/", function (request, response) {
	console.log("Sending 'index.html'...");
	response.sendFile(path.resolve(__dirname + "/../webapp/src/release/index.html"));
});

httpServer.get(/^(.+)$/, function (request, response) {
	console.log("Sending '" + request.params[0] + "'...");
	response.sendFile(path.resolve(__dirname + "/../webapp/src/release" + request.params[0]));
});

//Express-Server auf Port 8080 starten
httpServer.listen(PORT, function () {
	console.log("Server is listening on " + PORT);
});
