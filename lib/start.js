var _ = require('underscore'),
	path = require('path'),
	serveStatic = require('serve-static'),
	passport = require('passport');

/**
 * initialize plugin and hook itself into keystone
 * @api	public
 */
var start = function start() {
	var keystone = this.get('keystone'),
		routes,
		app;

	// make sure we have keystone
	if (!_.isObject(keystone)) {
		return this.__error('configuration missing "keystone" object', 'ConfigError');
	}

	// make sure we have at least one provider
	if (!_.keys(this.get('providers')).length) {
		return this.__error('No providers configured. You must configure at least one provider.', 'ConfigError');
	}

	// get the app and the routes
	app = keystone.app;
	routes = keystone.get('routes');

	// serve files from our public folder
	app.use('/social', require('less-middleware')(path.join(__dirname, 'public')));
	app.use('/social', serveStatic(path.join(__dirname, 'public')));

	// initialize passport
	keystone.pre('routes', passport.initialize());
	keystone.pre('routes', passport.session());

	// inject our routes, followed by the application routes
	keystone.set('routes', function() {

		app.get('/social/login', this.__login.bind(this));

		// configure plugin routes
		_.each(this.get('providers'), function(provider) {
			var signInRedirect = keystone.get('signin redirect') || '/keystone';

			// route for the authentication entry point
			app.get(provider.options.url.login, passport.authenticate(provider.name));

			app.get(provider.options.url.callback, function(req, res, next) {

				passport.authenticate(provider.name, function(err, user) {

					// fix for Twiter non-standard response
					if (req.query.denied) {
						req.query.error = 'access_denied';
					}

					// check for error responses, flash and redirect
					switch(req.query.error) {
						case 'invalid_request':
							req.flash('error', 'User refused to grant access.');
							return res.redirect(this.get('signin url'));

						case 'invalid_client':
							req.flash('error', 'The client identifier provided is invalid.');
							return res.redirect(this.get('signin url'));

						case 'unauthorized_client':
							req.flash('error', 'The client is not authorized to use the requested response type.');
							return res.redirect(this.get('signin url'));

						case 'redirect_uri_mismatch':
							req.flash('error', 'The redirection URI provided does not match a pre-registered value.');
							return res.redirect(this.get('signin url'));

						case 'access_denied':
							req.flash('error', 'The end-user or authorization server denied the request.');
							return res.redirect(this.get('signin url'));

						case 'unsupported_response_type':
							req.flash('error', 'The requested response type is not supported by the authorization server.');
							return res.redirect(this.get('signin url'));

						case 'invalid_scope':
							req.flash('error', 'The requested scope is invalid, unknown, or malformed.');
							return res.redirect(this.get('signin url'));

						case 'application_suspended':
							req.flash('error', 'OAuth application has been suspended.');
							return res.redirect(this.get('signin url'));
					}

					// check for other errors
					if (err) {
						return next(err);
					}

					// check if user was found
					if (!user) {
						req.flash('error', 'Unable to find user.');
						return res.redirect(this.get('signin url'));
					}

					// attempt to log in user
					req.logIn(user, function(err) {
						if (err) {
							return next(err);
						}
						return res.redirect(signInRedirect);
					});

				}.bind(this))(req, res, next);

			}.bind(this));

		}.bind(this));

		// configure application routes
		if (_.isFunction(routes)) {
			routes.call(keystone, app);
		}

	}.bind(this));

};

module.exports = start;
