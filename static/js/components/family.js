Vue.component('family', {
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
				married: this.$refs.married.value,
				events: this.data.events
			}), this.data);
			Tree.redraw();
		},

		resolvedParents() {
			// Rresolve my parents as Objects:
			return this.parents.map(pid => app.getIndividualById(pid));
		},

		resolvedChildren() {
			// Resolve my children as Objects:
			return this.children.map(cid => app.getIndividualById(cid));
		}
    },
	computed: {
	},
	template: `
		<div :class="[data.sex, {editing: editing}]">
			<div v-show="editing">
				<i class="right" v-on:click="update">close</i>
				<i class="right" v-on:click="toggleEdit">save</i>

				<h3>Parents</h3>

				<label for="married">Married?</label>
				<select
					name="married"
					ref="married"
					:value="data.married">
					<option>Married</option>
					<option>Unmarried</option>
					<option>Unknown</option>
				</select>

				<h3>Children</h3>

				<h3>Events</h3>
				<div class="dates">
					<event v-for="event in data.events"
						:event="event"
						:key="event.id"
						:parentType="'FAM'"
						:editing="true"></event>
					<button v-on:click="addEvent()" class="right"><i>add</i>Add Event</button>
				</div>
			</div>

			<div v-show="!editing">
				<i class="right" v-on:click="toggleEdit">edit</i>

				<h3>Parents</h3>
				<ul>
					<li v-for="p in resolvedParents">{{ p.fname }} <b>{{ p.lname }}</b></li>
				</ul>

				<h3>Children</h3>
				<ul>
					<li v-for="c in resolvedChildren">{{ c.fname }} <b>{{ c.lname }}</b></li>
				</ul>

				<h3>Events</h3>
				<div class="dates">
					<event v-for="event in data.events"
						:event="event"
						:key="event.id"
						:editing="false">
					</event>
				</div>

			</div>
		</div>`
});
