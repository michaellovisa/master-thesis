var receiver = require("../headsetReceiver/dataReceiver");
var dataManager = require("../dataManager");
var LightsFollowingTask = require("./LightsFollowingTask");
var FollowingTask = require("./FollowingTask")
var View = require("../view/view.js");

var view;
var task = 0;
var JSONTask;
var timeout;
var checkInterval;

var label; 
var tasks = []; // array of tasks, used to access them by index

exports.getView = function(){
    return view;
}

exports.getTasks = function(){
    return tasks;
}

exports.getVolumeTask = function(){
    return tasks[0];
}

exports.getBpmTask = function(){
    return tasks[1];
}

exports.getFilterTask = function(){
    return tasks[2];
}

exports.getLightsIntensityTask = function(){
    return tasks[3];
}

/* Function to start a new session */
exports.startNewSession = function() {

    //Instantiation of View
    view = new View();
    
    //Add listeners
    receiver.addNewListener(view.updateGraph);
    receiver.addNewListener(dataManager.addPacket);
    receiver.startReceiving();
    
    newTask(0);

}

/* Removes task from listeners list */
exports.removeListener = function(listener) {
    var receiver = require("../headsetReceiver/dataReceiver");
    receiver.removeTaskListener(listener); 
}

/* Function to create new tasks of the session */
function newTask(taskNumber){ //
    for (var i = 0; i < 4; i++){ 
            switch (i){ //assign the right label to the tasks
                case 0:
                    label = "music-vol";
                    var task = new FollowingTask();
                    createFollowingTask(label,task);
                    break;
                case 1:
                    label = "music-bpm";
                    var task = new FollowingTask();
                    createFollowingTask(label,task);
                    break;
                case 2:
                    label = "music-filter";
                    var task = new FollowingTask();
                    createFollowingTask(label,task);
                    break;
                case 3:
                    label = "lights-intensity";
                    var task = new LightsFollowingTask();
                    createLightsFollowingTask(label,task);
                    break;
            }
        task.startIntensity(); 
        task.packetEmitter.on("newAction",view.updateActions); 
        receiver.addNewTaskListener(task); 
    }
    
    timeout = setTimeout(function(){timeoutActions();}, 120*1000);
    return task;
}

function timeoutActions(){
    receiver.stopTasks();
}

/* Function to set parameters of a "following" type task */
function createFollowingTask(tasklabel,task){
    var variable = "relaxation";  
    task.setVariable(variable); 
    task.setFunctionType("linear"); //default value
    task.setAction({"label" : tasklabel});
    tasks.push(task);
}

/* Function to set parameters of a "lights" type task */
function createLightsFollowingTask(tasklabel,task){
    var variable = "relaxation";  
    task.setVariable(variable); 
    task.setFunctionType("linear"); //default value
    task.setAction({"label" : tasklabel}); 
    tasks.push(task);
}