/* global */

Vue.component('tool-palette', {
    props: {
    },
    data() {
        return {};
    },
    template: `
    <div id="palette">
        <vs-button vs-type="dark-filled" vs-icon="person_add" @click="$emit('add-indi')"></vs-button>
        <vs-button vs-type="dark-filled" vs-icon="group_add" @click="$emit('add-fam')"></vs-button>
        <vs-button vs-type="dark-filled" vs-icon="zoom_in"></vs-button>
        <vs-button vs-type="dark-filled" vs-icon="zoom_out"></vs-button>
        <vs-button vs-type="dark-filled" vs-icon="content_cut"></vs-button>
        <vs-button vs-type="dark-filled" vs-icon="settings"></vs-button>
    </div>`
});
