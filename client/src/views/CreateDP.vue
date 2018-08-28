<template>
  <v-container fluid fill-height>
    <v-slide-y-transition mode="out-in">
      <v-layout column align-center justify-center>
         <v-flex xs12 sm8 md4>
           <h1 class="ok-message">הטופס נשלח בהצלחה :)</h1>
              <v-form v-model="isFormValid">
                <v-text-field
                  name="to"
                  label="נמען"
                  v-model="recipientName"
                  :rules="requiredField"
                  required
                ></v-text-field>
                <v-text-field
                  v-model="recipientEmail"
                  :rules="emailRules"
                  label='דוא"ל נמען'
                  required
                ></v-text-field>
                <v-spacer></v-spacer>
                <v-flex xs12>
                  <v-dialog
                    ref="dialog"
                    v-model="modal"
                    :rules="requiredField"
                    :return-value.sync="date"
                    persistent
                    lazy
                    full-width
                    width="290px"
                  >
                    <v-text-field class="date-picker"
                      slot="activator"
                      v-model="date"
                      :rules="requiredField"
                      label="תאריך"
                      readonly
                    ></v-text-field>
                    <v-date-picker v-model="date" type="date" scrollable>
                      <v-spacer></v-spacer>
                      <v-btn flat color="primary" @click="modal = false">Cancel</v-btn>
                      <v-btn flat color="primary" @click="$refs.dialog.save(date)">OK</v-btn>
                    </v-date-picker>
                  </v-dialog>
                </v-flex>
                <v-textarea
                  outline
                  name="description"
                  v-model="description"
                  :rules="requiredField"
                  label="תיאור"
                ></v-textarea>
                <v-text-field
                  name="amount"
                  mask="#######"
                  v-model="amount"
                  :rules="requiredField"
                  label="סכום"
                  suffix="₪"
                ></v-text-field>
                
                <v-textarea
                  outline
                  name="comments"
                  v-model="comments"
                  label="הערות"
                ></v-textarea>
                <v-btn depressed :disabled="!isFormValid" color="primary" @click="submit">שליחה</v-btn>
              </v-form>
         </v-flex>
      </v-layout>
    </v-slide-y-transition>
  </v-container>
</template>

<script>
import ApiConsumer from "../mixins/apiconsumer.mixin";
export default {
  data: () => ({
    date: null,
    recipientName: "",
    recipientEmail: "",
    description: "",
    comments: "",
    amount: null,
    menu: false,
    modal: false,
    isFormValid: false,
    requiredField: [v => !!v || "שדה חובה"],
    email: "",
    emailRules: [
      v => !!v || "שדה חובה",
      v => /\S+@\S+\.\S+/.test(v) || "אימייל צריך להיות תקין"
    ]
  }),
  // mounted() {
  //   this.$validator.localize("en", this.dictionary);
  // },
  methods: {
    submit() {
      if (this.isFormValid) {
        this.submitDP(
          this.$root.$data.jwt,
          this.$root.$data.uid,
          this.recipientName,
          this.recipientEmail,
          this.date,
          this.description,
          this.amount,
          this.comments
        ).then(() => {
          document.querySelector('form').style.opacity = 0;
          setTimeout(() => {
            document.querySelector('form').style.height = 0;
            document.querySelector('.ok-message').style.opacity = 1;
          }, 500);
        });
      }
    }
  },
  mixins: [ApiConsumer]
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
form {
  transition: all 0.5s;
}
form * {
  width: 350px;
}
.date-picker input {
  text-align: center;
}
.ok-message {
  height: 0;
  opacity: 0;
  transition: all 0.5s;
}
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
