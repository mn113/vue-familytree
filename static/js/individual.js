
Vue.component('individual', {
	props: {
		'data': Object
	},
	data: function() {
		return {
			editing: false
		}
	},
	methods:{
        toggleEdit: function(){
            this.editing = !this.editing;
        }
    },
	template: `
		<v-flex xs2 sm6 offset-sm3>
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
										v-model="data.fname"
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
										v-model="data.lname"
									></v-text-field>
								</v-flex>
							</v-layout>
							<!--label for="fname">First name(s)</label><input name="fname" v-model="data.fname">
							<label for="lname">Surname(s)</label><input name="lname" v-model="data.lname"-->
							<label for="sex">Sex</label>
							<select v-model="data.sex" name="sex">
								<option>M</option>
								<option>F</option>
								<option>unknown</option>
							</select>
							<div class="dates">
								<div v-for="event in data.events" class="dates">
									<span>{{ event.type }}</span>
									<label for="data">Date</label><input v-model="event.date">
									<label for="place">Place</label><input v-model="event.place">
								</div>
								<!-- TODO: add/remove event buttons -->
							</div>
						</div>
						<div v-show="!editing">
							<v-icon v-on:click="toggleEdit">edit</v-icon>
							<span class="name">{{ data.fname }} <b>{{ data.lname }}</b></span>
							<div v-for="event in data.events" class="dates">
								<p>{{ event.type }}:
									<span v-if="event.date">{{ event.date }}</span>
									<span v-if="event.place">{{ event.place }}</span>
								</p>
							</div>
						</div>
					</figure>
				</v-card-text>
			</v-card>
		</v-flex>`
});
