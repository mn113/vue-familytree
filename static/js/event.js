Vue.component('event', {
	props: {
		'event': Object,
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
		}
	},
	template: `
	<div class="event">
		<div v-show="editing">
			<select
				ref="type"
				v-model="event.type">
				<option>BIRT</option>
				<option>DEAT</option>
			</select>

			<label for="date">Date</label>
			<input
				name="date"
				ref="date"
				:value="fulldate"
				@input="updateEvent()">

			<label for="place">Place</label>
			<input
				name="place"
				ref="place"
				v-model="event.place"
				@input="updateEvent()">

			<button @click="deleteEvent()"><i>delete</i></button>
		</div>
		<div v-show="!editing">
			<span>{{ event.type }}</span>
			<span>{{ event.place }}</span>
			<span>{{ fulldate }}</span>
		</div>
	</div>`
});
