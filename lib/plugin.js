/**
 * plugin.js
 */
var _ = require('underscore');

/**
 * adds required fields to the keystone user model
 * @param  {List} keystone list of user model
 */
var plugin = function plugin(list) {
	var keystoneFields = {},
		schemaFields = {};

	// make sure we have keystone
	if (!_.isObject(list)) {
		return this.__error('User "list" argument must be an object', 'ConfigError');
	}

	// make sure we have at least one provider
	if (!_.keys(this.get('providers')).length) {
		return this.__error('No providers configured. You must configure at least one provider.', 'ConfigError');
	}

	// add custom fields for each provider
	_.each(this.get('providers'), function(provider) {
		var providerLoginId = provider.name + 'LoginId';

		// provider specific keystone field
		keystoneFields[providerLoginId] = { type: String, label: provider.loginId.label, width: 'medium', initial: true, index: true };

		// provider specific support fields to store a standardized/normalized version of the profile object
		schemaFields[provider] = {
			id: { type: String, index: true },
			name: { type: String },
			email: { type: String },
			photoUrl : { type: String },
			profileUrl : { type: String },
			accessToken: { type: String },
			refreshToken: { type: String }
		};

		// add pre save hooks to support user changes to provider login id
		list.schema.pre('save', function(next) {
			var profileID = 'social.' + provider.name + '.id';

			// don't check new documents
			if (!this.isNew) {
				// if user changed the provider login id the existing provider profile is no longer valid
				if (this.isModified(providerLoginId) && (this.get(providerLoginId) !== this.get(profileID))) {
					this.set('social.' + provider.name + '.id', '');
					this.set('social.' + provider.name + '.name', '');
					this.set('social.' + provider.name + '.email', '');
					this.set('social.' + provider.name + '.photoUrl', '');
					this.set('social.' + provider.name + '.profileUrl', '');
				}
			}

			next();
		});
	});

	// add fields to keystone list
	list.add('Social Login Accounts', keystoneFields);
	// add support fields directly to schema
	list.schema.add({ social: schemaFields });
};

module.exports = plugin;
