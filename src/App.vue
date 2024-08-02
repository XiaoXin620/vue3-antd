<script setup lang="ts">
</script>

<template>
  <a-config-provider>
    <RouterView #="{ Component }">
      <component :is="Component" />
    </RouterView>
    <!-- <div class="wrapper">
      <a-button>Add</a-button>
      <a-button type="primary">Primary Button</a-button>
      <nav>
        <RouterLink to="/">Home</RouterLink>
        <RouterLink to="/about">About</RouterLink>
      </nav>
    </div> -->
  </a-config-provider>
</template>

<style scoped></style>
