/**
 * Twitter provider default settings
 * @type {Object}
 */
var provider = {
	name: 'twitter',
	strategy: {
		module: 'passport-twitter',
		method: 'Strategy'
	},
	fields: {
		uniqueid: 'id',
		linkid: 'screen_name'
	},
	settings:	{
		clientID:	'consumerKey',
		clientSecret:	'consumerSecret'
	},
	options: {
		clientID:	null,
		clientSecret:	null,
		url: {
			login: '/social/twitter/login',
			callback: '/social/twitter/callback'		
		}
	},
	loginId: { name: 'screen_name', label: 'Twitter Screen Name' },
	parseProfile: function(jsonProfile) {
		return {
			id: jsonProfile.id_str,	// jshint ignore:line
			email: null,
			name: jsonProfile.name,
			photoUrl: jsonProfile.profile_image_url, // jshint ignore:line
			profileUrl: 'https://twitter.com/' + jsonProfile.screen_name // jshint ignore:line
		};
	}
};

module.exports = provider;
