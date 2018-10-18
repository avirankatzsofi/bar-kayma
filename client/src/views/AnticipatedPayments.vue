<template>
  <v-container fill-height>
    <v-slide-y-transition mode="out-in">
      <v-layout row wrap>
        <v-flex xs12 md12>
          <h1 class="display-1">סה"כ: {{total}} ש"ח</h1>
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
            <v-text-field
              slot="activator" 
              v-model="startDateFormatted"
              label="מתאריך"
              prepend-icon="event"
            ></v-text-field>
            <v-date-picker v-model="filter.startDateISO" no-title @input="startDateMenu = false"></v-date-picker>
          </v-menu>
        </v-flex>
        <v-flex xs12 md3 offset-md1>
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
            <v-text-field
              slot="activator" 
              v-model="endDateFormatted"
              label="עד תאריך"
              prepend-icon="event"
            ></v-text-field>
            <v-date-picker v-model="filter.endDateISO" no-title @input="endDateMenu = false"></v-date-picker>
          </v-menu>
        </v-flex>
        <v-flex xs12 md3>
          <v-select
            :items="[
              {text: 'הכל', value: null}, 
              {text: 'שולם', value: status.payed}, 
              {text: 'לא שולם', value: status.unpayed}
            ]"
            v-model="filter.status"
            label="סטטוס"
          ></v-select>
        </v-flex>
        <v-flex xs12 md12></v-flex>
        <v-flex xs12 md12></v-flex>
        <v-flex xs12 md12></v-flex>
        <v-flex xs12 md12>
          <v-data-table
            :headers="headers"
            :items="filteredPayments"
            class="elevation-1 responsive-table"
            :rows-per-page-items="[10]"
          >
            <template slot="items" slot-scope="props">
              <td>{{ props.item.recipientName }}</td>
              <td>{{ props.item.recipientEmail }}</td>
              <td>{{ new Date(props.item.date).toLocaleDateString('he') }}</td>
              <td>{{ props.item.description }}</td>
              <td>{{ props.item.amount }}</td>
              <td>{{ props.item.comments }}</td>
              <td>{{ props.item.status ==  status.unpayed ? "לא שולם" : "שולם"}}</td>
              <td><a :href="apiUrl + '/dp/' + props.item._id + '.pdf'">{{ props.item.id }}</a></td>
            </template>
          </v-data-table>
        </v-flex>
        <v-flex xs12 md12></v-flex>
        <v-flex xs12 md12></v-flex>
        <v-flex xs12 md12></v-flex>
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
      apiUrl: config.apiUrl,
      status: {
        payed: "Payed",
        unpayed: "Unpayed"
      },
      headers: [
        { text: "שם נמען", value: "recipientName" },
        { text: "אימייל נמען", value: "recipientEmail" },
        { text: "תאריך", value: "date" },
        { text: "תיאור", value: "description" },
        { text: "סכום דרישה (₪)", value: "amount" },
        { text: "תגובות", value: "comments" },
        { text: "סטטוס", value: "status" },
        { text: "קובץ", value: "_id" }
      ],
      payments: [],
      filter: {
        startDateISO: null,
        endDateISO: null,
        status: null,
        startDateFormatted: "",
      }
    };
  },
  mounted() {
    this.getAnticipatedPayments().then(result => (this.payments = result.data));
  },
  computed: {
    endDateFormatted() {
      return this.filter.endDateISO && new Date(this.filter.endDateISO).toLocaleDateString('he-IL');
    },
    startDateFormatted() {
      return this.filter.startDateISO && new Date(this.filter.startDateISO).toLocaleDateString('he-IL');
    },
    total() {
      return this.payments.reduce((p1, p2) => p1 + p2.amount, 0);
    },
    filteredPayments() {
      return this.payments.filter(
        (payment) => {
          const statusFilterPass = !this.filter.status || payment.status == this.filter.status;
          const startDateFilterPassed = !this.filter.startDateISO || new Date(this.filter.startDateISO) <= new Date(payment.date);
          const endDateFilterPassed = !this.filter.endDateISO || new Date(this.filter.endDateISO) >= new Date(payment.date);
          return statusFilterPass && startDateFilterPassed && endDateFilterPassed;
        }
      );
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
