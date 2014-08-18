var _ = require('underscore'),
	jade = require('jade'),
	path = require('path');

var login = function login(req, res) {
	var template,
		app = this.get('keystone'),
		locals,
		flashMessages;

	// send to keyston login if already logged in
	if (req.user) {
		return res.redirect(this.__signinUrl);
	}

	// compile the login template
	template = jade.compileFile(
		path.join(__dirname,'templates/login.jade'),  
		{ pretty: true }
	);

	// get all flash messages
	flashMessages = {
		info: req.flash('info'),
		success: req.flash('success'),
		warning: req.flash('warning'),
		error: req.flash('error'),
		hilight: req.flash('hilight')
	};
	
	// underscore mixin for capitalizing strings
	_.mixin({
		capitalize: function(string) {
			return string.charAt(0).toUpperCase() + string.substring(1).toLowerCase();
		}
	});

	// build a locals object for the view
	locals = {
		_: _,
		brand: app.get('brand'),
		messages: _.any(flashMessages, function(msgs) { return msgs.length; }) ? flashMessages : false,
		ga: {
			property: app.get('ga property'),
			domain: app.get('ga domain')
		},
		signin: this.__signinUrl || '/keystone/signin',
		providers: _.keys(this.get('providers'))
	};

	// render the view
	res.send(template(locals));
};

module.exports = login;
