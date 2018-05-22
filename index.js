const fs = require('fs');
const parser = require('parse-gedcom');

fs.readFile('sample.ged', 'utf-8', (err, data) => {
	if (err) throw err;
	//console.log(data);
	const json = parser.parse(data);
	processTree(json);
});

function processTree(json) {
	for (var node of json) {
		if (node.tag == 'INDI') {
			//console.log(node.tag, ' ', node.pointer);
			if (node.data) console.log(node.data);
			var indiv = mapIndividual(node.tree);
			indiv.id = node.pointer;
			console.log(indiv);
		}
		else if (node.tag == 'FAM') {
			//console.log(node.tag, ' ', node.pointer);
			if (node.data) console.log(node.data);
			var family = mapFamily(node.tree);
			family.id = node.pointer;
			console.log(family);
		}
	}
}

function mapIndividual(arr) {
	var fams = arr.filter(node => node.tag == 'FAMS');
	var famc = arr.filter(node => node.tag == 'FAMC');
	return {
		fname: arr.filter(node => node.tag == 'NAME')[0].data,
		lname: arr.filter(node => node.tag == 'NAME')[0].data,
		sex: arr.filter(node => node.tag == 'SEX')[0].data,
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
