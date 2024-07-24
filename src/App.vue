<template>
  <div id="app">
    <nav class="navbar navbar-expand-lg navbar-light bg-light">
    </nav>
    <router-view></router-view>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'App',
});
</script>

<style scoped>
</style>
