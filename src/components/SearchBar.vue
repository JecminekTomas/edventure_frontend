<template>
  <v-row class="mx-1">
    <v-col cols="12" md="3">
      <v-autocomplete
          v-model="university"
          clearable
          label="Univerzita"
          :items="this.universities"
          item-text="name"
          item-value="id"
          @click:clear="clearUniversity"
          @change="clearFaculty"
      />
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
          @click:clear="clearFaculty"
          @change="clearSubject"
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
          @click:clear="clearSubject"
      />
    </v-col>
    <v-col align-self="center" cols="12" md="3">
      <v-btn color="secondary" block :disabled="searchDisabled" @click="searchClick">
        <v-icon>mdi-magnify</v-icon>
        Vyhledat
      </v-btn>
    </v-col>
  </v-row>
</template>

<script>
import {mapActions, mapState} from "vuex";

export default {
  name: "SearchBar",
  data() {
    return {
      university: null,
      faculty: null,
      subject: null,
      clickedSearch: false
    }
  },
  async created() {
    await this.fetchUniversities()
  },
  methods: {
    ...mapActions('Offers', ['switchFilter', 'setSubjectFilter']),
    ...mapActions('Universities', ['fetchUniversities']),
    ...mapActions('Faculties', ['fetchFaculties']),
    ...mapActions('Subjects', ['fetchSubjects']),

    searchClick() {
      this.switchFilter(true)
      this.setSubjectFilter(this.subject)
      this.clickedSearch = true
    },

    clearUniversity() {
      this.university = null
      this.clearFaculty()
    },

    clearFaculty() {
      this.faculty = null
      this.clearSubject()
    },

    clearSubject() {
      this.subject = null
      this.clickedSearch = false
    }
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
    },

    searchDisabled() {
      return !this.subject
    },

  },

  watch: {
    async university() {
      await this.fetchFaculties(this.university.id)
    },
    async faculty() {
      await this.fetchSubjects(this.faculty.id)
    }
  },
}
</script>

<style scoped>

</style>