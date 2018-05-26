const gedcom2en = {
	"BIRT": "birth",
	"BAPM": "baptism",
	"CHR": "christening",
	"CHRA": "adult christening",
	"DEAT": "death",
	"BURI": "burial",
	"CREM": "cremation"
};

var app = new Vue({
	el: '#app',
	data: {
		title: "Default tree",
		author: "Martin",
		individuals: [],
		families: [],
		links: [],
		editingNode: null
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
});
