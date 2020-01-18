<template>
    <div>
        <div class="pb-4 mb-4 text-lg uppercase border-b-2 border-gray-800 flex justify-center items-center">
            <h1 class="w-full">
                Api
            </h1>
            <button class="discord-button w-1/6" @click="createToken()">
                Create Token
            </button>
        </div>

        <div>
            <h3 class="text-lg mb-4">Your Api Tokens: </h3>

            <div v-if="tokens && tokens.length > 0">
                <div v-for="token in tokens" class="p-3 bg-gray-800 mb-3 rounded flex justify-center items-center">
                    <strong class="w-full">Type: {{token.type}} | Created: {{token.created_at}}</strong>
                    <a v-if="token.type ==='api_token'" href="javascript:;" v-tooltip="'Delete Token'" class="font-bold text-red-500 text-lg"
                       @click="deleteToken(token)">x</a>
                </div>
            </div>
            <div v-if="tokens && tokens.length === 0" class="flex justify-center items-center flex-col">
                <h3 class="text-lg font-bold ">You have not created any tokens yet.</h3>
                <p class="mb-4 text-gray-600">You can create one by clicking the button below.</p>
                <button class="discord-button w-1/6" @click="createToken()">
                    Create Token
                </button>
            </div>

            <div v-if="token">
                <div class="p-3">
                    <strong>Your token was created successfully.</strong>
                    <p class="text-gray-600">Make sure to save this token, you wont be able to get it again.</p>
                    <strong>Sidenote:</strong>
                    <p>If you do use my apis, I'd appreciate it if you joined the <a href="https://discord.gg/KqfAAJj" target="_blank" class="text-blue-500">Discord</a> and let me
                        know what for. Please try to keep api rape to the minimum
                        also.</p>
                </div>
                <div class="p-3 bg-gray-800 mb-3 rounded flex justify-center items-center">
                    <code>
                        <pre>{{token}}</pre>
                    </code>
                </div>
            </div>

        </div>

    </div>
</template>

<script>
	export default {
		name    : "Api",
		mounted()
		{
			this.getTokens();
		},
		data()
		{
			return {
				loading : false,
				tokens  : null,

				token : null,

			};
		},
		methods : {

			async getTokens()
			{
				this.loading = true;
				try {
					let tokens  = await this.$store.api().get('/auth/tokens');
					this.tokens = tokens.data;
				} catch (e) {
					console.log(e);
				}
				this.loading = false;
			},

			async createToken()
			{
				try {
					let token = await this.$store.api().post('/auth/tokens');

					this.token = token.data;
					await this.getTokens();
				} catch (e) {
					console.log(e);
				}
			},

			async deleteToken(token)
			{
				try {
					await this.$store.api().delete(`/auth/tokens/` + token.id);

					this.tokens.splice(this.tokens.indexOf(token), 1);
				} catch (e) {
					console.log(e);
				}
			},

		},
	};
</script>

<style scoped lang="scss">

</style>
