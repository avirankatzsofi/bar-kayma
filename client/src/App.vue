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
    </v-toolbar>
    <v-content>
      <router-view/>
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
export default {
  name: "App",
  computed: {
    displayFrame() {
      return this.$route.path != '/signin';
    }
  },
  data() {
    return {
      drawer: true,
      items: [
        {
          icon: "account_balance_wallet",
          title: "תשלומים צפויים",
          route: 'anticipated-payments'
        },
        {
          icon: "insert_drive_file",
          title: "דרישת תשלום חדשה",
          route: 'create-dp'
        }
      ],
      right: true,
      title: "בנקיימא"
    };
  },
  mounted() {
    if (this.$root.$data.jwt == null) {
      this.$router.push("signin");
    } 
  },
  mixins: [ApiConsumer]
};
</script>
