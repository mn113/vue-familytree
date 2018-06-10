/* global dagre, dagreD3, d3, year, app */

// Create a new directed graph
var graph = new dagreD3.graphlib.Graph();
// Set an object for the graph label
graph.setGraph({});
graph.setDefaultNodeLabel(() => {});    // New Person/Family or somesuch label?

// Set up an SVG group so that we can translate the final graph.
var svg = d3.select("svg"),
    inner = svg.append("g");

var activeHandle = null; // tracks last clicked node handle

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
        graph.setEdge(source, target, {
            curve: d3.curveBasis,
            labelType: 'html',
            label: `<i source=${source} target=${target}>content_cut</i>`
        });
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
        svg.selectAll("g.node").on("click", Tree.selectNode);
        // Unselecting click:
        svg.on("click", () => {
            inner.selectAll("g.node").classed("selected", false);
            inner.selectAll("text").classed("active", false);
            activeHandle = null;
            // Update Vue data:
            app.selectNone();
        });

        Tree.addHandlesToNodes();
        Tree.addHandlesToEdges();

        // Center the graph - we need the absolute width of the SVG here, not 100%
        //var xCenterOffset = (svg.attr("width") - graph.graph().width) / 2;
        var xCenterOffset = (document.querySelector("main").offsetWidth - 40 - graph.graph().width) / 2;
        inner.attr("transform", "translate(" + xCenterOffset + ", 20)");
        // TODO: Remove height setting once pan-and-zoom implemented:
        svg.attr("height", graph.graph().height + 40);
    }

    static addHandlesToNodes() {
        // Add handles to rendered nodes:
        svg.selectAll("g.node").each(nodeId => {
            var node = graph.node(nodeId);
            var type = app.$data.nodes.filter(n => n.id === nodeId)[0].type;

            // Add 2 connector handles:
            var handlesGroup = d3.select(node.elem).append("g");
            handlesGroup.classed("handles", true);
            var handleTop = handlesGroup.append("text").text("add_box").style("transform", `translate(-6px, ${-0.5 * node.height - 8}px)`);
            var handleBot = handlesGroup.append("text").text("add_box").style("transform", `translate(-6px, ${0.5 * node.height + 24}px)`);

            // Add click handlers to handles:
            handleTop.on('click', () => {
                d3.event.stopPropagation();
                inner.selectAll("text").classed("active", false);
                handleTop.classed("active", true);
                Tree.tryConnection([nodeId, 'top', type]);
            });
            handleBot.on('click', () => {
                d3.event.stopPropagation();
                inner.selectAll("text").classed("active", false);
                handleBot.classed("active", true);
                Tree.tryConnection([nodeId, 'bot', type]);
            });
        });
    }

    static addHandlesToEdges() {
        // Add handles to rendered edge labels: TODO: use paths
        document.querySelectorAll("g.edgeLabel i").forEach(elem => {
            // I need the elem & its attributes
            elem = d3.select(elem);
            elem.on('click', () => {
                Tree.breakConnection(elem.attr('source'), elem.attr('target'));
            });
        });
    }

    static tryConnection(clickedHandle) {
        var person1,
            person2,
            family;
        // Needs to be different nodes and different handles:
        if (activeHandle
            && activeHandle[0] !== clickedHandle[0]
            && activeHandle[1] !== clickedHandle[1]) {
            // Make a connection:
            // 0. If 2 family nodes, ignore:
            if (clickedHandle[2] === 'FAM' && activeHandle[2] === 'FAM') {
                console.log("Can't join 2 families");
            }
            // 1. If 2 person nodes, ask to create new family or add to existing?
            else if (clickedHandle[2] === 'INDI' && activeHandle[2] === 'INDI') {
                person1 = app.getIndividualById(activeHandle[0]);
                person2 = app.getIndividualById(clickedHandle[0]);
                console.log("We want to join 2 individuals directly.");
                alert("Individuals cannot be joined directly without creating a family first.");
            }
            // 2. Person bottom to family top => person becomes a family parent
            else if (clickedHandle[2] === 'FAM' && clickedHandle[1] === 'top') {
                //console.log("person", activeHandle[0], "heads family", clickedHandle[0]);
                person1 = app.getIndividualById(activeHandle[0]);
                family = app.getFamilyById(clickedHandle[0]);
                person1.famsHeadOf.push(family.id);
                family.parents.push(person1.id);
                app.$data.links.push({source: person1.id, target: family.id});
                Tree.redraw();
            }
            // 3. Same as case 2, order reversed
            else if (clickedHandle[2] === 'INDI' && clickedHandle[1] === 'bot') {
                //console.log("person", clickedHandle[0], "heads family", activeHandle[0]);
                person1 = app.getIndividualById(clickedHandle[0]);
                family = app.getFamilyById(activeHandle[0]);
                person1.famsHeadOf.push(family.id);
                family.parents.push(person1.id);
                app.$data.links.push({source: person1.id, target: family.id});
                Tree.redraw();
            }
            // 4. Person top to family bottom => person becomes a family child
            else if (clickedHandle[2] === 'FAM' && clickedHandle[1] === 'bot') {
                //console.log("person", activeHandle[0], "born into family", clickedHandle[0]);
                person1 = app.getIndividualById(activeHandle[0]);
                family = app.getFamilyById(clickedHandle[0]);
                person1.famsChildOf.push(family.id);
                family.children.push(person1.id);
                app.$data.links.push({source: family.id, target: person1.id});
                Tree.redraw();
            }
            // 5. Same as case 4, order reversed
            else if (clickedHandle[2] === 'INDI' && clickedHandle[1] === 'top') {
                //console.log("person", clickedHandle[0], "born into family", activeHandle[0]);
                person1 = app.getIndividualById(clickedHandle[0]);
                family = app.getFamilyById(activeHandle[0]);
                person1.famsChildOf.push(family.id);
                family.children.push(person1.id);
                app.$data.links.push({source: family.id, target: person1.id});
                Tree.redraw();
            }
            // Deselect:
            activeHandle = null;
            inner.selectAll("text").classed("active", false);
        }
        else {
            activeHandle = clickedHandle;
        }
    }

    static breakConnection(source, target) {
        var person,
            family;
        console.log("Breaking link", source, target);
        // If person above family, de-parent both:
        person = app.getIndividualById(source);
        if (person) {
            family = app.getFamilyById(target);
            person.famsHeadOf = person.famsHeadOf.filter(f => f !== target);
            family.parents = family.parents.filter(p => p !== source);
        }
        // If person below family, de-child both:
        else {
            person = app.getIndividualById(target);
            family = app.getFamilyById(source);
            person.famsChildOf = person.famsChildOf.filter(p => p !== source);
            family.children = family.children.filter(f => f !== target);
        }
        console.log("Unlinked", person, family);

        // Remove from dagre graph:
        graph.removeEdge(source, target);

        // Finally, remove the single unique link from Vue:
        console.log(app.$data.links.length);
        app.$data.links = app.$data.links.filter(e => e.source !== source || e.target !== target);
        console.log(app.$data.links.length);
        Tree.redraw();
    }

    static redraw() {
        console.info("Redrawing.");
        Tree.rebuildGraph();
        Tree.layoutAndRender();
        if (app.selectedNode) Tree.selectNode(app.selectedNode.id);
    }

    static selectNode(id) {
        if (d3.event !== null) d3.event.stopPropagation();
        if (!app.selectedNode) return;
        console.log("Node", id, "selected");
        inner.selectAll("g.node")
            .classed("selected", (n => n === id)); // set matching one selected
        // Update Vue data:
        app.selectNodeById(id);
    }
}
