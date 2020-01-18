<template>
  <div class="flex justify-center">
    <div class="container">
      <div class="flex">
        <div class="w-1/5">

          <div class="p-4 account-menu">

            <router-link to="/account/overview">Overview</router-link>
            <router-link to="/account/api">Api</router-link>


          </div>

        </div>
        <div class="w-4/5">
          <transition name="fade" mode="out-in" appear>
            <keep-alive :key="$route.fullPath">
              <router-view :key="$route.fullPath"></router-view>
            </keep-alive>
          </transition>
        </div>


      </div>
    </div>
  </div>
</template>

<script>
  export default {
    name    : "AccountLayout",
    mounted()
    {
    },
    data()
    {
      return {};
    },
    methods : {},
  };
</script>

<style scoped lang="scss">
  .account-menu {
    display: flex;
    flex-direction: column;
    @apply .text-gray-500;

    > a {
      padding: 10px;

      &.router-link-active {
        @apply .text-gray-300;
      }

      &:hover, &:focus {
        @apply .text-gray-300;
      }
    }
  }
</style>
