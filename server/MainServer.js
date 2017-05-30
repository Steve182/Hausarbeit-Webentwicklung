const fs = require("fs");

const http = require("http");
const PORT = 8080;

http.createServer((request, response) => {
	if (request.method === "POST" && request.url.startsWith("/")) {
		fs.readFile("./json" + request.url,
			(error, data) => {
				if (error) {
					console.error(error);
					response.writeHead(500, { "Content-Type": "json/application", "Content-Length": data.length });
					response.end(data);
				}
				else {
					response.writeHead(200);
				}
			});
	}
	else {
		response.writeHead(404);
	}
	response.end();
}).listen(PORT, () => { console.log("HTTP server listening on port %d.", PORT); });
