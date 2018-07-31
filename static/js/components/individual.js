/* global app, Tree, treeNodeMixin */

Vue.component('individual', {
    mixins: [treeNodeMixin],
    props: {
        data: Object
    },
    data() {
        return {
            editing: false,
            firstDate: this.data.start, // kept in state so we can update them as Events change
            lastDate: this.data.end,
            dateError: false
        };
    },
    updated() {
        // Keep start and end dates up-to-date:
        this.firstDate = this.data.events
            .filter(e => ['BIRT','BAPM','CHR'].includes(e.type) && e.date)
            .map(e => e.date)
            .sort()
            .shift();
        this.lastDate = this.data.events
            .filter(e => ['DEAT','BURI','CREM'].includes(e.type) && e.date)
            .map(e => e.date)
            .sort()
            .shift();
        this.dateError = (this.lastDate < this.firstDate);
    },
    methods: {
        update() {
            // Emit signal back to parent:
            var newData = Object.assign({	// retain all data while updating editables
                fname: this.$refs.fname.value,
                lname: this.$refs.lname.value,
                sex: this.$refs.sex.value,
                events: this.data.events
            }, this.data);
            this.$emit('update', newData);
        },

        // Create 2 nodes and link them above this one:
        addFamilyAndParent() {
            var myNode = this.$root.selectedNode;
            var family = this.$root.newFamily();
            var famNode = this.$root.getFamilyById(family.id);
            this.$root.newLink(famNode, myNode);
            var parent = this.$root.newIndividual();
            var parNode = this.$root.getIndividualById(parent.id);
            this.$root.newLink(parNode, famNode);
            this.selectify();
            Tree.redraw();
        }
    },
    computed: {
        sexOptions() {
            return [
                {text: 'Male', value: 'M'},
                {text: 'Female', value: 'F'},
                {text: 'Unknown', value: 'unknown'}
            ];
        },

        symbol() {
            return this.data.sex === 'M' ? '♂' : this.data.sex === 'F' ? '♀' : '';
        },

        isHomePerson() {
            return this.$root.homePerson && this.$root.homePerson.id === this.data.id;
        },

        isDisconnected() {
            return this.data.famsHeadOf.length === 0 && this.data.famsChildOf.length === 0;
        },

        parents() {
            // Get family above me, resolve its parents as Objects:
            if (this.data.famsChildOf.length === 0) return [];
            var fam = this.data.famsChildOf.map(fid => app.getFamilyById(fid))[0];
            console.log('parFam', fam);
            return fam.parents.map(pid => app.getIndividualById(pid));
        },

        siblings() {
            // Get family above me, resolve its kids as Objects:
            if (this.data.famsChildOf.length === 0) return [];
            var fam = this.data.famsChildOf.map(fid => app.getFamilyById(fid))[0];
            console.log('sibFam', fam);
            return fam.children.map(pid => app.getIndividualById(pid));
        },

        families() {
            // Get families below me. Resolve all ids to Objects:
            if (this.data.famsHeadOf.length === 0) return [];
            var fams = this.data.famsHeadOf.map(fid => app.getFamilyById(fid));
            console.log('kidsFams', fams);
            return fams.map(fam => {
                var spouses = fam.parents.filter(pers => pers.id !== this.data.id);
                console.log('spouses', spouses);
                var spouse = (spouses.length > 0) ? app.getIndividualById(spouses[0]) : null;
                var children = fam.children.map(cid => app.getIndividualById(cid));
                return {
                    spouse,
                    children    // ES6 object shorthand
                };
            });
        }
    },
    template: `
    <div :class="{editing: editing}">

        <vs-dropdown class="right" vs-trigger-click>
            <vs-button class="btn-drop" vs-type="primary-filled" vs-icon="expand_more"></vs-button>
            <vs-dropdown-menu :style="{width: '15em'}">
                <vs-dropdown-item>
                    <vs-button
                        vs-type="dark-border"
                        vs-icon="home"
                        :class="{ 'vs-icon-dark-border': !isHomePerson, 'vs-icon-success-filled': isHomePerson }"
                        @click="$root.setHomePerson()">
                        Set as Home person
                    </vs-button>
                </vs-dropdown-item>
                <vs-dropdown-item>
                    <vs-button
                        vs-type="dark-border"
                        vs-icon="group_add"
                        @click="addFamilyAndParent()">
                        Add parent
                    </vs-button>
                </vs-dropdown-item>
                <vs-dropdown-item>
                    <vs-button
                        vs-type="dark-border"
                        vs-icon="delete"
                        @click="$root.deletePerson()">
                        Delete person
                    </vs-button>
                </vs-dropdown-item>
            </vs-dropdown-menu>
        </vs-dropdown>

        <div v-if="editing">
            <i class="right" v-on:click="update">close</i>
            <i class="right" v-on:click="toggleEdit">save</i>

            <section>
                <vs-divider></vs-divider>
                <h3>Names</h3>
                <div>
                    <vs-input
                        vs-label-placeholder="First"
                        ref="fname"
                        v-model="data.fname"/>

                    <vs-input
                        vs-label-placeholder="Last"
                        ref="lname"
                        v-model="data.lname"/>
                </div>
            </section>
            <section>
                <vs-select
                    label="Sex"
                    ref="sex"
                    v-model="data.sex"
                    :options="sexOptions">
                </vs-select>
            </section>

            <section>
                <vs-divider></vs-divider>
                <h3>Events <span>({{ data.events.length }})</span></h3>
                <div class="dates clearfix">
                    <event v-for="event in sortedEvents"
                        :event="event"
                        :parentType="'INDI'"
                        :key="event.id"
                        :editing="true"
                        @update="event = arguments[0]"
                        @delete="event = null">
                    </event>

                    <vs-button
                        vs-type="primary-filled"
                        @click="addEvent()"
                        class="right"
                        vs-icon="add">Add Event
                    </vs-button>
                </div>
            </section>
        </div>

        <div v-if="!editing">
            <i class="right" v-on:click="toggleEdit">edit</i>

            <section>
                <vs-divider></vs-divider>
                <h3 class="name">{{ data.fname }} <b>{{ data.lname }}</b> {{ symbol }}</h3>
            </section>

            <section>
                <vs-divider></vs-divider>
                <h3>Events <span>({{ data.events.length }})</span></h3>
                <div class="dates clearfix">
                    <event v-for="event in sortedEvents"
                        :event="event"
                        :key="event.id"
                        :editing="false">
                    </event>
                </div>
            </section>
        </div>

        <div>
            <section>
                <vs-divider></vs-divider>
                <h3>Parents <span>({{ parents.length }})</span></h3>
                <ul v-if="parents.length > 0">
                    <li v-for="parent in parents">
                        <person-line v-bind="parent"></person-line>
                    </li>
                </ul>
            </section>

            <section>
                <vs-divider></vs-divider>
                <h3>Siblings <span>({{ siblings.length }})</span></h3>
                <ol v-if="siblings.length > 0">
                    <li v-for="sibling in siblings">
                        <person-line v-bind="sibling"></person-line>
                    </li>
                </ol>
            </section>

            <section>
                <vs-divider></vs-divider>
                <h3>Families <span>({{ families.length }})</span></h3>
                <ol v-if="families.length > 0">
                    <li v-for="family in families">
                        Spouse: <person-line v-bind="family.spouse" :short="true"></person-line>
                        <h5 v-if="family.children.length > 0">Children: <span>({{ family.children.length }})</span></h5>
                        <ol>
                            <li v-for="child in family.children">
                                <person-line v-bind="child" :short="true"></person-line>
                            </li>
                        </ol>
                    </li>
                </ol>
            </section>
        </div>
    </div>`
});
