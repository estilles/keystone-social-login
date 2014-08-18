var _ = require('underscore'),
	chai = require('chai'),
	expect = chai.expect,
	sinon = require('sinon'),
	sinonChai = require('sinon-chai'),
	SocialLogin = require('../../lib/social'),
	social,
	error,
	keystone;

chai.use(sinonChai);

describe('.init()', function () {

	before(function () {
		social = SocialLogin();

		error = sinon.stub(social, '__error');
		error.throws();

		keystone = {
			get: sinon.stub(),
			set: sinon.stub()
		};
		keystone.get.withArgs('signin url').returns(undefined);
		keystone.get.withArgs('static').returns('public');
	});

	after(function () {
		error.restore();
	});

	describe('when not configured correctly', function() {

		it('should error if "keystone" not set to an object', function () {
			expect(function() {
				social.init();
			}).to.throw();
			expect(error).to.have.been.calledWithExactly('Configuration missing "keystone" object', 'ConfigError');
		});

		it('should error if no providers have been configured', function () {
			expect(function() {
				social.set('keystone', keystone);
				social.init();
			}).to.throw();
			expect(error).to.have.been.calledWithExactly('No providers configured. You must configure at least one provider.', 'ConfigError');
		});

	});

	describe('when configured correctly', function () {
		var providers, config;

		before(function () {
			providers = {
				google: { 
					clientID: 'my-client-id', 
					clientSecret: 'my-super-duper-top-secret-key'
				}
			};

			config = {
				keystone: keystone,
				providers: providers,
				'signin url': 'path/to/signin'
			};
			social.config(config);
		});

		it('should set keystone "signin url"', function () {
			expect(keystone.set).to.have.been.calledWithExactly('signin url', config['signin url']);
		});
		
		it('should replace keystone "static"', function () {
			expect(keystone.get).to.have.been.calledWith('static');
			expect(keystone.set).to.have.been.calledWith('static');
		});
		
	});

});