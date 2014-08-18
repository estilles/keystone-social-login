/**
 * error handler
 * @param  {string} message error message/description
 * @param  {string} type    error message type/category
 */
var error = function error(message, type) {
	var err = new Error(message),
		stack;

	err.name = type || 'SocialLoginError';

	// remove first two entries in the stack
	stack = err.stack.split('\n');
	stack.splice(1,2);
	stack = stack.join('\n');

	// display custom message
	console.log('------------------------------------------------------------');
	console.log('Error in Keystone Social Login Plugin\n');
	console.log(stack);
	console.log('See https://github.com/JohnnyEstilles/keystone-social-login');
	console.log('------------------------------------------------------------');
	process.exit(1);
};

module.exports = error;
