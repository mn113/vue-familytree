/* global fulldate, app, moment */

Vue.component('event', {
    props: {
        event: Object,
        parentType: String,
        editing: Boolean	// from parent
    },
    data() {
        return {};
    },
    methods: {
        // Talk to parent:
        deleteEvent() {
            this.$emit('delete');
        },
        updateEvent() {
            this.$emit('update', {
                id: this.event.id,
                type: this.$refs.type.value,
                date: Date.parse(this.$refs.date.value),
                place: this.$refs.place.value
            });
            console.log("Emitted update from", this.event.id);
        }
    },
    computed: {
        dateString: {
            get() {
                console.log("Computed fulldate property");
                // Proxy for global utility function
                return fulldate(this.event.date);
            }
        },

        eventTypes() {
            if (this.parentType === 'INDI') {
                return [
                    {value: 'BIRT', text: 'Birth', short: 'b.'},
                    {value: 'CHR',  text: 'Christening', short: 'chr.'},
                    {value: 'BAPM', text: 'Baptism', short: 'bap.'},
                    {value: 'DEAT', text: 'Death', short: 'd.'},
                    {value: 'BURI', text: 'Burial', short: 'bur.'},
                    {value: 'CREM', text: 'Cremation', short: 'crem.'}
                ];
            }
            else if (this.parentType === 'FAM') {
                return [
                    {value: 'MARR', text: 'Marriage', short: 'm.'},
                    {value: 'DIV',  text: 'Divorce',  short: 'div.'}
                ];
            }
        },

        placeList() {
            // Hopefully it has already been computed on the root instance...
            return app.placeList.sort() || [];
        },

        validateDate(d) {
            if (moment(d).isValid()) {
                return true;
            }
            else {
                console.log("Invalid date", d);
                return false;
            }
        }
    },
    template: `
    <div class="event">
        <div v-show="editing">
            <vs-select
                ref="type"
                label="Type"
                v-model="event.type"
                :options="eventTypes"
                @change="updateEvent">
            </vs-select>

            <vs-input
                vs-label-placeholder="Date"
                style="width:7em"
                ref="date"
                :value="dateString"
                @blur="updateEvent"
                vs-validation-function="validateDate"/>

            <vs-input
                vs-label-placeholder="Place"
                style="width:7em"
                ref="place"
                v-model="event.place"
                :list="event.id"
                @blur="updateEvent"/>
            <datalist :id="event.id">
                <option v-for="place in placeList" :value="place" />
            </datalist>

            <vs-button vs-type="danger-border" vs-icon="delete" @click="deleteEvent"></vs-button>
        </div>

        <div v-show="!editing">
            <span>{{ event.type }}</span>
            <span>{{ dateString }}</span>
            <span>{{ event.place }}</span>
        </div>
    </div>`
});
