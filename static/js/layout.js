// Create a new directed graph
var g = new dagreD3.graphlib.Graph();

// Set an object for the graph label
g.setGraph({});

// Default to assigning a new object as a label for each new edge.
g.setDefaultEdgeLabel(function() { return {}; });

// Add nodes to the graph. The first argument is the node id. The second is
// metadata about the node. In this case we're going to add labels to each of
// our nodes.
g.setNode("kspacey",    { label: "Kevin Spacey",  width: 144, height: 80, style: "fill: lightblue" });
g.setNode("swilliams",  { label: "Serena Williams", width: 160, height: 80, style: "fill: lightpink" });
g.setNode("fam1",       { label: "unmarried",     width: 120, height: 60, style: "fill: lightyellow" });
g.setNode("bpitt",      { label: "Brad Pitt",     width: 108, height: 80 });
g.setNode("hford",      { label: "Harrison Ford", width: 168, height: 80 });
g.setNode("lwilson",    { label: "Luke Wilson",   width: 144, height: 80 });
g.setNode("fam2",       { label: "unmarried",     width: 120, height: 60  });
g.setNode("kbacon",     { label: "Kevin Bacon",   width: 121, height: 80 });

// Add edges to the graph.
g.setEdge("kspacey", "fam1");
g.setEdge("swilliams", "fam1");
g.setEdge("fam1", "bpitt", {curve: d3.curveBasis});
g.setEdge("fam1", "hford");
g.setEdge("fam1", "lwilson");
g.setEdge("lwilson", "fam2");
g.setEdge("fam2", "kbacon");

// Calculate layout:
dagre.layout(g);

/*
g.nodes().forEach(function(v) {
     console.log("Node " + v + ": " + JSON.stringify(g.node(v)));
});
g.edges().forEach(function(e) {
    console.log("Edge " + e.v + " -> " + e.w + ": " + JSON.stringify(g.edge(e)));
});
*/

// Create the renderer
var render = new dagreD3.render();

// Set up an SVG group so that we can translate the final graph.
var svg = d3.select("svg"),
    inner = svg.append("g");

// Run the renderer. This is what draws the final graph.
render(inner, g);

// Center the graph
var xCenterOffset = (svg.attr("width") - g.graph().width) / 2;
inner.attr("transform", "translate(" + xCenterOffset + ", 20)");
svg.attr("height", g.graph().height + 40);
