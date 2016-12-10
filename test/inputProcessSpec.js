/**
 * Created by Aleksandr Volkov on 07/12/2016.
 */
const expect = require('chai').expect;
const InputProcess = require('../inputClass.js');

describe('input process of timer', function(){
	it('should handle --tasks key and emit showTasks event', function(done){
		let input = new InputProcess();
		let argvArr = ['node', 'timer', '10m', '--get-tasks'];
		input.on('showTasks', () =>{
			expect(true).to.be.equal(true);
			done();
		});
		input.processParams(argvArr);
	});
	it('should handle --task key and emit runTask event', function(done){
		let input = new InputProcess();
		let argvArr = ['node', 'timer', '10m', 10, '--task', 'test'];
		input.on('runTask', (data) =>{
			expect(data.task).to.be.equal('test');
			expect(data.time).to.be.equal('10m');
			done();
		});
		input.processParams(argvArr);
	});
	it('should return time if no other keys are specified', function(done){
		let input = new InputProcess();
		let argvArr = ['node', 'timer', '10m', 10, 'test'];
		input.on('runTimer', (data) =>{
			expect(data.time).to.be.equal('10m');
			done();
		});
		input.processParams(argvArr);
	});
	it('should return 10 instead of 10m if no other keys are specified', function(done){
		let input = new InputProcess();
		let argvArr = ['node', 'timer', 10, '10m', 'test'];
		input.on('runTimer', (data) =>{
			expect(data.time).to.be.equal(10);
			done();
		});
		input.processParams(argvArr);
	});
});