const _ = require('lodash');
const express = require('express');
const cookieParser = require('cookie-parser');

const config = require('./config');
const routes = require('./routes');
const Twitter  = require('./twitter');

class App {

	/**
	 * @param {AppConfig} config
	 */
	constructor(config) {
		this.config = config;
		this.app = null;
		this.server = null;
		this.twitter = new Twitter(config);
		this.configure();
	}

	/**
	 * Configure the application for running:
	 * 1. Include cookie parser for better ability to read & write cookies
	 * 2. Configure authentication
	 * 3. Configure application routes
	 */
	configure() {
		this.app = express();
		this.app.use(cookieParser());
		// configure application routes
		routes.configureRoutes(this.app, this.config);
	}

	/**
	 * Launches the application.
	 * @param callback - In case actions required to be performed after startup
	 */
	launch(callback) {
		this.server = this.app.listen(this.config.port , () => {
			console.log('Listening on port ' + this.server.address().port);

			if (_.isFunction(callback)) {
				callback();
			}
		});
	}
}

// run the application.
new App(config).launch();
