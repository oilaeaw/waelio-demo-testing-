<template>
  <header class="app-header">
    <div class="logo-badge">W</div>
    <h1>@waelio packages</h1>
    <span class="framework-tag" :style="{ background: `${color}22`, color, borderColor: `${color}55` }">
      {{ framework }}
    </span>
  </header>
</template>

<script setup lang="ts">
defineProps<{ framework: string; color: string }>()
</script>

<style scoped>
.app-header {
  background: var(--surface);
  border-bottom: 1px solid var(--border);
  padding: 1.25rem 2rem;
  display: flex; align-items: center; gap: 1rem;
}
.logo-badge {
  background: var(--accent); color: #000; font-weight: 800;
  padding: .25rem .6rem; border-radius: .375rem; font-size: .75rem;
}
h1 { font-size: 1.125rem; font-weight: 600; }
.framework-tag {
  margin-left: auto;
  padding: .25rem .75rem; border-radius: 999px;
  font-size: .75rem; font-weight: 500; border: 1px solid;
}
</style>
