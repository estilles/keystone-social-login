var _ = require('underscore'),
	chai = require('chai'),
	expect = chai.expect,
	sinon = require('sinon'),
	sinonChai = require('sinon-chai'),
	error = require('../../lib/error');

chai.use(sinonChai);

describe('.__error()', function () {

	beforeEach(function () {
		sinon.stub(process, 'exit');
		sinon.stub(console, 'log');
	});

	afterEach(function () {
		process.exit.restore();
	});

	it('should use default type/message when called with no arguments', function() {
		error();

		expect(console.log).to.have.callCount(5);
		expect(console.log.getCall(0)).to.have.been.calledWithExactly('------------------------------------------------------------');
		expect(console.log.getCall(1)).to.have.been.calledWithExactly('Error in Keystone Social Login Plugin\n');
		expect(console.log.getCall(2)).to.have.been.calledWithMatch(/An unexpected error has occured/);
		expect(console.log.getCall(2)).to.have.been.calledWithMatch(/SocialLoginError/);
		expect(console.log.getCall(3)).to.have.been.calledWith('See https://github.com/JohnnyEstilles/keystone-social-login');
		expect(console.log.getCall(4)).to.have.been.calledWithExactly('------------------------------------------------------------');
		expect(process.exit).to.have.been.called.once;
		expect(process.exit).to.have.been.calledWithExactly(1);
		console.log.restore();
	});

	it('should use default type when called with one argument', function() {
		var message = 'This is a test message';

		error(message);

		expect(console.log).to.have.callCount(5);
		expect(console.log.getCall(0)).to.have.been.calledWithExactly('------------------------------------------------------------');
		expect(console.log.getCall(1)).to.have.been.calledWithExactly('Error in Keystone Social Login Plugin\n');
		expect(console.log.getCall(2)).to.have.been.calledWithMatch(RegExp(message));
		expect(console.log.getCall(2)).to.have.been.calledWithMatch(/SocialLoginError/);
		expect(console.log.getCall(3)).to.have.been.calledWith('See https://github.com/JohnnyEstilles/keystone-social-login');
		expect(console.log.getCall(4)).to.have.been.calledWithExactly('------------------------------------------------------------');
		expect(process.exit).to.have.been.called.once;
		expect(process.exit).to.have.been.calledWithExactly(1);
		console.log.restore();
	});

	it('should use arguments when called with two arguments', function() {
		var message = 'This is a test message';
		var type = 'TestError';

		error(message, type);

		expect(console.log).to.have.callCount(5);
		expect(console.log.getCall(0)).to.have.been.calledWithExactly('------------------------------------------------------------');
		expect(console.log.getCall(1)).to.have.been.calledWithExactly('Error in Keystone Social Login Plugin\n');
		expect(console.log.getCall(2)).to.have.been.calledWithMatch(RegExp(message));
		expect(console.log.getCall(2)).to.have.been.calledWithMatch(RegExp(type));
		expect(console.log.getCall(3)).to.have.been.calledWith('See https://github.com/JohnnyEstilles/keystone-social-login');
		expect(console.log.getCall(4)).to.have.been.calledWithExactly('------------------------------------------------------------');
		expect(process.exit).to.have.been.called.once;
		expect(process.exit).to.have.been.calledWithExactly(1);
		console.log.restore();
	});

});
