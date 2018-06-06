var app = new Vue({
	el: '#app',
	data: {
		title: "Default tree",
		author: "Martin",
		individuals: [],
		families: [],
		nodes: [],	// TODO: choose one or other
		links: [],
		selectedNode: null,
		fileToUpload: ""
	},
	mounted() {
		this.fetchTreeData();
	},
	methods: {
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
				Tree.addAllNodes();
				Tree.addAllEdges();
				Tree.clearGraph();
				Tree.layoutAndRender();
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
			if (matched.length > 0) this.selectedNode = matched[0];
		},

		selectNone() {
			this.selectedNode = null;
		},

		getFamilyById(id) {
			var matched = this.families.filter(n => n.id == id);
			return (matched.length > 0) ? matched[0] : null;
		},

		getIndividualById(id) {
			var matched = this.individuals.filter(n => n.id == id);
			return (matched.length > 0) ? matched[0] : null;
		},

		newIndividual() {
			var i = new Individual();
			console.log("Created i:", i);
			this.individuals.push(i);
			this.nodes.push(i);
			Tree.addIndividualNode(i);
			Tree.clearGraph();
			Tree.layoutAndRender();
		},

		newFamily() {
			var f = new Family();
			console.log("Created f:", f);
			this.families.push(f);
			this.nodes.push(f);
			Tree.addFamilyNode(f);
			Tree.clearGraph();
			Tree.layoutAndRender();
		},

		newLink(source, target) {
			this.links.push({});
			Tree.addEdge(source, target);
			Tree.clearGraph();
			Tree.layoutAndRender();
		}
	},
	computed: {

	}
});

var INDI_ID = 0;
var FAM_ID = 0;

/* TEMPORARY TEMPLATES */

class Individual {
	constructor() {
		return {
			id: "i_" + INDI_ID++,
			type: "INDI",
			fname: "",
			lname: "",
			sex: "unknown",
			events: []
		}
	}
}

class Family {
	constructor() {
		return {
			id: 'f_' + FAM_ID++,
			type: "FAM",
			husb: "",
			wife: "",
			children: [],
			married: "",
			events: []
		}
	}
}
