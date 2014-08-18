/**
 * use.js
 * allows users to provision the providers to be used
 */

var _ = require('underscore'),
	providers = require('./providers');

/**
 * configure an individual provider
 * @param  {object} config - provider specific options
 */
var use = function use(config) {
	var _this = this,
		provider;

	if (!_.isObject(config)) {
		this.__error('"config" must be an object', 'TypeError');
	}

	_.each(config, function(options, name) {
		if (!_.has(providers, name)) {
			_this.__error('Provider "' + name +'" is not supported', 'ConfigError');
		}

		if (_.has(_this._options.providers, name)) {
			_this.__error('Duplicate provider. "' + name +'" was already configured', 'ConfigError');
		}

		if (!_.isObject(options)) {
			_this.__error('Provider options for "' + name +'" must be an object', 'TypeError');
		}

		if (!options.clientID) {
			_this.__error('Provider options for "' + name +'" are missing the "clientID"', 'ConfigError');
		}

		if (!options.clientSecret) {
			_this.__error('Provider options for "' + name +'" are missing the "clientSecret"', 'ConfigError');
		}

		provider = providers[name];
		provider.options = _.defaults(options, provider.options);
		_this._options.providers[name] = provider;
	});

};

module.exports = use;
