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
  margin-left: 6px!important;
}
</style>

<script>

export default {
  name: 'App',
  data () {
    return {
      drawer: true,
      items: [{
        icon: 'bubble_chart',
        title: 'Inspire'
      }],
      right: true,
      displayFrame: true,
      title: 'בנקיימא'
    }
  },
  mounted() {
    this.displayFrame = this.$route.path != '/signin';
  }
}
</script>
