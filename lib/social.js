var _ = require('underscore');

/**
 * SocialLogin class
 * @constructor
 * @param {object} options user defined options
 */
var SocialLogin = function(options) {
	if (!(this instanceof SocialLogin)) {
		return new SocialLogin(options);
	}
	var defaults = {
		'keystone': null,
		'signin url' : '/social/login',
		'providers': {},
		'auto create user': false,
		'onAuthenticate': null
	};

	// ignore options param if not an object
	if (!_.isObject(options)) {
		options = {};
	}

	// store user options along with any missing defaults
	this._options = _.defaults(options, defaults);

	return this;
};

// public api
SocialLogin.prototype.set = require('./set');
SocialLogin.prototype.get = SocialLogin.prototype.set;
SocialLogin.prototype.config = require('./config');
SocialLogin.prototype.use = require('./use');
SocialLogin.prototype.init = require('./init');
SocialLogin.prototype.start = require('./start');
SocialLogin.prototype.plugin = require('./plugin');

// private api
SocialLogin.prototype.__error = require('./error');
SocialLogin.prototype.__login = require('./login');


// create an instance and export it
module.exports = exports = SocialLogin;
