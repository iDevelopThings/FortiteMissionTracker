export default {
	ready : false,

	user  : null,
	token : null,

	postLogin(data)
	{
		console.log(data);

		window.localStorage.setItem('token', data.token);

		this.user  = data.user;
		this.token = data.token;

	},

	/**
	 *
	 * @returns {{CancelTokenSource: CancelTokenSource; CancelStatic: CancelStatic; AxiosProxyConfig: AxiosProxyConfig; Canceler: Canceler; AxiosStatic:
	 *     AxiosStatic; AxiosRequestConfig: AxiosRequestConfig; AxiosTransformer: AxiosTransformer; Cancel: Cancel; AxiosInstance: AxiosInstance; AxiosError:
	 *     AxiosError; Method: Method; AxiosPromise: AxiosPromise; CancelTokenStatic: CancelTokenStatic; AxiosBasicCredentials: AxiosBasicCredentials;
	 *     ResponseType: ResponseType; CancelToken: CancelToken; AxiosInterceptorManager: AxiosInterceptorManager; AxiosResponse: AxiosResponse; AxiosAdapter:
	 *     AxiosAdapter; readonly default: AxiosStatic} | AxiosStatic}
	 */
	api()
	{
		if (this.token)
			axios.defaults.headers.common['Authorization'] = `Bearer ${this.token}`;

		return axios;
	},

	async checkAndHandleAuth()
	{
		let token = window.localStorage.getItem('token');

		if (token !== null && token !== undefined) {
			this.token                                     = token;
			axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
			this.user                                      = await this.getUser();

			this.ready = true;
			return true;
		}

		this.ready = true;
		return false;
	},

	async getUser()
	{
		try {
			let response = await this.api().get('/auth/me');

			return response.data;
		} catch (e) {
			throw e;
		}
	},
};