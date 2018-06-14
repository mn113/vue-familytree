/* global */

Vue.component('topbar', {
    data() {
        return {
            barStyle: {
                'justify-content': 'space-between'
            }
        };
    },
    template: `
        <vs-topbar vs-color="primary" :style="barStyle">
            <vs-button vs-color-text="rgb(255, 255, 255)" vs-color="rgba(255, 255, 255, 0.3)" vs-type="dark-flat" vs-radius="50%" vs-icon="menu"></vs-button>

            <h1>Family Tree Editor</h1>

            <vs-dropdown class="right" vs-trigger-click>
                <vs-button vs-color-text="rgb(255, 255, 255)" vs-color="rgba(255, 255, 255, 0.3)" vs-type="dark-flat" vs-radius="50%" vs-icon="more_vert" style="margin-left: auto;"></vs-button>
                <vs-dropdown-menu :style="{width: '15em'}">
                    <vs-dropdown-item>
                        <vs-button
                            vs-type="dark-border"
                            vs-icon="create_new_folder"
                            @click="$root()">
                            New Tree
                        </vs-button>
                    </vs-dropdown-item>
                    <vs-dropdown-item>
                        <vs-button
                            vs-type="dark-border"
                            vs-icon="cloud_upload"
                            @click="$root.showUploadDialog()">
                            Upload GEDCOM file
                        </vs-button>
                    </vs-dropdown-item>
                    <vs-dropdown-item>
                        <vs-button
                            vs-type="dark-border"
                            vs-icon="cloud_download"
                            @click="$root()">
                            Export GEDCOM file
                        </vs-button>
                    </vs-dropdown-item>
                    <vs-dropdown-item>
                        <vs-button
                            vs-type="dark-border"
                            vs-icon="settings"
                            @click="$root.settingsDialog()">
                            Settings
                        </vs-button>
                    </vs-dropdown-item>
                </vs-dropdown-menu>
            </vs-dropdown>
        </vs-topbar>`
});
