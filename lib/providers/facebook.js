/**
 * Facebook provider default settings
 * @type {Object}
 */
var provider = {
	name: 'facebook',
	strategy: {
		module: 'passport-facebook',
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
			login: '/social/facebook/login',
			callback: '/social/facebook/callback'		
		},
		additional: {
			scope: ['public_profile', 'email'],
			enableProof: false
		}
	},
	loginId: { name: 'email', label: 'Facebook E-Mail' },
	parseProfile: function(jsonProfile) {
		return {
			id: jsonProfile.id,
			email: jsonProfile.email,
			name: jsonProfile.name,
			photoUrl: null,
			profileUrl: jsonProfile.link
		};
	}
};

module.exports = provider;
