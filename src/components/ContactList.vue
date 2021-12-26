<template>
  <v-container fluid>
    <template v-for="(contact, index) in contacts">
      <v-row :key="index" class="mt-md-n6 my-n4" justify="space-between">
        <v-col cols="12" md="5">
          <v-select v-model="contacts[index].contactType" label="Typ kontaktu" :items="contactTypes"
                    prepend-icon="mdi-close"
                    @click:prepend="deleteContact(index)"/>
        </v-col>
        <v-col cols="12" md="7" class="mt-n8 mt-md-0">
          <v-text-field v-model="contacts[index].value" label="Hodnota"/>
        </v-col>
      </v-row>
    </template>
    <v-row>
      <v-btn outlined block color="primary" @click="addContact">
        <v-icon>mdi-plus</v-icon>
        Přidat kontakt
      </v-btn>
    </v-row>
  </v-container>
</template>

<script>
import {mapActions} from "vuex";

export default {
  name: "ContactList",
  data() {
    return {
      changedValue: null,
      contacts: [],
      contactTypes:
          [
            {text: "Facebook", id: 0},
            {text: "Twitter", id: 1},
            {text: "LinkedIn", id: 2},
            {text: "Instagram", id: 3},
            {text: "Telefon", id: 4}
          ]
    }
  },
  methods: {
    ...mapActions('Contacts', ['setContacts']),

    addContact() {
      this.contacts.push({contactType: null, value: null})
    },

    async doSetContacts() {
      await this.setContacts(this.contacts)
    },

    deleteContact(index) {
      this.contacts.splice(index, 1)
    }
  }
}
</script>

<style scoped>

</style>