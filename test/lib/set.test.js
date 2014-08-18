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
		error.throws();
	});

	after(function () {
		error.restore();
	});

	describe('with invalid arguments', function () {

		it('should error when called with no arguments', function() {
			expect(function() {
				social.set();
			}).to.throw();
			expect(error).to.have.been.calledWithExactly('Invalid number of arguments.', 'ConfigError');
		});	
	
		it('should error when called with invalid option', function() {
			expect(function() {
				social.set('invalid', 'value');
			}).to.throw();
			expect(error).to.have.been.calledWithExactly('Invalid configuration settings. "invalid" is not a valid setting option.', 'ConfigError');
		});	
	
		it('should error when setting "keystone" to a non-object', function() {
			expect(function() {
				social.set('keystone', 'value');
			}).to.throw();
			expect(error).to.have.been.calledWithExactly('Invalid configuration settings. "keystone" must be an object.', 'TypeError');
		});	
	
		it('should error when setting "signin url" to a non-string', function() {
			expect(function() {
				social.set('signin url', {});
			}).to.throw();
			expect(error).to.have.been.calledWithExactly('Invalid configuration settings. "signin url" must be a string.', 'TypeError');
		});	
	
		it('should error when setting "auto create user" to a non-boolean', function() {
			expect(function() {
				social.set('auto create user', 'valid');
			}).to.throw();
			expect(error).to.have.been.calledWithExactly('Invalid configuration settings. "auto create user" must be a boolean.', 'TypeError');
		});	
	
		it('should error when setting "onAuthenticate" to a non-function', function() {
			expect(function() {
				social.set('onAuthenticate', 'valid');
			}).to.throw();
			expect(error).to.have.been.calledWithExactly('Invalid configuration settings. "onAuthenticate" must be a function.', 'TypeError');
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
		
	});
	
});