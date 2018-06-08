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
            //this.update();
            //this.editing = true;
        },

        deleteEvent(id) {
            // Find event index in array by id:
            var i = this.data.events.findIndex(e => e.id === id);
            if (i > -1) {
                this.data.events.splice(i,1);
                //this.update();
                //this.editing = true;
            }
        },

        updateEvent(id, value) {
            // Find event index in array by id:
            var i = this.data.events.findIndex(e => e.id === id);
            if (i > -1) {
                this.data.events[i] = value;
                //this.update();
                //this.editing = true;
            }
        },

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
        sortedEvents() {
            // Always sort person's events chronologically:
            return this.data.events.sort((a, b) => a.date - b.date);
        }
    }
};
