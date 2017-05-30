const fs = require("fs");

const http = require("http");
const PORT = 8081;

http.createServer((request, response) => {
	console.log(__dirname);
	if (request.method === "GET" && request.url.startsWith("/")) {
		if (request.url === "/routes") {
			let data = JSON.stringify(fs.readdirSync(__dirname + "/json"));
			//console.log(data);
			response.writeHead(200, { "Content-Type": "application/json", "Content-Length": data.length });
			response.end(data);
		}
		else {
			fs.readFile(__dirname + "/json" + request.url,
				(error, data) => {
					if (error) {
						console.error(error);
						response.writeHead(500);
						response.end();
					}
					else {
						response.writeHead(200, { "Content-Type": "application/json", "Content-Length": data.length });
						response.end(data);
					}
				});
		}
	}
	else {
		response.writeHead(404);
		response.end();
	}
}).listen(PORT, () => { console.log("HTTP server listening on port %d.", PORT); });
