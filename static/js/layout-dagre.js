/* global dagre, dagreD3, d3, year, app */

// Create a new directed graph
var graph = new dagreD3.graphlib.Graph();
// Set an object for the graph label
graph.setGraph({});
// Default to assigning a new object as a label for each new edge.
graph.setDefaultNodeLabel(() => {});
graph.setDefaultEdgeLabel(() => {});

// Set up an SVG group so that we can translate the final graph.
var svg = d3.select("svg"),
    inner = svg.append("g");

class Tree {
    // Add or update a node and its label in the graph:
    static addIndividualNode(node) {
        graph.setNode(node.id, {
            labelType: "html",
            label: `
            <div id="${node.id}">
                <p>${node.fname} <b>${node.lname}</b></p>
                <p>${year(node.firstDate)} - ${year(node.lastDate)}</p>
            </div>`,
            width: 50 + 3 * (node.fname.length + node.lname.length),
            height: 40,
            style: `fill: ${node.sex === "M" ? "lightblue" : node.sex === "F" ? "lightpink" : "#ccc"}`
        });
    }

    // Add or update a node and its label in the graph:
    static addFamilyNode(node) {
        graph.setNode(node.id, {
            labelType: "html",
            label: `
            <div id="${node.id}">
                <p>m. ${year(node.marriageDate)}</p>
                <p>${node.children.length} children</p>
            </div>`,
            shape: "ellipse",
            width: 80,
            height: 50,
            style: "fill: lightyellow; stroke: #333"
        });
    }

    // Add or update an edge in the graph:
    static addEdge(source, target) {
        graph.setEdge(source, target, { curve: d3.curveBasis });
    }

    // Batch add all the Vue nodes to the graph:
    static addAllNodes() {
        // Individuals:
        for (var indiNode of app.individuals) {
            Tree.addIndividualNode(indiNode);
        }
        // Families:
        for (var famNode of app.families) {
            Tree.addFamilyNode(famNode);
        }
    }

    // Batch add all the Vue edges to the graph:
    static addAllEdges() {
        for (var link of app.links) {
            Tree.addEdge(link.source, link.target);
        }
    }

    // Erase the graph: (preserves graph data)
    static clearGraph() {
        inner.html("");
    }

    static rebuildGraph() {
        // Graph doesn't need to be cleared; these functions update existing node labels
        Tree.addAllNodes();
        Tree.addAllEdges();
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
        svg.on("click", () => {
            inner.selectAll("g.node")
                .classed("selected", false);
            // Update Vue data:
            app.selectNone();
        });

        // Center the graph - we need the absolute width of the SVG here, not 100%
        //var xCenterOffset = (svg.attr("width") - graph.graph().width) / 2;
        var xCenterOffset = (document.querySelector("main").offsetWidth - 40 - graph.graph().width) / 2;
        inner.attr("transform", "translate(" + xCenterOffset + ", 20)");
        // TODO: Remove height setting once pan-and-zoom implemented:
        svg.attr("height", graph.graph().height + 40);
    }

    static redraw() {
        console.info("Redrawing.");
        Tree.rebuildGraph();
        Tree.layoutAndRender();
        Tree.selectNode(app.selectedNode.id);
    }

    static selectNode(id) {
        if (d3.event !== null) d3.event.stopPropagation();
        console.log("Node", id, "selected");
        inner.selectAll("g.node")
            .classed("selected", (n => n === id)); // set matching one selected
        // Update Vue data:
        app.selectNodeById(id);
    }
}
