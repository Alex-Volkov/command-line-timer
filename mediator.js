const TimerClass = require('./timerClass');
const debug = require('debug')('timer');
const Storage = require('./timerStorage');
const moment = require('moment');
const InputClass = require('./inputClass');
/**
 * TODO
 * task description from parameters +
 * summary with division by tasks
 * show available task types
 * reconsider moment to numeric.js http://numeraljs.com/
 *
 */
class Mediator {
	constructor() {
		this.db = new Storage();
		this.db.on('initDone', () => {
			this.input = new InputClass();
			this.inputHandlers();
			this.timer = null;
			this.input.processParams(process.argv);
		})

	}

	inputHandlers() {
		this.input.on('showTasks', () => {
			this.db.getTaskTypes()
				.then((data) => console.log(data.map(elem => elem.task) ))
		});

		this.input.on('runTask', (data) => {
			this.timer = new TimerClass(data);
			this.timerHandlers();
		});

		this.input.on('runTimer', (data) => {
			this.timer = new TimerClass(data);
			this.timerHandlers();
		});

		this.input.on('removeTask', (data) => {
			this.db.removeByTask(data.task)
				.then(() => console.log(`task *${data.task}* removed`))
		});
	}

	timerHandlers() {
		this.timer.on('timerCompleted', (evt) => {
			debug(evt);
			this.db.saveSession(evt)
				.then(() => {
					this.db.getDaySessionsTotal(Date.now())
						.then((data) => {
							debug(data);
							if (!!evt.task) {
								this.db.getSessionsByTaskTotal(evt.task)
									.then((taskDuration) => {
										console.log('-----------------');
										console.log(`Total time for task *${evt.task}*: ${moment(moment.duration(taskDuration.totalDuration, 'seconds')._data).format('HH:mm')}`);
										console.log('-----------------');
										console.log(`Total time spent today: ${moment(moment.duration(data.totalDuration, 'seconds')._data).format('HH:mm')}`);
										console.log('-----------------');
										process.exit();
									})
							} else {
								console.log(`Total time spent today: ${moment(moment.duration(data.totalDuration, 'seconds')._data).format('HH:mm')}`);
								process.exit();
							}
						})

				})
		});
		this.timer.on('timerTerminated', (evt) => debug(evt));
	}

}



module.exports = Mediator;

