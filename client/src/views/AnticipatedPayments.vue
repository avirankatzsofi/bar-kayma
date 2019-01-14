<template>
  <v-container fill-height>
    <v-slide-y-transition mode="out-in">
      <v-layout row wrap>
        <v-flex md3 offset-md1 xs12>
          <v-select
            :items="[{text: 'הכל', value: null}, ...selects.statuses]"
            label="סטטוס"
            v-model="filter.status"
          ></v-select>
        </v-flex>
        <v-flex md3 offset-md1 xs12>
          <v-menu
            :close-on-content-click="false"
            :nudge-right="40"
            full-width
            lazy
            max-width="290px"
            min-width="290px"
            offset-y
            ref="startDateMenu"
            transition="scale-transition"
            v-model="startDateMenu"
          >
            <v-text-field label="מתאריך" slot="activator" v-model="startDateFormatted"></v-text-field>
            <v-date-picker @input="startDateMenu = false" no-title v-model="filter.startDateISO"></v-date-picker>
          </v-menu>
        </v-flex>
        <v-flex md3 xs12>
          <v-menu
            :close-on-content-click="false"
            :nudge-right="40"
            full-width
            lazy
            max-width="290px"
            min-width="290px"
            offset-y
            ref="endDateMenu"
            transition="scale-transition"
            v-model="endDateMenu"
          >
            <v-text-field label="עד תאריך" slot="activator" v-model="endDateFormatted"></v-text-field>
            <v-date-picker @input="endDateMenu = false" no-title v-model="filter.endDateISO"></v-date-picker>
          </v-menu>
        </v-flex>
        <v-flex md12 xs12></v-flex>
        <v-flex md12 xs12></v-flex>
        <v-flex md12 xs12></v-flex>
        <v-flex md4 xs12>
          <h1 class="header">סה"כ שולם: {{totalPayed}} ש"ח</h1>
        </v-flex>
        <v-flex md4 xs12>
          <h1 class="header">סה"כ צפוי: {{totalAnticipated}} ש"ח</h1>
        </v-flex>
        <v-flex md4 xs12>
          <h1 class="header">סה"כ בוטל: {{totalCancelled}} ש"ח</h1>
        </v-flex>
        <v-flex md12 xs12>
          <v-card>
            <v-card-title>
              <span v-if="!uIsSystemManager">פרויקט: {{project}}</span>
              <span v-else>
                <v-select :items="selects.projects" label="פרויקט" v-model="filter.project"></v-select>
              </span>
              <v-spacer></v-spacer>
              <v-text-field append-icon="search" label="חיפוש" single-line v-model="filter.search"></v-text-field>
            </v-card-title>
            <v-data-table
              :headers="headers"
              :items="filteredPayments"
              :rows-per-page-items="[30]"
              class="responsive-table"
              no-data-text="לא נמצאו תשלומים"
              no-results-text="לא נמצאו תשלומים"
            >
              <template
                slot="pageText"
                slot-scope="props"
              >
                <v-tooltip bottom>
                  <v-btn @click="exportToCsv" color="primary" flat icon slot="activator">
                    <v-icon>save_alt</v-icon>
                  </v-btn>
                  <span>יצוא לקובץ CSV</span>
                </v-tooltip>
                שורות {{ props.pageStart }} - {{ props.pageStop }} מתוך {{ props.itemsLength }}
              </template>
              <template slot="items" slot-scope="props">
                <tr @click="onRowClick(props)">
                  <td>{{ props.item.index }}</td>
                  <td v-if="uIsSystemManager">{{ props.item.user.project }}</td>
                  <td>{{ selects.statuses.find(status => status.value === props.item.status).text }}</td>
                  <td>{{ new Date(props.item.date).toLocaleDateString('he') }}</td>
                  <td>{{ props.item.amount }}</td>
                  <td>{{ props.item.recipientName }}</td>
                  <td>{{ props.item.description }}</td>
                  <td>{{ props.item.sumPayed }}</td>
                  <td>{{ props.item.paymentDate === null ? null : new
                    Date(props.item.paymentDate).toLocaleDateString('he')}}
                  </td>
                  <td>
                    <a :href="apiUrl + '/dp/' + props.item._id + '.pdf'" target="blank">כניסה לקובץ</a>
                  </td>
                </tr>
              </template>
              <template slot="expand" slot-scope="props">
                <v-card flat>
                  <v-card-text>
                    <v-layout align-center justify-space-around row wrap>
                      <v-flex md3 xs12>
                        <v-select
                          :disabled="!uIsSystemManager"
                          :items="selects.statuses"
                          @change="onPaymentEdited"
                          label="סטטוס"
                          v-model="currentExpandedPayment.status"
                        ></v-select>
                      </v-flex>
                      <v-flex md3 xs12>
                        <v-text-field
                          :disabled="!uIsSystemManager"
                          :rules="amountRules"
                          @input="onPaymentEdited"
                          label="סכום ששולם"
                          name="amount"
                          suffix="₪"
                          type="number"
                          v-model.number="currentExpandedPayment.sumPayed"
                        ></v-text-field>
                      </v-flex>
                      <v-flex md3 xs12>
                        <v-text-field
                          :disabled="!uIsSystemManager"
                          @input="onPaymentEdited"
                          label="מספר קבלה"
                          mask="#######"
                          name="receiptNumber"
                          v-model="currentExpandedPayment.receiptNumber"
                        ></v-text-field>
                      </v-flex>
                    </v-layout>
                    <v-layout justify-space-around row wrap>
                      <v-flex md3 xs12>
                        <v-select
                          :disabled="!uIsSystemManager"
                          :items="selects.paymentTypes"
                          @change="onPaymentEdited"
                          label="אופן תשלום"
                          v-model="currentExpandedPayment.type"
                        ></v-select>
                      </v-flex>
                      <v-flex md3 xs12>
                        <v-select
                          :disabled="!uIsSystemManager"
                          :items="selects.accountNumbers"
                          @change="onPaymentEdited"
                          label="סעיף תקציבי"
                          v-model="currentExpandedPayment.accountNumber"
                        ></v-select>
                      </v-flex>
                      <v-flex md3 xs12>
                        <v-menu
                          :close-on-content-click="false"
                          :disabled="!uIsSystemManager"
                          :nudge-right="40"
                          full-width
                          lazy
                          max-width="290px"
                          min-width="290px"
                          offset-y
                          ref="paymentDateMenu"
                          transition="scale-transition"
                          v-model="paymentDateMenu"
                        >
                          <v-text-field
                            :disabled="!uIsSystemManager"
                            @blur="onPaymentEdited"
                            label="תאריך תשלום"
                            slot="activator"
                            v-model="currentExpandedPaymentDateFormatted"
                          ></v-text-field>
                          <v-date-picker
                            @input="paymentDateMenu = false"
                            no-title
                            v-model="currentExpandedPayment.paymentDate"
                          ></v-date-picker>
                        </v-menu>
                      </v-flex>
                    </v-layout>
                    <v-layout justify-space-around row wrap>
                      <v-flex md3 xs12>
                        <v-text-field
                          :disabled="!uIsSystemManager"
                          @blur="onPaymentEdited"
                          label="אימייל נמען"
                          slot="activator"
                          v-model="props.item.recipientEmail"
                        ></v-text-field>
                      </v-flex>
                      <v-flex md3 xs12>
                        <v-text-field
                          :disabled="!uIsSystemManager"
                          @blur="onPaymentEdited"
                          label="איש קשר"
                          slot="activator"
                          v-model="props.item.contact"
                        ></v-text-field>
                      </v-flex>
                      <v-flex md3 xs12></v-flex>
                    </v-layout>
                  </v-card-text>
                </v-card>
              </template>
            </v-data-table>
          </v-card>
        </v-flex>
      </v-layout>
    </v-slide-y-transition>
  </v-container>
</template>
<script>
  import ApiConsumer from "../mixins/apiconsumer.mixin";
  import helpersMixin from "../mixins/helpers.mixin";
  import {ConfigKeys, PaymentStatus, SessionStorageKeys} from "../constants";

  export default {
    data() {
      return {
        project: this.getSessionStorageItem(SessionStorageKeys.U_PROJECT),
        apiUrl: this.getConfiguration(ConfigKeys.API_URL),
        headers: [
          {text: "מזהה", value: "index", align: "right"},
          {text: "סטטוס", value: "status", align: "right"},
          {text: "תאריך", value: "date", align: "right"},
          {text: "סכום דרישה (₪)", value: "amount", align: "right"},
          {text: "שם נמען", value: "recipientName", align: "right"},
          {text: "תיאור", value: "description", align: "right"},
          {text: "סכום ששולם", value: "sumPayed", align: "right"},
          {text: "תאריך תשלום", value: "paymentDate", align: "right"},
          {text: "קובץ", value: "_id", align: "right"}
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
          projects: [{text: "הכל", value: null}],
          statuses: [
            {value: PaymentStatus.PAYED, text: "שולם"},
            {value: PaymentStatus.UNPAYED, text: "לא שולם"},
            {value: PaymentStatus.CANCELLED, text: "מבוטל"}
          ],
          paymentTypes: [
            {value: "Cheque", text: "צ'ק"},
            {value: "Bank Transfer", text: "העברה בנקאית"},
            {value: "Cash", text: "מזומן"},
            {value: "Defrayal", text: "סליקה"},
            {value: "Eventer", text: "Eventer"},
            {value: "Other", text: "אחר"}
          ],
          accountNumbers: null
        },
        startDateMenu: null,
        endDateMenu: null,
        paymentDateMenu: null,
        currentExpandedPayment: null,
        currentExpandedRow: null,
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
       * @param {props} props props object of the clicked row, which contains the payment object and the expanded state
       */
      onRowClick(props) {
        props.expanded = !props.expanded;
        if (props.expanded) {
          this.currentExpandedPayment =
            this.paymentsDelta[props.item.id] ||
            JSON.parse(JSON.stringify(props.item));
          this.currentExpandedRow = props;
        } else {
          this.currentExpandedPayment = null;
          this.currentExpandedRow = null;
        }
      },
      /**
       * Called when the user expands and edits a payment
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
      async saveDelta() {
        this.$emit("canSaveChanged", null);
        await this.updateAnticipatedPayments(Object.values(this.paymentsDelta));
        this.paymentsDelta = {};
        this.payments = (await this.getAnticipatedPayments()).data;
        this.$emit("canSaveChanged", false);
        if (this.currentExpandedRow != null) {
          this.currentExpandedRow.expanded = false;
          this.currentExpandedRow = null;
        }
      },
      /**
       * Exports anticipated payments to CSV file
       */
      exportToCsv() {
        /**
         *
         * @type {{field: string, displayName: string}[]}
         */
        const headers = this.getConfiguration(
          ConfigKeys.ANTICIPATED_PAYMENT_CSV_FIELDS
        );
        const csv = this.convertToCsv(this.filteredPayments, headers);
        this.downloadFile("incomes.csv", csv);
      }
    },
    async mounted() {
      this.$emit("canSaveChanged", false);
      this.payments = (await this.getAnticipatedPayments()).data;
      this.selects.accountNumbers = await this.getAccountNumbers();
      if (this.uIsSystemManager) {
        this.headers.splice(1, 0, {text: "פרויקט", value: "user.project", align: "right"});
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
        return this.filteredPayments.reduce((p1, p2) => p1 + p2.amount, 0).toFixed(2);
      },
      totalCancelled() {
        return this.filteredPayments.filter(p => p.status === PaymentStatus.CANCELLED).reduce((p1, p2) => p1 + p2.amount, 0).toFixed(2);
      },
      totalAnticipated() {
        return this.total - this.totalPayed;
      },
      totalPayed() {
        return this.filteredPayments
          .reduce((p1, p2) => p1 + (p2.sumPayed == null ? 0 : p2.sumPayed), 0)
          .toFixed(2);
      },
      filteredPayments() {
        return this.payments.filter(payment => {
          const statusFilterPassed =
            !this.filter.status || payment.status === this.filter.status;
          const startDateFilterPassed =
            !this.filter.startDateISO ||
            new Date(this.filter.startDateISO) <=
            new Date(
              this.filter.status === PaymentStatus.PAYED ? payment.paymentDate : payment.date
            );
          const endDateFilterPassed =
            !this.filter.endDateISO ||
            new Date(this.filter.endDateISO) >=
            new Date(
              this.filter.status === PaymentStatus.PAYED ? payment.paymentDate : payment.date
            );
          const projectFilterPassed =
            !this.filter.project ||
            this.filter.project === payment.user.projectCode;
          const searchFilterPassed =
            !this.filter.search ||
            Object.keys(payment).some(
              key =>
                payment[key] &&
                payment[key].toString().includes(this.filter.search)
            );
          return (
            statusFilterPassed &&
            startDateFilterPassed &&
            endDateFilterPassed &&
            projectFilterPassed &&
            searchFilterPassed
          );
        });
      }
    },
    mixins: [ApiConsumer, helpersMixin]
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
