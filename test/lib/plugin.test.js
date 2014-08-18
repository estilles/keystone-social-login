var _ = require('underscore'),
	chai = require('chai'),
	expect = chai.expect,
	sinon = require('sinon'),
	sinonChai = require('sinon-chai'),
	SocialLogin = require('../../lib/social'),
	social;

chai.use(sinonChai);

describe('.plugin()', function () {

	before(function () {
		social = SocialLogin();

		error = sinon.stub(social, '__error');
		error.throws();

		list = {
			add: sinon.stub(),
			schema: {
				pre: sinon.stub(),
				add: sinon.stub()
			}
		};
	});

	describe('when not configured correctly', function() {

		it('should error if "list" argument is missing', function () {
			expect(function() {
				social.plugin();
			}).to.throw();
			expect(error).to.have.been.calledWithExactly('User "list" argument must be an object', 'ConfigError');
		});

		it('should error if "list" is a non-object', function () {
			expect(function() {
				social.plugin('invalid');
			}).to.throw();
			expect(error).to.have.been.calledWithExactly('User "list" argument must be an object', 'ConfigError');
		});

		it('should error if no providers have been configured', function () {
			expect(function() {
				social.plugin(list);
			}).to.throw();
			expect(error).to.have.been.calledWithExactly('No providers configured. You must configure at least one provider.', 'ConfigError');
		});

	});

	describe('when configured correctly', function () {

		before(function () {
			var providers = {
				google: { 
					clientID: 'my-client-id', 
					clientSecret: 'my-super-duper-top-secret-key'
				}
			};
			social.use(providers);
			social.plugin(list);
		});

		it('should call list.scheme.pre once for every provider configured', function () {
			expect(list.schema.pre).to.have.been.calledOnce;
		});

		it('should call list.add once to add fields', function () {
			expect(list.add).to.have.been.calledOnce;
			expect(list.add).to.have.been.calledWith('Social Login Accounts');
		});
		
		it('should call list.schema.add once to add support fields', function () {
			expect(list.schema.add).to.have.been.calledOnce;
		});
		
	});

});