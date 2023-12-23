<script setup>
import { RouterLink, RouterView } from 'vue-router'
import TopBar from './components/TopBar.vue';
</script>

<template>
	<router-view id="view_container"/>
</template>

<style scoped>
#view_container {
	width: 100%;
	height: 100%;
}

</style>
