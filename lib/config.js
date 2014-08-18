var _ = require('underscore');

var config = function config(settings) {
	var _this = this;

	// make sure settings is an object
	if (!_.isObject(settings)) {
		this.__error('Invalid configuration settings. Must be an object.', 'TypeError');
	}

	// parse settings
	_.each(settings, function(value, key) {
		switch (key) {
			case 'keystone':
			case 'signin url':
			case 'auto create user':
			case 'onAuthenticate':
				_this.set(key, value);
			break;

			case 'providers':
				_this.use(value);
			break;

			default:
				_this.__error('Invalid configuration settings. "' + key + '" is not a valid setting.', 'ConfigError');
		}
	});

	// initialize plugin now that everything is configured
	this.init();
};

module.exports = config;
