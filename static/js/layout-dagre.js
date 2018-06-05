// Create a new directed graph
var g = new dagreD3.graphlib.Graph();

// Set an object for the graph label
g.setGraph({});

// Default to assigning a new object as a label for each new edge.
//g.setDefaultEdgeLabel(function() { return {}; });

// Set up an SVG group so that we can translate the final graph.
var svg = d3.select("svg"),
	inner = svg.append("g");

function addNodes() {
	// Add nodes to the graph.
	for (var node of app.individuals) {
		g.setNode(node.id, {
			labelType: "html",
			label: `<div id="${node.id}">
						<p>${node.fname} <b>${node.lname}</b></p>
						<p>${year(node.start)} - ${year(node.end)}</p>
					</div>`,
			width: 50 + 3 * (node.fname.length + node.lname.length),
			height: 40,
			style: `fill: ${node.sex == "M" ? "lightblue" : node.sex == "F" ? "lightpink" : "#ccc"}`
		});
	}
	for (var node of app.families) {
		g.setNode(node.id, {
			labelType: "html",
			label: `<div id="${node.id}">
						<p>${node.married}</p>
						<p>${node.children.length} children</p>
					</div>`,
			shape: "ellipse",
			width: 80,
			height: 50,
			style: "fill: lightyellow; stroke: #333"
		});
	}
}

function addEdges() {
	for (var link of app.links) {
		g.setEdge(link.source, link.target, { curve: d3.curveBasis });
	}
}

function layoutAndRender() {
	// Calculate layout:
	dagre.layout(g);

	// Create the renderer
	var render = new dagreD3.render();

	// Run the renderer. This is what draws the final graph.
	render(inner, g);

	// Add event listeners to nodes:
	inner.selectAll("g.node").on("click", selectNode);
	// Unselecting click:
	svg.on("click", function() {
		inner.selectAll("g.node")
			 .classed("selected", false);
		 // Update Vue data:
	 	app.selectNone();
	});

	// Center the graph
	var xCenterOffset = (svg.attr("width") - g.graph().width) / 2;
	inner.attr("transform", "translate(" + xCenterOffset + ", 20)");
	svg.attr("height", g.graph().height + 40);
}

function selectNode(id) {
	d3.event.stopPropagation();
	console.log("Node", id, "selected");
	inner.selectAll("g.node")
		 .classed("selected", function(node) { return node === id; });	// set matching one selected
	// Update Vue data:
	app.selectNodeById(id);
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
