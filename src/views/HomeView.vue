<template>
  <div>
    <div v-if="errorStore.errorVisible">
      <h2>{{ errorStore.errorMessage }}</h2>
    </div>
    <h1>Home</h1>


  </div>
</template>

<script setup>
import { useErrorStore } from '@/stores/errorStore';
const errorStore = useErrorStore();

</script>

<style scoped>

</style>

