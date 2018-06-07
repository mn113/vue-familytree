Vue.component('individual', {
	mixins: [treeNodeMixin],
	props: {
		data: Object
	},
	data: function() {
		return {
			editing: false
		}
	},
	methods: {
		update: function() {
			// Emit signal back to parent:
			this.$emit('update', Object.assign({	// retain all data while updating editables
				fname: this.$refs.fname.value,
				lname: this.$refs.lname.value,
				sex: this.$refs.sex.value,
				events: this.data.events
			}), this.data);
			Tree.redraw();
		}
    },
	computed: {
		symbol() {
			return this.data.sex == 'M' ? '♂' : this.data.sex == 'F' ? '♀' : '';
		},

		parents() {
			// Get family above me, resolve its parents as Objects:
			if (this.data.famsChildOf.length === 0) return null;
			var fam = this.data.famsChildOf.map(fid => app.getFamilyById(fid))[0];
			console.log('parFam', fam);
			return fam.parents.map(pid => app.getIndividualById(pid));
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
		<div :class="[data.sex, {editing: editing}]">
			<div v-show="editing">
				<i class="right" v-on:click="update">close</i>
				<i class="right" v-on:click="toggleEdit">save</i>

				<h3>Names</h3>
				<div row>
					<label>First name(s)</label>
					<input
						name="fname"
						label="First"
						ref="fname"
						:value="data.fname"
						@input="update">
					</input>
				</div>
				<div row>
					<label>Last name(s)</label>
					<input
						name="lname"
						label="Last"
						ref="lname"
						:value="data.lname"
						@input="update">
					</input>
				</div>

				<label for="sex">Sex</label>
				<select
					name="sex"
					ref="sex"
					:value="data.sex"
					@input="update">
					<option>M</option>
					<option>F</option>
					<option>unknown</option>
				</select>

				<h3>Events</h3>
				<div class="dates">
					<event v-for="event in data.events"
						:event="event"
						:parentType="'INDI'"
						:key="event.id"
						:editing="true"></event>
					<button v-on:click="addEvent()" class="right"><i>add</i>Add Event</button>
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
					<li v-for="p in parents">
						<person-line v-bind="p"></person-line>
					</li>
				</ul>

				<h3>Siblings</h3>
				<ol v-if="siblings.length > 0">
					<li v-for="s in siblings">
						<person-line v-bind="s"></person-line>
					</li>
				</ol>

				<h3>Families</h3>
				<ol v-if="families.length > 0">
					<li v-for="f in families">
						Spouse: {{ f.spouse }}
						<ol>
							<li v-for="c in f.children">
								<person-line v-bind="c"></person-line>
							</li>
						</ol>
					</li>
				</ol>

			</div>
		</div>`
});
