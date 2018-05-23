Vue.component('individual', {
	props: ['data'],
	template: `<figure :id="data.id" :class="data.sex">{{ data.fname }} {{ data.lname }}</figure>`
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
		groceryList: [
			{ id: 0, text: 'Vegetables', fname: 'Fred' },
			{ id: 1, text: 'Cheese' },
			{ id: 2, text: 'Whatever else humans are supposed to eat' }
		],
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
	}
})
