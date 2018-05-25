const fs = require('fs');
const parser = require('parse-gedcom');
const dateformat = require('dateformat');
const express = require('express');
const app = express();
const port = 3000;
var treeData = {};

readGedcomFile('gedcom/allged.ged');

// Serve basic files:
app.use(express.static('static'))

app.post('/input', (req,res) => {
	// TODO: Validate request & handle a submitted file
});

app.get('/treedata', (req,res) => {
	console.log(treeData);
	res.send(treeData);
});

// Error handling:
app.use((err, req, res, next) => {
	console.log(err);
	res.status(500).send('Something broke!');
})

app.listen(port, (err) => {
	console.log(`server is listening on ${port}`);
	if (err) console.log('something bad happened', err);
});

function readGedcomFile(filename) {
	fs.readFile(filename, 'utf-8', (err, data) => {	// TODO: non-utf8 encodings?
		if (err) throw err;
		const json = parser.parse(data);
		console.log(json);
		const linkedJson = (parser.d3ize(json));
		treeData.nodes = processNodes(linkedJson);
		treeData.links = processLinks(linkedJson);
	});
}

// Clean the data structure from the parser:
function processNodes(json) {
	var cleanNodes = [];
	for (var i = 0; i < json.nodes.length; i++) {
		var node = json.nodes[i];
		if (node.pointer) console.log(node.pointer);
		if (node.data) console.log(node.data);
		if (node.tag == 'INDI') {
			var indiv = mapIndividual(node.tree);
			indiv.id = node.pointer;
			indiv.type = "INDI";
			cleanNodes.push(indiv);
		}
		else if (node.tag == 'FAM') {
			var family = mapFamily(node.tree);
			family.id = node.pointer;
			family.type = "FAM";
			cleanNodes.push(family);
		}
	}
	return cleanNodes;
}

// Make sure all graph links are directed from high to low:
function processLinks(json) {
	console.log(json.links);
	var cleanLinks = [];
	for (var link of json.links) {
		// Skip errors:
		if (link.source === undefined || link.target === undefined) continue;

		var from = treeData.nodes[link.source],
			to = treeData.nodes[link.target];
		if (from.type == "INDI") {
			console.log("person->family:", link);
			console.log(to.id);
			console.log(from.famsHeadOf);
			if (from.famsHeadOf.includes(to.id)) {
				// reverse edge:
				console.log("Reversed");
				cleanLinks.push({source: to.id, target: from.id});
			}
			else {
				console.log("Link fine");
				cleanLinks.push({source: from.id, target: to.id});
			}
		}
		else if (to.type == "INDI") {
			console.log("family->person:", link);
			console.log(from.id);
			console.log(to.famsChildOf);
			if (!to.famsChildOf.includes(from.id)) {
				// reverse edge:
				console.log("Reversed");
				cleanLinks.push({source: to.id, target: from.id});
			}
			else {
				console.log("Link fine");
				cleanLinks.push({source: from.id, target: to.id});
			}
		}
	}
	return cleanLinks;
}

// Helper function to get deep data:
function extractValue(key, arr) {
	try {
		return arr.length > 0 ? arr[0].tree.filter(node => node.tag == key)[0].data : null
	}
	catch (err) {
		console.log(err);
		return null;
	}
}

// Map an individual's data structure to something easier for front-end:
function mapIndividual(arr) {
	var name = arr.filter(node => node.tag == 'NAME').shift().data;
	var lname = name.match(/\/([\w\s\-\.]+)\//);			// double-slashed surname if present
	var fname = name.match(/^([\w\s\-\.]+)(\/[\w\s\-\.]+\/)/);	// all text before the double-slashed surname
	console.log(name, fname, lname);
	var sex = arr.filter(node => node.tag == 'SEX');
	var fams = arr.filter(node => node.tag == 'FAMS');
	var famc = arr.filter(node => node.tag == 'FAMC');
	var birth = arr.filter(node => node.tag == 'BIRT');
	var death = arr.filter(node => node.tag == 'DEAT');
	var events = {};
	for (key in ['birth','bap','chr','death','bur','crem']) {
		// extract births etc present in JSON TODO
	}
	return {
		lname: lname !== undefined ? lname[1] : "",
		fname: fname !== undefined ? fname[1] : "",
		sex: sex.length > 0 ? sex[0].data : 'unknown',
		events: {
			birth: {
				date: dateformat(Date.parse(extractValue('DATE', birth)), 'yyyy-mm-dd'),
				place: extractValue('PLAC', birth)
			},
			bap: 'baptism',
			chr: 'christening',
			death: {
				date: dateformat(Date.parse(extractValue('DATE', death)), 'yyyy-mm-dd'),
				place: extractValue('PLAC', death)
			},
			bur: 'burial',
			crem: 'cremation',
		},
		famsHeadOf: fams.length > 0 ? fams.map(obj => obj.data) : [],
		famsChildOf: famc.length > 0 ? famc.map(obj => obj.data) : []
	};
}

// Map a family's data for the front-end:
function mapFamily(arr) {
	console.log(arr);
	var children = arr.filter(node => node.tag == 'CHIL');
	return {
		//id: arr.filter(node => node.tag == 'POINTER')[0].data,
		husband: extractValue('HUSB', arr),
		wife: extractValue('WIFE', arr),
		married: extractValue('MARR', arr),
		children: children.length > 0 ? children.map(obj => obj.data) : null
	};
}
