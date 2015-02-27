/**
 * utils.js
 * utility functions
 */

exports.serializeUser = function serializeUser(user, done) {
	done(null, user._id);
};

exports.deserializeUser = function(keystone) {
	return function deserializeUser(id, done) {
		var User = keystone.list(keystone.get('user model')).model;

		User.findById(id).exec(function(err, user) {
			if (err) { return done(err); }
			if (!user) { return done(null, false); }
			return done(null, user);
		});
	};
};