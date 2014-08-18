/**
 * GitHub provider default settings
 * @type {Object}
 */
var provider = {
	name: 'github',
	strategy: {
		module: 'passport-github',
		method: 'Strategy'
	},
	id: 'id',
	settings:	{
		clientID:	'clientID',
		clientSecret:	'clientSecret'
	},
	options: {
		clientID:	null,
		clientSecret:	null,
		url: {
			login: '/social/github/login',
			callback: '/social/github/callback'		
		},
		additional: {
			scope: [ 'user:email' ]
		}
	},
	loginId: { name: 'login', label: 'GitHub Login' },
	parseProfile: function(jsonProfile) {
		return {
			id: jsonProfile.id.toString(),
			email: jsonProfile.email,
			name: jsonProfile.name,
			photoUrl: jsonProfile.avatar_url, // jshint ignore:line
			profileUrl: jsonProfile.html_url 	// jshint ignore:line
		};
	}
};

module.exports = provider;
