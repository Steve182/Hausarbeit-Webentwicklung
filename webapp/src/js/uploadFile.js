let Client = require("ssh2-sftp-client");
let src = process.argv[2];
let sftp = new Client();

sftp.connect({
	host: "krassus.net",
	username: "webentwicklung",
	password: "HSTrierSS2017"
}).then(() => {
	return sftp.put(src, "/web/" + src);
}).then(() => {
	sftp.end();
}).catch((err) => {
	console.error(err);
});
