<template>
  <div class="demo-card" :style="{ '--card-accent': color }">
    <div class="card-header">
      <div class="card-icon">{{ icon }}</div>
      <div>
        <h2>{{ title }}</h2>
        <span class="pkg-badge">{{ pkg }}</span>
      </div>
    </div>
    <slot />
  </div>
</template>

<script setup lang="ts">
defineProps<{ title: string; icon: string; pkg: string; color: string }>()
</script>

<style scoped>
.demo-card {
  background: var(--surface); border: 1px solid var(--border);
  border-radius: 1rem; padding: 1.5rem; transition: border-color .2s;
}
.demo-card:hover { border-color: var(--card-accent, var(--accent2)); }
.card-header { display: flex; align-items: center; gap: .75rem; margin-bottom: 1.25rem; }
.card-icon { font-size: 1.5rem; }
h2 { font-size: 1rem; font-weight: 600; }
.pkg-badge { font-family: var(--mono); font-size: .6875rem; background: var(--surface2); border: 1px solid var(--border); padding: .125rem .5rem; border-radius: .25rem; color: var(--muted); }
</style>
