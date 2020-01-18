<template>
    <div class="h-full w-full flex justify-center items-center">

        <form class="bg-gray-800 shadow-md rounded px-8 pt-6 pb-8 mb-4" @submit.prevent="login()">
            <div class="mb-4">
                <label class="block text-gray-300 text-sm font-bold mb-2" for="email">
                    Email
                </label>
                <input
                        class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-300 leading-tight bg-gray-700 border-gray-800 focus:outline-none focus:shadow-outline"
                        id="email" v-model="email"
                        :class="emailError ? 'border-red-500' : ''" :disabled="submitting"
                        type="text" placeholder="Email">
                <p class="text-red-500 text-xs italic" v-if="emailError">{{emailError}}</p>
            </div>
            <div class="mb-6">
                <label class="block text-gray-300 text-sm font-bold mb-2" for="password">
                    Password
                </label>
                <input
                        v-model="password"
                        class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-300 leading-tight bg-gray-700 border-gray-800 focus:outline-none focus:shadow-outline"
                        :class="passwordError ? 'border-red-500' : ''"
                        :disabled="submitting"
                        id="password" type="password" placeholder="******************">
                <p class="text-red-500 text-xs italic" v-if="passwordError">{{passwordError}}</p>
            </div>
            <button class="discord-button block w-full text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline "
                    type="submit"
                    :class="submitting ? 'bg-gray-300 cursor-not-allowed' : ''"
                    :disabled="submitting">
                Sign In
            </button>
        </form>

    </div>
</template>

<script>
	export default {
		name    : "Login",
		mounted()
		{
		},
		data()
		{
			return {

				email    : "",
				password : "",

				submitting : false,

				emailError    : null,
				passwordError : null,

			};
		},
		methods : {

			login()
			{

				this.emailError    = null;
				this.passwordError = null;

				if (this.email.trim() === "") {
					this.emailError = "You must enter an email.";
					return;
				}
				if (this.password.trim() === "") {
					this.passwordError = "You must enter a password.";
					return;
				}

				this.submitting = true;

				axios.post('/auth/login', {email : this.email, password : this.password})
					.then(response => {
						this.$store.postLogin(response.data);
						this.$router.push({path : '/account'});
					})
					.catch(error => {
						console.error(error);
					})
					.finally(() => {
						console.log('login complete');
						this.submitting = false;
					});
			},

		},
	};
</script>

<style scoped lang="scss">

</style>
