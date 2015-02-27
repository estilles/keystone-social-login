var _ = require('underscore'),
	chai = require('chai'),
	expect = chai.expect,
	sinon = require('sinon'),
	sinonChai = require('sinon-chai'),
	SocialLogin = require('../../lib/social'),
	social,
	error;

chai.use(sinonChai);

describe('.set()/.get()', function () {

	before(function () {
		social = SocialLogin();	
		error = sinon.stub(social, '__error');
	});

	after(function() {
		error.restore();		
	})

	describe('with invalid arguments', function () {
		afterEach(function () {
			error.reset();
		});

		it('should error when called with no arguments', function() {
			social.set();
			expect(error).to.have.been.called.once;
			expect(error).to.have.been.calledWithExactly('Invalid number of arguments.', 'ConfigError');
		});	
	
		it('should error when called with invalid option', function() {
			social.set('invalid', 'value');
			expect(error).to.have.been.called.once;
			expect(error).to.have.been.calledWithExactly('Invalid configuration settings. "invalid" is not a valid setting option.', 'ConfigError');
		});	
	
		it('should error when setting "keystone" to a non-object', function() {
			social.set('keystone', 'value');
			expect(error).to.have.been.called.once;
			expect(error).to.have.been.calledWithExactly('Invalid configuration settings. "keystone" must be an object.', 'TypeError');
		});	
	
		it('should error when setting "signin url" to a non-string', function() {
			social.set('signin url', {});
			expect(error).to.have.been.called.once;
			expect(error).to.have.been.calledWithExactly('Invalid configuration settings. "signin url" must be a string.', 'TypeError');
		});	
	
		it('should error when setting "auto create user" to a non-boolean', function() {
			social.set('auto create user', 'valid');
			expect(error).to.have.been.called.once;
			expect(error).to.have.been.calledWithExactly('Invalid configuration settings. "auto create user" must be a boolean.', 'TypeError');
		});	
	
		it('should error when setting "onAuthenticate" to a non-function', function() {
			social.set('onAuthenticate', 'valid');
			expect(error).to.have.been.called.once;
			expect(error).to.have.been.calledWithExactly('Invalid configuration settings. "onAuthenticate" must be a function.', 'TypeError');
		});	
	
		it('should error when setting "providers" to a non-object', function() {
			social.set('providers', 'valid');
			expect(error).to.have.been.called.once;
			expect(error).to.have.been.calledWithExactly('Invalid configuration settings. "providers" must be an object.', 'TypeError');
		});	
	
	});

	describe('with valid arguments', function () {

		it('should set "keystone" to passed object', function () {
			var option = 'keystone',
				value = { keystone: true };
			social.set(option, value);
			expect(social.get(option)).to.be.an('object');
			expect(social.get(option)).to.equal(value);
		});
		
		it('should set "signin url" to passed string', function () {
			var option = 'signin url',
				value = '/path/to/url';
			social.set(option, value);
			expect(social.get(option)).to.be.a('string');
			expect(social.get(option)).to.equal(value);
		});
		
		it('should set "auto create user" to passed string', function () {
			var option = 'auto create user';
			social.set(option, true);
			expect(social.get(option)).to.a('boolean');
			expect(social.get(option)).to.be.true;
		});
		
		it('should set "onAuthenticate" to passed function', function () {
			var option = 'onAuthenticate',
				value = function() { return true };
			social.set(option, value);
			expect(social.get(option)).to.be.a('function');
			expect(social.get(option)).to.equal(value);
		});

		it('should set "providers" to passed object', function () {
			var option = 'providers',
				value = {
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
				},
				settting;
			social.set(option, value);
			setting = social.get(option);

			expect(setting).to.be.an('object');
			expect(setting.google.options.clientID).to.equal(value.google.clientID);
			expect(setting.google.options.clientSecret).to.equal(value.google.clientSecret);

			expect(setting.twitter.options.clientID).to.equal(value.twitter.clientID);
			expect(setting.twitter.options.clientSecret).to.equal(value.twitter.clientSecret);

			expect(setting.github.options.clientID).to.equal(value.github.clientID);
			expect(setting.github.options.clientSecret).to.equal(value.github.clientSecret);

			expect(setting.facebook.options.clientID).to.equal(value.facebook.clientID);
			expect(setting.facebook.options.clientSecret).to.equal(value.facebook.clientSecret);
		});
		
	});
	
});
