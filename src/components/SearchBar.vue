<template>
  <v-container fluid>
    <v-row class="mx-1">
      <v-col cols="12" md="3">
        <v-autocomplete
            v-model="university"
            clearable
            label="Univerzita"
            :items="this.universities"
            item-text="name"
            item-value="id"/>
      </v-col>
      <v-col cols="12" md="3">
        <v-autocomplete
            v-model="faculty"
            clearable
            label="Fakulta"
            :disabled="facultyDisabled"
            :items="this.faculties"
            item-text="name"
            item-value="id"
        />
      </v-col>
      <v-col cols="12" md="3">
        <v-autocomplete
            v-model="subject"
            clearable
            label="Předmět"
            :disabled="subjectDisabled"
            :items="this.subjects"
            item-text="name"
            item-value="id"
        />
      </v-col>
      <v-col align-self="center" cols="10" md="2">
        <v-btn color="secondary" block>
          <v-icon>mdi-magnify</v-icon>
          Vyhledat
        </v-btn>
      </v-col>
      <v-col align-self="center" cols="2" md="1">
        <v-btn color="primary" block @click="this.switchFilter">
          <v-icon>mdi-filter</v-icon>
        </v-btn>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import {mapActions, mapState} from "vuex";

export default {
  name: "SearchBar",
  data() {
    return {
      university: null,
      faculty: null,
      subject: null
    }
  },
  methods: {
    ...mapActions('Offers', ['switchFilter']),
    ...mapActions('Universities', ['fetchUniversities']),
    ...mapActions('Faculties', ['fetchFaculties']),
    ...mapActions('Subjects', ['fetchSubjects']),
  },
  computed: {
    ...mapState('Universities', ['universities']),
    ...mapState('Faculties', ['faculties']),
    ...mapState('Subjects', ['subjects']),

    facultyDisabled() {
      return !this.university
    },
    subjectDisabled() {
      return !this.faculty
    }
  },

  watch: {
    async university() {
      await this.fetchFaculties(this.university.id)
    },
    async faculty() {
      await this.fetchSubjects(this.faculty.id)
    }
  },

  async created() {
    await this.fetchUniversities()
  }
}
</script>

<style scoped>

</style>