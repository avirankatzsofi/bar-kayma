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
      <div v-if="isAnticipatedPaymentActionsVisible">
        <v-btn
          v-if="uIsSystemManager"
          :loading="canSave === null"
          flat
          icon
          color="secondary"
          :disabled="!canSave"
          @click="onSave"
        >
          <v-icon>{{canSave ? 'save' : 'done'}}</v-icon>
        </v-btn>
      </div>
      <div>
        <v-menu>
          <v-btn flat icon color="secondary" slot="activator">
            <v-icon>account_circle</v-icon>
          </v-btn>
          <v-card>
            <v-card-title primary-title>
              <div>
                <h3 class="subheader mb-0 font-weight-regular indigo--text">{{uFullName}}</h3>
                <div class="teal--text">{{uProject}}</div>
              </div>
            </v-card-title>
            <v-list>
              <v-list-tile @click="logout">
                <v-list-tile-title>התנתק</v-list-tile-title>
              </v-list-tile>
            </v-list>
          </v-card>
        </v-menu>
      </div>
    </v-toolbar>
    <v-content>
      <router-view @canSaveChanged="setCanSave" ref="routerView"/>
    </v-content>
  </v-app>
</template>
<style scoped>
/*noinspection CssUnusedSymbol*/
.v-toolbar__side-icon {
  margin-left: 6px !important;
}

/*noinspection CssUnusedSymbol*/
.v-list__tile__title {
  text-align: right;
}
</style>

<script>
import ApiConsumer from "./mixins/apiconsumer.mixin";
import { SessionStorageKeys } from "./constants";
import helpersMixin from "./mixins/helpers.mixin";

export default {
  name: "App",
  computed: {
    /**
     * Should title bar and navigation drawer be displayed
     */
    displayFrame() {
      return this.$route.path !== "/signin";
    },
    /**
     * Should anticipated payments buttons be visible
     */
    isAnticipatedPaymentActionsVisible() {
      return this.$route.path === "/anticipated-payments";
    },
    uFullName() {
      return this.displayFrame
        ? this.getSessionStorageItem(SessionStorageKeys.U_FULLNAME)
        : null;
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
          route: "anticipated-payments"
        },
        {
          icon: "insert_drive_file",
          title: "דרישת תשלום חדשה",
          route: "create-dp"
        }
      ],
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
    },
    /**
     * Removes the JWT and redirects to sign in view
     */
    logout() {
      this.removeSessionStorageItem(SessionStorageKeys.JWT);
      this.$router.push("/signin");
    }
  },
  mounted() {
    if (this.getSessionStorageItem(SessionStorageKeys.JWT) == null) {
      this.$router.push("signin");
    }
  },
  mixins: [ApiConsumer, helpersMixin]
};
</script>
