/**
 * Created by Aleksandr Volkov on 27/11/2016.
 */
const expect = require('chai').expect;
const debug = require('debug')('test');
const Storage = require('../timerStorage');
describe('timer storage', function () {
	let db;
	let date = new Date() - 100000000000;
	beforeEach(function (done) {
		//'../timer.sqlite'
		db = new Storage();
		db.on('initDone', () => {
			db.removeByType('test');
			done()
		})
	});

	it('should save record to db', function (done) {
		db.saveSession({
			finishTime: date,
			duration: 11,
			type: 'test'
		})
			.then(() => {
				db.getSessions(date)
					.then((data) => {
						expect(data.length).to.be.equal(1);
						expect(data[0]).to.all.keys('id', 'date', 'finishTime', 'duration', 'type', 'task');
						done()
					})
			})
	});

	it('should return total length of sessions for the day ', function (done) {
		db.saveSession({
			finishTime: date,
			duration: 20,
			type: 'test'
		})
			.then(() => {
				db.getDaySessionsTotal(date)
					.then((data) => {
						expect(data).to.have.keys('totalDuration');
						expect(data.totalDuration).to.be.equal(20);
						done()
					}, (err) => {
						debug(err)
					})
			})
	})
});