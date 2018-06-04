var cy = cytoscape({
	container: document.getElementById('cy'),
	boxSelectionEnabled: true,
	elements: [],
	style: [ // the stylesheet for the graph
		{
			selector: 'node',
			style: {
				'label': 'data(label)'
			}
		},

		{
			selector: 'edge',
			style: {
				'width': 3,
				'line-color': '#ccc',
				'target-arrow-color': '#ccc',
				'target-arrow-shape': 'triangle'
			}
		}
	]
});

function addNodes() {
	// Add nodes to the graph.
	for (var node of app.individuals) {
		cy.add({
			group: 'nodes',
			data: {
				id: node.id,
				label: `<p>${node.fname} <b>${node.lname}</b></p>
				<p>${year(node.start)} - ${year(node.end)}</p>`
			},
			classes: 'person '+ node.sex
		});
		// g.setNode(node.id, {
		// 	labelType: "html",
		// 	label: `<p>${node.fname} <b>${node.lname}</b></p>
		// 	<p>${year(node.start)} - ${year(node.end)}</p>`,
		// 	width: 50 + 3 * (node.fname.length + node.lname.length),
		// 	height: 40,
		// 	style: `fill: ${node.sex == "M" ? "lightblue" : node.sex == "F" ? "lightpink" : "#ccc"}`
		// });
	}
	for (var node of app.families) {
		cy.add({
			group: 'nodes',
			data: {
				id: node.id
			},
			classes: 'family'
		});
//		g.setNode(node.id, { label: node.id, width: 80, height: 50, shape: "ellipse", style: "fill: lightyellow; stroke: #333" });
	}
}

function addEdges() {
	for (var link of app.links) {
		cy.add({
			group: 'edges',
			data: {
				id: link.source + "-" + link.target,
				source: link.source,
				target: link.target
			}
		});
	}
}

function layoutAndRender() {
	cy.layout({
		name: 'dagre',
	}).run();
	console.log("Layout applied.");
}

function year(date) {
	if (date === undefined || date.length === 0) return "?";
	if (typeof date == 'number') date = new Date(date);
	return date.getFullYear();
}

function fulldate(date) {
	if (date === undefined || date.length === 0) return "?";
	if (typeof date == 'number') date = new Date(date);
	var y = date.getFullYear(),
		m = (date.getMonth() + 1).toString().padStart(2,"0"),
		d = date.getDate().toString().padStart(2,"0");
	return `${y}-${m}-${d}`;
}
