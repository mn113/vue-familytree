// Create a new directed graph
var graph = new dagreD3.graphlib.Graph();
// Set an object for the graph label
graph.setGraph({});

// Set up an SVG group so that we can translate the final graph.
var svg = d3.select("svg"),
	inner = svg.append("g");

class Tree {
	static addIndividualNode(node) {
		graph.setNode(node.id, {
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

	static addFamilyNode(node) {
		graph.setNode(node.id, {
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

	static addEdge(source, target) {
		graph.setEdge(source, target, { curve: d3.curveBasis });
	}

	// Add all the Vue nodes data to the graph:
	static addAllNodes() {
		// Individuals:
		for (var node of app.individuals) {
			Tree.addIndividualNode(node);
		}
		// Families:
		for (var node of app.families) {
			Tree.addFamilyNode(node);
		}
	}

	// Add all the Vue edges data to the graph:
	static addAllEdges() {
		for (var link of app.links) {
			Tree.addEdge(link.source, link.target);
		}
	}

	// Erase the graph: (preserves graph data)
	static clearGraph() {
		inner.html("");
	}

	// Draw a new graph:
	static layoutAndRender() {
		// Calculate layout:
		dagre.layout(graph);

		// Create the renderer
		var render = new dagreD3.render();

		// Run the renderer. This is what draws the final graph.
		render(inner, graph);

		// Add event listeners to nodes:
		inner.selectAll("g.node").on("click", Tree.selectNode);
		// Unselecting click:
		svg.on("click", function() {
			inner.selectAll("g.node")
				 .classed("selected", false);
			 // Update Vue data:
		 	app.selectNone();
		});

		// Center the graph
		var xCenterOffset = (svg.attr("width") - graph.graph().width) / 2;
		inner.attr("transform", "translate(" + xCenterOffset + ", 20)");
		svg.attr("height", graph.graph().height + 40);
	}

	static redraw() {
		console.info("Redrawing.");
		Tree.clearGraph();
		Tree.layoutAndRender();
		Tree.selectNode(app.selectedNode.id);
	}

	static selectNode(id) {
		if (d3.event !== null) d3.event.stopPropagation();
		console.log("Node", id, "selected");
		inner.selectAll("g.node")
			 .classed("selected", function(node) { return node === id; });	// set matching one selected
		// Update Vue data:
		app.selectNodeById(id);
	}
};


/* UTILITY FUNCTIONS */

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
