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
	<figure :id="data.id" :class="data.sex" class="person">
		<div v-show="editing">
			<i v-on:click="toggleEdit">Close</i>
			<label for="fname">First name(s)</label><input name="fname" :value="data.fname">
			<label for="lname">Surname(s)</label><input name="lname" :value="data.lname">
			<div class="dates">
				<div v-for="event, key in data.events" class="dates">
					<label for="data">Date</label><input :value="event.date">
					<label for="place">Place</label><input :value="event.place">
				</div>
				<!-- TODO: add/remove buttons -->
			</div>
		</div>
		<div v-show="!editing">
			<i v-on:click="toggleEdit">Edit</i>
			<span class="name">{{ data.fname }} <b>{{ data.lname }}</b></span>
			<div v-for="event, key in data.events" class="dates">
				<p>{{ key }}.
					<span v-if="event.date">{{ event.date }}</span>
					<span v-if="event.place">{{ event.place }}</span>
				</p>
			</div>
		</div>
	</figure>`
});

Vue.component('family', {
	props: {
		'data': Object,
		'editMode': false
	},
	template: `
	<figure :id="data.id" class="family">
		{{ data.husband }} + {{ data.wife }}<br>
		{{ data.married }}<br>
		<span v-if="data.children.length == 1">1 child</span>
		<span v-if="data.children.length > 1">{{ data.children.length }} children</span>
	</figure>`
});

var app = new Vue({
	el: '#app',
	data: {
		title: "Default tree",
		author: "Martin",
		individuals: [],
		families: [],
		links: []
	},
	mounted() {
		axios
		.get('/treedata')
		.then(response => {
			console.log(response);
			this.individuals = response.data.nodes.filter(n => n.type == "INDI");
			this.families = response.data.nodes.filter(n => n.type == "FAM");
			this.links = response.data.links;
			// Now we can graph:
			addNodes();
			addEdges();
			layoutAndRender();
		})
		.catch(error => {
			console.log(error);
			this.errored = true;
		})
		.finally(() => this.loading = false);
	},
	methods: {
		arrangeNodes() {

		}
	},
	computed: {

	}
})
