const express = require('express');

const path = require('path');
const Twitter = require('../twitter');

class AuthMiddleware {

	/*************************/
	/* Middleware providers */
	/************************/

	/**
	 * Verify user is logged in.
	 */
	static verifyLoggedIn() {
		return (req, res, next) => {
			if (!req.cookies['at']) {
				return res.status(500).send('User is not logged in');
			}
			return next();
		}
	}

	/**
	 * Attaches user access token and secret to the request :
	 * req.user.accessToken;
	 * req.user.accessTokenSecret
	 */
	static attachUserInfo() {
		return (req, res, next) => {
			AuthMiddleware.verifyLoggedIn()(req, res, () => {
				req.user = {};
				req.user.accessToken = req.cookies['at'];
				req.user.accessTokenSecret = req.cookies['ats'];
				return next();
			});
		}
	}

	/**
	 * Returns middleware which fetches request token from twitter, and sets it on req cookie.
	 * @param {AppConfig} config
	 * @return {function}
	 */
	static getRequestToken(config) {
		const twitter = new Twitter(config);
		return (req, res, next) => {
			twitter.getRequestToken((err, data) => {
				if (err) {
					return next(err);
				}
				AuthMiddleware.setTokens(data, req, res);
				next();
			});
		};
	}

	/**
	 *
	 * @param data
	 * @param data.oAuthAccessToken
	 * @param data.oAuthAccessTokenSecret
	 * @param data.userId
	 * @param data.screenName
	 * @param res
	 */
	static setUserInfo(data, res, httpOnly) {

		const opts = { httpOnly, maxAge: 60*1000*1000 };

		if (data) {
			res.cookie('at', data.oAuthAccessToken, opts);
			res.cookie('ats', data.oAuthAccessTokenSecret, opts);
			res.cookie('uid', data.userId, opts);
			res.cookie('name', data.screenName, opts);
		}
	}

	/**
	 *
	 * @param {object} tokens
	 * @param {string} tokens.oAuthToken
	 * @param {string} tokens.oAuthTokenSecret
	 * @param {object} req
	 * @param {object} res
	 */
	static setTokens(tokens, req, res) {
		if (tokens && tokens.oAuthToken && tokens.oAuthTokenSecret) {
			req.cookies['oAuthToken'] = tokens.oAuthToken;
			res.cookie('oAuthTokenSecret', tokens.oAuthTokenSecret, { httpOnly: true });
		}
	}
}

module.exports = AuthMiddleware;
