/**
 * Created by Aleksandr Volkov on 07/12/2016.
 */
const Events = require('events');

class InputProcess extends Events{
	constructor(){
		super();
	}

	processParams(inputArr){
		let time = this.getTime(inputArr);
		/**
		 * we want to get list of tasks
		 */
		if(inputArr.indexOf('--get-tasks') > -1){
			return this.emit('showTasks')
		}
		/**
		 * task param specified
		 */
		if(inputArr.indexOf('--task') > -1){
			let taskIndex = inputArr.indexOf('--task');
			let task = null;
			if(taskIndex > -1 && !!inputArr[taskIndex + 1]){
				task = inputArr[taskIndex + 1];
			}
			return this.emit('runTask', {task:task, time: time})
		}
		/**
		 * we need to remove task
		 */
		if(inputArr.indexOf('--remove-task') > -1){
			let taskIndex = inputArr.indexOf('--remove-task');
			let task = null;
			if(taskIndex > -1 && !!inputArr[taskIndex + 1]){
				task = inputArr[taskIndex + 1];
			}
			return this.emit('removeTask', {task:task})
		}
		/**
		 * only time is specified
		 */
		if(!!time){
			return this.emit('runTimer', {time: time})
		}
		if(!time){
			return this.emit('runTimer', {})
		}
	}

	/**
	 * will seek for numbers or numbers ending with 'm' letter and return the first match
	 * @param inputArr
	 * @returns {T|*}
	 */
	getTime(inputArr){
		return inputArr.filter((elem)=> String(elem).match(/^\d+$|^\d+m$/ig))[0];
	}

}

module.exports = InputProcess;