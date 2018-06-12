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
    <div :class="{editing: editing}">
        <div v-show="editing">
            <i class="right" @click="update">close</i>
            <i class="right" @click="toggleEdit">save</i>

            <vs-select
                label="Status"
                name="married"
                ref="married"
                v-model="data.married"
                :options="['Married','Unmarried','Divorced','Unknown']">
            </select>

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

            <h3>Events <span>({{ data.events.length }})</span></h3>
            <div class="dates clearfix">
                <event v-for="event in sortedEvents"
                    :event="event"
                    :key="event.id"
                    :parentType="'FAM'"
                    :editing="true"
                    @update="event = arguments[0]"><!-- can't target by index -->
                </event>
                <button @click="addEvent" class="right"><i>add</i>Add Event</button>
            </div>
        </div>

        <div v-show="!editing">
            <i class="right" @click="toggleEdit">edit</i>

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

            <h3>Events <span>({{ data.events.length }})</span></h3>
            <div class="dates clearfix">
                <event v-for="event in sortedEvents"
                    :event="event"
                    :key="event.id"
                    :editing="false">
                </event>
            </div>

        </div>
    </div>`
});
