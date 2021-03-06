const db = require('sqlite');
const debug = require('debug')('storage');
const EventEmitter = require('events');
const fs = require('fs');

class TimerStorage extends EventEmitter {
	constructor(dbFile) {
		super();
		this.homeFolder = process.env[(process.platform == 'win32') ? 'USERPROFILE' : 'HOME'] + '/timer/';
		this.dbFile = this.homeFolder + (dbFile || 'timer.sqlite');
		this.db = db;
		this._checkFile()
		this.db.open(this.dbFile)
			.then(
				() => {
					this.db.migrate(
						{
							// force: 'last',
							migrationsPath: `${__dirname}/migrations`
						}
					)
						.then(() => this.emit('initDone'))
				},
				(err) => console.log(err)
			)
	}
	_checkFile(){
		if(!fs.existsSync(this.homeFolder)) fs.mkdirSync(this.homeFolder);
		if(!fs.existsSync(this.dbFile)){
			debug('writing new file', this.dbFile)
			fs.writeFileSync(this.dbFile, '')
		}
	}
	/**
	 * returns data YYYY-MM-DD from timestamp
	 * @param timestamp
	 * @private
	 */
	_getDateFromTs(timestamp) {
		let ts = new Date(timestamp);
		let month = ts.getMonth() + 1;
		let day = ts.getDate();
		if (month < 10) month = '0' + month;
		if (day < 10) day = '0' + day;
		return String(`${ts.getFullYear()}-${month}-${day}`);
	}

	/**
	 * @param data
	 * @returns {Array|{index: number, input: string}|*}
	 */
	saveSession(data) {
		return this.db.exec(`
		insert
		into
		sessions (finishTime, date, duration, type, task)
		values(${data.finishTime}, '${this._getDateFromTs(data.finishTime)}', ${data.duration}, '${data.type}', '${data.task}')`);
	}

	/**
	 * returns sessions for selected date
	 * @param date
	 */
	getSessions(date) {
		date = this._getDateFromTs(date);
		return this.db.all(`select * from sessions where date='${date}'`);
	}

	/**
	 * returns sum of sessions for selected period
	 * @param date
	 * @returns {V|*}
	 */
	getDaySessionsTotal(date) {
		date = this._getDateFromTs(date);
		debug(date);
		return this.db.get(`select sum(duration) as totalDuration from sessions where date='${date}'`)
	}

	/**
	 * shows available tasks
	 */
	getTaskTypes(){
		return this.db.all('select distinct task from sessions where task not in("null", "undefined");')
	}

	/**
	 * shows stats grouped by task 
	 * @returns {*|Promise<any[]>|Promise.<*>}
	 */
	getTasksStats(){
		return this.db.all('select task, sum(duration) as duration from sessions group by task;')
	}

	getSessionsByTaskTotal(task) {
		debug(task);
		return this.db.get(`select sum(duration) as totalDuration from sessions where task='${task}'`)
	}
	/**
	 * removes sessions by specific type
	 * @param type
	 * @returns {*|Array|{index: number, input: string}}
	 */
	removeByType(type) {
		return this.db.exec(`delete from sessions where type = '${type}'`);
	}

	/**
	 * remove tasks by task name
	 * @param task
	 * @returns {Array|{index: number, input: string}|*}
	 */
	removeByTask(task){
		return this.db.exec(`delete from sessions where task = '${task}'`);
	}
}

module.exports = TimerStorage;