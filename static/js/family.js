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
