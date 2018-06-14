/* global */

Vue.component('editable-text', {
    model: {
        prop: 'value',
        event: 'update'
    },
    props: {
        value: String
    },
    data() {
        return {
            editing: false
        };
    },
    methods: {
        toggleEdit() {
            this.editing = !this.editing;
        },

        emitUpdate() {
            this.$emit('update', this.$refs.input.value);
            return true;
        }
    },
    template: `
        <span class="editableText" v-if="editing">
            <input :value="value" ref="input">
            <i @click="emitUpdate() && toggleEdit()">save</i>
        </span>

        <span class="editableText" v-else>
            <span>{{ value }}</span>
            <i @click="toggleEdit">edit</i>
        </span>`
});
