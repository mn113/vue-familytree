/* global fulldate, year, app, moment */

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
                type: this.$refs.type.value,
                date: Date.parse(this.$refs.date.value),
                place: this.$refs.place.value
            });
        },
        stringifyDate() {

        }
    },
    computed: {
        dateString: {
            get() {
                console.log("Computed fulldate property");
                // Proxy for global utility function
                return fulldate(this.event.date);
            },
            set(dateString) {
                console.log("Parsed", Date.parse(dateString));
                this.event.date = Date.parse(dateString);   // to milliseconds
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
            return app.placeList.map(p => {
                return {text: p, value: p};
            }) || [];
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
                v-model="dateString"
                @blur="updateEvent"
                vs-validation-function="validateDate"/>

            <vs-input
                vs-label-placeholder="Place"
                style="width:7em"
                ref="place"
                v-model="event.place"
                @blur="updateEvent"/>

            <vs-button vs-type="danger-border" vs-icon="delete" @click="deleteEvent"></vs-button>
        </div>

        <div v-show="!editing">
            <span>{{ event.type }}</span>
            <span>{{ dateString }}</span>
            <span>{{ event.place }}</span>
        </div>
    </div>`
});
