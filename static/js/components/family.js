/* global app, Tree, treeNodeMixin */

Vue.component('family', {
    mixins: [treeNodeMixin],
    props: {
        data: Object
    },
    data() {
        return {
            editing: false,
            marriageOptions: [
                {text: 'Married', value: 'Married'},
                {text: 'Unmarried', value: 'Unmarried'},
                {text: 'Divorced', value: 'Divorced'},
                {text: 'Unknown', value: 'Unknown'}
            ]
        };
    },
    methods: {
        update() {
            // Emit signal back to parent:
            var newData = Object.assign({	// retain all data while updating editables
                married: this.$refs.married.value,
                events: this.data.events
            }, this.data);
            this.$emit('update', newData);
        }
    },
    computed: {
        resolvedParents() {
            // Resolve my parents as Objects:
            return this.data.parents.map(pid => app.getIndividualById(pid));
        },

        resolvedChildren() {
            // Resolve my children as Objects:
            return this.data.children.map(cid => app.getIndividualById(cid));
        }
    },
    template: `
    <div :class="{editing: editing}">
        <div v-show="editing">
            <i class="right" @click="update">close</i>
            <i class="right" @click="toggleEdit">save</i>

            <h3>Status</h3>
            <vs-select
                label="Status"
                name="married"
                ref="married"
                v-model="data.married"
                :options="marriageOptions">
            </vs-select>

            <h3>Events <span>({{ data.events.length }})</span></h3>
            <div class="dates clearfix">
                <event v-for="event in sortedEvents"
                    :key="event.id"
                    :parentType="'FAM'"
                    :editing="true"
                    :event="event"
                    @update="updateEvent(event.id, arguments[0])"
                    @delete="deleteEvent(event.id)">
                </event>
                <button @click="addEvent" class="right"><i>add</i>Add Event</button>
            </div>

            <h3>Parents <span>({{ data.parents.length }})</span></h3>
            <ul>
                <li v-for="parent in resolvedParents">
                    <person-line v-bind="parent"></person-line>
                </li>
            </ul>

            <h3>Children <span>({{ data.children.length }})</span></h3>
            <ul>
                <li v-for="child in resolvedChildren">
                    <person-line v-bind="child"></person-line>
                </li>
            </ul>
        </div>

        <div v-show="!editing">
            <i class="right" @click="toggleEdit">edit</i>

            <h3>Status</h3>
            <p>{{ data.married }}</p>

            <h3>Events <span>({{ data.events.length }})</span></h3>
            <div class="dates clearfix">
                <event v-for="event in sortedEvents"
                    :key="event.id"
                    :editing="false"
                    :event="event">
                </event>
            </div>

            <h3>Parents <span>({{ data.parents.length }})</span></h3>
            <ul>
                <li v-for="parent in resolvedParents">
                    <person-line v-bind="parent"></person-line>
                </li>
            </ul>

            <h3>Children <span>({{ data.children.length }})</span></h3>
            <ul>
                <li v-for="child in resolvedChildren">
                    <person-line v-bind="child"></person-line>
                </li>
            </ul>
        </div>
    </div>`
});
