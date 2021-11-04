<template>
<div class="text-h1">Hledani</div>
</template>

<script>
export default {
  name: "Offers",
  data() {
    return {
      offers: []
    }
  },
  async created() {
    this.offers = this.$http.get('/offers')
  }
}
</script>

<style scoped>

</style>