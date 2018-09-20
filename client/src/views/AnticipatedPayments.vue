<template>
  <v-container fluid fill-height>
    <v-slide-y-transition mode="out-in">
      <v-layout column align-center justify-center>
        <v-data-table
          :headers="headers"
          :items="payments"
          hide-actions
          class="elevation-1 responsive-table"
        >
          <template slot="items" slot-scope="props">
            <td>{{ props.item.recipientName }}</td>
            <td>{{ props.item.recipientEmail }}</td>
            <td>{{ new Date(props.item.date).toLocaleDateString('he') }}</td>
            <td>{{ props.item.description }}</td>
            <td>{{ props.item.amount }}</td>
            <td>{{ props.item.comments }}</td>
            <td>{{ props.item.status ==  status.unpayed ? "לא שולם" : "שולם"}}</td>
          </template>
        </v-data-table>
      </v-layout>
    </v-slide-y-transition>
  </v-container>
</template>
<script>
import ApiConsumer from "../mixins/apiconsumer.mixin";
export default {
  data() {
    return {
      status: {
        payed: 'Payed',
        unpayed: 'Unpayed'
      },
      headers: [
        { text: "שם נמען", value: "recipientName" },
        { text: "אימייל נמען", value: "recipientEmail" },
        { text: "תאריך", value: "date" },
        { text: "תיאור", value: "description" },
        { text: "סכום דרישה (₪)", value: "amount" },
        { text: "תגובות", value: "comments" },
        { text: "סטטוס", value: "status" }
      ],
      payments: []
    };
  },
  mounted() {
    this.getAnticipatedPayments().then(result => this.payments = result.data);
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
