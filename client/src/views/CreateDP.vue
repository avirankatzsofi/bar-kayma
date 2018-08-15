<template>
  <v-container fluid fill-height>
    <v-slide-y-transition mode="out-in">
      <v-layout column align-center justify-center>
         <v-flex xs12 sm8 md4>
              <v-form v-model="valid">
                <v-text-field
                  name="to"
                  label="נמען"
                  v-model="recipient"
                  :rules="requiredField"
                ></v-text-field>
                <v-text-field
                  v-model="recipient_email"
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
                      prepend-icon="event"
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
                <v-btn @click="submit">שליחה</v-btn>
              </v-form>
         </v-flex>
      </v-layout>
    </v-slide-y-transition>
  </v-container>
</template>

<script>
import ApiConsumer from '../mixins/apiconsumer.mixin';
import Vue from 'vue'
import VeeValidate from 'vee-validate'
  Vue.use(VeeValidate)
export default {
  $_veeValidate: {
    validator: 'new'
  },
  data: () => ({
    date: null,
    recipient:"",
    recipient_email:"",
    description:"",
    comments:"",
    amount: null,
    menu: false,
    modal: false,
    valid: false,
      requiredField: [
        v => !!v || 'שדה חובה',
      ],
      email: '',
      emailRules: [
        v => !!v || 'שדה חובה',
        v => /.+@.+/.test(v) || 'אימייל צריך להיות תקין'
      ]
  }),
  mounted() {
    console.log(this.$root.$data.jwt);
    this.$validator.localize('en', this.dictionary)
  },
  methods: {
    submit () {
      this.$validator.validateAll()
    },
  },
  mixins: [ApiConsumer]
}

</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
form{
    width:400px;
}
.date-picker input{
    text-align:center;
}
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
