


var i = 0; //number of synth, starts from 0
var n = 1; //visual number of synth, starts from 1

var main_div = document.getElementById('main-div');

// Add an instrument panel at every click of "add-synth"
$('#add-synth').click(function(){
  main_div.insertAdjacentHTML('beforeend', '<div class="row" id="synth'+i+'"> <!-- synthi --> <div class="x_panel"> <div class="x_title"> <h2>Synthesizer '+n+'</h2> <!--<ul class="nav navbar-right panel_toolbox"> <li><a class="collapse-link"><i class="fa fa-chevron-up"></i></a> </li> </ul>--> <div class="clearfix"></div> </div> <div class="x_content"> <div class="row"> <!-- first row --> <div class="col-lg-4 col-md-4 col-sm-4 col-xs-4"> <!-- first column --> <label >OSCILLATOR 1</label> <form class="form-horizontal"> <div class="form-group"> <label for="synth'+i+'-osc1-wave" class="col-sm-2 control-label">Wave</label> <div class="col-sm-6"> <input class="form-control" id="synth'+i+'-osc1-wave" placeholder="sine,square,triangle,sawtooth"> </div> </div> <div class="form-group"> <label for="synth'+i+'-osc1-gain" class="col-sm-2 control-label">Gain</label> <div class="col-sm-6"> <input class="form-control" id="synth'+i+'-osc1-gain" placeholder="between 0 and 1"> </div> </div> <div class="form-group"> <label for="synth'+i+'-osc1-transp" class="col-sm-2 control-label">Transposition</label> <div class="col-sm-6"> <input class="form-control" id="synth'+i+'-osc1-transp" placeholder="between -7 and 7"> </div> </div> </form> </div> <div class="col-lg-4 col-md-4 col-sm-4 col-xs-4"> <!-- second column --> <label >OSCILLATOR 2</label> <form class="form-horizontal"> <div class="form-group"> <label for="synth'+i+'-osc2-wave" class="col-sm-2 control-label">Wave</label> <div class="col-sm-6"> <input class="form-control" id="synth'+i+'-osc2-wave" placeholder="sine,square,triangle,sawtooth"> </div> </div> <div class="form-group"> <label for="synth'+i+'-osc2-gain" class="col-sm-2 control-label">Gain</label> <div class="col-sm-6"> <input class="form-control" id="synth'+i+'-osc2-gain" placeholder="between 0 and 1"> </div> </div> <div class="form-group"> <label for="synth'+i+'-osc2-transp" class="col-sm-2 control-label">Transposition</label> <div class="col-sm-6"> <input class="form-control" id="synth'+i+'-osc2-transp" placeholder="between -7 and 7"> </div> </div> </form> </div> <div class="col-lg-4 col-md-4 col-sm-4 col-xs-4"> <!-- third column --> <label >OSCILLATOR 3</label> <form class="form-horizontal"> <div class="form-group"> <label for="synth'+i+'-osc3-wave" class="col-sm-2 control-label">Wave</label> <div class="col-sm-6"> <input class="form-control" id="synth'+i+'-osc3-wave" placeholder="sine,square,triangle,sawtooth"> </div> </div> <div class="form-group"> <label for="synth'+i+'-osc3-gain" class="col-sm-2 control-label">Gain</label> <div class="col-sm-6"> <input class="form-control" id="synth'+i+'-osc3-gain" placeholder="between 0 and 1"> </div> </div> <div class="form-group"> <label for="synth'+i+'-osc3-transp" class="col-sm-2 control-label">Transposition</label> <div class="col-sm-6"> <input class="form-control" id="synth'+i+'-osc3-transp" placeholder="between -7 and 7"> </div> </div> </form> </div> </div> <div class="row padding-top-50"> <!-- second row--> <div class="col-lg-4 col-md-4 col-sm-4 col-xs-4"> <!-- first column --> <!-- ON/OFF ACTIVATE ADAPTATION OPTIONS --> <!-- they can be checked or unchecked or disable or checked&disabled--> <label >ADSR</label> <form class="form-horizontal"> <div class="form-group">  <label for="synth'+i+'-attack" class="col-sm-2 control-label">Attack</label> <div class="col-sm-3"> <input class="form-control" id="synth'+i+'-attack" placeholder="in sec"> </div> <div class="dropdown col-sm-3"> <button id="synth'+i+'-attack-function" data-toggle="dropdown" class="btn btn-default dropdown-toggle" type="button" aria-expanded="false"> Select function <span class="caret"></span> </button> <ul role="menu" class="dropdown-menu" id="synth'+i+'-attack-dropdown"> <li><a role="button" data-value="lin">linear</a> </li> <li><a role="button" data-value="exp">exponential</a> </li> </ul> </div> </div> <div class="form-group"> <label for="synth'+i+'-decay" class="col-sm-2 control-label">Decay</label> <div class="col-sm-3"> <input class="form-control" id="synth'+i+'-decay" placeholder="in sec"> </div> <div class="dropdown col-sm-3"> <button id="synth'+i+'-decay-function" data-toggle="dropdown" class="btn btn-default dropdown-toggle" type="button" aria-expanded="false"> Select function <span class="caret"></span> </button> <ul role="menu" class="dropdown-menu" id="synth'+i+'-decay-dropdown"> <li><a role="button" data-value="lin">linear</a> </li> <li><a role="button" data-value="exp">exponential</a> </li> </ul> </div> </div> <div class="form-group"> <label for="synth'+i+'-sustain" class="col-sm-2 control-label">Sustain</label> <div class="col-sm-6"> <input class="form-control" id="synth'+i+'-sustain" placeholder="between 0 and 1"> </div> </div> <div class="form-group"> <label for="synth'+i+'-release" class="col-sm-2 control-label">Release</label> <div class="col-sm-3"> <input class="form-control" id="synth'+i+'-release" placeholder="in s"> </div> <div class="dropdown col-sm-3"> <button id="synth'+i+'-release-function" data-toggle="dropdown" class="btn btn-default dropdown-toggle" type="button" aria-expanded="false"> Select function <span class="caret"></span> </button> <ul role="menu" class="dropdown-menu" id="synth'+i+'-release-dropdown"> <li><a role="button" data-value="lin">linear</a> </li> <li><a role="button" data-value="exp">exponential</a> </li> </ul> </div> </div> </form> </div> <div class="col-lg-4 col-md-4 col-sm-4 col-xs-4"> <!-- second column --> <label>FILTER</label> <form class="form-horizontal"> <div class="form-group"> <label for="synth'+i+'-filter-type" class="col-sm-2 control-label">Type</label> <div class="col-sm-6"> <input class="form-control" id="synth'+i+'-filter-type" placeholder="lowpass,bandpass"> </div> </div> <div class="form-group"> <label for="synth'+i+'-filter-freq" class="col-sm-2 control-label">Frequency</label> <div class="col-sm-6"> <input class="form-control" id="synth'+i+'-filter-freq" placeholder="between 0 and 22000"> </div> </div> <div class="form-group"> <label for="synth'+i+'-filter-q" class="col-sm-2 control-label">Q</label> <div class="col-sm-6"> <input class="form-control" id="synth'+i+'-filter-q" placeholder="between 0.0001 and 1000"> </div> </div> </form> </div> <div class="col-lg-4 col-md-4 col-sm-4 col-xs-4"> <!-- third column --> <label >TOTAL GAIN</label> <form class="form-horizontal"> <div class="form-group"> <label for="synth'+i+'-gain" class="col-sm-2 control-label">Gain</label> <div class="col-sm-6"> <input class="form-control" id="synth'+i+'-gain" placeholder="between 0 and 1"> </div> </div> </form> </div> </div> <!-- /second row --> <div class="row"> <!-- third row --> <div class="col-lg-5"> <!-- first empty column --> </div> <div class="col-lg-4"> <!-- second centered column --> <a id="synth'+i+'-play-sound" class="btn btn-app-small" data-value="1"> <i class="fa fa-play"></i> Play sound </a> </div> <div class="col-lg-3"> <!-- third empty column --> </div> </div> <!-- /third row --> <div class="row padding-top-80"> <!-- fourth row--> <div class="col-lg-6 col-md-6 col-sm-6 col-xs-6"> <!-- first column --> <label>RHYTHM - select one of the alternatives, numbers indicate 16th notes and they are separated by commas</label> <form class="form-horizontal"> <div class="form-group"> <div class="radio col-sm-1 control-label"> <input type="radio" name="synth'+i+'-rhythm-radio" value="0"> </div> <label for="synth'+i+'-rhythm-random" class="col-sm-1 control-label">Random</label> <div class="col-sm-4"> <input class="form-control" id="synth'+i+'-rhythm-random-length" placeholder="loop length in bars"> </div> <div class="col-sm-4"> <input class="form-control" id="synth'+i+'-rhythm-random-notes" placeholder="number of notes"> </div> </div> <div class="form-group"> <div class="radio col-sm-1 control-label"> <input type="radio" name="synth'+i+'-rhythm-radio" value="1"> </div> <label for="synth'+i+'-rhythm-library" class="col-sm-1 control-label">Library</label> <div class="dropdown col-sm-6"> <button id="synth'+i+'-rhythm-library" data-toggle="dropdown" class="btn btn-default dropdown-toggle" type="button" aria-expanded="false"> Select rhythm from library <span class="caret"></span> </button> <ul role="menu" class="dropdown-menu" id="synth'+i+'-rhythm-library-dropdown"> <li><a role="button" data-value="0">0,4,8,12,16,20,24,28</a> </li> <li><a role="button" data-value="1">0,2,4,8,10,12,16,18,20,24,26,28</a> </li> <li><a role="button" data-value="2">0,8,16,24</a> </li> <li><a role="button" data-value="3">0,2,4,6,8,10,12,14,16,18,20,22,24,26,28,30</a> </li> <li><a role="button" data-value="4">0,1,2,3,4,8,9,10,11,12,16,17,18,19,20,24,25,26,27,28</a> </li> <li><a role="button" data-value="5">0,3,4,7,8,11,12,15,16,19,20,23,24,27,28,31</a> </li> <li><a role="button" data-value="6">4,12,20,28</a> </li> <li><a role="button" data-value="7">0,16</a> </li> </ul> </div> </div> <div class="form-group"> <div class="radio col-sm-1 control-label"> <input type="radio" name="synth'+i+'-rhythm-radio" value="2"> </div> <label for="synth'+i+'-rhythm-hand" class="col-sm-1 control-label">Define</label> <div class="col-sm-8"> <input class="form-control" id="synth'+i+'-rhythm-hand" placeholder="insert rhythm by hand (es. 0,4,8,9,12)"> </div> </div> </form> </div> <div class="col-lg-6 col-md-6 col-sm-6 col-xs-6"> <!-- first column --> <label>DURATION - select one of the alternatives, durations are expressed as beats and they are separated by commas</label> <form class="form-horizontal"> <div class="form-group"> <div class="radio col-sm-1 control-label"> <input type="radio" name="synth'+i+'-duration-radio" value="0"> </div> <label for="synth'+i+'-duration-random" class="col-sm-1 control-label">Random</label> <div class="col-sm-8"> <input class="form-control" id="synth'+i+'-duration-random" placeholder="between the inserted durations (es. 1,0.5,0.25,2)"> </div> </div> <div class="form-group"> <div class="radio col-sm-1 control-label"> <input type="radio" name="synth'+i+'-duration-radio" value="1"> </div> <label for="synth'+i+'-duration-random-values" class="col-sm-3 control-label">Random choice with probabilities</label> <div class="col-sm-3"> <input class="form-control" id="synth'+i+'-duration-random-values" placeholder="possible durations"> </div> <div class="col-sm-3"> <input class="form-control" id="synth'+i+'-duration-random-prob" placeholder="corresponding probabilities"> </div> </div> <div class="form-group"> <div class="radio col-sm-1 control-label"> <input type="radio" name="synth'+i+'-duration-radio" value="2"> </div> <label for="synth'+i+'-duration-hand" class="col-sm-1 control-label">Define</label> <div class="col-sm-8"> <input class="form-control" id="synth'+i+'-duration-hand" placeholder="insert durations by hand (es. 0.25,0.25,1,0.5,0.25)"> </div> </div> </form> </div> </div> <div class="row padding-top-50"> <!-- third row--> <div class="col-lg-6 col-md-6 col-sm-6 col-xs-6"> <!-- first column --> <label>NOTES - select one of the alternatives, numbers indicate notes in the selected scale and they are separated by commas</label> <form class="form-horizontal"> <div class="form-group"> <div class="radio col-sm-1 control-label"> <input type="radio" name="synth'+i+'-note-radio" value="0"> </div> <label for="synth'+i+'-note-random-min" class="col-sm-3 control-label">Random choice between</label> <div class="col-sm-1"> <input class="form-control" id="synth'+i+'-note-random-min" placeholder="min"> </div> <div class="col-sm-1"> <input class="form-control" id="synth'+i+'-note-random-max" placeholder="max"> </div> </div> <div class="form-group"> <div class="radio col-sm-1 control-label"> <input type="radio" name="synth'+i+'-note-radio" value="1"> </div> <label for="synth'+i+'-note-random-values" class="col-sm-3 control-label">Random choice with probabilities</label> <div class="col-sm-3"> <input class="form-control" id="synth'+i+'-note-random-values" placeholder="possible notes"> </div> <div class="col-sm-3"> <input class="form-control" id="synth'+i+'-note-random-prob" placeholder="corresponding probabilities"> </div> </div> <div class="form-group"> <div class="radio col-sm-1 control-label"> <input type="radio" name="synth'+i+'-note-radio" value="2"> </div> <label for="synth'+i+'-note-loop-min" class="col-sm-3 control-label">Loop of notes between</label> <div class="col-sm-1"> <input class="form-control" id="synth'+i+'-note-loop-min" placeholder="min"> </div> <div class="col-sm-1"> <input class="form-control" id="synth'+i+'-note-loop-max" placeholder="max"> </div> <div class="col-sm-4"> <input class="form-control" id="synth'+i+'-note-loop-numofnotes" placeholder="number of notes"> </div> </div> <div class="form-group"> <div class="radio col-sm-1 control-label"> <input type="radio" name="synth'+i+'-note-radio" value="3"> </div> <label for="synth'+i+'-note-hand" class="col-sm-1 control-label">Define</label> <div class="col-sm-8"> <input class="form-control" id="synth'+i+'-note-hand" placeholder="insert notes by hand (es. 23,27,32,20,39)"> </div> </div> </form> </div> <div class="col-lg-6 col-md-6 col-sm-6 col-xs-6"> <!-- first column --> <label>VELOCITY - select one of the alternatives, numbers are integer between 0 and 127 and separated by commas</label> <form class="form-horizontal"> <div class="form-group"> <div class="radio col-sm-1 control-label"> <input type="radio" name="synth'+i+'-velocity-radio" value="0"> </div> <label for="synth'+i+'-velocity-random-min" class="col-sm-3 control-label">Random choice between</label> <div class="col-sm-1"> <input class="form-control" id="synth'+i+'-velocity-random-min" placeholder="min"> </div> <div class="col-sm-1"> <input class="form-control" id="synth'+i+'-velocity-random-max" placeholder="max"> </div> </div> <div class="form-group"> <div class="radio col-sm-1 control-label"> <input type="radio" name="synth'+i+'-velocity-radio" value="1"> </div> <label for="synth'+i+'-velocity-random-choice" class="col-sm-3 control-label">Random choice amongst</label> <div class="col-sm-6"> <input class="form-control" id="synth'+i+'-velocity-random-choice" placeholder="possible velocities"> </div> </div> <div class="form-group"> <div class="radio col-sm-1 control-label"> <input type="radio" name="synth'+i+'-velocity-radio" value="2"> </div> <label for="synth'+i+'-velocity-random-values" class="col-sm-3 control-label">Random choice with probabilities</label> <div class="col-sm-3"> <input class="form-control" id="synth'+i+'-velocity-random-values" placeholder="possible velocities"> </div> <div class="col-sm-3"> <input class="form-control" id="synth'+i+'-velocity-random-prob" placeholder="corresponding probabilities"> </div> </div> <div class="form-group"> <div class="radio col-sm-1 control-label"> <input type="radio" name="synth'+i+'-velocity-radio" value="3"> </div> <label for="synth'+i+'-velocity-hand" class="col-sm-1 control-label">Define</label> <div class="col-sm-8"> <input class="form-control" id="synth'+i+'-velocity-hand" placeholder="insert velocities by hand (es. 127,90,65,80,43)"> </div> </div> </form> </div> </div> <div class="row"> <!-- third row --> <div class="col-lg-5"> <!-- first empty column --> </div> <div class="col-lg-1"> <!-- second centered column --> <a id="synth'+i+'-play-music" class="btn btn-app-small" data-value="1"> <i class="fa fa-play"></i> Play music </a> </div> <div class="col-lg-1"> <!-- second centered column --> <a id="synth'+i+'-stop-music" class="btn btn-app-small" data-value="0"> <i class="fa fa-stop"></i> Stop music </a> </div> <div class="col-lg-5"> <!-- third empty column --> </div> </div> <!-- /third row --> </div> </div> </div> <!-- /synthi -->');

	$('#synth'+i+'-play-sound').click({param1: i,param2: n},playsound);
  $('#synth'+i+'-play-music').click({param1: i,param2: n},playsinglemusic);
	$('#synth'+i+'-stop-music').click({param1: i,param2: n},stopsinglemusic);

  // Show and set the selected value for dropdown menus created dinamically
	$(".dropdown-menu li a").on("click",function(){
  	$(this).parents(".dropdown").find('.btn').html($(this).text() + ' <span class="caret"></span>');
  	$(this).parents(".dropdown").find('.btn').val($(this).data('value'));
	});
  i++;
  n++;
});

// Show and set the selected value for dropdown menus in the top panel
$(".dropdown-menu li a").on("click",function(){
  	$(this).parents(".dropdown").find('.btn').html($(this).text() + ' <span class="caret"></span>');
  	$(this).parents(".dropdown").find('.btn').val($(this).data('value'));
});

// Call selectscale() when a new scale is chosen
$("#scale-dropdown li a").click(function(){
  selectscale();
});

// Call selectmajmin() when a new scale is chosen
$("#majmin-dropdown li a").click(function(){
  selectmajmin();
});

$('#playeverything').click(function(){
	playmusic();
});	
$('#stopeverything').click(function(){
	stop();
});

// Prepare JSON file
$('#export').click(function(){
	var exportJSON = '{ "scriptname": "' + $("#scriptName").val() + '" , "bpm": "' + $("#bpm").val() + '" , "scale": "' + $("#select-scale").val() + '" , "scaletype": "' + $("#select-majmin").val() + '" , '; 

	exportJSON = exportJSON + '"synthesizers" : [';
	for (var f = 0; f < i; f++){
		if (f !== i-1){ //all synths except the last one	
			exportJSON = exportJSON +
			'{ "synthid": "synth'+ f +'" , "osc1wave": "'+ $("#synth"+ f +"-osc1-wave").val() +'" , "osc1gain": "'+ $("#synth"+ f +"-osc1-gain").val() +'" ,'+
			'"osc1transp": "'+ $("#synth"+ f +"-osc1-transp").val() +'" , "osc2wave": "'+ $("#synth"+ f +"-osc2-wave").val() +'" , '+
			'"osc2gain": "'+ $("#synth"+ f +"-osc2-gain").val() +'" , "osc2transp": "'+ $("#synth"+ f +"-osc2-transp").val() +'" , '+
			'"osc3wave": "'+ $("#synth"+ f +"-osc3-wave").val() +'" , "osc3gain": "'+ $("#synth"+ f +"-osc3-gain").val() +'" , '+
			'"osc3transp": "'+ $("#synth"+ f +"-osc3-transp").val() +'" , "attack": "'+ $("#synth"+ f +"-attack").val() +'" , '+
			'"attackfunction": "'+ $("#synth"+ f +"-attack-function").val() +'" , "decay": "'+ $("#synth"+ f +"-decay").val() +'" , '+
			'"decayfunction": "'+ $("#synth"+ f +"-decay-function").val() +'" , "sustain": "'+ $("#synth"+ f +"-sustain").val() +'" , '+
			'"release": "'+ $("#synth"+ f +"-release").val() +'" , "releasefunction": "'+ $("#synth"+ f +"-release-function").val() +'" , '+
			'"filtertype": "'+ $("#synth"+ f +"-filter-type").val() +'" , "filterfreq": "'+ $("#synth"+ f +"-filter-freq").val() +'" , '+
			'"filterq": "'+ $("#synth"+ f +"-filter-q").val() +'" , "gain": "'+ $("#synth"+ f +"-gain").val() +'" , '+
			'"rhythmradio": "'+ $("input[name='synth"+ f +"-rhythm-radio']:checked").val() +'" , '+
			'"rhythmrandomlength": "'+ $("#synth"+ f +"-rhythm-random-length").val() +'" ,  '+
			'"rhythmrandomnotes": "'+ $("#synth"+ f +"-rhythm-random-notes").val() +'" , '+
			'"rhythmlibrary": "'+ $("#synth"+ f +"-rhythm-library").val() +'" , '+  
			'"rhythmhand": "['+ $("#synth"+ f +"-rhythm-hand").val() +']" , '+
			'"durationradio": "'+ $("input[name='synth"+ f +"-duration-radio']:checked").val() +'" , '+
			'"durationrandom": "['+ $("#synth"+ f +"-duration-random").val() +']" ,  '+
			'"durationrandomvalues": "['+ $("#synth"+ f +"-duration-random-values").val() +']" , '+
			'"durationrandomprob": "['+ $("#synth"+ f +"-duration-random-prob").val() +']" , '+
			'"durationhand": "['+ $("#synth"+ f +"-duration-hand").val() +']" , '+
			'"noteradio": "'+ $("input[name='synth"+ f +"-note-radio']:checked").val() +'" , '+
			'"noterandommin": "'+ $("#synth"+ f +"-note-random-min").val() +'" ,  '+
			'"noterandommax": "'+ $("#synth"+ f +"-note-random-max").val() +'" ,  '+
			'"noterandomvalues": "['+ $("#synth"+ f +"-note-random-values").val() +']" , '+
			'"noterandomprob": "['+ $("#synth"+ f +"-note-random-prob").val() +']" , '+
			'"noteloopmin": "'+ $("#synth"+ f +"-note-loop-min").val() +'" ,  '+
			'"noteloopmax": "'+ $("#synth"+ f +"-note-loop-max").val() +'" ,  '+
			'"noteloopnumofnotes": "'+ $("#synth"+ f +"-note-loop-numofnotes").val() +'" ,  '+
			'"notehand": "['+ $("#synth"+ f +"-note-hand").val() +']" , '+
			'"velocityradio": "'+ $("input[name='synth"+ f +"-velocity-radio']:checked").val() +'" , '+
			'"velocityrandommin": "'+ $("#synth"+ f +"-velocity-random-min").val() +'" ,  '+
			'"velocityrandommax": "'+ $("#synth"+ f +"-velocity-random-max").val() +'" ,  '+
			'"velocityrandomchoice": "['+ $("#synth"+ f +"-velocity-random-choice").val() +']" , '+
			'"velocityrandomvalues": "['+ $("#synth"+ f +"-velocity-random-values").val() +']" , '+
			'"velocityrandomprob": "['+ $("#synth"+ f +"-velocity-random-prob").val() +']" , '+
			'"velocityhand": "['+ $("#synth"+ f +"-velocity-hand").val() +']" },'; 
		} else { //last synth (no comma in the json)
    		exportJSON = exportJSON +
			'{ "synthid": "synth'+ f +'" , "osc1wave": "'+ $("#synth"+ f +"-osc1-wave").val() +'" , "osc1gain": "'+ $("#synth"+ f +"-osc1-gain").val() +'" ,'+
			'"osc1transp": "'+ $("#synth"+ f +"-osc1-transp").val() +'" , "osc2wave": "'+ $("#synth"+ f +"-osc2-wave").val() +'" , '+
			'"osc2gain": "'+ $("#synth"+ f +"-osc2-gain").val() +'" , "osc2transp": "'+ $("#synth"+ f +"-osc2-transp").val() +'" , '+
			'"osc3wave": "'+ $("#synth"+ f +"-osc3-wave").val() +'" , "osc3gain": "'+ $("#synth"+ f +"-osc3-gain").val() +'" , '+
			'"osc3transp": "'+ $("#synth"+ f +"-osc3-transp").val() +'" , "attack": "'+ $("#synth"+ f +"-attack").val() +'" , '+
			'"attackfunction": "'+ $("#synth"+ f +"-attack-function").val() +'" , "decay": "'+ $("#synth"+ f +"-decay").val() +'" , '+
			'"decayfunction": "'+ $("#synth"+ f +"-decay-function").val() +'" , "sustain": "'+ $("#synth"+ f +"-sustain").val() +'" , '+
			'"release": "'+ $("#synth"+ f +"-release").val() +'" , "releasefunction": "'+ $("#synth"+ f +"-release-function").val() +'" , '+
			'"filtertype": "'+ $("#synth"+ f +"-filter-type").val() +'" , "filterfreq": "'+ $("#synth"+ f +"-filter-freq").val() +'" , '+
			'"filterq": "'+ $("#synth"+ f +"-filter-q").val() +'" , "gain": "'+ $("#synth"+ f +"-gain").val() +'" , '+
			'"rhythmradio": "'+ $("input[name='synth"+ f +"-rhythm-radio']:checked").val() +'" , '+
			'"rhythmrandomlength": "'+ $("#synth"+ f +"-rhythm-random-length").val() +'" ,  '+
			'"rhythmrandomnotes": "'+ $("#synth"+ f +"-rhythm-random-notes").val() +'" , '+
			'"rhythmlibrary": "'+ $("#synth"+ f +"-rhythm-library").val() +'" , '+ 
			'"rhythmhand": "['+ $("#synth"+ f +"-rhythm-hand").val() +']" , '+
			'"durationradio": "'+ $("input[name='synth"+ f +"-duration-radio']:checked").val() +'" , '+
			'"durationrandom": "['+ $("#synth"+ f +"-duration-random").val() +']" ,  '+
			'"durationrandomvalues": "['+ $("#synth"+ f +"-duration-random-values").val() +']" , '+
			'"durationrandomprob": "['+ $("#synth"+ f +"-duration-random-prob").val() +']" , '+
			'"durationhand": "['+ $("#synth"+ f +"-duration-hand").val() +']" , '+
			'"noteradio": "'+ $("input[name='synth"+ f +"-note-radio']:checked").val() +'" , '+
			'"noterandommin": "'+ $("#synth"+ f +"-note-random-min").val() +'" ,  '+
			'"noterandommax": "'+ $("#synth"+ f +"-note-random-max").val() +'" ,  '+
			'"noterandomvalues": "['+ $("#synth"+ f +"-note-random-values").val() +']" , '+
			'"noterandomprob": "['+ $("#synth"+ f +"-note-random-prob").val() +']" , '+
			'"noteloopmin": "'+ $("#synth"+ f +"-note-loop-min").val() +'" ,  '+
			'"noteloopmax": "'+ $("#synth"+ f +"-note-loop-max").val() +'" ,  '+
			'"noteloopnumofnotes": "'+ $("#synth"+ f +"-note-loop-numofnotes").val() +'" ,  '+
			'"notehand": "['+ $("#synth"+ f +"-note-hand").val() +']" , '+
			'"velocityradio": "'+ $("input[name='synth"+ f +"-velocity-radio']:checked").val() +'" , '+
			'"velocityrandommin": "'+ $("#synth"+ f +"-velocity-random-min").val() +'" ,  '+
			'"velocityrandommax": "'+ $("#synth"+ f +"-velocity-random-max").val() +'" ,  '+
			'"velocityrandomchoice": "['+ $("#synth"+ f +"-velocity-random-choice").val() +']" , '+
			'"velocityrandomvalues": "['+ $("#synth"+ f +"-velocity-random-values").val() +']" , '+
			'"velocityrandomprob": "['+ $("#synth"+ f +"-velocity-random-prob").val() +']" , '+
			'"velocityhand": "['+ $("#synth"+ f +"-velocity-hand").val() +']" }';  
		}
	}
	
	exportJSON = exportJSON + ' ]}';
	console.log(exportJSON);
	console.log(JSON.parse(exportJSON));

	download(exportJSON, $("#scriptName").val()+'.json', 'text/plain');
	});


//download JSON file
function download(text, name, type) {
    var a = document.createElement("a");
    var file = new Blob([text], {type: type});
    a.href = URL.createObjectURL(file);
    a.download = name;
    a.click();
}