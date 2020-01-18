'use strict';

const User = use('App/Models/User');
const Hash = use('Hash');

class AuthController {

	async register({request, response, auth})
	{

		let {email, password, password_confirm} = request.all();

		if (password.trim().length < 6 || password_confirm.trim().length < 6) {
			return response.status(500).json({success : false, error : 'Password must be 6 or more chars.'});
		}

		if (password.trim() !== password_confirm.trim()) {
			return response.status(500).json({success : false, error : 'Your passwords do not match.'});
		}

		let user = await User.query()
			.where('email', email)
			.first();

		if (user)
			return response.status(500).json({success : false, message : 'This email is already in use.'});

		user = await User.create({
			email    : email,
			password : password,
		});

		return response.json({success : true, ...await auth.generate(user), ...{user : user}});

	}

	async login({request, response, auth})
	{
		let {email, password} = request.all();

		try {
			let loginRes = await auth.attempt(email, password);

			let user = await User.query().where('email', email).first();

			return response.json({success : true, ...loginRes, ...{user : user}});
		} catch (e) {
			console.log(e);
			return response.status(500).json({success : false, message : 'Failed to login...'});
		}
	}

	async me({request, response, auth})
	{
		return response.json(auth.user);
	}

	async tokens({request, response, auth})
	{
		let tokens = await auth
			.user
			.tokens()
			.fetch();

		tokens = tokens.toJSON();

		tokens.map(token => {
			delete token.token;
		});

		return response.json(tokens);
	}

	async generateToken({request, response, auth})
	{
		let token = await auth
			.authenticator('api')
			.generate(await auth.getUser());

		return response.json(token);
	}

	async deleteToken({request, response, auth, params})
	{
		let tokens = await auth
			.user
			.tokens()
			.where('id', params.id)
			.where('type', 'api_token')
			.delete();

		return response.json({success : true});
	}

}

module.exports = AuthController;
