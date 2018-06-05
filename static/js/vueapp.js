var app = new Vue({
	el: '#app',
	data: {
		title: "Default tree",
		author: "Martin",
		individuals: [],
		families: [],
		nodes: [],
		links: [],
		selectedNode: null,
		fileToUpload: ""
	},
	mounted() {
		this.fetchTreeData();
	},
	methods: {
		arrangeNodes() {

		},
		fetchTreeData() {
			axios
			.get('/treedata')
			.then(response => {
				console.log(response);
				this.nodes = response.data.nodes;
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
		storeFormFile() {
			this.fileToUpload = this.$refs.file.files[0];
		},
		submitForm() {
			var formData = new FormData();
			formData.append('file', this.fileToUpload);
			axios.post('/upload', formData,
				{
					headers: {
						'Content-Type': 'multipart/form-data'
					}
				}
			)
			.then(() => {
				console.log('Upload succeeded');
				this.fetchTreeData();
				this.fileToUpload = "";
			})
			.catch(err => console.log('Upload failed', err));
		},

		selectNodeById(id) {
			var matched = this.nodes.filter(n => n.id == id);
			console.log(matched);
			if (matched.length > 0) this.selectedNode = matched[0];
		},
		selectNone() {
			this.selectedNode = null;
		},

		newIndividual() {
			this.individuals.push(new Individual);
			// re-render
		},

		newFamily() {
			this.families.push(new Family);
			// re-render
		},

		newLink(source, target) {

		}
	},
	computed: {

	}
});

var INDI_ID = 0;
var FAM_ID = 0;

class Individual {
	construct() {
		return {
			id: INDI_ID++,
			type: "INDI",
			fname: "",
			lname: "",
			sex: "unknown",
			events: []
		}
	}
}

class Family {
	construct() {
		return {
			id: FAM_ID++,
			type: "FAM",
			husb: "",
			wife: "",
			married: "",
			events: []
		}
	}
}
