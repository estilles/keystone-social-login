var _ = require('underscore');

/**
 * set/get option
 * @param {string} key - name of option to set/get
 * @param {*} value - value to set
 */
var set = function set(key, value) {

	// if no arguments
	if (!arguments.length) {
		this.__error('Invalid number of arguments.', 'ConfigError');			
	}

	// if only key argument exist, the treat as a get()
	if (arguments.length === 1) {
		return this._options[key];
	}

	switch (key) {
		case 'keystone':
			if (!_.isObject(value)) {
				return this.__error('Invalid configuration settings. "' + key + '" must be an object.', 'TypeError');			
			}
		break;

		case 'signin url':
			if (!_.isString(value)) {
				return this.__error('Invalid configuration settings. "' + key + '" must be a string.', 'TypeError');			
			}
		break;

		case 'auto create user':
			if (!_.isBoolean(value)) {
				return this.__error('Invalid configuration settings. "' + key + '" must be a boolean.', 'TypeError');			
			}
		break;

		case 'onAuthenticate':
			if (!_.isFunction(value)) {
				return this.__error('Invalid configuration settings. "' + key + '" must be a function.', 'TypeError');			
			}
		break;

		case 'providers':
			if (!_.isObject(value)) {
				return this.__error('Invalid configuration settings. "' + key + '" must be an object.', 'TypeError');			
			}
			this.use(value);
			return value;

		default:
			return this.__error('Invalid configuration settings. "' + key + '" is not a valid setting option.', 'ConfigError');
	}

	return (this._options[key] = value);
};

// export public api function
module.exports = set;
