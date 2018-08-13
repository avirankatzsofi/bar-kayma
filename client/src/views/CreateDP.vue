<template>
  <v-container fluid fill-height>
    <v-slide-y-transition mode="out-in">
      <v-layout column align-center justify-center>
        <h2>כאן יופיע טופס ליצירת דרישת תשלום חדשה</h2>
      </v-layout>
    </v-slide-y-transition>
  </v-container>
</template>
<script>
import ApiConsumer from '../mixins/apiconsumer.mixin';
export default {
  mounted() {
    console.log(this.$root.$data.jwt);
  },
  mixins: [ApiConsumer]
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h1, h2 {
  font-weight: normal;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
</style>
