/* global Tree */

var treeNodeMixin = {  // eslint-disable-line no-unused-vars
    updated() {
        // This line keeps the SVG synced with the Vue data:
        // Move if not performant on larger trees
        Tree.redraw();
    },
    methods: {
        toggleEdit() {
            this.editing = !this.editing;
        },

        addEvent() {
            this.data.events.push({
                type: "",
                date: "",
                place: ""
            });
            this.update();
            this.editing = true;
        },
        /*
        deleteEvent: function(i) {
            this.data.events.splice(i,1);
            this.update();
        },
        updateEvent: function(i, value) {
            this.data.events[i] = value;
            this.update();
        },
*/

        disconnectFrom(otherNode) {
            // delete edge
            // remove person's family
            // remove family's person
            // re-render
        },

        attachTo(otherNode) {
            // add edge
            // add person to family
            // add family to person
            // re-render
        }
    },
    computed: {
        events() {
            // Always sort person's events chronologically:
            return this.data.events.sort((a, b) => b.date - a.date);
        }
    }
};
