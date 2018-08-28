<template>
  <v-container fluid fill-height>
    <v-slide-y-transition mode="out-in">
      <v-layout column align-center justify-center>
         <v-flex xs12 sm8 md4>
        <img src="@/assets/logo.png" alt="Vuetify.js" class="mb-5">
        <v-form @submit.prevent="onLogin">
        <v-text-field
          name="username"
          label="שם משתמש"
          v-model="username"
          box
          prepend-icon="person"
        ></v-text-field>
        <v-text-field
          name="password"
          label="סיסמה"
          hint="לפחות 8 תווים"
          min="8"
          :append-icon="showPassword ? 'visibility' : 'visibility_off'"
          @click:append="() => (showPassword = !showPassword)"
          prepend-icon="lock"
          v-model="password"
          :rules="[() => ('שם המשתמש או הסיסמה אינם נכונים')]"
          :error="false"
          :type="showPassword ? 'text' : 'password'"
          box
        ></v-text-field>
        <v-layout
          column
          full-width
        >
        <v-btn type="submit" outline color="primary" dark class="loginBtn">כניסה</v-btn>
        </v-layout>
        </v-form>
         </v-flex>
      </v-layout>
    </v-slide-y-transition>
  </v-container>
</template>
<script>
import ApiConsumer from '../mixins/apiconsumer.mixin';
export default {
  data() {
    return {
      username: "",
      password: "",
      showPassword: false,
      signInFormValid: true
    };
  },
  methods: {
    onLogin() {
      this.login(this.username, this.password).then(() => this.$router.push('anticipated-payments'));
    }
  },
  mixins: [ApiConsumer]
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h1,
h2 {
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
