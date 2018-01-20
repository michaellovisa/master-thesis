var starter = require('../session/sessionStarter');
var musicmaker = require('../../musicmaker.js'); 
var ui = require('../../UI.js'); 
var hue = require('node-hue-api'); 
var HueApi = require('node-hue-api').HueApi; 


var bridgeIP;
var bridgeId;
var bridgeMac; 
var username; 
var jsonLights; // contains the username for the current bridge
var api;
var lightState = hue.lightState;
var state;


function View() {}

module.exports = View;

var counter = 0;
var time = 0; 
var prev_gain = 1; 
var current_gain = 0; 
var prev_filter = 10000; 
var current_filter = 0; 
var filterMinFreq = 200;

View.prototype.followingActions = function(JSONaction,action) {
    
    var settings = JSON.parse(JSONaction); 
    
    var label = settings.label;
    console.log(settings.intensity);  
    console.log(settings.label); 

    if(label =="music-vol"){  
        changeMusicVolume(settings.intensity);
    }

    if(label =="music-bpm"){ 
        changeMusicBpm(settings.intensity);
    }

    if(label =="music-filter"){ 
        changeMusicFilter(settings.intensity);
    }
    
    if(label == "lights-intensity"){
        if(action == "play"){
        	startLights();
        }
        if(action == "continue"){
        	this.setLights(settings.intensity); 
    	}
    }
}


View.prototype.updateGraph = function( packet ) {
    
    var chart1 = chrome.app.window.get("index").contentWindow.chart1;
    var data = dateFormatter(new Date(packet.timestamp));
   
    chart1.dataProvider.push({
        "column-1": packet.attention, 
        "column-2": packet.meditation,
        "date": data
    });
    chart1.validateData();
}

View.prototype.updateActions = function( event ){    
    if(event.label == "lights-intensity" && starter.getLightsIntensityTask().switch == 1 && starter.getLightsIntensityTask().color != "OFF" && musicmaker.isMusicPlaying() == 1){ 
        var chart2 = chrome.app.window.get("index").contentWindow.chart2;
        var date = dateFormatter(new Date(event.timestamp));

        chart2.dataProvider.push({
		"date": date,
		"column-1": event.intensity
        });
            
        chart2.validateNow(true, false);
            
    } else if(event.label == "music-vol" && starter.getVolumeTask().switch == 1 && musicmaker.isMusicPlaying() == 1){ 
            
        var chart2 = chrome.app.window.get("index").contentWindow.chart2;
        var date = dateFormatter(new Date(event.timestamp));
            
        chart2.dataProvider.push({
		"date": date,
		"column-2": event.intensity
        });
            
        chart2.validateNow(true, false);
    } else if(event.label == "music-bpm" && starter.getBpmTask().switch == 1 && musicmaker.isMusicPlaying() == 1){
            
        var chart2 = chrome.app.window.get("index").contentWindow.chart2;
        var date = dateFormatter(new Date(event.timestamp));
            
        chart2.dataProvider.push({
        "date": date,
        "column-3": event.intensity
        });
            
        chart2.validateNow(true, false);
    } else if(event.label == "music-filter" && starter.getFilterTask().switch == 1 && musicmaker.isMusicPlaying() == 1){
            
        var chart2 = chrome.app.window.get("index").contentWindow.chart2;
        var date = dateFormatter(new Date(event.timestamp));
            
        chart2.dataProvider.push({
        "date": date,
        "column-4": event.intensity
        });
            
        chart2.validateNow(true, false);
    } 
}


function changeMusicVolume(volume){ 
    if(volume == 0){ 
        volume = 0.0;
    } 
    if (musicmaker.getScriptFlag() == 1 && musicmaker.isMusicPlaying() == 1){ 
            if (starter.getVolumeTask().switch == 1){ // switch on
                if (starter.getVolumeTask().instrumentNumber == 0){ // global
                    for (var f = 0; f < musicmaker.getInstruments().length; f++){
                        musicmaker.getInstruments()[f].gain.gain.value = musicmaker.getInstruments()[f].defaultInstrumentGain;
                    }
                    time = musicmaker.getCurrentTime();
                    musicmaker.getGainNodeTotal().gain.setValueAtTime(prev_gain,time); 
                    current_gain = musicmaker.getDefaultGlobalGain() * (ui.getVolumeSlider().result.from/100) * volume / 100; 
                    musicmaker.getGainNodeTotal().gain.linearRampToValueAtTime(current_gain,time + 1); 
                    prev_gain = current_gain;
                } else { // number of instrument
                    musicmaker.getGainNodeTotal().gain.value = musicmaker.getDefaultGlobalGain() * (ui.getVolumeSlider().result.from) / 100; //set global gain to default value
                    for (var f = 0; f < musicmaker.getInstruments().length; f++){ //set default frequency for the other instruments
                        if (f != starter.getVolumeTask().instrumentNumber - 1){ 
                            musicmaker.getInstruments()[f].gain.gain.value = musicmaker.getInstruments()[f].defaultInstrumentGain;
                        }
                    }
                    time = musicmaker.getCurrentTime();
                    musicmaker.getInstruments()[starter.getVolumeTask().instrumentNumber - 1].gain.gain.setValueAtTime(prev_gain,time);  
                    current_gain = musicmaker.getInstruments()[starter.getVolumeTask().instrumentNumber - 1].defaultInstrumentGain * volume / 100; 
                    musicmaker.getInstruments()[starter.getVolumeTask().instrumentNumber - 1].gain.gain.linearRampToValueAtTime(current_gain,time + 1); 
                    prev_gain = current_gain;

                }
            } else {  // switch off
                musicmaker.getGainNodeTotal().gain.value = musicmaker.getDefaultGlobalGain() * (ui.getVolumeSlider().result.from) / 100;
                for (var f = 0; f < musicmaker.getInstruments().length; f++){
                    musicmaker.getInstruments()[f].gain.gain.value = musicmaker.getInstruments()[f].defaultInstrumentGain;
                }
            }
    }
    
}

function changeMusicBpm(bpm){
    if (musicmaker.getScriptFlag() == 1 && musicmaker.isMusicPlaying() == 1){ 
        if (starter.getBpmTask().switch == 1){
            if (bpm == 0){
                bpm = 0.1;
            } 
            bpm = (bpm / 4 + 75) / 100; //value between 0.75 and 1
            musicmaker.setTempo(musicmaker.getDefaultBpm() * bpm * (ui.getBpmSlider().result.from / 100)); 
        } else {
            musicmaker.setTempo(musicmaker.getDefaultBpm() * (ui.getBpmSlider().result.from) / 100); 
        }
        console.log("new tempo = ",musicmaker.getTempo());
    }
}

function changeMusicFilter(filter){
    if (musicmaker.getScriptFlag() == 1 && musicmaker.isMusicPlaying() == 1){
        if (starter.getFilterTask().switch == 1){ //switch on
            if (starter.getFilterTask().instrumentNumber == 0){ // global
                for (var f = 0; f < musicmaker.getInstruments().length; f++){
                    musicmaker.getInstruments()[f].filter.frequency.value = musicmaker.getInstruments()[f].defaultInstrumentFreq;
                }
                time = musicmaker.getCurrentTime();; 
                musicmaker.getFilterNodeTotal().frequency.setValueAtTime(prev_filter,time); 
                current_filter = 5 * filter * (musicmaker.getDefaultMaxFreq() - filterMinFreq/5) / 100;                
                current_filter = current_filter + filterMinFreq; //value between filterMinFreq e 5*defaultMaxFreq
                musicmaker.getFilterNodeTotal().frequency.linearRampToValueAtTime(current_filter,time + 1); 
                prev_filter = current_filter;
            } else { // number of instrument
                musicmaker.getFilterNodeTotal().frequency.value = musicmaker.getDefaultGlobalFreq(); //set global frequency to default value
                for (var f = 0; f < musicmaker.getInstruments().length; f++){ //set default frequency for the other instruments
                    if (f != starter.getFilterTask().instrumentNumber - 1){ 
                        musicmaker.getInstruments()[f].filter.frequency.value = musicmaker.getInstruments()[f].defaultInstrumentFreq;
                    }
                }
                time = musicmaker.getCurrentTime();;
                musicmaker.getInstruments()[starter.getFilterTask().instrumentNumber - 1].filter.frequency.setValueAtTime(prev_filter,time);  
                current_filter = musicmaker.getInstruments()[starter.getFilterTask().instrumentNumber - 1].defaultInstrumentFreq * filter / 100; 
                musicmaker.getInstruments()[starter.getFilterTask().instrumentNumber - 1].filter.frequency.linearRampToValueAtTime(current_filter,time + 1); 
                prev_filter = current_filter;
            }

        } else { //switch off
            musicmaker.getFilterNodeTotal().frequency.value = musicmaker.getDefaultGlobalFreq(); 
            for (var f = 0; f < musicmaker.getInstruments().length; f++){
                musicmaker.getInstruments()[f].filter.frequency.value = musicmaker.getInstruments()[f].defaultInstrumentFreq;
            }
        }
    }
}

function startLights(){
    readJSONLights();
    //Disable lights dropdown (activate them when the connection with the bridge is estabilished)
	$('#sel-vol-lights-follow-color').prop('disabled', true); 
    $('#sel-filt-lights-follow-color').prop('disabled', true); 
}

function readJSONLights(){ 
    var readerLights = new FileReader();
    readerLights.onload = function(event) {
        jsonLights = event.target.result;
        username = JSON.parse(jsonLights).username; 
        console.log("username for Hue bridge = ", username);
        searchBridge();
    };
    readerLights.readAsText(ui.getFileJSONLightsPath());
}


function searchBridge(){
    //Display info about the found bridge
    var displayBridges = function(bridge) {
        console.log("Hue bridge found: " + JSON.stringify(bridge));
        console.log("Hue bridge IP: " + bridge[0].ipaddress); 
        console.log("Hue bridge id: " + bridge[0].id); 
        bridgeIP = bridge[0].ipaddress; 
        bridgeId = bridge[0].id; 
        startConnection();
    };

    // Find the ip address of the bridge
    hue.nupnpSearch(function(err, result) {
        if (result.length > 0){
          displayBridges(result);
        } else {
            console.log("No bridge found");
        }
    }); 
}

function startConnection(){
    var displayResultBridge = function(result) {
        starter.getLightsIntensityTask().connectionEstabilished = 1;
        $('#sel-vol-lights-follow-color').prop('disabled', false); // activate dropdown
        $('#sel-filt-lights-follow-color').prop('disabled', false); // activate dropdown
        readInfoLights();
    };
    
    // Start connection to the Hue bridge
    api = new HueApi(bridgeIP, username); 
    api.getConfig(function(err, config) {
        displayResultBridge(config);
    });
}

function readInfoLights(){
    var displayResultInfo = function(result) {
        console.log("Info lights: ",JSON.stringify(result, null, 2)); 
        readInfoGroups();
    };

    api.lights(function(err, lights) {
        if (err) throw err;
        displayResultInfo(lights);
    });
}

function readInfoGroups(){
    var displayResultGroups = function(result) {
        console.log("Info groups: ",JSON.stringify(result, null, 2));
    };

    api.groups(function(err, result) {
        if (err) throw err;
        displayResultGroups(result);
    });

}

// Convert from name of color to HSB value
function colorHSB(color){
    var hsb;
    switch (color){
            case 'yellow': 
                hsb = [41, 199, 100];
                break;
            case 'orange': 
                hsb = [31, 130, 100]; 
                break;
            case 'red': 
                hsb = [21, 100, 100];
                break;
    }
    return hsb; 
}

View.prototype.setLights = function(lightIntensity){
    if (musicmaker.getScriptFlag() == 1 && musicmaker.isMusicPlaying() == 1 && starter.getLightsIntensityTask().connectionEstabilished == 1 ){ 
        if(counter < 2){ // modify lights every three packets
            counter++;
        } else {
            if (starter.getLightsIntensityTask().switch == 1){
                if (starter.getLightsIntensityTask().color != "OFF") { 
                    counter = 0;
                    var colorPicked = colorHSB(starter.getLightsIntensityTask().color);
                    state = lightState.create().on().hsb(colorPicked[0],colorPicked[1],lightIntensity).transition(3000);
                } else {
                    state = lightState.create().off();
                }  
            } else {
                state = lightState.create().off();
            }
            api.setGroupLightState(0, state, function(err, lights) {
                if (err) throw err;
            });
        }
    } else { 
        if (ui.getJustStopped() == 1){ //music stopped right before this packet
            ui.setJustStopped(0);
            state = lightState.create().off();
            api.setGroupLightState(0, state, function(err, lights) {
                if (err) throw err;
            });
        }
    }
}

View.prototype.alert = function(type){
    if(type == "newTask"){
        var opt = {
          type: "basic",
          title: "ALERT",
          message: "Task completed! A new task will start in 3 seconds",
          iconUrl: "../../alert.jpg"
        }
        chrome.notifications.create("string notificationId", opt);
    } else if (type == "endSession"){
        var opt = {
          type: "basic",
          title: "ALERT",
          message: "Session ended!",
          iconUrl: "../../alert.jpg"
        }
        chrome.notifications.create("string notificationId", opt);
    }
}

function dateFormatter(date){
    
    var dat = new Date(date);
    
    var data = ""+dat.getFullYear()+"-";
    
    // Months
    if((dat.getMonth()*1) <10 ){
        data += "0"+dat.getMonth()+"-";
    }else{
        data += dat.getMonth()+"-";
    }
    
    // Days
    if((dat.getDate()*1) <10 ){
        data += "0"+dat.getDate()+" ";
    }else{
        data += dat.getDate()+" ";
    }
    
    // Hours
    if((dat.getHours()*1) <10 ){
        data += "0"+dat.getHours()+":";
    }else{
        data += dat.getHours()+":";
    }

    // Minutes
    if((dat.getMinutes()*1) <10 ){
        data += "0"+dat.getMinutes()+":";
    }else{
        data += dat.getMinutes()+":";
    }
    
    // Seconds
    if((dat.getSeconds()*1) <10 ){
        data += "0"+dat.getSeconds();
    }else{
        data += dat.getSeconds();
    }
    
    return data;    
}
