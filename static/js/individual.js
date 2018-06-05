Vue.component('individual', {
	props: {
		data: Object
	},
	data: function() {
		return {
			editing: false
		}
	},
	methods: {
        toggleEdit: function() {
            this.editing = !this.editing;
        },
		addEvent: function() {
			this.data.events.push({
				type: "",
				date: "",
				place: ""
			});
			this.updateIndividual();
		},
/*		deleteEvent: function(i) {
			this.data.events.splice(i,1);
			this.updateIndividual();
		},
		updateEvent: function(i, value) {
			this.data.events[i] = value;
			this.updateIndividual();
		},*/
		updateIndividual: function() {
			// Only this one emits signal back to parent
			this.$emit('input', {
				fname: this.$refs.fname.value,
				lname: this.$refs.lname.value,
				sex: this.$refs.sex.value,
				events: this.data.events
			});
		},
    },
/*	events: {
		updateEvent: function(i, value) {

		}
	}*/
	computed: {

	},
	template: `
		<div :id="data.id" :class="[data.sex, {editing: editing}]" class="person">
			<div v-show="editing">
				<i v-on:click="toggleEdit">close</i>
				<div row>
					<div xs4>
						<label>First name(s)</label>
					</div>
					<div xs8>
						<input
							name="fname"
							label="First name(s)"
							ref="fname"
							v-model="data.fname"
							v-on:input="updateFirstName($event.target.value)"
						></input>
					</div>
				</div>
				<div row>
					<div xs4>
						<label>Last name(s)</label>
					</div>
					<div xs8>
						<input
							name="lname"
							label="Last name(s)"
							ref="lname"
							v-model="data.lname"
							v-on:input="updateLastName($event.target.value)"
						></input>
					</div>
				</div>
				<label for="sex">Sex</label>
				<select
					name="sex"
					ref="sex"
					v-model="data.sex"
					v-on:input="updateSex($event.target.value)">
					<option>M</option>
					<option>F</option>
					<option>unknown</option>
				</select>
				<div class="dates">
					<event v-for="event in data.events"
						:event="event"
						:key="event.id"
						:editing="true"></event>
					<button v-on:click="addEvent()"><i>add</i></button>
				</div>
			</div>
			<div v-show="!editing">
				<i v-on:click="toggleEdit">edit</i>
				<span class="name">{{ data.fname }} <b>{{ data.lname }}</b></span>
				<div class="dates">
					<event v-for="event in data.events"
						:event="event"
						:key="event.id"
						:editing="false"></event>
				</div>
			</div>
		</div>`
});
