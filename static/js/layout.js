// Create a new directed graph
var g = new dagreD3.graphlib.Graph();

// Set an object for the graph label
g.setGraph({});

// Default to assigning a new object as a label for each new edge.
g.setDefaultEdgeLabel(function() { return {}; });

// Set up an SVG group so that we can translate the final graph.
var svg = d3.select("svg"),
	inner = svg.append("g");

function addNodes() {
	// Add nodes to the graph.
	for (var node of app.individuals) {
		var fill = node.sex == "M" ? "lightblue" : node.sex == "F" ? "lightpink" : "#ccc";
		g.setNode(node.id, { label: node.fname, width: 100, height: 50, style: `fill: ${fill}` });
	}
	for (var node of app.families) {
		g.setNode(node.id, { label: node.id, width: 80, height: 50, shape: "ellipse", style: "fill: lightyellow; stroke: #333" });
	}
	/*
	g.nodes().forEach(function(v) {
	     console.log("Node " + v + ": " + JSON.stringify(g.node(v)));
	});
	*/
}

function addEdges() {
	for (var link of app.links) {
		g.setEdge(link.source, link.target, { curve: d3.curveBasis });
	}
	/*
	g.edges().forEach(function(e) {
	    console.log("Edge " + e.v + " -> " + e.w + ": " + JSON.stringify(g.edge(e)));
	});
	*/
}

function layoutAndRender() {
	// Calculate layout:
	dagre.layout(g);

	// Create the renderer
	var render = new dagreD3.render();

	// Run the renderer. This is what draws the final graph.
	render(inner, g);

	// Center the graph
	var xCenterOffset = (svg.attr("width") - g.graph().width) / 2;
	inner.attr("transform", "translate(" + xCenterOffset + ", 20)");
	svg.attr("height", g.graph().height + 40);
}
