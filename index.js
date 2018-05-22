const fs = require('fs');
const parser = require('parse-gedcom');

fs.readFile('sample.ged', 'utf-8', (err, data) => {
	if (err) throw err;
	console.log(data);
	var json = parser.parse(data);
	console.log(json);
});
