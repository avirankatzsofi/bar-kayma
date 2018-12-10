<template>
  <v-container fill-height>
    <v-slide-y-transition mode="out-in">
      <v-layout row wrap>
        <v-flex xs12 md3 offset-md1>
          <v-select
            :items="[{text: 'הכל', value: null}, ...selects.statuses]"
            v-model="filter.status"
            label="סטטוס"
          ></v-select>
        </v-flex>
        <v-flex xs12 md3 offset-md1>
          <v-menu
            ref="startDateMenu"
            :close-on-content-click="false"
            v-model="startDateMenu"
            :nudge-right="40"
            lazy
            transition="scale-transition"
            offset-y
            full-width
            max-width="290px"
            min-width="290px"
          >
            <v-text-field slot="activator" v-model="startDateFormatted" label="מתאריך"></v-text-field>
            <v-date-picker v-model="filter.startDateISO" no-title @input="startDateMenu = false"></v-date-picker>
          </v-menu>
        </v-flex>
        <v-flex xs12 md3>
          <v-menu
            ref="endDateMenu"
            :close-on-content-click="false"
            v-model="endDateMenu"
            :nudge-right="40"
            lazy
            transition="scale-transition"
            offset-y
            full-width
            max-width="290px"
            min-width="290px"
          >
            <v-text-field slot="activator" v-model="endDateFormatted" label="עד תאריך"></v-text-field>
            <v-date-picker v-model="filter.endDateISO" no-title @input="endDateMenu = false"></v-date-picker>
          </v-menu>
        </v-flex>
        <v-flex xs12 md12></v-flex>
        <v-flex xs12 md12></v-flex>
        <v-flex xs12 md12></v-flex>
        <v-flex xs12 md12>
          <v-card>
            <v-card-title>
              <span v-if="!uIsSystemManager">פרויקט: {{project}}</span>
              <span v-else>
                <v-select :items="selects.projects" v-model="filter.project" label="פרויקט"></v-select>
              </span>
              <v-spacer></v-spacer>
              <v-text-field v-model="filter.search" append-icon="search" label="חיפוש" single-line></v-text-field>
            </v-card-title>
            <v-data-table
              :headers="headers"
              :items="filteredPayments"
              class="responsive-table"
              :search="filter.search"
              :rows-per-page-items="[10]"
              no-results-text="לא נמצאו תשלומים"
            >
              <template slot="items" slot-scope="props">
                <tr @click="onRowClick(props)">
                  <td>{{ props.item.placeInLine }}</td>
                  <td>{{ selects.statuses.find(status => status.value === props.item.status).text }}</td>
                  <td>{{ new Date(props.item.date).toLocaleDateString('he') }}</td>
                  <td>{{ props.item.amount }}</td>
                  <td>{{ props.item.recipientName }}</td>
                  <td>{{ props.item.description }}</td>
                  <td>{{ props.item.sumPayed }}</td>
                  <td>{{ props.item.paymentDate === null ? null : new Date(props.item.paymentDate).toLocaleDateString('he')}}</td>
                  <td>
                    <a :href="apiUrl + '/dp/' + props.item._id + '.pdf'" target="blank">כניסה לקובץ</a>
                  </td>
                </tr>
              </template>
              <template slot="expand" slot-scope="props">
                <v-card flat>
                  <v-card-text>
                    <v-layout align-center row wrap justify-space-around>
                      <v-flex xs12 md3>
                        <v-select
                          :items="selects.statuses"
                          v-model="currentExpandedPayment.status"
                          @change="onPaymentEdited"
                          label="סטטוס"
                          :disabled="!uIsSystemManager"
                        ></v-select>
                      </v-flex>
                      <v-flex xs12 md3>
                        <v-text-field
                          name="amount"
                          label="סכום ששולם"
                          suffix="₪"
                          :rules="amountRules"
                          type="number"
                          v-model.number="currentExpandedPayment.sumPayed"
                          @input="onPaymentEdited"
                          :disabled="!uIsSystemManager"
                        ></v-text-field>
                      </v-flex>
                      <v-flex xs12 md3>
                        <v-text-field
                          name="receiptNumber"
                          label="מספר קבלה"
                          mask="#######"
                          v-model="currentExpandedPayment.receiptNumber"
                          @input="onPaymentEdited"
                          :disabled="!uIsSystemManager"
                        ></v-text-field>
                      </v-flex>
                    </v-layout>
                    <v-layout row wrap justify-space-around>
                      <v-flex xs12 md3>
                        <v-select
                          :disabled="!uIsSystemManager"
                          :items="selects.paymentTypes"
                          v-model="currentExpandedPayment.type"
                          @change="onPaymentEdited"
                          label="אופן תשלום"
                        ></v-select>
                      </v-flex>
                      <v-flex xs12 md3>
                        <v-select
                          :disabled="!uIsSystemManager"
                          :items="selects.accountNumbers"
                          v-model="currentExpandedPayment.accountNumber"
                          @change="onPaymentEdited"
                          label="סעיף תקציבי"
                        ></v-select>
                      </v-flex>
                      <v-flex xs12 md3>
                        <v-menu
                          ref="paymentDateMenu"
                          :close-on-content-click="false"
                          v-model="paymentDateMenu"
                          :nudge-right="40"
                          :disabled="!uIsSystemManager"
                          lazy
                          transition="scale-transition"
                          offset-y
                          full-width
                          max-width="290px"
                          min-width="290px"
                        >
                          <v-text-field
                            slot="activator"
                            v-model="currentExpandedPaymentDateFormatted"
                            @blur="onPaymentEdited"
                            label="תאריך תשלום"
                            :disabled="!uIsSystemManager"
                          ></v-text-field>
                          <v-date-picker
                            v-model="currentExpandedPayment.paymentDate"
                            no-title
                            @input="paymentDateMenu = false"
                          ></v-date-picker>
                        </v-menu>
                      </v-flex>
                    </v-layout>
                    <v-layout row wrap justify-space-around>
                      <v-flex xs12 md3>
                        <v-text-field
                          slot="activator"
                          v-model="props.item.recipientEmail"
                          @blur="onPaymentEdited"
                          label="אימייל נמען"
                          :disabled="!uIsSystemManager"
                        ></v-text-field>
                      </v-flex>
                      <v-flex xs12 md3></v-flex>
                      <v-flex xs12 md3></v-flex>
                    </v-layout>
                  </v-card-text>
                </v-card>
              </template>
            </v-data-table>
          </v-card>
        </v-flex>
        <v-flex xs12 md12></v-flex>
        <v-flex xs12 md12></v-flex>
        <v-flex xs12 md12></v-flex>
        <v-flex xs12 md12>
          <h1 class="display-1 text-sm-left">סה"כ: {{total}} ש"ח</h1>
        </v-flex>
      </v-layout>
    </v-slide-y-transition>
  </v-container>
</template>
<script>
import ApiConsumer from "../mixins/apiconsumer.mixin";
import * as config from "../config.json";

export default {
  data() {
    return {
      project: sessionStorage.getItem(config.sessionStorageKeys.uProject),
      apiUrl: config.apiUrl,

      headers: [
        { text: "", value: "" },
        { text: "סטטוס", value: "status" },
        { text: "תאריך", value: "date" },
        { text: "סכום דרישה (₪)", value: "amount" },
        { text: "שם נמען", value: "recipientName" },
        { text: "תיאור", value: "description" },
        { text: "סכום ששולם", value: "sumPayed" },
        { text: "תאריך תשלום", value: "paymentDate" },
        { text: "קובץ", value: "_id" }
      ],
      payments: [],
      filter: {
        startDateISO: null,
        endDateISO: null,
        status: null,
        startDateFormatted: "",
        project: null,
        search: null
      },
      selects: {
        projects: [{ text: "הכל", value: null }],
        statuses: [
          { value: "Payed", text: "שולם" },
          { value: "Unpayed", text: "לא שולם" },
          { value: "Cancelled", text: "מבוטל" }
        ],
        paymentTypes: [
          { value: "Cheque", text: "צ'ק" },
          { value: "Bank Transfer", text: "העברה בנקאית" },
          { value: "Cash", text: "מזומן" },
          { value: "Defrayal", text: "סליקה" },
          { value: "Eventer", text: "Eventer" },
          { value: "Other", text: "אחר" }
        ],
        accountNumbers: null
      },
      search: "",
      startDateMenu: null,
      endDateMenu: null,
      paymentDateMenu: null,
      uIsSystemManager:
        sessionStorage.getItem(config.sessionStorageKeys.uIsSystemManager) ==
        "true",
      currentExpandedPayment: null,
      paymentsDelta: {},
      amountRules: [
        v => !!v || "שדה חובה",
        v => /^\d+(\.\d{1,2})?$/.test(v) || "סכום לא תקין"
      ]
    };
  },
  methods: {
    /**
     * Called when a row is clicked.
     * @param {any} props props object of the clicked row, which contains the payment object and the expanded state
     */
    onRowClick(props) {
      props.expanded = !props.expanded;
      if (props.expanded) {
        this.currentExpandedPayment =
          this.paymentsDelta[props.item.id] ||
          JSON.parse(JSON.stringify(props.item));
      } else {
        this.currentExpandedPayment = null;
      }
    },
    /**
     * Called when the user expands and edits a paymen
     */
    onPaymentEdited() {
      if (!this.paymentsDelta[this.currentExpandedPayment.id])
        this.paymentsDelta[
          this.currentExpandedPayment.id
        ] = this.currentExpandedPayment;
      this.$emit("canSaveChanged", true);
    },
    /**
     * Sends an API call to save the payments delta
     */
    async savePaymentsDelta() {
      this.$emit("canSaveChanged", null);
      await this.updateAnticipatedPayments(Object.values(this.paymentsDelta));
      this.paymentsDelta = {};
      this.payments = (await this.getAnticipatedPayments()).data;
      this.$emit("canSaveChanged", false);
    }
  },
  async mounted() {
    this.$emit("canSaveChanged", false);
    this.payments = (await this.getAnticipatedPayments()).data;
    if (this.uIsSystemManager) {
      let uniqueProjects = {};
      this.payments.forEach(payment => {
        const project = payment.user.project;
        const projectCode = payment.user.projectCode;
        if (!uniqueProjects[projectCode]) {
          uniqueProjects[projectCode] = true;
          this.selects.projects.push({
            text: project,
            value: projectCode
          });
        }
      });
      this.selects.accountNumbers = await this.getAccountNumbers();
    }
  },
  computed: {
    endDateFormatted() {
      return (
        this.filter.endDateISO &&
        new Date(this.filter.endDateISO).toLocaleDateString("he-IL")
      );
    },
    startDateFormatted() {
      return (
        this.filter.startDateISO &&
        new Date(this.filter.startDateISO).toLocaleDateString("he-IL")
      );
    },
    currentExpandedPaymentDateFormatted() {
      return this.currentExpandedPayment.paymentDate
        ? new Date(this.currentExpandedPayment.paymentDate).toLocaleDateString(
            "he"
          )
        : null;
    },
    total() {
      return this.filteredPayments
        .reduce((p1, p2) => p1 + p2.amount, 0)
        .toFixed(2);
    },
    filteredPayments() {
      return this.payments.filter(payment => {
        const statusFilterPassed =
          !this.filter.status || payment.status == this.filter.status;
        const startDateFilterPassed =
          !this.filter.startDateISO ||
          new Date(this.filter.startDateISO) <=
            new Date(
              this.filter.status == "Payed" ? payment.paymentDate : payment.date
            );
        const endDateFilterPassed =
          !this.filter.endDateISO ||
          new Date(this.filter.endDateISO) >=
            new Date(
              this.filter.status == "Payed" ? payment.paymentDate : payment.date
            );
        const projectFilterPassed =
          !this.filter.project ||
          this.filter.project === payment.user.projectCode;
          // console.log(this.payment.paymentDate)
        // const searchFilterPassed =
        //   !this.search ||
        //   this.filter.project === payment.user.projectCode;
        //   console.log(!this.search)
        // console.log(this.filteredPayments)
        return (
          statusFilterPassed &&
          startDateFilterPassed &&
          endDateFilterPassed &&
          projectFilterPassed 
          // searchFilterPassed
        );
      });
    }
  },
  mixins: [ApiConsumer]
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.responsive-table {
  max-width: 100%;
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
