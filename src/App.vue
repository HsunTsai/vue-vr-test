<script setup>
import { RouterLink, RouterView } from 'vue-router'
</script>

<template>
  <div class="app">

    <header class="app__header">
      <img alt="Vue logo" class="app__header__logo" src="@/assets/logo.svg" width="40" height="40" />

      <div class="app__header__nav">
        <nav>
          <!-- <RouterLink to="/">Home</RouterLink>
          <RouterLink to="/about">About</RouterLink> -->
          <RouterLink to="/light">Light</RouterLink>
          <RouterLink to="/snow">Snow</RouterLink>
          <RouterLink to="/vr3Dof">VR(3Dof)</RouterLink>
          <RouterLink to="/vr6Dof">VR(6Dof)</RouterLink>
          <RouterLink to="/webXR">WebXR</RouterLink>
          <!-- <RouterLink to="/vrobject">VR + Object</RouterLink> -->
        </nav>
      </div>
    </header>

    <div class="app__body">
      <RouterView />
    </div>
  </div>
</template>

<style scoped lang="scss">
.app {
  height: 100vh;
  width: 100%;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  background: var(--color-border);
  gap: 1px;

  &__header {
    padding: 0.5rem 1rem;
    display: flex;
    align-items: center;
    gap: 0.5rem;
    background: var(--color-background);

    &__logo {
      display: block;
      height: 40px;
      width: 40px;
      padding: 0.5rem;
    }

    &__nav {
      flex: 1;
    }

    &::after {
      content: '';
      display: block;
      height: 1px;
      background-color: #d63333;
    }
  }

  &__body {
    flex: 1;
    overflow: hidden;
    background: var(--color-background);
  }
}
</style>
