Vue.component('eventField', {
	props: {
		'event': Object,
		'editing': Boolean	// from parent
	},
	methods: {
		delete: function() {
			// TODO: reference parent method
		}
	},
	computed: {
		fulldate: function() {
			return dateformat(event.date, 'yyyy-mm-dd');
		},
		year: function() {
			return dateformat(event.date, 'yyyy');
		}
	},
	template: `
	<div class="event">
		<div v-show="editing">
			<span>{{ event.type }}</span>
			<label for="data">Date</label><input v-model="event.date">
			<label for="place">Place</label><input v-model="event.place">
			<v-btn v-on:click="deleteEvent(i)"><v-icon>delete</v-icon></v-btn>
		</div>
		<div v-show="!editing">
			<span>{{ event.type }}</span>
			<span>{{ event.place }}</span>
			<span>{{ this.year }}</span>
		</div>
	</div>`
});
