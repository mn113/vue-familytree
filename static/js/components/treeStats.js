/* global */

Vue.component('tree-stats', {
    props: {
        title: String,
        author: String,
        individuals: Array
    },
    computed: {
        totalPeople() {
            return this.individuals.length;
        },

        totalFamilies() {

        },

        females() {
            return this.individuals.filter(i => i.sex === 'F').length;
        },

        males() {
            return this.individuals.filter(i => i.sex === 'M').length;
        },

        surnamesRank() {
            var count = {};
            for (var ind of this.individuals) {
                if (ind.lname.length === 0) continue;
                if (count[ind.lname] === undefined) count[ind.lname] = 1;
                else count[ind.lname]++;
            }
            var sortedKeys = Object.keys(count).sort((key1, key2) => count[key2] - count[key1]);
            return sortedKeys.map(k => [k, count[k]]);
        },

        totalSurnames() {
            return this.surnamesRank.length;
        }
    },
    template: `
    <div class="treeStats">
        <h2><input v-model="title"></input></h2>
        <h4>by <input v-model="author"></input></h4>
        <p>People: {{ totalPeople }}</p>
        <p>Males: {{ males }}</p>
        <p>Females: {{ females }}</p>
        <p>Unique surnames: {{ totalSurnames }}</p>
        <p>Surnames: {{ surnamesRank.toString() }}</p>
    </div>`
});
