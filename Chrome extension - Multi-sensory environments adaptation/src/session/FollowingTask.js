var starter = require("./sessionStarter");
var events = require('events');
var packetEmitter;

var intensity;
var functionType;
var variable;
var action;
var timestamp;
var id;
var currentIntensity;

var lastPackets = []; //to compute mean value
var lastTimestamp = 0; //to compute mean value
var mean; //to compute mean value
var meanWeights = [30,29,28,27,26,25,24,23,22,21,20,19,18,17,16,15,14,13,12,11,10,9,8,7,6,5,4,3,2,1];  
var meanWeightsSum = 0;
var meanLength = meanWeights.length; //to compute mean value
var currentIndex = meanLength - 1; //to computer mean value
for (var f=0; f< meanLength; f++){
    lastPackets.push(0); //initialize array
    meanWeightsSum = meanWeightsSum + meanWeights[f];//compute sum of weights
}


/**
* Class for handling the following task.
**/
function FollowingTask(){
    this.intensity = 100;
    this.functionType = "linear";
    this.variable = "meditation";
    this.packetEmitter = new events.EventEmitter();
    this.switch = 0;
    this.instrumentNumber = 0; // 0 is global
    this.functionEffect = "direct";
}

/* Function called when a new packet arrives */
FollowingTask.prototype.checkPacket = function(packet,object) {     
    console.log("I'm following session and this is the packet ");
    console.log(packet);
    object.timestamp = packet.timestamp; 

    var currentVariable = packet.meditation;;

    console.log("label = ", object.action.label);
                     
    if (object.functionType == "quadratic") {
        object.currentIntensity = Math.pow(currentVariable,2) / 100;
    }  else if (object.functionType == "linear") {
        object.currentIntensity = currentVariable;   
    } else if (object.functionType == "mean") {
        if (packet.timestamp != lastTimestamp){
            lastPackets[currentIndex] = currentVariable;
            var meanUpperPart = 0;
            for (var f=0; f < meanLength; f++){
                meanUpperPart = meanUpperPart + (lastPackets[(currentIndex+f)%meanLength] * meanWeights[f]);
            }
            mean = meanUpperPart/meanWeightsSum;

            lastTimestamp = packet.timestamp; 
            currentIndex--; 
            if (currentIndex == -1){ 
                currentIndex = meanLength - 1;
            }
        }
        object.currentIntensity = mean;
    }
        if (object.functionEffect == "inverse"){
            object.currentIntensity = 100 - object.currentIntensity;                                                              
        }
        console.log("new intensity = ",object.currentIntensity);
        changeIntensity(object, object.currentIntensity);
}

/* Start view's action */
function changeIntensity(object, intensity){
    console.log("Intensity is now : " + intensity);
    object.action.timestamp = object.timestamp;
    object.action.intensity = intensity;
    object.packetEmitter.emit("newAction",{label:object.action.label,timestamp:object.action.timestamp,intensity:intensity}); 
    starter.getView().followingActions(JSON.stringify(object.action),"continue"); 
}

/* Init function to set starting intensity */
FollowingTask.prototype.startIntensity = function() {
    this.action.timestamp = timestamp;
    this.action.intensity = 100; 
    starter.getView().followingActions(JSON.stringify(this.action),"play");
    var object = this;
}

/* Stopping following actions */
function stopIntensity(object) {
    object.action.timestamp = object.timestamp;
    object.action.intensity = 0;
    console.log("Intensity is now : " + object.action.intensity);
    object.packetEmitter.emit("newAction",{label:object.action.label,timestamp:object.action.timestamp,intensity:0});
    starter.getView().followingActions(JSON.stringify(object.action),"stop");
    starter.removeListener(object);
}


/* Getters & Setters */
FollowingTask.prototype.setIntensity = function(intensity){
    this.intensity = intensity;
}

FollowingTask.prototype.getIntensity = function(){
    return this.intensity;
}

FollowingTask.prototype.setFunctionType = function(type){
    this.functionType = type;
}

FollowingTask.prototype.getFunctionType = function(){
    return this.functionType;
}



FollowingTask.prototype.setVariable = function(variable){
    this.variable = variable;
}

FollowingTask.prototype.getVariable = function(){
    return this.variable;
}

FollowingTask.prototype.setAction = function(action){
    this.action = action;
}

FollowingTask.prototype.getAction = function(){
    return this.action;
}


FollowingTask.prototype.getId = function(){
    return this.id;
}

FollowingTask.prototype.setId = function(id){
    this.id = id;
}


FollowingTask.prototype.getTimeout = function(){}


module.exports = FollowingTask;