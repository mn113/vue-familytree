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
                v-model="data.married">
                <option>Married</option>
                <option>Unmarried</option>
                <option>Unknown</option>
            </select>

            <h3>Parents <span>({{ data.parents.length }})</span></h3>
            <ul>
                <li v-for="par in resolvedParents">
                    <person-line v-bind="par"></person-line>
                </li>
            </ul>

            <h3>Children <span>({{ data.children.length }})</span></h3>
            <ul>
                <li v-for="chi in resolvedChildren">
                    <person-line v-bind="chi"></person-line>
                </li>
            </ul>

            <h3>Events <span>({{ data.events.length }})</span></h3>
            <div class="dates clearfix">
                <event v-for="event in data.events"
                    :event="event"
                    :key="event.id"
                    :parentType="'FAM'"
                    :editing="true">
                </event>
                <button v-on:click="addEvent()" class="right"><i>add</i>Add Event</button>
            </div>
        </div>

        <div v-show="!editing">
            <i class="right" v-on:click="toggleEdit">edit</i>

            <h3>Parents <span>({{ data.parents.length }})</span></h3>
            <ul>
                <li v-for="par in resolvedParents">
                    <person-line v-bind="par"></person-line>
                </li>
            </ul>

            <h3>Children <span>({{ data.children.length }})</span></h3>
            <ul>
                <li v-for="chi in resolvedChildren">
                    <person-line v-bind="chi"></person-line>
                </li>
            </ul>

            <h3>Events <span>({{ data.events.length }})</span></h3>
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
