let deleteModule = require("delete");
let file = process.argv[2];

deleteModule.sync(file, function (error) {
	if (error) {
		console.error(error);
	}
});

