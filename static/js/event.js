Vue.component('event', {
	props: {
		'event': Object,
		'editing': Boolean	// from parent
	},
	methods: {
		// Talk to parent:
		deleteEvent: function() {
			this.$emit('input', null);	// ?
		},
		updateEvent: function() {
    		this.$emit('input', {
				type: event.type,
				date: this.$refs.date.value,
				place: this.$refs.place.value
			});
    	}
	},
	computed: {
		fulldate: function() {
			return fulldate(event.date);
		},
		year: function() {
			return year(event.date);
		}
	},
	template: `
	<div class="event">
		<div v-show="editing">
			<span>{{ event.type }}</span>

			<label for="date">Date</label>
			<input
				name="date"
				ref="date"
				v-model="event.date"
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
			<span>{{ this.year }}</span>
		</div>
	</div>`
});
