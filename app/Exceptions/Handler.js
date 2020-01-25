'use strict';

const BaseExceptionHandler = use('BaseExceptionHandler');

const bugsnag = use('BugSnag');

/**
 * This class handles all exceptions thrown during
 * the HTTP request lifecycle.
 *
 * @class ExceptionHandler
 */
class ExceptionHandler extends BaseExceptionHandler {
	/**
	 * Handle exception thrown during the HTTP lifecycle
	 *
	 * @method handle
	 *
	 * @param  {Object} error
	 * @param  {Object} options.request
	 * @param  {Object} options.response
	 *
	 * @return {void}
	 */
	async handle(error, {request, response})
	{
		response.status(error.status).send(error.message);
	}

	/**
	 * Report exception for logging or debugging.
	 *
	 * @method report
	 *
	 * @param  {Object} error
	 * @param  {Object} options.request
	 *
	 * @return {void}
	 */
	async report(error, {request})
	{
		let metaData = {
			headers : request.headers(),
			format  : request.format(),
			body    : request.raw(),
			method  : request.method().toLowerCase(),
		};

		metaData[(metaData.method == "get" ? "querystring" : "entity_body")] = request.all();

		await bugsnag.notify(error, request, metaData);
	}
}

module.exports = ExceptionHandler;
