/* global fulldate, year */

Vue.component('event', {
    props: {
        event: Object,
        parentType: String,
        editing: Boolean	// from parent
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
            if (this.parentType === 'INDI') return ['Birth', 'Christening', 'Baptism', 'Death', 'Burial', 'Cremation'];
            else if (this.parentType === 'FAM') return ['Marriage', 'Divorce'];
        },
        placeList() {
            return app.placeList;
        }
    },
    template: `
    <div class="event">
        <div v-show="editing">
            <select
                ref="type"
                v-model="event.type">
                <option v-for="type in eventTypes">{{ type }}</option>
            </select>

            <label for="date">Date</label>
            <input
                style="width:5.5em"
                name="date"
                ref="date"
                :value="fulldate"
                @blur="updateEvent">

            <label for="place">Place</label>
            <v-autocomplete
                style="width:7em"
                name="place"
                ref="place"
                :value="event.place"
                @blur="updateEvent"
                :items="placeList"
                :get-label="getLabel"
                :component-item='template'
                @update-items="updateItems">
            </v-autocomplete>

            <button @click="deleteEvent"><i>delete</i></button>
        </div>

        <div v-show="!editing">
            <span>{{ event.type }}</span>
            <span>{{ fulldate }}</span>
            <span>{{ event.place }}</span>
        </div>
    </div>`
});
