const express = require('express');
const AuthMiddleware = require('./middleware/authentication');
const Twitter = require('./twitter');

/**
 *
 * @param {Object} app
 * @param {AppConfig} config
 */
module.exports.configureRoutes = (app, config) => {

	const twitter = new Twitter(config);

	// zooz tweets
	app.get('/twitter/tweets',
		AuthMiddleware.verifyLoggedIn(),
		AuthMiddleware.attachUserInfo(), // will send failure in case of no user.
		(req, res) => {
			twitter.getTweets(req.user.accessToken, req.user.accessTokenSecret,
				(err, data) => {
					if (err) {
						console.error('Error - Failed to fetch tweets using current user data');
						return res.status(500).send(err);
					}
					return res.json(data);
				});
		});


	// Provide login route, which handles the process in front of tweeter
	app.get('/login', AuthMiddleware.getRequestToken(config), (req, res) => {
		const token = req.cookies['oAuthToken'];
        res.redirect(`https://api.twitter.com/oauth/authenticate?oauth_token=${token}`);
	});

	// Provide login route, which handles the process in front of tweeter
	app.get('/logout', (req, res) => {
        const cookies = req.cookies;
        for (const prop in cookies) {
            res.cookie(prop, '', {expires: new Date(0)});
        }
        res.redirect('/');
	});

	// simply sets callback for twitter authentication process
	app.get('/auth/callback', (req, res) => {

		if (!req.query.oauth_token || !req.query.oauth_verifier) {
			console.error('Error - Sign in callback returned no data');
			return res.redirect('/');
		}

		const params = {
			oAuthToken: req.query.oauth_token,
			oAuthVerifier: req.query.oauth_verifier,
			oAuthTokenSecret: req.cookies['oAuthTokenSecret'],
		};

		// get the access token. set it on the response, and go to the page.
		twitter.getAccessToken(params, (err, data) => {
			if (err) {
				console.error('Error - Granting access token failed');
				return res.status(500).send(err);
			}

			AuthMiddleware.setUserInfo(data, res, true);
			return res.redirect('/');
		});
	});

	app.get('/user-info', (req, res) => {
		for (const cookie in req.cookies) {
			res.cookie(cookie, req.cookies[cookie]);
		}

		res.json({
			isLoggedIn: !!req.cookies['at'] || false,
			name: req.cookies['name'] || null,
		});
	});

    // simply sends the template
    app.get('/', (req, res) => res.sendFile(config.templatePath));

    // set static content
    app.use('/', express.static(config.staticContentLocation));

};
