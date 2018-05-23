Vue.component('individual', {
	props: ['data'],
	template: `<figure :id="data.id" :class="data.sex">
		<span class="name">{{ data.fname }} {{ data.lname }}</span>
		<p class="dates" v-if="data.events">
			<!-- birth or bapt or chr TODO: v-for event in ['birth','bap','chr','death','bur','crem']-->
			<p v-if="data.events.birth">b.
				<span v-if="data.events.birth.date">{{ data.events.birth.date }}</span>
				<span v-if="data.events.birth.place">{{ data.events.birth.place }}</span>
			</p>
			<span v-else-if="data.events.baptism">bap.</span>
			<span v-else-if="data.events.christening">chr.</span>
			<!-- death or bur or crem -->
			<p v-if="data.events.death">d.
				<span v-if="data.events.death.date">{{ data.events.death.date }}</span>
				<span v-if="data.events.death.place">{{ data.events.death.place }}</span>
			</p>
			<span v-else-if="data.events.burial">bur.</span>
			<span v-else-if="data.events.cremation">crem.</span>
		</p>
	</figure>`
});

Vue.component('family', {
	props: ['data'],
	template: `<figure :id="data.id">
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
		individuals: [
			{
				fname: 'John',
				lname: 'Smith',
				sex: 'M',
				famsHeadOf: [ '@F1@' ],
				famsChildOf: null,
				id: '@I1@'
			},
			{
				fname: 'Elizabeth',
				lname: 'Stansfield',
				sex: 'F',
				famsHeadOf: [ '@F1@' ],
				famsChildOf: null,
				id: '@I2@'
			},
			{
				fname: 'James',
				lname: 'Smith',
				sex: 'M',
				famsHeadOf: null,
				famsChildOf: '@F1@',
				id: '@I3@'
			}

		],
		families: [
			{
				husband: '@I1@',
				wife: '@I2@',
				married: '',
				children: [ '@I3@' ],
				id: '@F1@'
			}
		]
	},
	mounted() {
		axios
		.get('/treedata')
		.then(response => {
			this.individuals = response.data.people;
			this.families = response.data.families;
		})
		.catch(error => {
			console.log(error);
			this.errored = true;
		})
		.finally(() => this.loading = false);
	}
})
