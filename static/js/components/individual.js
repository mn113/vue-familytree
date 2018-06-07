/* global app, Tree, treeNodeMixin */

Vue.component('individual', {
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
                fname: this.$refs.fname.value,
                lname: this.$refs.lname.value,
                sex: this.$refs.sex.value,
                events: this.data.events
            }), this.data);
        }
    },
    computed: {
        symbol() {
            return this.data.sex === 'M' ? '♂' : this.data.sex === 'F' ? '♀' : '';
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
    <div :class="[data.sex, {editing: editing}]">
        <div v-show="editing">
            <i class="right" v-on:click="update">close</i>
            <i class="right" v-on:click="toggleEdit">save</i>

            <h3>Names</h3>

            <div>
                <label>First name(s)</label>
                <input
                    name="fname"
                    label="First"
                    ref="fname"
                    v-model="data.fname">
                </input>
            </div>

            <div>
                <label>Last name(s)</label>
                <input
                    name="lname"
                    label="Last"
                    ref="lname"
                    v-model="data.lname">
                </input>
            </div>

            <label for="sex">Sex</label>
            <select
                name="sex"
                ref="sex"
                v-model="data.sex">
                <option>M</option>
                <option>F</option>
                <option>unknown</option>
            </select>

            <h3>Events <span>({{ data.events.length }})</span></h3>

            <div class="dates clearfix">
                <event v-for="event in data.events"
                    :event="event"
                    :parentType="'INDI'"
                    :key="event.id"
                    :editing="true"
                    @update="event = arguments[0]">
                </event>

                <button @click="addEvent()" class="right"><i>add</i>Add Event</button>
            </div>
        </div>

        <div v-show="!editing">
            <i class="right" v-on:click="toggleEdit">edit</i>

            <h3 class="name">{{ data.fname }} <b>{{ data.lname }}</b> {{ symbol }}</h3>

            <h3>Events <span>({{ data.events.length }})</span></h3>

            <div class="dates clearfix">
                <event v-for="event in data.events"
                    :event="event"
                    :key="event.id"
                    :editing="false">
                </event>
            </div>

            <h3>Parents <span>({{ parents.length }})</span></h3>

            <ul v-if="parents.length > 0">
                <li v-for="par in parents">
                    <person-line v-bind="par"></person-line>
                </li>
            </ul>

            <h3>Siblings <span>({{ siblings.length }})</span></h3>

            <ol v-if="siblings.length > 0">
                <li v-for="sib in siblings">
                    <person-line v-bind="sib"></person-line>
                </li>
            </ol>

            <h3>Families <span>({{ families.length }})</span></h3>

            <ol v-if="families.length > 0">
                <li v-for="fam in families">
                    Spouse: <person-line v-bind="fam.spouse"></person-line>
                    <h3 v-if="fam.children.length > 0">Children: <span>({{ fam.children.length }})</span></h3>
                    <ol>
                        <li v-for="chi in fam.children">
                            <person-line v-bind="chi"></person-line>
                        </li>
                    </ol>
                </li>
            </ol>
        </div>
    </div>`
});
