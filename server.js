const fs = require('fs');
const parser = require('parse-gedcom');
const dateformat = require('dateformat');
const express = require('express');
const app = express();
const port = 3000;
var treeData;

readGedcomFile('simple.ged');

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
		console.log(parser.d3ize(data));
		const json = parser.parse(data);
		treeData = processTree(json);
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

function extractValue(key, arr) {
	return arr.length > 0 ? arr[0].tree.filter(node => node.tag == key)[0].data : null
}

function mapIndividual(arr) {
	console.log(arr);
	var sex = arr.filter(node => node.tag == 'SEX');
	var fams = arr.filter(node => node.tag == 'FAMS');
	var famc = arr.filter(node => node.tag == 'FAMC');
	var birth = arr.filter(node => node.tag == 'BIRT');
	var death = arr.filter(node => node.tag == 'DEAT');
	return {
		fname: arr.filter(node => node.tag == 'NAME')[0].data,
		lname: arr.filter(node => node.tag == 'NAME')[0].data,
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
