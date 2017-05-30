const fs = require("fs");

const http = require("http");
const PORT = 8081;

http.createServer((request, response) => {
	console.log(__dirname);
	if (request.method === "GET" && request.url.startsWith("/")) {
		fs.readFile(__dirname + "/json" + request.url,
			(error, data) => {
				if (error) {
					console.error(error);
					response.writeHead(500);
					response.end();
				}
				else {
					response.writeHead(200, { "Content-Type": "json/application", "Content-Length": data.length });
					response.end(data);
				}
			});
	}
	else {
		response.writeHead(404);
		response.end();
	}
}).listen(PORT, () => { console.log("HTTP server listening on port %d.", PORT); });
