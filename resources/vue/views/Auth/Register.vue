<template>
    <div class="h-full w-full flex justify-center items-center">

        <form class="bg-gray-800 shadow-md rounded px-8 pt-6 pb-8 mb-4" @submit.prevent="register()">
            <div class="mb-4 bg-red-500 text-white p-4 rounded" v-if="error">
                <strong>Problem!</strong>
                <p>{{error}}</p>
            </div>
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
            <div class="mb-6">
                <label class="block text-gray-300 text-sm font-bold mb-2" for="password">
                    Password Confirm
                </label>
                <input
                        v-model="passwordConfirm"
                        class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-300 leading-tight bg-gray-700 border-gray-800 focus:outline-none focus:shadow-outline"
                        :class="passwordConfirmError ? 'border-red-500' : ''"
                        :disabled="submitting"
                        id="passwordConfirm" type="password" placeholder="******************">
                <p class="text-red-500 text-xs italic" v-if="passwordConfirmError">{{passwordConfirmError}}</p>
            </div>
            <button class="discord-button block w-full text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline "
                    type="submit"
                    :class="submitting ? 'bg-gray-300 cursor-not-allowed' : ''"
                    :disabled="submitting">
                Register
            </button>
        </form>

    </div>
</template>

<script>
	export default {
		name    : "Register",
		mounted()
		{
		},
		data()
		{
			return {
				email           : "",
				password        : "",
				passwordConfirm : "",

				error : null,

				submitting : false,

				emailError           : null,
				passwordError        : null,
				passwordConfirmError : null,
			};
		},
		methods : {

			register()
			{

				this.emailError           = null;
				this.passwordError        = null;
				this.passwordConfirmError = null;

				if (this.email.trim() === "") {
					this.emailError = "You must enter an email.";
					return;
				}
				if (this.password.trim() === "") {
					this.passwordError = "You must enter a password.";
					return;
				}

				if (this.password.trim().length < 6 || this.passwordConfirm.trim().length < 6) {
					this.passwordError        = "Your password must be 6 or more chars.";
					this.passwordConfirmError = "Your password must be 6 or more chars.";
					return;
				}

				if (this.password.trim() !== this.passwordConfirm.trim()) {
					this.passwordError        = "Your passwords do not match.";
					this.passwordConfirmError = "Your passwords do not match.";
					return;
				}

				this.submitting = true;

				axios.post('/auth/register', {email : this.email, password : this.password, password_confirm : this.passwordConfirm})
					.then(response => {
						this.$store.postLogin(response.data);
						this.$router.push({path : '/account'});
					})
					.catch(error => {

						if (error.response && error.response.data && !error.response.data.success) {
							this.error = error.response.data.message;
						}

						console.error(error);
					})
					.finally(() => {
						console.log('register complete');
						this.submitting = false;
					});
			},

		},
	};
</script>

<style scoped lang="scss">

</style>
