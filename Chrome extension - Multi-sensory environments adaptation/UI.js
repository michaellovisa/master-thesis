var default_adaptfunction = "linear";
var default_adapteffect = "direct";
var default_adaptinstrument = 0;
var vol_lights_default_value = "OFF";
var filt_lights_default_value = "OFF";

var slider_overall_vol;
var slider_overall_bpm;

var justStopped = 0;

var Adapter = require("./adapter.js");
var dataReceiver = require("./src/headsetReceiver/dataReceiver");
var starter = require('./src/session/sessionStarter');
var Dummy = require("./Dummy.js")
var dataManager = require("./src/dataManager");
var json;
var jsonLights;
var port;
var dummyBool;
var musicscale = require('./music-scale.js');
var musicmaker = require('./musicmaker.js');

var tasks = [];
var scriptName; 
var jsonpath;



//Initialize global sliders
$("#overall_volume").ionRangeSlider({
  min: 0,
  max: 200,
  from: 100,
  postfix: " %",
  onChange: function (data) { 
    if (musicmaker.getScriptFlag() == 1){ 
      musicmaker.getGainNodeTotal().gain.value = musicmaker.getDefaultGlobalGain() * (data.from) / 100;
    }
  },
});
$("#overall_bpm").ionRangeSlider({
  min: 0,
  max: 200,
  from: 100,
  postfix: " %",
  onChange: function (data) { 
    if (musicmaker.getScriptFlag() == 1){
      musicmaker.setTempo(musicmaker.getDefaultBpm() * (data.from) / 100);
    }
  },
});

slider_overall_vol = $('#overall_volume').data("ionRangeSlider");
slider_overall_bpm = $('#overall_bpm').data("ionRangeSlider");

exports.getVolumeSlider = function(){
  return slider_overall_vol;
}

exports.getBpmSlider = function(){
  return slider_overall_bpm;
}

// Select default values on the ui
$(document).ready(function(){
    
    //Populate dropdown of serial ports and onclick function for connect button
    var list = document.getElementById('portListDropdown');
    chrome.serial.getDevices(function(portList) {
      console.log(portList);
      for (var entry = 0; entry < portList.length; entry++) {
        var path = String(portList[entry].path);
        var li = document.createElement("li");
        var link = document.createElement("a");
        var text = document.createTextNode(path);
        link.appendChild(text);
        link.setAttribute("role","button");
        link.setAttribute("data-value",path);
        link.className = "portListEntry";
        li.appendChild(link);
        list.appendChild(li);
      }
      $('.portListEntry').on('click', function() {
        var path = $(this).text();
        $('#portListButton').html(path + ' <span class="caret"></span>');
        $('#portListButton').val(path);
        console.log("Selected serial port = ", $('#portListButton').attr("value"));
      });
    });
   
		//SELECT SCALE. Default value for the dropdown
    var scale_default_value = "random";
	$('#select-scale').html(scale_default_value + ' <span class="caret"></span>');
    $('#select-scale').val(scale_default_value);

    //SELECT MAJOR OR MINOR. Default value for the dropdown
    var scale_default_majmin = "major";
	$('#select-majmin').html(scale_default_majmin + ' <span class="caret"></span>');
    $('#select-majmin').val(scale_default_majmin);

    //SELECT MUSIC ADAPTIVE FUNCTION. Default value for the dropdown
	$('#sel-vol-adapt-function').html(default_adaptfunction + ' <span class="caret"></span>');
    $('#sel-vol-adapt-function').val(default_adaptfunction);

    //SELECT MUSIC ADAPTIVE FUNCTION EFFECT. Default value for the dropdown
	$('#sel-vol-adapt-effect').html(default_adapteffect + ' <span class="caret"></span>');
    $('#sel-vol-adapt-effect').val(default_adapteffect);

    // SELECT MUSIC NUMBER OF INSTRUMENT TO MODIFY 
	$('#select-vol-numinstrument').html("global" + ' <span class="caret"></span>');
    $('#select-vol-numinstrument').val(default_adaptinstrument);

    //SELECT LIGHTS in volume. Default value for the dropdown
    $('#sel-vol-lights-follow-color').html(vol_lights_default_value + ' <span class="caret"></span>');
    $('#sel-vol-lights-follow-color').val(vol_lights_default_value);	

    //SELECT BPM ADAPTIVE FUNCTION. Default value for the dropdown
	$('#sel-bpm-adapt-function').html(default_adaptfunction + ' <span class="caret"></span>');
    $('#sel-bpm-adapt-function').val(default_adaptfunction);

    //SELECT BPM ADAPTIVE FUNCTION EFFECT. Default value for the dropdown
	$('#sel-bpm-adapt-effect').html(default_adapteffect + ' <span class="caret"></span>');
    $('#sel-bpm-adapt-effect').val(default_adapteffect);

    //SELECT FILTER ADAPTIVE FUNCTION. Default value for the dropdown
	$('#sel-filt-adapt-function').html(default_adaptfunction + ' <span class="caret"></span>');
    $('#sel-filt-adapt-function').val(default_adaptfunction);

    //SELECT BPM ADAPTIVE FUNCTION EFFECT. Default value for the dropdown
	$('#sel-filt-adapt-effect').html(default_adapteffect + ' <span class="caret"></span>');
    $('#sel-filt-adapt-effect').val(default_adapteffect);

    // SELECT MUSIC NUMBER OF INSTRUMENT TO MODIFY 
	$('#select-filt-numinstrument').html("global" + ' <span class="caret"></span>');
    $('#select-filt-numinstrument').val(default_adaptinstrument);

    //SELECT LIGHTS in filter. Default value for the dropdown
    $('#sel-filt-lights-follow-color').html(filt_lights_default_value + ' <span class="caret"></span>');
    $('#sel-filt-lights-follow-color').val(filt_lights_default_value); 
});

// Show the selected value for every dropdown menu
$(".dropdown-menu li a").click(function(){
  $(this).parents(".dropdown").find('.btn').html($(this).text() + ' <span class="caret"></span>');
  $(this).parents(".dropdown").find('.btn').val($(this).data('value'));
});

// Call selectscale() when a new scale is chosen
$("#scale-dropdown li a").click(function(){
  musicscale.selectscale();
});

// Call selectmajmin() when a new scale is chosen
$("#majmin-dropdown li a").click(function(){
  musicscale.selectmajmin();
});

// Set the new volume adaptive function of the task when a new fuction is chosen
$("#volume-adapt-function li a").click(function(){
  if (starter.getVolumeTask().switch == 1 && musicmaker.isMusicPlaying() == 1){
    dataManager.endInterval(scriptName);
  }
  starter.getVolumeTask().functionType = $('#sel-vol-adapt-function').attr("value");
  starter.getLightsIntensityTask().functionType = $('#sel-vol-adapt-function').attr("value");
});

// Update starter.getVolumeTask().functionType when triggered
$("#sel-vol-adapt-function").change(function(){
  starter.getVolumeTask().functionType = $('#sel-vol-adapt-function').attr("value");
  starter.getLightsIntensityTask().functionType = $('#sel-vol-adapt-function').attr("value");
});

// Set the new volume adaptive function effect of the task when a new effect is chosen
$("#volume-adapt-effect li a").click(function(){
  if (starter.getVolumeTask().switch == 1 && musicmaker.isMusicPlaying() == 1){
    dataManager.endInterval(scriptName);
  }
  starter.getVolumeTask().functionEffect = $('#sel-vol-adapt-effect').attr("value");
  starter.getLightsIntensityTask().functionEffect = $('#sel-vol-adapt-effect').attr("value");
});

// Update starter.getVolumeTask().functionEffect when triggered
$("#sel-vol-adapt-effect").change(function(){
  starter.getVolumeTask().functionEffect = $('#sel-vol-adapt-effect').attr("value");
  starter.getLightsIntensityTask().functionEffect = $('#sel-vol-adapt-effect').attr("value");
});

// Set the new instrument number for the volume adaptation when a new number of instrument is chosen
$("#vol-numinstrument-dropdown li a").click(function(){
  if (starter.getVolumeTask().switch == 1 && musicmaker.isMusicPlaying() == 1){
    dataManager.endInterval(scriptName);
  }
  starter.getVolumeTask().instrumentNumber = $('#select-vol-numinstrument').attr("value");
}); 

// Update starter.getVolumeTask().instrumentNumber when triggered
$("#select-vol-numinstrument").change(function(){
  starter.getVolumeTask().instrumentNumber = $('#select-vol-numinstrument').attr("value");
}); 

// Set the new bpm adaptive function of the task when a new fuction is chosen
$("#bpm-adapt-function li a").click(function(){
  if (starter.getBpmTask().switch == 1 && musicmaker.isMusicPlaying() == 1){
    dataManager.endInterval(scriptName);
  }
  starter.getBpmTask().functionType = $('#sel-bpm-adapt-function').attr("value");
});

// Update starter.getBpmTask().functionType when triggered
$("#sel-bpm-adapt-function").change(function(){
  starter.getBpmTask().functionType = $('#sel-bpm-adapt-function').attr("value");
});

// Set the new bpm adaptive function effect of the task when a new effect is chosen
$("#bpm-adapt-effect li a").click(function(){
  if (starter.getBpmTask().switch == 1 && musicmaker.isMusicPlaying() == 1){
    dataManager.endInterval(scriptName);
  }
  starter.getBpmTask().functionEffect = $('#sel-bpm-adapt-effect').attr("value");
});

// Update starter.getBpmTask().functionEffect when triggered
$("#sel-bpm-adapt-effect").change(function(){
  starter.getBpmTask().functionEffect = $('#sel-bpm-adapt-effect').attr("value");
});

// Set the new bpm adaptive function of the task when a new fuction is chosen
$("#filt-adapt-function li a").click(function(){
  if (starter.getFilterTask().switch == 1 && musicmaker.isMusicPlaying() == 1){
    dataManager.endInterval(scriptName);
  }
  starter.getFilterTask().functionType = $('#sel-filt-adapt-function').attr("value");
  starter.getLightsIntensityTask().functionType = $('#sel-filt-adapt-function').attr("value");
}); 

// Update starter.getFilterTask().functionType when triggered
$("#sel-filt-adapt-function").change(function(){
  starter.getFilterTask().functionType = $('#sel-filt-adapt-function').attr("value");
  starter.getLightsIntensityTask().functionType = $('#sel-filt-adapt-function').attr("value");
});

// Set the new filter adaptive function effect of the task when a new effect is chosen
$("#filt-adapt-effect li a").click(function(){
  if (starter.getFilterTask().switch == 1 && musicmaker.isMusicPlaying() == 1){
    dataManager.endInterval(scriptName);
  }
  starter.getFilterTask().functionEffect = $('#sel-filt-adapt-effect').attr("value");
  starter.getLightsIntensityTask().functionEffect = $('#sel-filt-adapt-effect').attr("value");
}); 

// Update starter.getFilterTask().functionEffect when triggered
$("#sel-filt-adapt-effect").change(function(){
  starter.getFilterTask().functionEffect = $('#sel-filt-adapt-effect').attr("value");
  starter.getLightsIntensityTask().functionEffect = $('#sel-filt-adapt-effect').attr("value");
});

// Set the new instrument number for the filter adaptation when a new number of instrument is chosen
$("#filt-numinstrument-dropdown li a").click(function(){
  if (starter.getFilterTask().switch == 1 && musicmaker.isMusicPlaying() == 1){
    dataManager.endInterval(scriptName);
  }
  starter.getFilterTask().instrumentNumber = $('#select-filt-numinstrument').attr("value");
});

// Update starter.getFilterTask().instrumentNumber when triggered
$("#select-filt-numinstrument").change(function(){
  starter.getFilterTask().instrumentNumber = $('#select-filt-numinstrument').attr("value");
});

// Set the new "following" of the lights task when a new "following" is chosen
$("#vol-lights-follow-color li a").click(function(){
  if (starter.getVolumeTask().switch == 1 && musicmaker.isMusicPlaying() == 1){ 
    dataManager.endInterval(scriptName);
  }
  starter.getLightsIntensityTask().color = $('#sel-vol-lights-follow-color').attr("value");
  if (starter.getLightsIntensityTask().color != "OFF"){
    $('#sel-filt-lights-follow-color').prop('disabled', true); //disable the other lights dropdown menu
    starter.getLightsIntensityTask().follow = "volume";
    copyValuesFromMusicTasks(starter.getLightsIntensityTask().follow);
  } else {
    $('#sel-filt-lights-follow-color').prop('disabled', false); //enable the other lights dropdown menu
  }
});

// Update starter.getLightsIntensityTask().color when triggered
$("#sel-vol-lights-follow-color").change(function(){
  starter.getLightsIntensityTask().color = $('#sel-vol-lights-follow-color').attr("value");
  if (starter.getLightsIntensityTask().color != "OFF"){
    $('#sel-filt-lights-follow-color').prop('disabled', true); //disable the other lights dropdown menu
    starter.getLightsIntensityTask().follow = "volume";
    copyValuesFromMusicTasks(starter.getLightsIntensityTask().follow);
  } else {
    $('#sel-filt-lights-follow-color').prop('disabled', false); //enable the other lights dropdown menu
  }
});  

// Set the new "following" of the lights task when a new "following" is chosen
$("#filt-lights-follow-color li a").click(function(){
  if (starter.getFilterTask().switch == 1 && musicmaker.isMusicPlaying() == 1){ 
    dataManager.endInterval(scriptName);
  }
  starter.getLightsIntensityTask().color = $('#sel-filt-lights-follow-color').attr("value");
  if (starter.getLightsIntensityTask().color != "OFF"){
    $('#sel-vol-lights-follow-color').prop('disabled', true); //disable the other lights dropdown menu
    starter.getLightsIntensityTask().follow = "filter";
    copyValuesFromMusicTasks(starter.getLightsIntensityTask().follow);
  } else {
    $('#sel-vol-lights-follow-color').prop('disabled', false); //enable the other lights dropdown menu
  }
});

// Update starter.getLightsIntensityTask().color when triggered
$("#sel-filt-lights-follow-color").change(function(){
  starter.getLightsIntensityTask().color = $('#sel-filt-lights-follow-color').attr("value");
  if (starter.getLightsIntensityTask().color != "OFF"){
    $('#sel-vol-lights-follow-color').prop('disabled', true); //disable the other lights dropdown menu
    starter.getLightsIntensityTask().follow = "filter";
    copyValuesFromMusicTasks(starter.getLightsIntensityTask().follow);
  } else {
    $('#sel-vol-lights-follow-color').prop('disabled', false); //enable the other lights dropdown menu
  }
}); 

$('#btnExport').click(function(){
  fnExcelReport();
});

// ONCLICK function for play button
$('#play_btn').click(function(){
    musicmaker.play();	
    dataManager.musicPlaying(musicmaker.isMusicPlaying()); 
    dataManager.endInterval(scriptName);
});

// ONCLICK function for stop button
$('#stop_btn').click(function(){
    if (musicmaker.isMusicPlaying() == 1){
      if (music_switch_vol.checked == true){
        $(music_switch_vol).trigger('click');
      }
      if (music_switch_bpm.checked == true){
        $(music_switch_bpm).trigger('click');
      }
      if (music_switch_filt.checked == true){
        $(music_switch_filt).trigger('click');
      }
      starter.getLightsIntensityTask().color = "OFF";
      justStopped = 1;
    } 
    musicmaker.stop();
    dataManager.musicPlaying(musicmaker.isMusicPlaying()); 
    dataManager.endInterval(scriptName);
});

exports.getJustStopped = function(){
  return justStopped;
}

exports.setJustStopped = function(value){
  justStopped = value;
}

// ONCLICK function for preset 1 button
$('#preset_1').click(function(){
    if (music_switch_vol.checked == false){
      $(music_switch_vol).trigger('click');
    }
    if (music_switch_bpm.checked == true){
      $(music_switch_bpm).trigger('click');
    }
    if (music_switch_filt.checked == true){
      $(music_switch_filt).trigger('click');
    }
    $('#sel-vol-adapt-effect').html("inverse" + ' <span class="caret"></span>');
    $('#sel-vol-adapt-effect').val("inverse");
    $('#sel-vol-adapt-effect').trigger('change');
    $('#select-vol-numinstrument').html("global" + ' <span class="caret"></span>');
    $('#select-vol-numinstrument').val(0);
    $('#select-vol-numinstrument').trigger('change');
});

// ONCLICK function for preset 2 button
$('#preset_2').click(function(){
    if (music_switch_vol.checked == true){
      $(music_switch_vol).trigger('click');
    }
    if (music_switch_bpm.checked == false){
      $(music_switch_bpm).trigger('click');
    }
    if (music_switch_filt.checked == false){
      $(music_switch_filt).trigger('click');
    }
    $('#sel-bpm-adapt-effect').html("inverse" + ' <span class="caret"></span>');
    $('#sel-bpm-adapt-effect').val("inverse");
    $('#sel-bpm-adapt-effect').trigger('change');    
    $('#sel-filt-adapt-effect').html("inverse" + ' <span class="caret"></span>');
    $('#sel-filt-adapt-effect').val("inverse");
    $('#sel-filt-adapt-effect').trigger('change');
    $('#select-filt-numinstrument').html("global" + ' <span class="caret"></span>');
    $('#select-filt-numinstrument').val(0);
    $('#select-filt-numinstrument').trigger('change');
});

// ONCLICK function for preset 3 button
$('#preset_3').click(function(){
    if (music_switch_vol.checked == false){
      $(music_switch_vol).trigger('click');
    }
    if (music_switch_bpm.checked == true){
      $(music_switch_bpm).trigger('click');
    }
    if (music_switch_filt.checked == false){
      $(music_switch_filt).trigger('click');
    }    
    $('#sel-vol-adapt-effect').html("direct" + ' <span class="caret"></span>');
    $('#sel-vol-adapt-effect').val("direct");
    $('#sel-vol-adapt-effect').trigger('change');
    $('#select-vol-numinstrument').html(1 + ' <span class="caret"></span>');
    $('#select-vol-numinstrument').val(1);
    $('#select-vol-numinstrument').trigger('change');
    $('#sel-filt-adapt-effect').html("direct" + ' <span class="caret"></span>');
    $('#sel-filt-adapt-effect').val("direct");
    $('#sel-filt-adapt-effect').trigger('change');
    $('#select-filt-numinstrument').html(1 + ' <span class="caret"></span>');
    $('#select-filt-numinstrument').val(1);
    $('#select-filt-numinstrument').trigger('change');
});


// Select a music script through a pop-up
document.getElementById('file-input').addEventListener('change', readFileJSON, false);

// Select lights configuration file thourgh a pop-up
document.getElementById('file-input-lights').addEventListener('change', readFileJSONLightsPath, false);

// Read JSON music file
function readFileJSON(session) {
  var reader = new FileReader();
  reader.onload = function(event) {
    json = event.target.result;
    console.log("JSON = ",JSON.parse(json));
    musicmaker.setScriptValues(JSON.parse(json));
    try {
      json = JSON.parse(json);
    } catch (err) {
      var opt = {
        type: "basic",
        title: "ALERT",
        message: "This is not a well formed JSON file. Error" + err + " detected",
        iconUrl: "../../alert.jpg"
      }
      chrome.notifications.create("string notificationId", opt);
      json = undefined;
      return;
    }
  };
  scriptName = session.target.files[0].name;
  reader.readAsText(session.target.files[0]);
}

exports.getJSON = function(){
  return JSON.parse(json);
}

function readFileJSONLightsPath(session) {
  jsonpath = session.target.files[0];
  $('#lightsConfiguration').hide(); 
  startApplication();
}

exports.getFileJSONLightsPath = function(session) {
  return jsonpath;
}

//Initialize switches into variables
var music_switch_vol = document.querySelector('#music-switch-volume');
music_switch_vol.onchange = function() { 
  if (musicmaker.isMusicPlaying() == 1){
    dataManager.endInterval(scriptName);
  }
  if (music_switch_vol.checked == true){
    starter.getVolumeTask().switch = 1;
    starter.getLightsIntensityTask().switch = 1;
  } else {
    starter.getVolumeTask().switch = 0;
    starter.getLightsIntensityTask().color = "OFF";
    starter.getLightsIntensityTask().switch = 0;
    $('#sel-vol-lights-follow-color').html("OFF" + ' <span class="caret"></span>');
    $('#sel-vol-lights-follow-color').val("OFF");  
    $('#sel-filt-lights-follow-color').prop('disabled', false); 
  }
};

var music_switch_bpm = document.querySelector('#music-switch-bpm');
music_switch_bpm.onchange = function() { 
  if (musicmaker.isMusicPlaying() == 1){
    dataManager.endInterval(scriptName);
  }
  if (music_switch_bpm.checked == true){
    starter.getBpmTask().switch = 1;
  } else {
    starter.getBpmTask().switch = 0;
    starter.getLightsIntensityTask().color = "OFF";
  }
};

var music_switch_filt = document.querySelector('#music-switch-filter');
music_switch_filt.onchange = function() { 
  if (musicmaker.isMusicPlaying() == 1){
    dataManager.endInterval(scriptName);
  }
  if (music_switch_filt.checked == true){
    starter.getFilterTask().switch = 1;
    starter.getLightsIntensityTask().switch = 1;
  } else {
    starter.getFilterTask().switch = 0;
    starter.getLightsIntensityTask().color = "OFF";
    starter.getLightsIntensityTask().switch = 0;
    $('#sel-filt-lights-follow-color').html("OFF" + ' <span class="caret"></span>'); 
    $('#sel-filt-lights-follow-color').val("OFF"); 
    $('#sel-vol-lights-follow-color').prop('disabled', false); 
  }
};

// When click on button "connect", show panel for lights initial configuration
document.addEventListener('DOMContentLoaded', function() {
  $('#form').click(function() {
    if ($('#portListButton').attr("value") !== undefined || document.getElementById("dummyBool").checked == true){ //Start application only if a port is already being selected
      startLightsConnection(); 
      return false;
    }
  });
});

function startLightsConnection(){
  $('#controlPanel').hide(); 
  $('#lightsConfiguration').show(); 
}

function copyValuesFromMusicTasks(param){
  switch (param){
    case 'volume':
      starter.getLightsIntensityTask().functionType = starter.getVolumeTask().functionType;
      starter.getLightsIntensityTask().functionEffect = starter.getVolumeTask().functionEffect;
      break;
    case 'bpm':
      starter.getLightsIntensityTask().functionType = starter.getBpmTask().functionType;
      starter.getLightsIntensityTask().functionEffect = starter.getBpmTask().functionEffect;
      break;
    case 'filter':
      starter.getLightsIntensityTask().functionType = starter.getFilterTask().functionType;
      starter.getLightsIntensityTask().functionEffect = starter.getFilterTask().functionEffect;
      break;  
  }
}

// Start application
function startApplication() {
  console.log("START APPLICATION");
  $('#lightsConfiguration').hide();
  $('#musicmakerpanel').show();
  $('#musicadaptationpanel').show();
  $('#statisticpanel').show();

  port = $('#portListButton').attr("value");
  dummyBool = document.getElementById("dummyBool").checked;

  //Check if port is inserted with dummy disabled.
  if (dummyBool == false) {
    if (port == '') {
      var opt = {
        type: "basic",
        title: "ALERT",
        message: "port is not defined for not dummy applcation!",
        iconUrl: "../../alert.jpg"
      }
      chrome.notifications.create("string notificationId", opt);
      return;
    }
  }
  initializeGraphs(); 
  start();
}

// Initialize application.
function start() {
  console.log("Launching application");
  if (dummyBool == true) {
    adapter = new Dummy();
  } else {
    var adapter = new Adapter(port);
  }
  adapter.once("packet", function(data) {
    starter.startNewSession();
  })
  dataReceiver.setAdapter(adapter);
  adapter.init();
}

// Export data table
function fnExcelReport()
{
    var tab_text="<table border='2px'>";
    tab_text = tab_text + '<x:Name>Music script used : ' + scriptName + '</x:Name>'; 
    tab_text = tab_text + "<tr bgcolor='#87AFC6'>";
    var textRange; var j=0;
    tab = document.getElementById('datatable'); // id of table

    for(j = 0 ; j < tab.rows.length ; j++) 
    {     
        tab_text=tab_text+tab.rows[j].innerHTML+"</tr>";
    }

    tab_text= tab_text+"</table>";
    tab_text= tab_text.replace(/<A[^>]*>|<\/A>/g, "");//remove if u want links in your table
    tab_text= tab_text.replace(/<img src="arrow-up[^>]*>/gi,"better"); // replace arrow up icon with "better"
    tab_text= tab_text.replace(/<img src="arrow-down[^>]*>/gi,"worse"); // replace arrow down icon with "worse"
    tab_text= tab_text.replace(/<img src="arrow-equal[^>]*>/gi,"same"); // replace arrow equal icon with "same"
    tab_text= tab_text.replace(/<img src="arrow-star[^>]*>/gi,"best"); // replace star icon with "best"
    tab_text= tab_text.replace(/<input[^>]*>|<\/input>/gi, ""); // remove input params

    var ua = window.navigator.userAgent;
    var msie = ua.indexOf("MSIE "); 

    if (msie > 0 || !!navigator.userAgent.match(/Trident.*rv\:11\./))      // If Internet Explorer
    {
        txtArea1.document.open("txt/html","replace");
        txtArea1.document.write(tab_text);
        txtArea1.document.close();
        txtArea1.focus(); 
        sa=txtArea1.document.execCommand("SaveAs",true,"download.xls");
    }  
    else                 
        sa = window.open('data:application/vnd.ms-excel,' + encodeURIComponent(tab_text));  

    return (sa);
}