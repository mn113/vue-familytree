/* global fulldate */

Vue.component('person-line', {
    props: {
        id: String,
        fname: String,
        lname: String,
        events: Array
    },
    computed: {
        startDate() {
            // Birth, christening, baptism
            var birth = this.events.filter(e => e.type === "BIRT"),
                chr = this.events.filter(e => e.type === "CHR"),
                bap = this.events.filter(e => e.type === "BAPT");
            if (birth.length > 0) return 'b. ' + fulldate(birth[0].date);
            else if (chr.length > 0) return 'chr. ' + fulldate(chr[0].date);
            else if (bap.length > 0) return 'bap. ' + fulldate(bap[0].date);
            else return "";
        },

        endDate() {
            // Death, burial, cremation
            var death = this.events.filter(e => e.type === "DEAT"),
                bur = this.events.filter(e => e.type === "BURI"),
                crem = this.events.filter(e => e.type === "CREM");
            if (death.length > 0) return 'd. ' + fulldate(death[0].date);
            else if (bur.length > 0) return 'bur. ' + fulldate(bur[0].date);
            else if (crem.length > 0) return 'crem. ' + fulldate(crem[0].date);
            else return "";
        },

        hash() {
            // sanitize by deleting unwanteds & kebabing:
            return `#${this.fname}-${this.lname}`
                .toLowerCase()
                .replace(/['".,]/g, '')
                .replace(/[\s]/g, '-');
        }
    },
    template: `
    <p class="personLine">
        <a :href="hash" @click="$root.selectNodeById(id)">{{ fname }} <b>{{ lname }}</b></a>
        <span>{{ startDate }}</span>
        <span>{{ endDate }}</span>
    </p>`
});
