Vue.component('person-line', {
	props: {
		fname: String,
		lname: String,
		events: Array
	},
	computed: {
		startDate() {
			// Birth, christening, baptism
			var birth = this.events.filter(e => e.type == "BIRT"),
				chr = this.events.filter(e => e.type == "CHR"),
				bap = this.events.filter(e => e.type == "BAPT");
			return (birth.length > 0) ? 'b. '+ fulldate(birth[0].date) :
					(chr.length > 0) ? 'chr. '+ fulldate(chr[0].date) :
					(bap.length > 0) ? 'bap. '+ fulldate(bap[0].date) : "";
		},

		endDate() {
			// Death, burial, cremation
			var death = this.events.filter(e => e.type == "DEAT"),
				bur = this.events.filter(e => e.type == "BURI"),
				crem = this.events.filter(e => e.type == "CREM");
			return (death.length > 0) ? 'd. '+ fulldate(death[0].date) :
					(bur.length > 0) ? 'bur. '+ fulldate(bur[0].date) :
					(crem.length > 0) ? 'crem. '+ fulldate(crem[0].date) : "";
		}
	},
	template: `
		<p class="personLine">
			{{ fname }} <b>{{ lname }}</b>
			<span>{{ startDate }}</span>
			<span>{{ endDate }}</span>
		</p>`
});
