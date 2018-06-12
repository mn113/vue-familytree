/* global fulldate, year, app */

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
                type: this.event.type,
                date: new Date(this.$refs.date.value),
                place: this.$refs.place.value
            });
        }
    },
    computed: {
        fulldate() {
            return fulldate(this.event.date);
        },
        year() {
            return year(this.event.date);
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
        }
    },
    template: `
    <div class="event">
        <div v-show="editing">
            <vs-select
                ref="type"
                label="Type"
                v-model="event.type"
                :options="eventTypes">
            </vs-select>

            <vs-input
                vs-label-placeholder="Date"
                style="width:6em"
                name="date"
                ref="date"
                :value="fulldate"
                @blur="updateEvent"/>

            <vs-select
                vs-label-placeholder="Place"
                style="width:7em"
                name="place"
                ref="place"
                v-model="event.place"
                @blur="updateEvent"
                :options="placeList"
                vs-autocomplete />
            </vs-select>

            <vs-button vs-type="danger-border" vs-icon="delete" @click="deleteEvent"></vs-button>
        </div>

        <div v-show="!editing">
            <span>{{ event.type }}</span>
            <span>{{ fulldate }}</span>
            <span>{{ event.place }}</span>
        </div>
    </div>`
});
