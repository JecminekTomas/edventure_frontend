<template>
  <v-row class="mx-1">
    <v-col cols="12" md="3">
      <v-autocomplete
          v-model="universityId"
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
          v-model="facultyId"
          clearable
          label="Fakulta"
          :disabled="facultyIdDisabled"
          :items="this.faculties"
          item-text="name"
          item-value="id"
          @click:clear="clearFaculty"
          @change="clearSubject"
      />
    </v-col>
    <v-col cols="12" md="3">
      <v-autocomplete
          v-model="subjectId"
          clearable
          label="Předmět"
          :disabled="subjectIdDisabled"
          :items="this.subjects"
          :item-text="item => item.code +' - '+ item.name"
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
      universityId: null,
      facultyId: null,
      subjectId: null,
    }
  },
  async created() {
    await this.fetchUniversities()
  },
  async mounted() {
    await this.setData()
  },

  methods: {
    ...mapActions('Offers', ['switchFilter', 'setSubjectFilter', 'fetchOffersBySubject']),
    ...mapActions('Universities', ['fetchUniversities', 'fetchUniversityById']),
    ...mapActions('Faculties', ['fetchFaculties', 'fetchFacultyById']),
    ...mapActions('Subjects', ['fetchSubjects', 'fetchSubjectById']),

    setData() {
      this.universityId = this.university?.id ?? null
      this.facultyId = this.faculty?.id ?? null
      this.subjectId = this.subject?.id ?? null
    },

    async setStore() {
      await this.fetchUniversityById(this.universityId)
      await this.fetchFacultyById(this.facultyId)
      await this.fetchSubjectById(this.subjectId)
    },

    async searchClick() {
      this.setSubjectFilter(this.subjectId)
      await this.setStore()
      await this.fetchOffersBySubject(this.subjectId)
      this.switchFilter(true)
    },

    clearUniversity() {
      this.universityId = null
      this.clearFaculty()
    },

    clearFaculty() {
      this.facultyId = null
      this.clearSubject()
    },

    clearSubject() {
      this.switchFilter(false)
      this.subjectId = null
    }
  },
  computed: {
    ...mapState('Universities', ['universities', 'university']),
    ...mapState('Faculties', ['faculties', 'faculty']),
    ...mapState('Subjects', ['subjects', 'subject']),

    facultyIdDisabled() {
      return !this.universityId
    },

    subjectIdDisabled() {
      return !this.facultyId
    },

    searchDisabled() {
      return !this.subjectId
    },

  },

  watch: {
    async universityId() {
      await this.fetchFaculties(this.universityId)
    },
    async facultyId() {
      await this.fetchSubjects(this.facultyId)
    }

  },
}
</script>

<style scoped>

</style>