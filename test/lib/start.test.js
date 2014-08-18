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

describe('.start()', function () {

	before(function () {
		social = SocialLogin();

		error = sinon.stub(social, '__error');
		error.throws();

		keystone = {
			get: sinon.stub(),
			set: sinon.stub(),
			pre: sinon.stub(),
			app: {
				use: sinon.stub()
			}
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
			social.start();
		});

		it('should get keystone "routes"', function () {
			expect(keystone.get).to.have.been.calledWithExactly('routes');
		});
		
		it('should call app.use() twice to use "less" and server "public"', function () {
			expect(keystone.app.use).to.have.been.calledTwice;
			expect(keystone.app.use.firstCall).to.have.been.calledWith('/social');
			expect(keystone.app.use.secondCall).to.have.been.calledWith('/social');
		});
		
		it('should call keystone.pre() twice to initialize passport', function () {
			expect(keystone.pre).to.have.been.calledTwice;
			expect(keystone.pre.firstCall).to.have.been.calledWith('routes');
			expect(keystone.pre.secondCall).to.have.been.calledWith('routes');
		});
		
		it('should set keystone "routes"', function () {
			expect(keystone.set).to.have.been.calledWith('routes');
		});
		
	});

});
