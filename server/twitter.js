const config = require('./config');
const { OAuth } = require('oauth');

const twitterApiPath = 'https://api.twitter.com';
const links = {
	requestToken: `${twitterApiPath}/oauth/request_token`,
	accessToken: `${twitterApiPath}/oauth/access_token`,
	userTimeline: `${twitterApiPath}/1.1/statuses/user_timeline.json`,
	tweetSearch: `${twitterApiPath}/1.1/search/tweets.json`,
};

/**
 * This class is responsible of wrapping all actions in front of twitter api
 */
class Twitter {

	/**
	 *
	 * @param {AppConfig} config
	 */
	constructor(config) {
		this.client = new OAuth(
			links.requestToken,
			links.accessToken,
			config.twitterConsumerKey,
			config.twitterConsumerSecret,
			'1.0A',
			`http://localhost:${config.port}/${config.callbackPath}`,
			'HMAC-SHA1'
		);
	}

	/**
	 * @param callback
	 */
	getRequestToken(callback) {
		this.client.getOAuthRequestToken((error, oAuthToken, oAuthTokenSecret, results) => {
			callback(error, {
				oAuthToken,
				oAuthTokenSecret,
			});
		});
	}

	/**
	 *
	 * @param params
	 * @param params.oAuthToken
	 * @param params.oAuthTokenSecret
	 * @param params.oAuthVerifier
	 * @param callback
	 */
	getAccessToken(params, callback) {
		this.client.getOAuthAccessToken(params.oAuthToken, params.oAuthTokenSecret, params.oAuthVerifier,
			(error, oAuthAccessToken, oAuthAccessTokenSecret, results) => {
				if (error) {
					return callback(error);
				}
				return callback(error, {
					oAuthAccessToken,
					oAuthAccessTokenSecret,
					userId: results.user_id,
					screenName: results.screen_name
				});
			});
	}

	/**
	 *
	 * @param {string} accessToken
	 * @param {string} accessTokenSecret
	 * @param callback
	 */
	getTweets(accessToken, accessTokenSecret, callback) {

		const searchQuery = '%23apple';
		const limitToAmount = 50;

		this.client.get(
			`${links.tweetSearch}?q=${searchQuery}&limit=${limitToAmount}`,
			accessToken,
			accessTokenSecret,
			(error, data) => {
				if (error) {
					console.error(error);
					return callback(error)
				}
				callback(null, data);
			});
	};
}

module.exports = Twitter;

