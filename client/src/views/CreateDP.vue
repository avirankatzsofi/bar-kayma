<template>
  <v-container fluid fill-height>
    <v-slide-y-transition mode="out-in">
      <v-layout column align-center justify-center>
        <v-flex xs12 sm8 md4>
          <h1 class="ok-message" v-if="isFormSubmitted">
            הטופס נשלח לכתובת {{recipientEmail}}
            <br>
            <a :href="pdfLink" target="blank">לצפייה לחץ כאן</a>
          </h1>
          <v-form v-model="isFormValid">
            <v-select
              v-if="uIsSystemManager"
              :rules="requiredField"
              required
              outline
              :items="users"
              item-text="project"
              return-object
              v-model="selectedUser"
              label="פרויקט"
            ></v-select>
            <v-text-field v-else outline name="project" label="פרויקט" v-model="project" disabled></v-text-field>
            <v-text-field
              outline
              name="to"
              label="שם הלקוח"
              v-model="recipientName"
              :rules="requiredField"
              required
            ></v-text-field>
            <v-text-field
              outline
              v-model="contactName"
              :rules="requiredField"
              label="איש קשר"
              required
            ></v-text-field>
            <v-text-field
              outline
              v-model="recipientEmail"
              :rules="emailRules"
              label="דוא&quot;ל נמען"
              required
            ></v-text-field>
            <v-spacer></v-spacer>
            <v-textarea
              outline
              name="description"
              v-model="description"
              :rules="requiredField"
              label="תיאור"
            ></v-textarea>
            <v-text-field
              outline
              name="amount"
              type="number"
              v-model="amount"
              :rules="amountRules"
              label="סכום"
              suffix="₪"
            ></v-text-field>
            <v-textarea outline name="comments" v-model="comments" label="הערות"></v-textarea>
            <v-btn depressed :disabled="!isFormValid" color="primary" @click="submit">שליחה</v-btn>
          </v-form>
        </v-flex>
      </v-layout>
    </v-slide-y-transition>
  </v-container>
</template>

<script>
import ApiConsumer from "../mixins/apiconsumer.mixin";
import { SessionStorageKeys, ConfigKeys } from "../constants";
import helpersMixin from "../mixins/helpers.mixin";
export default {
  computed: {
    project() {
      return this.getSessionStorageItem(SessionStorageKeys.U_PROJECT);
    }
  },
  data() {
    return {
      contactName: "",
      date: new Date().toISOString().split("T")[0],
      recipientName: "",
      recipientEmail: "",
      description: "",
      comments: "",
      amount: null,
      pdfLink: "",
      menu: false,
      /**
       * @type any[]
       */
      users: [],
      selectedUser: null,
      modal: false,
      isFormSubmitted: false,
      isFormValid: false,
      requiredField: [v => !!v || "שדה חובה"],
      email: "",
      emailRules: [
        v => !!v || "שדה חובה",
        v => /\S+@\S+\.\S+/.test(v) || "אימייל צריך להיות תקין"
      ],
      amountRules: [
        v => !!v || "שדה חובה",
        v => /^\d+(\.\d{1,2})?$/.test(v) || "סכום לא תקין"
      ]
    };
  },
  methods: {
    async submit() {
      const index = await this.getNextSequence();
      if (this.isFormValid) {
        this.submitDP(
          this.contactName,
          this.recipientName,
          this.recipientEmail,
          this.date,
          this.description,
          this.amount,
          this.comments,
          index,
          this.selectedUser != null ? this.selectedUser : null
        ).then(result => {
          this.isFormSubmitted = true;
          this.pdfLink = `${this.getConfiguration(ConfigKeys.API_URL)}/dp/${
            result.data.id
          }.pdf`;
          document.querySelector("form").style.opacity = 0;
          setTimeout(() => {
            document.querySelector("form").style.height = 0;
            document.querySelector(".ok-message").style.opacity = 1;
            document.querySelector(".ok-message").style.width = "auto";
          }, 500);
        });
      }
    }
  },
  async mounted() {
    if (this.uIsSystemManager) {
      this.users = await this.getUsers();
    }
  },
  mixins: [ApiConsumer, helpersMixin]
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
form {
  transition: all 0.5s;
  overflow: hidden;
}
form * {
  width: 350px;
  max-width: 100%;
  margin: auto;
}
.date-picker input {
  text-align: center;
}
.ok-message {
  height: 0;
  opacity: 0;
  width: 0;
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
