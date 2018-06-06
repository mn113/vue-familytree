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

		disconnectFrom(otherNode) {
			// delete edge
			// remove person's family
			// remove family's person
			// re-render
		},

		attachTo(otherNode) {
			// add edge
			// add person to family
			// add family to person
			// re-render
		}
    },
	computed: {
		symbol() {
			return this.data.sex == 'M' ? '♂' : this.data.sex == 'F' ? '♀' : '';
		},

		events() {
			// Always sort person's events chronologically:
			return this.data.events.sort((a,b) => { b.date - a.date; });
		},

		parents() {
			// Get family above me, resolve its parents as Objects:
			if (this.data.famsChildOf.length === 0) return null;
			var fam = this.data.famsChildOf.map(fid => app.getFamilyById(fid))[0];
			console.log('parFam', fam);
			return [fam.husband, fam.wife];	// not good!
		},

		siblings() {
			// Get family above me, resolve its kids as Objects:
			if (this.data.famsChildOf.length === 0) return null;
			var fam = this.data.famsChildOf.map(fid => app.getFamilyById(fid))[0];
			console.log('sibFam', fam);
			return fam.children.map(pid => app.getIndividualById(pid));
		},

		families() {
			// Get families below me. Resolve all ids to Objects:
			if (this.data.famsHeadOf.length === 0) return null;
			var fams = this.data.famsHeadOf.map(fid => app.getFamilyById(fid));
			console.log('kidsFams', fams);
			return fams.map(fam => {
				var spouseId = (fam.husband == this.data.id) ? fam.wife : (fam.wife == this.data.id) ? fam.husband : null;
				console.log('spouseId', spouseId);
				var spouse = (spouseId) ? app.getIndividualById(spouseId) : null;
				var children = fam.children.map(cid => app.getIndividualById(cid));
				return {
					spouse: spouse,
					children: children
				};
			});
		}
	},
	template: `
		<div :id="data.id" :class="[data.sex, {editing: editing}]" class="person">
			<div v-show="editing">
				<i class="right" v-on:click="toggleEdit">close</i>

				<h3>Names</h3>
				<div row>
					<label>First name(s)</label>
					<input
						name="fname"
						label="First name(s)"
						ref="fname"
						v-model="data.fname"
						v-on:input="updateFirstName($event.target.value)"
					></input>
				</div>
				<div row>
					<label>Last name(s)</label>
					<input
						name="lname"
						label="Last name(s)"
						ref="lname"
						v-model="data.lname"
						v-on:input="updateLastName($event.target.value)"
					></input>
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

				<h3>Events</h3>
				<div class="dates">
					<event v-for="event in data.events"
						:event="event"
						:key="event.id"
						:editing="true"></event>
					<button v-on:click="addEvent()"><i>add</i></button>
				</div>
			</div>

			<div v-show="!editing">
				<i class="right" v-on:click="toggleEdit">edit</i>

				<h3 class="name">{{ data.fname }} <b>{{ data.lname }}</b> {{ symbol }}</h3>

				<h3>Events</h3>
				<div class="dates">
					<event v-for="event in data.events"
						:event="event"
						:key="event.id"
						:editing="false"></event>
				</div>

				<h3>Parents</h3>
				<ul v-if="parents.length > 0">
					<li v-for="p in parents">{{ p.fname }} <b>{{ p.lname }}</b></li>
				</ul>

				<h3>Siblings</h3>
				<ol v-if="siblings.length > 0">
					<li v-for="p in siblings">{{ p.fname }} <b>{{ p.lname }}</b></li>
				</ol>

				<h3>Families</h3>
				<ol v-if="families.length > 0">
					<li v-for="f in families">
						Spouse: {{ f.spouse }}
						<ol>
							<li v-for="c in f.children">{{ c.fname }} <b>{{ c.lname }}</b></li>
						</ol>
					</li>
				</ol>

			</div>
		</div>`
});
