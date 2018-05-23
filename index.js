const fs = require('fs');
const parser = require('parse-gedcom');
const http = require('http');

var treeData = readGedcomFile('simple.ged');

// Handle requests for index.html or treeData:
const requestHandler = (request, response) => {
	console.log(request.url);
	if (request.url == "/") {
		response.end(fs.readFile('index.html', (err, html) => html));
	}
	else if (request.url == "/treedata") {
		response.end(treeData);
	}
	else {
		response.end('404');
	}
}

// Start serving:
const port = 3000;
http.createServer(requestHandler).listen(port, (err) => {
	console.log(`server is listening on ${port}`);
	if (err) console.log(err);
});


function readGedcomFile(filename) {
	return fs.readFile(filename, 'utf-8', (err, data) => {	// TODO: non-utf8 encodings?
		if (err) throw err;
		//console.log(data);
		const json = parser.parse(data);
		return processTree(json);
	});
}

function processTree(json) {
	var people = [],
		families = [];
	for (var node of json) {
		if (node.tag == 'INDI') {
			//console.log(node.tag, ' ', node.pointer);
			if (node.data) console.log(node.data);
			var indiv = mapIndividual(node.tree);
			indiv.id = node.pointer;
			people.push(indiv);
		}
		else if (node.tag == 'FAM') {
			//console.log(node.tag, ' ', node.pointer);
			if (node.data) console.log(node.data);
			var family = mapFamily(node.tree);
			family.id = node.pointer;
			families.push(family);
		}
	}
	return {
		people: people,
		families: families
	};
}

function mapIndividual(arr) {
	var sex = arr.filter(node => node.tag == 'SEX');
	var fams = arr.filter(node => node.tag == 'FAMS');
	var famc = arr.filter(node => node.tag == 'FAMC');
	return {
		fname: arr.filter(node => node.tag == 'NAME')[0].data,
		lname: arr.filter(node => node.tag == 'NAME')[0].data,
		sex: sex.length > 0 ? sex[0].data : 'unknown',
		famsHeadOf: fams.length > 0 ? fams.map(obj => obj.data) : null,
		famsChildOf: famc.length > 0 ? famc[0].data : null
	};
}

function mapFamily(arr) {
	var children = arr.filter(node => node.tag == 'CHIL');
	return {
		husband: arr.filter(node => node.tag == 'HUSB')[0].data,
		wife: arr.filter(node => node.tag == 'WIFE')[0].data,
		married: arr.filter(node => node.tag == 'MARR')[0].data,
		children: children.length > 0 ? children.map(obj => obj.data) : null
	};
}
