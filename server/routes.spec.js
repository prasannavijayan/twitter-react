const expect = require('chai').expect;
const express = require('express');
const sinon = require('sinon');

const routes = require('./routes');
const config = require('./config');

describe('Routes tests', () => {

	let app = express();

	context('configureRoutes()', () => {

		it('should set [/, /twitter/zooz-tweets] routes', () => {

			const spy = sinon.spy(app, 'get');
			routes.configureRoutes(app, config);
			expect(spy.calledWith('/')).to.be.true;
			expect(spy.calledWith('/twitter/zooz-tweets')).to.be.true;

			spy.restore();
		});
	});

});
