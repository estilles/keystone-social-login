var _ = require('underscore'),
	chai = require('chai'),
	expect = chai.expect,
	sinon = require('sinon'),
	sinonChai = require('sinon-chai'),
	SocialLogin = require('../../lib/social'),
	social,
	error,
	init;

chai.use(sinonChai);

describe('.config()', function () {

	before(function () {
		social = SocialLogin();
		
		error = sinon.stub(social, '__error');
		error.throws();

		init = sinon.stub(social, 'init');
	});

	after(function () {
		error.restore();
		init.restore();
	});

	describe('with invalid arguments', function () {

		it('should error when called with no arguments', function() {
			expect(function() {
				social.config();
			}).to.throw();
			expect(error).to.have.been.calledWithExactly('Invalid configuration settings. Must be an object.', 'TypeError');
			expect(init).not.to.have.been.called;
		});

		it('should error when called with a non-object', function() {
			expect(function() {
				social.config('invalid');
			}).to.throw();
			expect(error).to.have.been.calledWithExactly('Invalid configuration settings. Must be an object.', 'TypeError');
			expect(init).not.to.have.been.called;
		});

		it('should error when called with an invalid option', function() {
			expect(function() {
				social.config({
					'invalid': 'value'
				});
			}).to.throw();
			expect(error).to.have.been.calledWithExactly('Invalid configuration settings. "invalid" is not a valid setting.', 'ConfigError');
			expect(init).not.to.have.been.called;
		});

	});

	describe('with valid arguments', function () {

		it('should set the options and call .init() once', function () {
			var keystone = { keystone: true },
				providers = {
					google: { 
						clientID: 'my-client-id', 
						clientSecret: 'my-super-duper-top-secret-key'
					}
				};

			social.config({
				keystone: keystone,
				providers: providers
			});
			
			expect(social.get('keystone')).to.eql(keystone);
			expect(social.get('providers').google.options.clientID).to.equal(providers.google.clientID);
			expect(social.get('providers').google.options.clientSecret).to.equal(providers.google.clientSecret);
			expect(init).to.have.been.calledOnce;
		});
		
	});
		
});
