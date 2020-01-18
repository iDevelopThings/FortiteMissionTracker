<template>

    <div class="app-layout">

        <nav class="flex items-center justify-between flex-wrap p-6">
            <div class="flex items-center flex-shrink-0 text-white mr-6">
                <router-link to="/">
                    <img src="/logo.png" alt="" style="width: 230px;">
                </router-link>
            </div>
            <div class="block lg:hidden">
                <button @click="expandMenu = !expandMenu"
                        class="flex items-center px-3 py-2 border rounded text-gray-400 border-teal-400 hover:text-white hover:border-white">
                    <svg class="fill-current h-3 w-3" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><title>Menu</title>
                        <path d="M0 3h20v2H0V3zm0 6h20v2H0V9zm0 6h20v2H0v-2z"/>
                    </svg>
                </button>
            </div>
            <div class="w-full block flex-grow lg:flex lg:items-center lg:w-auto" v-show="expandMenu">
                <div class="text-sm lg:flex-grow">
                    <a href="#responsive-header" class="block mt-4 lg:inline-block lg:mt-0 text-gray-400 hover:text-white mr-4">
                        Docs
                    </a>
                    <router-link v-if="$store.user" to="/account" class="block mt-4 lg:inline-block lg:mt-0 text-gray-400 hover:text-white mr-4">
                        My Account
                    </router-link>

                </div>
                <div v-if="!$store.user">
                    <router-link to="/login" class="block mt-4 lg:inline-block lg:mt-0 text-gray-400 hover:text-white mr-4">
                        Login
                    </router-link>
                    <router-link to="/register" class="block mt-4 lg:inline-block lg:mt-0 text-gray-400 hover:text-white mr-4">
                        Register
                    </router-link>
                </div>
            </div>
        </nav>

        <div class="app-content">
            <transition name="fade" method="out-in" appear>
                <router-view v-if="$store.ready"></router-view>
            </transition>
        </div>

    </div>

</template>

<script>
	export default {
		name    : "Layout",
		mounted()
		{
		},
		data()
		{
			return {
				expandMenu : true,
			};
		},
		methods : {},
	};
</script>

<style scoped lang="scss">
    .app-layout {
        height: 100%;
        overflow-y: hidden;

        > .app-content {
            overflow-y: hidden;
            height: calc(100% - 80px);
        }
    }
</style>
