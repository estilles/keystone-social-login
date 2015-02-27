var _ = require('underscore');

var config = function config(settings) {
	// make sure settings is an object
	if (!_.isObject(settings)) {
		return this.__error('Invalid configuration settings. Must be an object.', 'TypeError');
	}

	// parse settings
	_.each(settings, function(value, key) {
		switch (key) {
			case 'keystone':
			case 'signin url':
			case 'auto create user':
			case 'onAuthenticate':
				this.set(key, value);
			break;

			case 'providers':
				this.use(value);
			break;

			default:
				return this.__error('Invalid configuration settings. "' + key + '" is not a valid setting.', 'ConfigError');
		}
	}.bind(this));

	// initialize plugin now that everything is configured
	this.init();
};

module.exports = config;
