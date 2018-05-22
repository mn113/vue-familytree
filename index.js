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
			console.log(node.tag, ' ', node.pointer);
			if (node.data) console.log(node.data);
			console.log(mapIndividual(node.tree));
		}
		else if (node.tag == 'FAM') {
			console.log(node.tag, ' ', node.pointer);
			if (node.data) console.log(node.data);
			console.log(mapFamily(node.tree));
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
		fams: fams.length > 0 ? fams[0].data : null,
		famc: famc.length > 0 ? famc[0].data : null
	};
}

function mapFamily(arr) {
	return {
		husband: arr.filter(node => node.tag == 'HUSB')[0].data,
		wife: arr.filter(node => node.tag == 'WIFE')[0].data,
		married: arr.filter(node => node.tag == 'MARR')[0].data,
		children: arr.filter(node => node.tag == 'CHIL').map(obj => obj.data)
	};
}
