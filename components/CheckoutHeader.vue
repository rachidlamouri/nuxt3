<script lang="ts" setup></script>

<template>
  <div>
    <SkipLink />
    <div class="container | flow-s">
      <!-- HEASER TOP -->
      <div class="main-header__top">
        <div class="branding">
          <Nuxt-link :to="{ name: 'index' }" aria-label="Aviation Component Solutions">
            <img class="" src="/images/logo-transparent.svg" alt="ACS Logo Home Page" />
            <img class="" src="/images/logo-color.svg" alt="ACS Logo Home Page" />
          </Nuxt-link>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped></style>
