const _ = require('lodash');
const expect = require('chai').expect;
const express = require('express');
const sinon = require('sinon');

const AuthMiddleware = require('./authentication');
const config = require('../config');

describe('Authentication middleware tests', () => {

	let req = {
		cookies: {},
	};
	let res = {
		cookie(key, value) {},
		status(code) {
			return { send(error) {} }
		}
	};

	afterEach(() => {
		req.cookies = {};
	});
	context('setTokens()', () => {

		it('should not set any cookie in case tokens are empty', () => {
			const spyRes = sinon.spy(res, 'cookie');

			AuthMiddleware.setTokens(null, req, res);
			expect(spyRes.notCalled).to.be.true;
			expect(req.cookies).to.be.empty;
			spyRes.restore();
		});

		it('should not set any cookie in case all tokens doens\'t exist', () => {
			const spyRes = sinon.spy(res, 'cookie');

			AuthMiddleware.setTokens({oAuthToken: '1'}, req, res);
			expect(spyRes.notCalled).to.be.true;
			expect(req.cookies).to.be.empty;

			AuthMiddleware.setTokens({oAuthTokenSecret: '1'}, req, res);
			expect(spyRes.notCalled).to.be.true;
			expect(req.cookies).to.be.empty;

			spyRes.restore();
		});

		it('should set cookies with valid variables', () => {

			const spyRes = sinon.spy(res, 'cookie');

			AuthMiddleware.setTokens({oAuthTokenSecret: '1', oAuthToken: '2' }, req, res);
			expect(spyRes.calledWith('oAuthTokenSecret', '1')).to.be.true;
			expect(req.cookies).property('oAuthToken').to.eq('2');
			spyRes.restore();
		});
	});

	context('verifyLoggedIn()', () => {

		const mw = AuthMiddleware.verifyLoggedIn();

		it('should return status 500 in case not logged in', () => {
			const cb = sinon.stub();
			const spy =  sinon.spy(res, 'status');

			mw(req, res, cb);
			expect(spy.calledOnce).to.be.true;
			expect(spy.calledWith(500)).to.be.true;
			expect(cb.notCalled).to.be.true;
			spy.restore();
		});

		it('should call callback in case of valid user cookie', () => {

			const cb = sinon.stub();
			const spy =  sinon.spy(res, 'status');

			req.cookies['at'] = '1';
			mw(req, res, cb);
			expect(spy.notCalled).to.be.true;
			expect(cb.calledOnce).to.be.true;
			spy.restore();
		});
	});

	context('attachUserInfo()', () => {

		const mw = AuthMiddleware.attachUserInfo();

		it('should attach user info in case user is logged in', (done) => {

			const spy = sinon.spy(AuthMiddleware, 'verifyLoggedIn');

			req.cookies['at'] = '1';
			req.cookies['ats'] = '2';
			mw(req, res, () => {
				expect(spy.calledOnce).to.be.true;
				expect(req.user).to.be.a('object');
				expect(req.user).property('accessToken').to.eq('1');
				expect(req.user).property('accessTokenSecret').to.eq('2');
				spy.restore();
				done();
			});
		});

		it('should respond 500 in case of no user defined', () => {
			const cb = sinon.stub();
			const spy =  sinon.spy(res, 'status');

			mw(req, res, cb);
			expect(spy.calledOnce).to.be.true;
			expect(cb.notCalled).to.be.true;
			spy.restore();
		});
	});

	context('setUserInfo()', () => {

		it('should set user data on cookies', () => {
			const spy = sinon.spy(res, 'cookie');
			const data = {
				oAuthAccessToken: '1',
				oAuthAccessTokenSecret: '2',
				userId: '3',
				screenName: '4',
			};

			AuthMiddleware.setUserInfo(data, res);

			_.values(data) // checks the second argument of call
				.forEach(val => expect(spy.calledWith(sinon.match.any, val)).to.be.true);
		});

	});
});
