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
          <RouterLink to="/vr">VR</RouterLink>
          <RouterLink to="/vrobject">VR + Object</RouterLink>
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


<!-- nav {
width: 100%;
font-size: 12px;
text-align: center;
margin-top: 2rem;

nav a.router-link-exact-active {
color: var(--color-text);

nav a.router-link-exact-active:hover {
background-color: transparent;

nav a {
display: inline-block;
padding: 0 1rem;
border-left: 1px solid var(--color-border);

nav a:first-of-type {
border: 0;

@media (min-width: 1024px) {
header {
display: flex;
place-items: center;
padding-right: calc(var(--section-gap) / 2);

.logo {
margin: 0 2rem 0 0;

header .wrapper {
display: flex;
place-items: flex-start;
flex-wrap: wrap;

nav {
text-align: left;
margin-left: -1rem;
font-size: 1re
padding: 1rem 0;
margin-top: 1rem;
}
} -->
