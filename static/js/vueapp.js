/* global Tree, axios */

var app = new Vue({ // eslint-disable-line no-unused-vars
    el: '#app',
    data: {
        title: "Default tree",
        author: "Martin",
        individuals: [],
        families: [],
        //nodes: [],	// TODO: choose one or other
        links: [],
        selectedNode: null,
        fileToUpload: ""
    },
    mounted() {
        this.fetchTreeData();
    },
    computed: {
        nodes() {
            return this.data.individuals.concat(this.data.families);
        },

        placeList() {
            var list = new Set();
            for (var n of this.nodes) {
                for (var e of n.events) {
                    if (e.place && e.place.length > 0) list.add(e.place);
                }
            }
            return list;
        }
    },
    methods: {
        fetchTreeData() {
            axios.get('/treedata')
                .then(response => {
                    console.log(response);
                    //this.nodes = response.data.nodes;
                    this.individuals = response.data.nodes.filter(n => n.type === "INDI");
                    this.families = response.data.nodes.filter(n => n.type === "FAM");
                    this.links = response.data.links;
                    // Now we can graph:
                    Tree.addAllNodes();
                    Tree.addAllEdges();
                    Tree.layoutAndRender();
                })
                .catch(error => {
                    console.log(error);
                    this.errored = true;
                })
                .finally(() => {
                    this.loading = false;
                });
        },

        storeFormFile() {
            this.fileToUpload = this.$refs.file.files[0];
        },

        submitForm() {
            var formData = new FormData();
            formData.append('file', this.fileToUpload);
            axios.post('/upload', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            }).then(() => {
                console.log('Upload succeeded');
                this.fetchTreeData();
                this.fileToUpload = "";
            }).catch(err => console.log('Upload failed', err));
        },

        selectNodeById(id) {
            var matched = this.individuals.concat(this.families).filter(n => n.id === id);
            if (matched.length > 0) this.selectedNode = matched[0];
        },

        selectNone() {
            this.selectedNode = null;
        },

        getFamilyById(id) {
            var matched = this.families.filter(n => n.id === id);
            return (matched.length > 0) ? matched[0] : null;
        },

        getIndividualById(id) {
            var matched = this.individuals.filter(n => n.id === id);
            return (matched.length > 0) ? matched[0] : null;
        },

        newIndividual() {
            var i = new Individual();
            console.log("Created i:", i);
            this.individuals.push(i);
            //this.nodes.push(i);
            Tree.addIndividualNode(i);
            Tree.layoutAndRender();
        },

        newFamily() {
            var f = new Family();
            console.log("Created f:", f);
            this.families.push(f);
            //this.nodes.push(f);
            Tree.addFamilyNode(f);
            Tree.layoutAndRender();
        },

        newLink(source, target) {
            console.log("Created link:", source, '->', target);
            this.links.push({source, target});
            Tree.addEdge(source, target);
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
            fname: "New",
            lname: "Person",
            sex: "unknown",
            events: [],
            famsHeadOf: [],
            famsChildOf: []
        };
    }
}

class Family {
    constructor() {
        return {
            id: 'f_' + FAM_ID++,
            type: "FAM",
            married: "unknown",
            events: [],
            parents: [],
            children: []
        };
    }
}

/* UTILITY FUNCTIONS */

function year(date) {
    if (date === undefined || date.length === 0) return "?";
    if (typeof date === 'number') date = new Date(date);
    return date.getFullYear();
}

function fulldate(date) {
    if (date === undefined || date.length === 0) return "?";
    if (typeof date === 'number') date = new Date(date);
    var y = date.getFullYear(),
        m = (date.getMonth() + 1).toString().padStart(2, "0"),
        d = date.getDate().toString().padStart(2, "0");
    return `${y}-${m}-${d}`;
}
