const fs = require('fs');
const winston = require('winston');
var pino = require('pino')({base: null, prettyPrint: {forceColor: true}});
const colors = require('colors');
const parser = require('parse-gedcom');
const dateformat = require('dateformat');
const express = require('express');
const app = express();
const multer = require('multer');
var upload = multer({ dest: 'uploads/' });
var port = 3000;
var treeData = {};
var eventId = 0;

readGedcomFile('gedcom/fictitious.ged');

// Serve basic files:
app.use(express.static('static'))

// Receive uploaded GEDCOM file:
app.post('/upload', upload.any(), (req,res) => {
	//console.log('form data', req.body);
	//console.log('file', req.file);
	console.log('files'.yellow, req.files[0]);
	// Process and store data:
	if (req.files !== undefined) {
		readGedcomFile(req.files[0].path);
		res.sendStatus(200);
	}
	else {
		res.sendStatus(500);
	}
});

// Serve current treeData object as JSON:
app.get('/treedata', (req,res) => {
	console.log(treeData);
	res.send(treeData);
});

// Error handling:
app.use((err, req, res, next) => {
	console.log(err.toString().red);
	res.status(500).send('Something broke!'.red);
})

app.listen(port, (err) => {
	console.log(`Server is listening on ${port}`.bold);
	if (err) console.log('Something bad happened'.red, err.toString().red);
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
		if (node.pointer) console.log(`${node.pointer}`.yellow);
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
	//console.log(json.links);
	var cleanLinks = [];
	for (var link of json.links) {
		// Skip errors:
		if (link.source === undefined || link.target === undefined) continue;

		var from = treeData.nodes[link.source],
			to = treeData.nodes[link.target];
		if (from.type == "INDI") {
			//console.log("person->family:", link);
			//console.log(to.id);
			//console.log(from.famsHeadOf);
			if (from.famsHeadOf.includes(to.id)) {
				// reverse edge:
				//console.log("Reversed");
				cleanLinks.push({source: to.id, target: from.id});
			}
			else {
				//console.log("Link fine");
				cleanLinks.push({source: from.id, target: to.id});
			}
		}
		else if (to.type == "INDI") {
			//console.log("family->person:", link);
			//console.log(from.id);
			//console.log(to.famsChildOf);
			if (!to.famsChildOf.includes(from.id)) {
				// reverse edge:
				//console.log("Reversed");
				cleanLinks.push({source: to.id, target: from.id});
			}
			else {
				//console.log("Link fine");
				cleanLinks.push({source: from.id, target: to.id});
			}
		}
	}
	return cleanLinks;
}

// Helper function to get deep data:
function extractValue(key, arr) {
	try {
		return arr.length > 0 ? arr[0].tree.filter(node => node.tag == key)[0].data : "";
	}
	catch (err) {
		console.log(err.toString().dim);
		return null;
	}
}

// Map an individual's data structure to something easier for front-end:
// Every single property will need to be extracted conditionally :(
function mapIndividual(arr) {
	var name = arr.filter(node => node.tag == 'NAME').shift().data;
	var lname = name.match(/\/([\w\s\-\.]+)\//);			// double-slashed surname if present
	var fname = name.match(/^([\w\s\-\.]+)(\/[\w\s\-\.]+\/)/);	// all text before the double-slashed surname
	//console.log(name, fname, lname);
	var sexes = arr.filter(node => node.tag == 'SEX');
	var fams = arr.filter(node => node.tag == 'FAMS');
	var famc = arr.filter(node => node.tag == 'FAMC');
	// Extract all events of desired types:
	//var birth = arr.filter(node => node.tag == 'BIRT');
	//console.log(`${birth}`.red);
	//console.log(extractValue('DATE', birth)); // ok

	var events = ['BIRT','BAPM','CHR','CHRA','DEAT','BURI','CREM']
		.map(key => {
			return {
				type: key,
				nodeList: arr.filter(node => node.tag == key)
			};
		});
	pino.info('EVENT'.blue, events[0].nodeList[0].tree);
		//.forEach(obj => { console.log(`${obj}`.red); return obj; })
	events = events.filter(obj => obj.nodeList.length > 0)
	.map(obj => {
			return {
				id: eventId++,
				type: obj.type,
				date: Date.parse(extractValue('DATE', obj.nodeList)),	// to milliseconds
				place: extractValue('PLAC', obj.nodeList)
			};
		});
	pino.info('EVENT'.rainbow, events);
	var earliest = events
		.filter(e => ['BIRT','BAPM','CHR'].includes(e.type) && e.date)
		.map(e => e.date)
		.sort()
		.shift();
	var latest = events
		.filter(e => ['DEAT','BURI','CREM'].includes(e.type) && e.date)
		.map(e => e.date)
		.sort()
		.shift();

	return {
		lname: lname !== undefined ? lname[1].trim() : "",
		fname: fname !== undefined ? fname[1].trim() : "",
		sex: sexes.length > 0 ? sexes[0].data : 'unknown',
		famsHeadOf: fams.length > 0 ? fams.map(obj => obj.data) : [],
		famsChildOf: famc.length > 0 ? famc.map(obj => obj.data) : [],
		events: events,
		start: earliest !== undefined ? earliest : "",
		end: latest !== undefined ? latest : "",
		notes: []
	};
}

// Map a family's data for the front-end:
function mapFamily(arr) {
	console.log('FAM'.green, arr);
	var husband = extractValue('HUSB', arr),
		wife = extractValue('WIFE', arr),
		married = extractValue('MARR', arr),
		children = arr.filter(node => node.tag == 'CHIL');
	return {
		husband: husband || "",
		wife: wife || "",
		married: married || "",
		children: children.length > 0 ? children.map(obj => obj.data) : null
	};
}
