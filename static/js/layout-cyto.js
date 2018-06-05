var cy = cytoscape({
	container: document.getElementById('cy'),
	boxSelectionEnabled: true,
	elements: [],
	style: [ // the stylesheet for the graph
		{
			selector: 'node',
			style: {
				'label': 'data(label)',
				'background-color': 'lightblue'
			}
		},
		{
			selector: 'edge',
			style: {
				'width': 3,
				'line-color': '#ccc'
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
		nodeSep: undefined, // the separation between adjacent nodes in the same rank
	    edgeSep: undefined, // the separation between adjacent edges in the same rank
	    rankSep: undefined, // the separation between adjacent nodes in the same rank
	    rankDir: 'TB', // 'TB' for top to bottom flow, 'LR' for left to right,
	    ranker: undefined, // Type of algorithm to assign a rank to each node in the input graph. Possible values: 'network-simplex', 'tight-tree' or 'longest-path'
	    minLen: function( edge ){ return 1; }, // number of ranks to keep between the source and target of the edge
	    edgeWeight: function( edge ){ return 1; }, // higher weight edges are generally made shorter and straighter than lower weight edges

	    // general layout options
	    fit: true, // whether to fit to viewport
	    padding: 30, // fit padding
	    spacingFactor: undefined, // Applies a multiplicative factor (>0) to expand or compress the overall area that the nodes take up
	    nodeDimensionsIncludeLabels: true, // whether labels should be included in determining the space used by a node
	    animate: false, // whether to transition the node positions
	    boundingBox: undefined, // constrain layout bounds; { x1, y1, x2, y2 } or { x1, y1, w, h }
	    transform: function( node, pos ){ return pos; }, // a function that applies a transform to the final node position
	    ready: function(){}, // on layoutready
	    stop: function(){} // on layoutstop
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
