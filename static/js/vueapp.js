/* global Tree, axios */

var app = new Vue({ // eslint-disable-line no-unused-vars
    el: '#app',
    data: {
        meta: {
            title: "Default tree",
            author: "Martin"
        },
        tree: {
            individuals: [],
            families: [],
            links: []
        },
        selectedNode: null,
        homePerson: null,
        fileToUpload: "",
        individualId: 0,
        familyId: 0,
        eventId: 0,
        uploadDialogIsOpen: false
    },
    mounted() {
        this.fetchTreeData();
    },
    computed: {
        nodes() {
            return this.tree.individuals.concat(this.tree.families);
        },

        placeList() {
            var list = new Set();
            for (var n of this.nodes) {
                for (var e of n.events) {
                    if (e.place && e.place.length > 0) list.add(e.place);
                }
            }
            return Array.from(list);
        }
    },
    methods: {
        // Data
        fetchTreeData() {
            axios.get('/treedata')
                .then(response => {
                    console.log(response);
                    //this.nodes = response.data.nodes;
                    this.tree.individuals = response.data.nodes.filter(n => n.type === "INDI");
                    this.tree.families = response.data.nodes.filter(n => n.type === "FAM");
                    this.tree.links = response.data.links;
                    // Counters:
                    this.individualId = response.data.individualId;
                    this.familyId = response.data.familyId;
                    this.eventId = response.data.eventId;
                    // Now we can graph:
                    Tree.clearGraph();
                    Tree.addAllNodes();
                    Tree.addAllEdges();
                    Tree.layoutAndRender();
                })
                .catch(error => {
                    console.log(error);
                    this.notify('Problem fetching data. Please reload the page.', 'error');
                    this.errored = true;
                })
                .finally(() => {
                    this.loading = false;
                });
        },

        // Data
        storeFormFile() {
            this.fileToUpload = this.$refs.file.files[0];
        },

        // Data
        submitForm() {
            var formData = new FormData();
            formData.append('file', this.fileToUpload);
            axios.post('/upload', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            }).then(() => {
                console.log('Upload succeeded');
                this.notify('Upload successful.');
                this.fetchTreeData();
                this.fileToUpload = "";
            }).catch(err => {
                console.log('Upload failed', err);
                this.notify('Upload failed', 'error');
            });
        },

        // Tree
        selectNodeById(id) {
            var matched = this.nodes.filter(n => n.id === id);
            if (matched.length > 0) this.selectedNode = matched[0];
            Tree.centreNode(id);
        },

        // Tree
        selectNone() {
            this.selectedNode = null;
        },

        // Tree
        getFamilyById(id) {
            var matched = this.tree.families.filter(n => n.id === id);
            return (matched.length > 0) ? matched[0] : null;
        },

        // Tree
        getIndividualById(id) {
            var matched = this.tree.individuals.filter(n => n.id === id);
            return (matched.length > 0) ? matched[0] : null;
        },

        // Tree
        newIndividual() {
            var i = new Individual();
            console.log("Created i:", i);
            this.tree.individuals.push(i);
            Tree.addIndividualNode(i);
            Tree.layoutAndRender();
            Tree.selectNode(i.id);
            this.notify('Person created.');
            return i;
        },

        // Tree
        newFamily() {
            var f = new Family();
            console.log("Created f:", f);
            this.tree.families.push(f);
            Tree.addFamilyNode(f);
            Tree.layoutAndRender();
            Tree.selectNode(f.id);
            this.notify('Family created.');
            return f;
        },

        // Tree
        newLink(source, target) {
            console.log("Created link:", source, '->', target);
            this.tree.links.push({source, target});
            Tree.addEdge(source, target);
            Tree.layoutAndRender();
            this.notify('Link created.');
        },

        // Tree
        goHome() {
            console.log("Going Home");
            if (this.homePerson !== null) this.selectedNode = this.homePerson;
            Tree.redraw();
            Tree.centreNode(this.selectedNode.id);
        },

        // Tree
        setHomePerson() {
            this.homePerson = this.selectedNode;
            this.notify('Home Person set.');
        },

        // UI
        showUploadDialog() {
            this.uploadDialogIsOpen = true;
        },

        // UI
        hideUploadDialog() {
            this.uploadDialogIsOpen = false;
        },

        // UI
        notify(text, color = 'success') {
            this.$vs.notify({
                position: 'top-right',
                color: color,
                text: text
            });
        }
    }
});

/* TEMPORARY TEMPLATES */

class Individual {
    constructor() {
        return {
            id: "i_" + app.$data.individualId++,
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
            id: 'f_' + app.$data.familyId++,
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
    if (!date && date !== 0) return "?";
    if (typeof date === 'number') date = new Date(date);
    return date.getFullYear();
}

function fulldate(date) {
    if (!date && date !== 0) return "?";
    if (typeof date === 'number') date = new Date(date);
    var y = date.getFullYear(),
        m = (date.getMonth() + 1).toString().padStart(2, "0"),
        d = date.getDate().toString().padStart(2, "0");
    return `${y}-${m}-${d}`;
}
