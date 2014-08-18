var _ = require('underscore'),
	chai = require('chai'),
	expect = chai.expect,
	sinon = require('sinon'),
	sinonChai = require('sinon-chai'),
	SocialLogin = require('../../lib/social'),
	social,
	error;

chai.use(sinonChai);

describe('.use()', function () {

	before(function () {
		social = SocialLogin();
		
		error = sinon.stub(social, '__error');
		error.throws();
	});

	after(function () {
		error.restore();
	});

	describe('with invalid arguments', function () {

		beforeEach(function () {
			social._options.providers = {};
		});

		it('should error when called with no arguments', function() {
			expect(function() {
				social.use();
			}).to.throw();
			expect(error).to.have.been.calledWithExactly('"config" must be an object', 'TypeError');
		});

		it('should error when called with a non-object argument', function() {
			expect(function() {
				social.use('invalid');
			}).to.throw();
			expect(error).to.be.calledWithExactly('"config" must be an object', 'TypeError');
		});

		it('should error when called with an invalid provider name', function() {
			var config = {
				invalid: { 
					clientID: 'my-client-id', 
					clientSecret: 'my-super-duper-top-secret-key'
				}
			};

			expect(function() {
				social.use(config);
			}).to.throw();
			expect(error).to.have.been.calledWithExactly('Provider "invalid" is not supported', 'ConfigError');
		});

		it('should error when called with non-object provider options', function() {
			var config = {
				google: 'invalid'
			};

			expect(function() {
				social.use(config);
			}).to.throw();
			expect(error).to.have.been.calledWithExactly('Provider options for "google" must be an object', 'TypeError');
		});

		it('should error when called with missing "clientID" option', function() {
			var config = {
				google: { 
					invalid: 'my-client-id', 
					clientSecret: 'my-super-duper-top-secret-key'
				}
			};

			expect(function() {
				social.use(config);
			}).to.throw();
			expect(error).to.have.been.calledWithExactly('Provider options for "google" are missing the "clientID"', 'ConfigError');
		});

		it('should error when called with missing "clientSecret" option', function() {
			var config = {
				google: { 
					clientID: 'my-client-id', 
					invalid: 'my-super-duper-top-secret-key'
				}
			};

			expect(function() {
				social.use(config);
			}).to.throw();
			expect(error).to.have.been.calledWithExactly('Provider options for "google" are missing the "clientSecret"', 'ConfigError');
		});

		it('should error when called with a duplicate provider', function() {
			var config = {
				google: { 
					clientID: 'my-client-id', 
					clientSecret: 'my-super-duper-top-secret-key'
				}
			};

			expect(function() {
				social.use(config);
				social.use(config);
			}).to.throw();
			expect(error).to.have.been.calledWithExactly('Duplicate provider. "google" was already configured', 'ConfigError');
		});

	});

	describe('with required arguments', function () {

		beforeEach(function () {
			social._options.providers = {};
		});

		it('should add the provider to the configuration', function() {
			var config = {
				google: { 
					clientID: 'my-client-id', 
					clientSecret: 'my-super-duper-top-secret-key'
				}
			};
			social.use(config);
			expect(social.get('providers').google.options.clientID).to.equal(config.google.clientID);
			expect(social.get('providers').google.options.clientSecret).to.equal(config.google.clientSecret);
		});		

		it('should accept "google", "twitter", "github" and "facebook"', function() {
			var config = {
				google: { 
					clientID: 'google-client-id', 
					clientSecret: 'google-super-duper-top-secret-key'
				},
				twitter: { 
					clientID: 'twitter-client-id', 
					clientSecret: 'twitter-super-duper-top-secret-key'
				},
				github: { 
					clientID: 'github-client-id', 
					clientSecret: 'github-super-duper-top-secret-key'
				},
				facebook: { 
					clientID: 'facebook-client-id', 
					clientSecret: 'facebook-super-duper-top-secret-key'
				}
			};
			social.use(config);

			expect(social.get('providers').google.options.clientID).to.equal(config.google.clientID);
			expect(social.get('providers').google.options.clientSecret).to.equal(config.google.clientSecret);

			expect(social.get('providers').twitter.options.clientID).to.equal(config.twitter.clientID);
			expect(social.get('providers').twitter.options.clientSecret).to.equal(config.twitter.clientSecret);

			expect(social.get('providers').github.options.clientID).to.equal(config.github.clientID);
			expect(social.get('providers').github.options.clientSecret).to.equal(config.github.clientSecret);

			expect(social.get('providers').facebook.options.clientID).to.equal(config.facebook.clientID);
			expect(social.get('providers').facebook.options.clientSecret).to.equal(config.facebook.clientSecret);
		});		

	});

	describe('with all arguments', function () {

		beforeEach(function () {
			social._options.providers = {};
		});

		it('should add single provider with all arguments', function() {
			var config = {
				google: { 
					clientID: 'my-client-id', 
					clientSecret: 'my-super-duper-top-secret-key',
					url: {
						login: '/path/to/login',
						callback: '/path/to/callback'
					},
					additional: {
						scope: [ 'my-scope' ]
					}
				}
			};
			social.use(config);

			expect(social.get('providers').google.options.clientID).to.equal(config.google.clientID);
			expect(social.get('providers').google.options.clientSecret).to.equal(config.google.clientSecret);
			expect(social.get('providers').google.options.url.login).to.equal(config.google.url.login);
			expect(social.get('providers').google.options.url.callback).to.equal(config.google.url.callback);
			expect(social.get('providers').google.options.additional.scope).to.equal(config.google.additional.scope);
		});		

		it('should add multiple providers with all arguments', function() {
			var config = {
				google: { 
					clientID: 'google-client-id', 
					clientSecret: 'google-super-duper-top-secret-key',
					url: {
						login: '/path/to/google/login',
						callback: '/path/to/google/callback'
					},
					additional: {
						scope: [ 'google-scope' ]
					}
				},
				twitter: { 
					clientID: 'twitter-client-id', 
					clientSecret: 'twitter-super-duper-top-secret-key',
					url: {
						login: '/path/to/twitter/login',
						callback: '/path/to/twitter/callback'
					},
					additional: {
						scope: [ 'twitter-scope' ]
					}
				},
				github: { 
					clientID: 'github-client-id', 
					clientSecret: 'github-super-duper-top-secret-key',
					url: {
						login: '/path/to/github/login',
						callback: '/path/to/github/callback'
					},
					additional: {
						scope: [ 'github-scope' ]
					}
				},
				facebook: { 
					clientID: 'facebook-client-id', 
					clientSecret: 'facebook-super-duper-top-secret-key',
					url: {
						login: '/path/to/facebook/login',
						callback: '/path/to/facebook/callback'
					},
					additional: {
						scope: [ 'facebook-scope' ]
					}
				}
			};
			social.use(config);
			expect(social.get('providers').google.options.clientID).to.equal(config.google.clientID);
			expect(social.get('providers').google.options.clientSecret).to.equal(config.google.clientSecret);
			expect(social.get('providers').google.options.url.login).to.equal(config.google.url.login);
			expect(social.get('providers').google.options.url.callback).to.equal(config.google.url.callback);
			expect(social.get('providers').google.options.additional.scope).to.equal(config.google.additional.scope);

			expect(social.get('providers').twitter.options.clientID).to.equal(config.twitter.clientID);
			expect(social.get('providers').twitter.options.clientSecret).to.equal(config.twitter.clientSecret);
			expect(social.get('providers').twitter.options.url.login).to.equal(config.twitter.url.login);
			expect(social.get('providers').twitter.options.url.callback).to.equal(config.twitter.url.callback);
			expect(social.get('providers').twitter.options.additional.scope).to.equal(config.twitter.additional.scope);

			expect(social.get('providers').github.options.clientID).to.equal(config.github.clientID);
			expect(social.get('providers').github.options.clientSecret).to.equal(config.github.clientSecret);
			expect(social.get('providers').github.options.url.login).to.equal(config.github.url.login);
			expect(social.get('providers').github.options.url.callback).to.equal(config.github.url.callback);
			expect(social.get('providers').github.options.additional.scope).to.equal(config.github.additional.scope);

			expect(social.get('providers').facebook.options.clientID).to.equal(config.facebook.clientID);
			expect(social.get('providers').facebook.options.clientSecret).to.equal(config.facebook.clientSecret);
			expect(social.get('providers').facebook.options.url.login).to.equal(config.facebook.url.login);
			expect(social.get('providers').facebook.options.url.callback).to.equal(config.facebook.url.callback);
			expect(social.get('providers').facebook.options.additional.scope).to.equal(config.facebook.additional.scope);
		});		

	});

});