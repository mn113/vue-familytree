Vue.component('event', {
	props: {
		'event': Object,
		'parentType': String,
		'editing': Boolean	// from parent
	},
	methods: {
		// Talk to parent:
		deleteEvent() {
			this.$emit('input', null);	// FIXME better way to delete?
		},
		updateEvent() {
    		this.$emit('input', {
				type: this.event.type,
				date: this.$refs.date.value,
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
			if (this.parentType == 'INDI') return ['Birth', 'Death'];
			else if (this.parentType == 'FAM') return ['Marriage', 'Divorce'];
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
				@input="updateEvent()">

			<label for="place">Place</label>
			<input
				style="width:7em"
				name="place"
				ref="place"
				v-model="event.place"
				@input="updateEvent()">

			<button @click="deleteEvent()"><i>delete</i></button>
		</div>

		<div v-show="!editing">
			<span>{{ event.type }}</span>
			<span>{{ fulldate }}</span>
			<span>{{ event.place }}</span>
		</div>
	</div>`
});
