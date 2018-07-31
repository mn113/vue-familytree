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

        selectify() {
            this.$root.selectedNode = this;
        },

        // A tree node can have its own Events
        // Common Event methods:
        addEvent() {
            console.log("Adding empty event");
            this.data.events.push({
                type: "",
                date: "",
                place: "",
                id: 'E_' + this.$root.eventId++
            });
        },

        deleteEvent(id) {
            console.log("Deleting event", id);
            // Find event index in array by id:
            var i = this.data.events.findIndex(e => e.id === id);
            if (i > -1) {
                this.data.events.splice(i,1);
                this.update();
                this.editing = true;
            }
        },

        updateEvent(id, value) {
            console.log("Updating event", id);
            // Find event index in array by id:
            var i = this.data.events.findIndex(e => e.id === id);
            if (i > -1) {
                console.log("OK", i);
                this.data.events[i] = value;
                this.update();
                this.editing = true;
            }
        },

        // Needs to be different on Individual & Family:
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
        sortedEvents: {
            get() {
                // Always sort person's events chronologically:
                return this.data.events.sort((a, b) => a.date - b.date);
            }
        }
    }
};
