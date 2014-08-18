var _ = require('underscore'),
	chai = require('chai'),
	expect = chai.expect,
	sinon = require('sinon'),
	sinonChai = require('sinon-chai'),
	SocialLogin = require('../../lib/social'),
	social,
	keystone,
	req,
	res;

chai.use(sinonChai);

describe('.__login()', function () {
	
	before(function () {
		social = SocialLogin();

		keystone = {
			get: sinon.stub(),
			pre: sinon.stub(),
			set: sinon.stub(),
			app: {
				use: sinon.stub()
			}
		};
		keystone.get.withArgs('signin url').returns(undefined);
		keystone.get.withArgs('static').returns('public');
		keystone.get.withArgs('brand').returns('test');
		keystone.get.withArgs('ga property').returns('property');
		keystone.get.withArgs('ga domain').returns('domain');

		req = {
			user: undefined,
			flash: sinon.stub()
		};
		req.flash.withArgs('info').returns(['Test Info Message']);
		req.flash.withArgs('success').returns([]);
		req.flash.withArgs('warning').returns([]);
		req.flash.withArgs('error').returns([]);
		req.flash.withArgs('hilight').returns([]);

		res = {
			redirect: sinon.stub(),
			send: sinon.stub()
		}
	});

	describe('when user is not logged in', function() {

		before(function () {
			providers = {
				google: { 
					clientID: 'my-client-id', 
					clientSecret: 'my-super-duper-top-secret-key'
				}
			};

			config = {
				keystone: keystone,
				providers: providers
			};
			social.config(config);
			social.start();

			social.__login(req, res);
		});

		it('should not redirect to keystone signin', function () {
			expect(res.redirect).not.to.have.been.called;
		});

		it('should get any flash messages', function() {
			expect(req.flash).to.have.callCount(5);
			expect(req.flash).to.have.been.calledWithExactly('info');
			expect(req.flash).to.have.been.calledWithExactly('success');
			expect(req.flash).to.have.been.calledWithExactly('warning');
			expect(req.flash).to.have.been.calledWithExactly('error');
			expect(req.flash).to.have.been.calledWithExactly('hilight');
		});

		it('should get keystone brand', function () {
			expect(keystone.get).to.have.been.calledWithExactly('brand');
		});

		it('should get keystone Google Analytics property/domain', function () {
			expect(keystone.get).to.have.been.calledWithExactly('ga property');
			expect(keystone.get).to.have.been.calledWithExactly('ga domain');
		});

		it('should call req.send()', function() {
			expect(res.send).to.have.been.calledOnce;
		});

	});

	describe('when user is logged in', function() {

		before(function () {
			req.user = {};
			social.__login(req, res);
		});

		it('should redirect to keystone signin', function () {
			expect(res.redirect).to.have.been.calledOnce;
			expect(res.redirect).to.have.been.calledWithExactly(social.__signinUrl);
		});
	});

});