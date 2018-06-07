/* global app, Tree, treeNodeMixin */

Vue.component('family', {
    mixins: [treeNodeMixin],
    props: {
        data: Object
    },
    data() {
        return {
            editing: false
        };
    },
    methods: {
        update() {
            // Emit signal back to parent:
            this.$emit('update', Object.assign({	// retain all data while updating editables
                married: this.$refs.married.value,
                events: this.data.events
            }), this.data);
            Tree.redraw();
        }
    },
    computed: {
        resolvedParents() {
            // Rresolve my parents as Objects:
            return this.data.parents.map(pid => app.getIndividualById(pid));
        },

        resolvedChildren() {
            // Resolve my children as Objects:
            return this.data.children.map(cid => app.getIndividualById(cid));
        }
    },
    template: `
    <div :class="[data.sex, {editing: editing}]">
        <div v-show="editing">
            <i class="right" v-on:click="update">close</i>
            <i class="right" v-on:click="toggleEdit">save</i>

            <label for="married">Married?</label>
            <select
                name="married"
                ref="married"
                :value="data.married">
                <option>Married</option>
                <option>Unmarried</option>
                <option>Unknown</option>
            </select>

            <h3>Parents</h3>
            <ul>
                <li v-for="p in resolvedParents">
                    <person-line v-bind="p"></person-line>
                </li>
            </ul>

            <h3>Children</h3>
            <ul>
                <li v-for="p in resolvedParents">
                    <person-line v-bind="p"></person-line>
                </li>
            </ul>

            <h3>Events</h3>
            <div class="dates clearfix">
                <event v-for="event in data.events"
                    :event="event"
                    :key="event.id"
                    :parentType="'FAM'"
                    :editing="true"></event>
                    <button v-on:click="addEvent()" class="right"><i>add</i>Add Event</button>
                </event>
            </div>
        </div>

        <div v-show="!editing">
            <i class="right" v-on:click="toggleEdit">edit</i>

            <h3>Parents</h3>
            <ul>
                <li v-for="p in resolvedParents">
                    <person-line v-bind="p"></person-line>
                </li>
            </ul>

            <h3>Children</h3>
            <ul>
                <li v-for="c in resolvedChildren">
                    <person-line v-bind="c"></person-line>
                </li>
            </ul>

            <h3>Events</h3>
            <div class="dates clearfix">
                <event v-for="event in data.events"
                    :event="event"
                    :key="event.id"
                    :editing="false">
                </event>
            </div>

        </div>
    </div>`
});
