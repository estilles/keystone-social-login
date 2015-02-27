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
		afterEach(function() {
			error.reset();
		})

		it('should error if "keystone" not set to an object', function () {
			social.init();
			expect(error).to.have.been.called.once;
			expect(error).to.have.been.calledWithExactly('Configuration missing "keystone" object', 'ConfigError');
		});

		it('should error if no providers have been configured', function () {
			social.set('keystone', keystone);
			social.init();
			expect(error).to.have.been.called.once;
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