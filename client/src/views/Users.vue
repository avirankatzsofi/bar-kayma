<template>
  <v-container fill-height>
    <v-btn fab dark fixed bottom left @click="isDialogVisible = true">
      <v-icon dark>add</v-icon>
    </v-btn>
    <v-flex md12>
      <v-data-table :rows-per-page-items="[30]" :items="users" :headers="tableHeaders" class="elevation-1">
        <template slot="items" slot-scope="props">
          <tr @click="onRowClick(props)">
            <td>{{props.item.username}}</td>
            <td>{{props.item.firstName}}</td>
            <td>{{props.item.lastName}}</td>
            <td>{{props.item.email}}</td>
            <td>{{props.item.project}}</td>
            <td>{{props.item.projectCode}}</td>
            <td>
              <v-btn icon flat color="grey" @click.stop="removeProjectManager(props.item.id)">
                <v-icon>delete</v-icon>
              </v-btn>
            </td>
          </tr>
        </template>
        <template slot="expand" slot-scope="props">
          <v-layout row wrap align-center justify-space-around class="py-3">
            <v-flex xs12 md3>
              <v-text-field v-model="currentExpandedUser.username" label="שם משתמש"
                            @input="onUserEdited(UserFields.USERNAME)"></v-text-field>
            </v-flex>
            <v-flex xs12 md3>
              <v-text-field v-model="currentExpandedUser.email" label="אימייל"
                            @input="onUserEdited(UserFields.EMAIL)"></v-text-field>
            </v-flex>
            <v-flex xs12 md3>
              <v-text-field v-model="currentExpandedUser.projectCode" label="קוד פרויקט"
                            @input="onUserEdited(UserFields.PROJECT_CODE)"></v-text-field>
            </v-flex>
          </v-layout>
          <v-layout row wrap align-center justify-space-around class="py-3">
            <v-flex xs12 md3>
              <v-text-field v-model="currentExpandedUser.project" label="פרויקט"
                            @input="onUserEdited(UserFields.PROJECT)"></v-text-field>
            </v-flex>
            <v-flex xs12 md3>
              <v-text-field v-model="currentExpandedUser.firstName" label="שם פרטי"
                            @input="onUserEdited(UserFields.FIRST_NAME)"></v-text-field>
            </v-flex>
            <v-flex xs12 md3>
              <v-text-field v-model="currentExpandedUser.lastName" label="שם משפחה"
                            @input="onUserEdited(UserFields.LAST_NAME)"></v-text-field>
            </v-flex>
          </v-layout>
        </template>
      </v-data-table>
    </v-flex>
    <v-dialog v-model="isDialogVisible" max-width="600px">
      <v-card>
        <v-card-title>מנהל פרויקט חדש</v-card-title>
        <v-card-text>
          <v-form v-model="isFormValid" @submit.prevent="addProjectManager">
            <v-container>
              <v-layout row wrap>
                <v-flex xs12 sm6>
                  <v-text-field label="שם משתמש" outline required :rules="formRules.requiredField"
                                browser-autocomplete="username" v-model="formFields.username"></v-text-field>
                </v-flex>
                <v-flex xs12 sm6>
                  <v-text-field label="סיסמה" type="password" outline required
                                :rules="formRules.requiredField" browser-autocomplete="password"
                                v-model="formFields.password"></v-text-field>
                </v-flex>
                <v-flex xs12>
                  <v-text-field label="אימייל" type="email" outline required
                                :rules="formRules.emailRules" v-model="formFields.email"></v-text-field>
                </v-flex>
                <v-flex xs12 sm6>
                  <v-text-field
                    label="שם פרטי" outline required :rules="formRules.requiredField"
                    browser-autocomplete="first-name" v-model="formFields.firstName"></v-text-field>
                </v-flex>
                <v-flex xs12 sm6>
                  <v-text-field label="שם משפחה" outline required :rules="formRules.requiredField"
                                browser-autocomplete="last-name" v-model="formFields.lastName"></v-text-field>
                </v-flex>
                <v-flex xs12 sm6>
                  <v-text-field label="פרויקט" outline required :rules="formRules.requiredField"
                                browser-autocomplete="project" v-model="formFields.project"></v-text-field>
                </v-flex>
                <v-flex xs12 sm6>
                  <v-text-field label="קוד פרויקט" outline required :rules="formRules.requiredField"
                                browser-autocomplete="project-code" v-model="formFields.projectCode"
                                mask="######"></v-text-field>
                </v-flex>
                <v-flex xs12 v-if="isSubmissionErrorVisible">
                  <h1 class="error--text title text-xs-center">אופס... לא הצלחנו להוסיף מנהל פרויקט. יכול להיות שהמשתמש
                    כבר קיים?</h1>
                </v-flex>
                <v-flex xs12>
                  <v-btn block depressed large color="secondary" :disabled="!isFormValid" type="submit"
                         :loading="isWaitingForUserCreation">
                    הוספה
                  </v-btn>
                </v-flex>
              </v-layout>
            </v-container>
          </v-form>
        </v-card-text>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script>
  import ApiConsumer from "../mixins/apiconsumer.mixin";
  import {UserFields} from "../constants";

  export default {
    name: "Users",
    data() {
      return {
        isFormValid: false,
        isDialogVisible: false,
        isWaitingForUserCreation: false,
        isSubmissionErrorVisible: false,
        users: [],
        tableHeaders: [
          {text: "שם משתמש", value: "username", align: "right"},
          {text: "שם פרטי", value: "firstName", align: "right"},
          {text: "שם משפחה", value: "lastName", align: "right"},
          {text: "אימייל", value: "email", align: "right"},
          {text: "פרויקט", value: "project", align: "right"},
          {text: "קוד פרויקט", value: "projectCode", align: "right"},
          {text: "פעולות", align: "center", sortable: false}
        ],
        formRules: {
          emailRules: [
            v => !!v || "שדה חובה",
            v => /\S+@\S+\.\S+/.test(v) || "אימייל צריך להיות תקין"
          ],
          requiredField: [v => !!v || "שדה חובה"],
        },
        formFields: {
          username: "",
          password: "",
          firstName: "",
          lastName: "",
          email: "",
          project: "",
          projectCode: ""
        },
        userDelta: {},
        currentExpandedUser: null,
        currentExpandedRow: null,
        UserFields: UserFields
      }
    },
    methods: {
      /**
       * Called when a row is clicked.
       * @param {props} props props object of the clicked row, which contains the payment object and the expanded state
       */
      onRowClick(props) {
        props.expanded = !props.expanded;
        if (props.expanded) {
          this.currentExpandedUser =
            this.userDelta[props.item.id] ||
            JSON.parse(JSON.stringify(props.item));
          this.currentExpandedRow = props;
        } else {
          this.currentExpandedUser = null;
          this.currentExpandedRow = null;
        }
      },
      /**
       * Called when the user expands and edits another user's details
       */
      onUserEdited(field) {
        if (!this.userDelta[this.currentExpandedUser.id]) {
          this.userDelta[
            this.currentExpandedUser.id
            ] = {};
        }
        this.userDelta[this.currentExpandedUser.id][field] = this.currentExpandedUser[field];
        this.$emit("canSaveChanged", true);
      },
      /**
       * Sends an API call to save the payments delta
       */
      async saveDelta() {
        this.$emit("canSaveChanged", null);
        await this.updateProjectManagers(this.userDelta);
        this.userDelta = {};
        this.users = await this.getProjectManagers();
        this.$emit("canSaveChanged", false);
        if (this.currentExpandedRow != null) {
          this.currentExpandedRow.expanded = false;
          this.currentExpandedRow = null;
        }
      },
      /**
       * Sends an API call to add a new project manager
       * @returns {Promise<void>}
       */
      async addProjectManager() {
        if (this.isFormValid) {
          this.isWaitingForUserCreation = true;
          try {
            await this.submitNewProjectManager(
              this.formFields.username,
              this.formFields.password,
              this.formFields.email,
              this.formFields.firstName,
              this.formFields.lastName,
              this.formFields.project,
              this.formFields.projectCode
            );
            this.users = await this.getProjectManagers();
            this.isWaitingForUserCreation = false;
            this.isDialogVisible = false;
          } catch (reason) {
            this.isWaitingForUserCreation = false;
            this.isSubmissionErrorVisible = true;
          }
        }
      },
      /**
       * Sends an API call to block a project manager
       * @param {string} uid ID of project manager to remove
       * @returns {Promise<void>}
       */
      async removeProjectManager(uid) {
        try {
          await this.blockProjectManager(uid);
          this.users = await this.getProjectManagers();
        } catch (e) {
          console.error(e);
        }
      }
    },
    async mounted() {
      this.users = await this.getProjectManagers();
    },
    mixins: [ApiConsumer]
  }
</script>

<style scoped>

</style>