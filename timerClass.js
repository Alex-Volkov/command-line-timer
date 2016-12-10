const player = require('play-sound')(opts = {});
const debug = require('debug')('timerClass');
const Emitter = require('events');

class TimerClass extends Emitter {
	constructor(params) {
		super();
		this.interval = null;
		this.currentTime = 0;
		this.stdin = process.stdin;
		this.stdin.setRawMode(true);
		this.stdin.resume();
		this.stdin.setEncoding('utf8');
		this.timerValue = params.time || '1m';
		if(params.task){
			this.task = params.task;
		}
		this.maxValue = this.timerValue.indexOf('m') > -1 ? parseInt(this.timerValue) * 60 : parseInt(this.timerValue);
		this.st = process.stderr;
		this.textColour = '\x1b[31m';
		this.stdin.on('data', this.inputProcess.bind(this));
		this.startTimer.call(this)
	}

	/**
	 * here we start our timer
	 */
	startTimer() {
		this.interval = setInterval(() => {
				this.currentTime++;
				let currentTimeOut = 0;
				if (this.currentTime < 60) {
					currentTimeOut = this.currentTime + 's';
				} else {
					currentTimeOut = `${parseInt(this.currentTime / 60)}m${this.currentTime - parseInt(this.currentTime / 60) * 60}s`;
				}
				let out = `  ${this.textColour}${currentTimeOut.toString()} - of ${this.timerValue}`;
				this.st.write(out);
				this.st.cursorTo(0);
				if (this.currentTime >= this.maxValue) {

					clearInterval(this.interval);
					let audio = player.play(`${__dirname}/bell.wav`, () => {
						this.setDefaultColors();
						this.emit('timerCompleted',{
							type: 'timerCompleted',
							finishTime: Date.now(),
							duration: this.maxValue,
							task: this.task
						});
						audio.kill();
						// process.exit();
					});
				}
			}
			, 1000);
	}

	/**
	 * return color of console to the defaults
	 */
	setDefaultColors(){
		this.st.write("\x1b[0m");
	}

	/**
	 * handler for input activity
	 * @param key
	 */
	inputProcess(key) {
		/**
		 * Ctrl + c ('\u0003') will kill the app
		 */
		if (key == '\u0003') {
			this.emit('timerTerminated', {
				type: 'timerTerminated',
				finishTime: Date.now(),
				duration: this.maxValue
			});
			this.setDefaultColors();
			process.exit();
		}
		/**
		 * it will pause timer when spacebar ('\u0020') pressed
		 */
		if (key == '\u0020') {
			if (!!this.interval) {
				this.st.cursorTo(0);
				this.st.write('  paused           ');
				this.st.cursorTo(0);
				clearInterval(this.interval);
				this.interval = null;
				/**
				 * it will resume app if the app was paused
				 */
			} else {
				this.st.cursorTo(0);
				this.st.write('  continued        ');
				this.st.cursorTo(0);
				this.startTimer()
			}
		}
	}
}

module.exports = TimerClass;
