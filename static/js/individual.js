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
		<v-flex md4 wrap="true">
			<v-card>
				<v-card-text>
					<figure :id="data.id" :class="[data.sex, {editing: editing}]" class="person">
						<div v-show="editing">
							<v-icon v-on:click="toggleEdit">close</v-icon>
							<v-layout row>
								<v-flex xs4>
									<v-subheader>First name(s)</v-subheader>
								</v-flex>
								<v-flex xs8>
									<v-text-field
										name="fname"
										label="First name(s)"
										ref="fname"
										v-model="data.fname"
										v-on:input="updateFirstName($event.target.value)"
									></v-text-field>
								</v-flex>
							</v-layout>
							<v-layout row>
								<v-flex xs4>
									<v-subheader>Last name(s)</v-subheader>
								</v-flex>
								<v-flex xs8>
									<v-text-field
										name="lname"
										label="Last name(s)"
										ref="lname"
										v-model="data.lname"
										v-on:input="updateLastName($event.target.value)"
									></v-text-field>
								</v-flex>
							</v-layout>
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
								<v-btn v-on:click="addEvent()"><v-icon>add</v-icon></v-btn>
							</div>
						</div>
						<div v-show="!editing">
							<v-icon v-on:click="toggleEdit">edit</v-icon>
							<span class="name">{{ data.fname }} <b>{{ data.lname }}</b></span>
							<div class="dates">
								<event v-for="event in data.events"
									:event="event"
									:key="event.id"
									:editing="false"></event>
							</div>
						</div>
					</figure>
				</v-card-text>
			</v-card>
		</v-flex>`
});
