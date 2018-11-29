<template>
  <v-app>
    <v-navigation-drawer 
      v-if="displayFrame"
      persistent
      right
      v-model="drawer"
      enable-resize-watcher
      app
    >
      <v-list>
        <v-list-tile
          value="true"
          v-for="(item, i) in items"
          :key="i"
          @click="$router.push(item.route)"
        >
          <v-list-tile-action>
            <v-icon v-html="item.icon"></v-icon>
          </v-list-tile-action>
          <v-list-tile-content>
            <v-list-tile-title v-text="item.title"></v-list-tile-title>
          </v-list-tile-content>
        </v-list-tile>
      </v-list>
    </v-navigation-drawer>
    <v-toolbar app v-if="displayFrame">
        <v-toolbar-side-icon @click.stop="drawer = !drawer"></v-toolbar-side-icon>
        <v-toolbar-title v-text="title"></v-toolbar-title>
        <v-spacer></v-spacer>
        <v-btn :loading="canSave === null" flat icon color="secondary" :disabled="!canSave" v-if="isSaveVisible" @click="onSave">
          <v-icon>{{canSave ? 'save' : 'done'}}</v-icon>
        </v-btn>
        {{uFullName}}
    </v-toolbar>
    <v-content>
      <router-view @canSaveChanged="setCanSave" ref="routerView"/>
    </v-content>
  </v-app>
</template>
<style scoped>
.v-toolbar__side-icon {
  margin-left: 6px !important;
}
.v-list__tile__title {
  text-align: right;
}
</style>

<script>
import ApiConsumer from './mixins/apiconsumer.mixin';
import config from './config.json';

const sessionStorageKeys = config.sessionStorageKeys;

export default {
  name: "App",
  computed: {
    /**
     * Should title bar and navigation drawer be displayed
     */
    displayFrame() {
      return this.$route.path != '/signin';
    },
    /**
     * Should save button be visible
     */
    isSaveVisible() {
      return this.$route.path == "/anticipated-payments" && sessionStorage.getItem(sessionStorageKeys.uIsSystemManager) == "true";
    }
  },
  data() {
    return {
      canSave: false,
      drawer: true,
      items: [
        {
          icon: "account_balance_wallet",
          title: "הכנסות",
          route: 'anticipated-payments'
        },
        {
          icon: "insert_drive_file",
          title: "דרישת תשלום חדשה",
          route: 'create-dp'
        }
      ],
      uFullName: sessionStorage.getItem(sessionStorageKeys.uFullName),
      right: true,
      title: "בנקיימא"
    };
  },
  methods: {
    /**
     * Sets the canSave data property according to the data from anticipated payments component.
     * @param {boolean} value Value to set
     */
    setCanSave(value) {
      this.canSave = value;
    },
    /**
     * Called when the user clicks the save button.
     */
    onSave() {
      this.$refs.routerView.savePaymentsDelta();
    }
  },
  mounted() {
    if (sessionStorage.getItem('jwt') == null) {
      this.$router.push("signin");
    } 
  },
  mixins: [ApiConsumer]
};
</script>
