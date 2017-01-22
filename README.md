#Command line timer
 
 Small console app which runs a timer and sounds a gong sound in the end of the session and a `different` gong sound at the end of the rest phase 
 
 By default timer runs for 25m with 5m rest phase
 
 It can be installed globally with `npm install -g bell-timer` 
 
 ```timer``` runs timer for a 25 minutes 
 
 ```timer 10m``` runs timer for ten minutes 
 
 ```timer 50``` runs timer for 50 seconds
  
 ```timer 10m --task 'my task'``` will run timer for 10 min and add stat to DB for with value `my task` for `task` field
 
 ```timer --get-tasks``` will show list of tasks from DB like this
  ```[ 'test', 'test task', 'another task' ]```
 ```timer --get-stats``` will show stats grouped by task
 ```
    first task  --->  03:00
    another task  --->  11:50
    one more  --->  03:15
```

 ```timer --remove-task 'test task'``` removes all the data from DB with a `task` named `test task` 
  
 When timer is running it can be paused and unpaused with a `spacebar`
 
 Since the app is an instance of `eventEmitter` it will emit event with on its end 
  ```
  { finishTime: 1480176012867, duration: 5 }
  ```
  
 `timerCompleted` and `timerTerminated` events are triggered on complete and on terminate event 
 
 ```
 timer.on('timerCompleted', (evt) => {
 	console.log(evt);
 })
 ```
  
 In the end timer will write to `stdout` amount of time it was used today 
 ```
 Total time spent today: 3 minutes
```
or if key `--task` specified something similar to this output

```
timer 10m --task 'test task'
---------------
Total time for task *test task*: 00:10
---------------
Total time spent today: 00:26
---------------
```
output for the specified `task` will be for all the logged time

