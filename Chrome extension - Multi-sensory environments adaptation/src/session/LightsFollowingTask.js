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

var lastPacketsL = []; //to compute mean value
var lastTimestampL = 0; //to compute mean value
var meanL; //to compute mean value
var meanWeightsL = [30,29,28,27,26,25,24,23,22,21,20,19,18,17,16,15,14,13,12,11,10,9,8,7,6,5,4,3,2,1]; 
var meanWeightsSumL = 0;
var meanLengthL = meanWeightsL.length; //to compute mean value
var currentIndexL = meanLengthL - 1; //to computer mean value
for (var f=0; f< meanLengthL; f++){
    lastPacketsL.push(0); //initialize array
    meanWeightsSumL = meanWeightsSumL + meanWeightsL[f];//compute sum of weights
}


/**
* Class for handling the following task.
**/
function LightsFollowingTask(){
    this.intensity = 100;
    this.functionType = "linear";
    this.variable = "meditation";
    this.packetEmitter = new events.EventEmitter();
    this.switch = 0;
    this.functionEffect = "direct";
    this.color = "OFF";
    this.prevColor = "OFF";
    this.follow = "volume";
    this.connectionEstabilished = 0;
}

/* Function called when a new packet arrives */
LightsFollowingTask.prototype.checkPacket = function(packet,object) {     
    console.log("I'm lights following session and this is the packet ");
    console.log(packet);
    object.timestamp = packet.timestamp; 
    var currentVariable = packet.meditation;
    console.log("label = ", object.action.label);
                       
    if (object.functionType == "quadratic") {
        object.currentIntensity = Math.pow(currentVariable,2) / 100;
    }  else if (object.functionType == "linear") {
        object.currentIntensity = currentVariable;   
    } else if (object.functionType == "mean") {
        if (packet.timestamp != lastTimestampL){
            lastPacketsL[currentIndexL] = currentVariable;
            var meanUpperPartL = 0;
            for (var f=0; f < meanLengthL; f++){
                meanUpperPartL = meanUpperPartL + (lastPacketsL[(currentIndexL+f)%meanLengthL] * meanWeightsL[f]);
            }
            meanL = meanUpperPartL/meanWeightsSumL;
            lastTimestampL = packet.timestamp; 
            currentIndexL--; 
            if (currentIndexL == -1){ 
                currentIndexL = meanLengthL - 1;
            }
        }
        object.currentIntensity = meanL;
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
LightsFollowingTask.prototype.startIntensity = function() {
    this.action.timestamp = timestamp;
    this.action.intensity = 100;
    starter.getView().followingActions(JSON.stringify(this.action),"play");
    var object = this;
}

/* Getters & Setters */
LightsFollowingTask.prototype.setIntensity = function(intensity){
    this.intensity = intensity;
}

LightsFollowingTask.prototype.getIntensity = function(){
    return this.intensity;
}

LightsFollowingTask.prototype.setFunctionType = function(type){
    this.functionType = type;
}

LightsFollowingTask.prototype.getFunctionType = function(){
    return this.functionType;
}



LightsFollowingTask.prototype.setVariable = function(variable){
    this.variable = variable;
}

LightsFollowingTask.prototype.getVariable = function(){
    return this.variable;
}

LightsFollowingTask.prototype.setAction = function(action){
    this.action = action;
}

LightsFollowingTask.prototype.getAction = function(){
    return this.action;
}


LightsFollowingTask.prototype.getId = function(){
    return this.id;
}

LightsFollowingTask.prototype.setId = function(id){
    this.id = id;
}


LightsFollowingTask.prototype.getTimeout = function(){}


module.exports = LightsFollowingTask;