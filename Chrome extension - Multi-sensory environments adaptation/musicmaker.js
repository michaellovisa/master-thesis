var updateUI = require('./updateUI.js');
var musicscale = require('./music-scale.js');

var defaultScale = 'C';
var defaultScaleType = "major";
var defaultBpm = 60;
var numberOfInstruments = 0;
var instruments = []; // Array of instruments used to have access to the instruments by index
var defaultMaxFreq;
var isMusicPlaying = 0; // Music is not playing
var scriptflag = 0;
var jsonFile;





exports.setScriptValues = function(json){
    instruments.length = 0; // reset array instruments when a new json script is loaded
    console.log("music scale = ",json.scale);
    defaultScale = json.scale;
    defaultScaleType = json.scaletype;
    defaultBpm = json.bpm;
    console.log("music bpm = ", defaultBpm);
    console.log("number of instruments = ", json.synthesizers.length);
    numberOfInstruments = json.synthesizers.length; 
    
    updateUI.updateUI(defaultScale,defaultScaleType,numberOfInstruments);
    
    createInstruments(json);
    computeDefaultMaxFreq();
}

function createInstruments(json){
    for (var f = 0; f < json.synthesizers.length; f++){
        instruments.push(new OscillatorObj(audioContext,json.synthesizers[f].osc1wave,json.synthesizers[f].osc1gain,parseInt(json.synthesizers[f].osc1transp),json.synthesizers[f].osc2wave,json.synthesizers[f].osc2gain,parseInt(json.synthesizers[f].osc2transp),json.synthesizers[f].osc3wave,json.synthesizers[f].osc3gain,parseInt(json.synthesizers[f].osc3transp),json.synthesizers[f].filtertype,json.synthesizers[f].filterfreq,json.synthesizers[f].filterq,json.synthesizers[f].gain)); 
        instruments[f].adsr(json.synthesizers[f].attackfunction,Number(json.synthesizers[f].attack),json.synthesizers[f].decayfunction,Number(json.synthesizers[f].decay),Number(json.synthesizers[f].sustain),json.synthesizers[f].releasefunction,Number(json.synthesizers[f].release));
        switch (parseInt(json.synthesizers[f].rhythmradio)){
            case 0:
                instruments[f].rhythmLoopRandom(JSON.parse(json.synthesizers[f].rhythmrandomnotes),JSON.parse(json.synthesizers[f].rhythmrandomlength));
                break;
            case 1:
                instruments[f].rhythmLoopFromLibrary(json.synthesizers[f].rhythmlibrary);
                break;
            case 2:
                instruments[f].rhythmByHand(JSON.parse(json.synthesizers[f].rhythmhand));
                break;
        }

        if (json.synthesizers[f].noteradio == 2){ //note for random loop
            for (var u = 0; u < parseInt(json.synthesizers[f].noteloopnumofnotes); u++){
                instruments[f].loopOfNotes.push(Math.floor(Math.random()*(parseInt(json.synthesizers[f].noteloopmax)+1-parseInt(json.synthesizers[f].noteloopmin))) + parseInt(json.synthesizers[f].noteloopmin));
            }
            console.log("Created loop of notes = ", instruments[f].loopOfNotes);
        }
    }
    jsonFile = json; 
}

exports.getDefaultScale = function(){
    return defaultScale;
}

exports.getDefaultBpm = function(){
    return defaultBpm;
}

exports.getInstruments = function(){
    return instruments;
}

exports.getScriptFlag = function(){
  return scriptflag;
}

exports.setScriptFlag = function(value){
  return scriptflag = value;
}

exports.isMusicPlaying = function(){
  return isMusicPlaying;
}

exports.setMusicPlaying = function(value){
  isMusicPlaying = value;
}

// Library of rhythms
var rhythm = [];
rhythm[0] = [0,4,8,12,16,20,24,28];
rhythm[1] = [0,2,4,8,10,12,16,18,20,24,26,28];
rhythm[2] = [0,8,16,24];
rhythm[3] = [0,2,4,6,8,10,12,14,16,18,20,22,24,26,28,30];
rhythm[4] = [0,1,2,3,4,8,9,10,11,12,16,17,18,19,20,24,25,26,27,28];
rhythm[5] = [0,3,4,7,8,11,12,15,16,19,20,23,24,27,28,31];
rhythm[6] = [4,12,20,28];
rhythm[7] = [0,16];

// create the audiocontext (this is the line for every web browser)
var audioContext = new (window.AudioContext || window.webkitAudioContext)();

var nextNoteTime = 0.0; // when the next note is due.
var scheduleAheadTime = 1;// How far ahead to schedule audio (in sec)
var lookahead = 500.0;  // How frequently to call scheduling function (in milliseconds) 
var tempo = defaultBpm; // in bpm
var secondsPerBeat = 60.0 / tempo; //second per every quarter note (every beat)
console.log("tempo = ", defaultBpm);
console.log("seconds per beat = ", secondsPerBeat);
var current16thNote = 0; 

//Total gainNode
var gainNodeTotal = audioContext.createGain();
var defaultGlobalGain = 0.8;
gainNodeTotal.gain.value = defaultGlobalGain; // initial value of the global gain
gainNodeTotal.connect(audioContext.destination);

//Total filterNode
var filterNodeTotal = audioContext.createBiquadFilter();
filterNodeTotal.connect(gainNodeTotal);
filterNodeTotal.type = "lowpass";
var defaultGlobalFreq = 20000;  
filterNodeTotal.frequency.value = defaultGlobalFreq; 

function computeDefaultMaxFreq(){
    defaultMaxFreq = instruments[0].defaultInstrumentFreq;
    for (var f = 1; f < instruments.length; f++){
        defaultMaxFreq = Math.max(defaultMaxFreq, instruments[f].defaultInstrumentFreq);  
    }
    console.log("max frequency = ", defaultMaxFreq);
}

scriptflag = 1; //all the variables have been loaded

exports.getGainNodeTotal = function(){
    return gainNodeTotal;
}

exports.getFilterNodeTotal = function(){
    return filterNodeTotal;
}

exports.getCurrentTime = function(){
    return audioContext.currentTime;
}

exports.getDefaultGlobalGain = function(){
    return defaultGlobalGain;
}

exports.getDefaultGlobalFreq = function(){
    return defaultGlobalFreq;
}

exports.getDefaultMaxFreq = function(){
    return defaultMaxFreq;
}

exports.getDefaultBpm = function(){
    return defaultBpm;
}

exports.getTempo = function(){
    return tempo;
}

exports.setTempo = function(value){
    return tempo = value;
}

// Function play
exports.play = function(){
	if (isMusicPlaying == 0){        
        nextNoteTime = audioContext.currentTime + 0.2; //little delay to give time to things like garbage collector, etc.
        secondsPerBeat = 60.0/tempo; //read  the value of tempo
        current16thNote = 0; 
        isMusicPlaying = 1;
        console.log("Play music");
		$('#select-scale').prop('disabled', true); //disable select scale dropdown menu
		$('#select-majmin').prop('disabled', true); //disable select scale dropdown menu
        scheduler();
    } 
}
// Function stop
exports.stop = function() {
    if (isMusicPlaying == 1){
        clearTimeout(t);
        console.log("Stop music");
        for (var i = 0; i < instruments.length; i++){ 
        	if (instruments[i].flag == 1){
        		instruments[i].gain.gain.value = 0; 
        		instruments[i].gain.disconnect();
        		instruments[i].gain = audioContext.createGain();
    			instruments[i].gain.connect(filterNodeTotal);

                instruments[i].notesloopindex = 0; //start from the beginning of the loop of notes 
                instruments[i].durations.index = 0;
                instruments[i].velocitiesindex = 0;
                instruments[i].notesindex = 0;
                instruments[i].rhythm.index = 0;
        	}
        }
        beatIndex = 0; //start a new bar from the beginning
        isMusicPlaying = 0;
		$('#select-scale').prop('disabled', false); //enable select scale dropdown menu
		$('#select-majmin').prop('disabled', false); //enable select scale dropdown menu
    }

}


function OscillatorObj(context,oscwave1,gain1,transp1,oscwave2,gain2,transp2,oscwave3,gain3,transp3,filtertype,filterfreq,filterQ,totalGain){ 
    
    this.flag = 1; // flag = 1 indicates synthesizers, flag = 0 indicates samplers (in future implementations)
    this.gainuno = gain1;
    this.gaindue = gain2;
    this.gaintre = gain3;
    this.osctype1 = oscwave1;
    this.osctype2 = oscwave2;
    this.osctype3 = oscwave3;
    this.osctransp1 = transp1;
    this.osctransp2 = transp2;
    this.osctransp3 = transp3;
    this.gaintutto = totalGain;
    this.filtertype = filtertype;
    this.filterfreq = filterfreq;
    this.filterQ = filterQ;
    this.defaultInstrumentFreq = filterfreq;
    this.defaultInstrumentGain = totalGain;
    this.gain = context.createGain();
    this.gain.connect(filterNodeTotal);
    this.rhythm = [];
    this.durations = [];
    this.rhythm.loop = 1; // default value
    this.rhythm.looplength = 1; //default value
    this.rhythm.index = 0;
    this.durations.index = 0;
    this.loopOfNotes = [];
    this.notesindex = 0;
    this.notesloopindex = 0;
    this.velocitiesindex = 0;
 
    this.adsrSimple = function(attackType,attackTime,decayType,decayTime){
        this.adsr.attack = attackTime; 
        this.adsr.attackType = attackType;
        this.adsr.decay = decayTime; 
        this.adsr.decayType = decayType;
        this.adsr.flag = 0; //ADSR defined using only attack and decay (no duration), useful for drums/percussion sounds in future implementations
    }

    this.adsr = function(attackType,attackTime,decayType,decayTime,sustainValue,releaseType,releaseTime){
        this.adsr.attack = attackTime; 
        this.adsr.attackType = attackType;
        this.adsr.decay = decayTime;
        this.adsr.decayType = decayType; 
        this.adsr.sustain = sustainValue; 
        this.adsr.release = releaseTime; 
        this.adsr.releaseType = releaseType; 
        this.adsr.flag = 1; //ADSR defined using attack, decay, sustain and release 
    }

    //noteDuration is espressed with respect to a beat
    //when noteDuration=1 the note will last 1/4
    //when noteDuration=0.5 the note will last 1/8
    //when noteDuration=0.25 the note will last 1/16
    //when noteDuration=4 the note will last 4/4 (1 bar)
    this.note = function(noteToPlay,noteDuration,noteStartTime,velocity){ //every note has its own oscillators and envelope so polyphony is possible
        this.oscillator1 = context.createOscillator();
        this.oscillator2 = context.createOscillator();
        this.oscillator3 = context.createOscillator();
        this.env = context.createGain();
        this.gain1 = context.createGain();
        this.gain2 = context.createGain();
        this.gain3 = context.createGain();
        this.filter = context.createBiquadFilter();
        this.gain1.gain.value = this.gainuno;
        this.gain2.gain.value = this.gaindue;
        this.gain3.gain.value = this.gaintre;
        this.gain.gain.value = this.gaintutto;
        this.filter.type = this.filtertype;
        this.filter.frequency.value = this.filterfreq;
        this.filter.Q = this.filterQ;
        this.gain1.connect(this.filter);
        this.gain2.connect(this.filter);
        this.gain3.connect(this.filter);
        this.velocity = context.createGain(); 
        this.velocity.gain.value = velocity/127;
        this.oscillator1.type = this.osctype1;
        this.oscillator2.type = this.osctype2;
        this.oscillator3.type = this.osctype3;
        this.oscillator1.frequency.value = musicscale.getNotes()[musicscale.getNotes().indexOf(noteToPlay)+this.osctransp1]; 
        this.oscillator2.frequency.value = musicscale.getNotes()[musicscale.getNotes().indexOf(noteToPlay)+this.osctransp2]; 
        this.oscillator3.frequency.value = musicscale.getNotes()[musicscale.getNotes().indexOf(noteToPlay)+this.osctransp3]; 
        this.env.gain.value = 0; // initialize amplitude envelope starting point
        this.oscillator1.connect(this.gain1);
        this.oscillator2.connect(this.gain2);
        this.oscillator3.connect(this.gain3);
        this.filter.connect(this.env);
        this.env.connect(this.velocity);
        this.velocity.connect(this.gain);

        // Update values of attack and release, useful for future implementations where the ADSR is changed for adaptation
        this.adsr.newrelease = this.adsr.release;
        this.adsr.newattack = this.adsr.attack;

        if (this.adsr.flag == 1){ //complete ADSR
            if (noteDuration*secondsPerBeat <= this.adsr.newattack){ // note duration is less than attack, find stopping amplitude point
                switch (this.adsr.attackType){
                    case 'lin':
                        this.env.gain.setValueAtTime(0,noteStartTime);
                        this.env.gain.linearRampToValueAtTime(noteDuration*secondsPerBeat/this.adsr.newattack,noteStartTime+noteDuration*secondsPerBeat);
                        break;
                    case 'exp':
                        this.env.gain.setValueAtTime(0.0001,noteStartTime);         
                        this.env.gain.exponentialRampToValueAtTime(0.0001*Math.pow((1/0.0001),(noteDuration*secondsPerBeat/this.adsr.newattack)),noteStartTime+noteDuration*secondsPerBeat);
                        break;
                }
            } else { 
                if (noteDuration*secondsPerBeat <= this.adsr.newattack + this.adsr.decay){ // note duration is less than attack + decay, find stopping amplitude point
                    switch (this.adsr.attackType){
                        case 'lin':
                            this.env.gain.setValueAtTime(0,noteStartTime);
                            this.env.gain.linearRampToValueAtTime(1,noteStartTime+this.adsr.newattack);
                            break;
                        case 'exp':
                            this.env.gain.setValueAtTime(0.0001,noteStartTime);
                            this.env.gain.exponentialRampToValueAtTime(1,noteStartTime+this.adsr.newattack);
                            break;
                    }
                    switch (this.adsr.decayType){
                        case 'lin':
                            this.env.gain.linearRampToValueAtTime(((noteDuration*secondsPerBeat-this.adsr.newattack)/(this.adsr.decay)*(this.adsr.sustain-1))+1,noteStartTime+noteDuration*secondsPerBeat);
                            break;
                        case 'exp':
                            if (this.adsr.sustain == 0){
                                this.env.gain.exponentialRampToValueAtTime(Math.pow(0.0001,((noteDuration*secondsPerBeat-this.adsr.newattack)/this.adsr.decay)),noteStartTime+noteDuration*secondsPerBeat);
                                break;
                            } else {
                                this.env.gain.exponentialRampToValueAtTime(Math.pow(this.adsr.sustain,((noteDuration*secondsPerBeat-this.adsr.newattack)/this.adsr.decay)),noteStartTime+noteDuration*secondsPerBeat);
                                break;
                            }
                    }
                } else { // note long enough 
                    switch (this.adsr.attackType){
                        case 'lin':
                            this.env.gain.setValueAtTime(0,noteStartTime);
                            this.env.gain.linearRampToValueAtTime(1,noteStartTime+this.adsr.newattack);
                            break;
                        case 'exp':
                            this.env.gain.setValueAtTime(0.0001,noteStartTime);
                            this.env.gain.exponentialRampToValueAtTime(1,noteStartTime+this.adsr.newattack);
                            break;
                    }
                    switch (this.adsr.decayType){
                        case 'lin':
                            this.env.gain.linearRampToValueAtTime(this.adsr.sustain,noteStartTime+this.adsr.newattack+this.adsr.decay);
                            break;
                        case 'exp':
                            if (this.adsr.sustain == 0){
                                this.env.gain.exponentialRampToValueAtTime(0.0001,noteStartTime+this.adsr.newattack+this.adsr.decay);
                                break;
                            } else {
                                this.env.gain.exponentialRampToValueAtTime(this.adsr.sustain,noteStartTime+this.adsr.newattack+this.adsr.decay);
                                break;
                            }
                    }
                    this.env.gain.linearRampToValueAtTime(this.adsr.sustain,noteStartTime+noteDuration*secondsPerBeat); //sustain part
                }
            }
            switch (this.adsr.releaseType){
                case 'lin':
                    if (this.adsr.newrelease == 0){ //if release is zero,add a small amount of time to avoid scheduling problems
                        this.env.gain.linearRampToValueAtTime(0,noteStartTime+noteDuration*secondsPerBeat+this.adsr.newrelease+0.0000000001); 
                    } else { 
                        this.env.gain.linearRampToValueAtTime(0,noteStartTime+noteDuration*secondsPerBeat+this.adsr.newrelease);} 
                    break;
                case 'exp':
                    if (this.adsr.newrelease == 0){ //if release is zero,add a small amount of time to avoid scheduling problems
                        this.env.gain.exponentialRampToValueAtTime(0.0001,noteStartTime+noteDuration*secondsPerBeat+this.adsr.newrelease+0.0000000001);
                    } else { 
                        this.env.gain.exponentialRampToValueAtTime(0.0001,noteStartTime+noteDuration*secondsPerBeat+this.adsr.newrelease);}
                    break;
            }
        } else { //simple ADSR
            if (noteDuration*secondsPerBeat <= this.adsr.newattack){ // note duration is less than attack, find stopping amplitude point
                switch (this.adsr.attackType){
                    case 'lin':
                        this.env.gain.setValueAtTime(0,noteStartTime);
                        this.env.gain.linearRampToValueAtTime(noteDuration*secondsPerBeat/this.adsr.newattack,noteStartTime+noteDuration*secondsPerBeat);
                        break;
                    case 'exp':
                        this.env.gain.setValueAtTime(0.0001,noteStartTime);
                        this.env.gain.exponentialRampToValueAtTime(0.0001*Math.pow((1/0.0001),(noteDuration*secondsPerBeat/this.adsr.newattack)),noteStartTime+noteDuration*secondsPerBeat);
                        break;
                }
            } else { 
                if (noteDuration*secondsPerBeat <= this.adsr.newattack + this.adsr.decay){ // note duration is less than attack + decay, find stopping amplitude point
                    switch (this.adsr.attackType){
                        case 'lin':
                            this.env.gain.setValueAtTime(0,noteStartTime);
                            this.env.gain.linearRampToValueAtTime(1,noteStartTime+this.adsr.newattack);
                            break;
                        case 'exp':
                            this.env.gain.setValueAtTime(0.0001,noteStartTime);
                            this.env.gain.exponentialRampToValueAtTime(1,noteStartTime+this.adsr.newattack);
                            break;
                    }
                    switch (this.adsr.decayType){
                        case 'lin':
                            this.env.gain.linearRampToValueAtTime(((noteDuration*secondsPerBeat-this.adsr.newattack)/(this.adsr.decay)*(0-1))+1,noteStartTime+noteDuration*secondsPerBeat);
                            break;
                        case 'exp':
                            this.env.gain.exponentialRampToValueAtTime(Math.pow(0.0001,((noteDuration*secondsPerBeat-this.adsr.newattack)/this.adsr.decay)),noteStartTime+noteDuration*secondsPerBeat);
                            break;
                    }
                } else { // note long enough 
                    switch (this.adsr.attackType){
                        case 'lin':
                            this.env.gain.setValueAtTime(0,noteStartTime);
                            this.env.gain.linearRampToValueAtTime(1,noteStartTime+this.adsr.newattack);
                            break;
                        case 'exp':
                            this.env.gain.setValueAtTime(0.0001,noteStartTime);
                            this.env.gain.exponentialRampToValueAtTime(1,noteStartTime+this.adsr.newattack);
                            break;
                    }
                    switch (this.adsr.decayType){
                        case 'lin':
                            this.env.gain.linearRampToValueAtTime(0,noteStartTime+this.adsr.newattack+this.adsr.decay);
                            break;
                        case 'exp':
                            this.env.gain.exponentialRampToValueAtTime(0.0001,noteStartTime+this.adsr.newattack+this.adsr.decay);
                            break;
                    }
                }
            }   
        } 
        this.oscillator1.start(noteStartTime);
        this.oscillator2.start(noteStartTime);
        this.oscillator3.start(noteStartTime);
        if (this.adsr.flag == 1){
            this.oscillator1.stop(noteStartTime+noteDuration*secondsPerBeat+this.adsr.newrelease);
            this.oscillator2.stop(noteStartTime+noteDuration*secondsPerBeat+this.adsr.newrelease);
            this.oscillator3.stop(noteStartTime+noteDuration*secondsPerBeat+this.adsr.newrelease);
        } else {
            this.oscillator1.stop(noteStartTime+noteDuration*secondsPerBeat);
            this.oscillator2.stop(noteStartTime+noteDuration*secondsPerBeat);
            this.oscillator3.stop(noteStartTime+noteDuration*secondsPerBeat);
        }
    }

    this.rhythmLoop = function(rhythm,looplength){
        this.rhythm = rhythm;
        this.rhythm.index = 0;
        this.rhythm.looplength = looplength; // in bars
        this.rhythm.loop = 1;
    }

    this.rhythmLoopRandom = function(numNotes,looplength){
        this.rhythm.loop = 1;                   
        this.rhythm.looplength = looplength; // in bars  
        while (this.rhythm.length < numNotes){
            var randomNumber = Math.floor(Math.random()*(looplength*16)); 
            if (this.rhythm.indexOf(randomNumber) == -1) { //if the randomNumber is not already in the array
                this.rhythm.push(randomNumber);
            }
        }
        this.rhythm.sort(function sortNumbers(a,b){return a-b;}); //sort the numbers
        console.log("rhythm = ", this.rhythm);
        this.rhythm.index = 0;
        console.log("loop length = ", this.rhythm.looplength);
    }

    this.rhythmByHand = function(rhythm){ //when it reaches the end of the rhythm array, it starts from the beginning, but it has to compute the length of the rhythm array in bars
        this.rhythm = rhythm;
        this.rhythm.index = 0;
        this.rhythm.loop = 1; 
        console.log("rhythm =", this.rhythm);
        var v = 1;
        while (rhythm[rhythm.length-1]/16 > v){
            v++;
        }
        this.rhythm.looplength = v;
        console.log("rhythm loop length = ", this.rhythm.looplength);
    }

    this.rhythmLoopFromLibrary = function(number){ 
        this.rhythm = rhythm[number];
        console.log("rhythm = ", this.rhythm);
        this.rhythm.index = 0;
        this.rhythm.looplength = 2; // in bars, every rhythm in the library is 2 bars long 
        this.rhythm.loop = 1;
    }
}


function scheduler() {
    // while there are notes that will need to play before the next interval, 
    // schedule them and advance the pointer.
    while (nextNoteTime < audioContext.currentTime + scheduleAheadTime) {
        scheduleNote(nextNoteTime);
        nextNote();
    }
    t = setTimeout(function(){scheduler()}, lookahead); //call the function scheduler() after lookahead time 
}


function scheduleNote( time ) {
    for (var f = 0; f < instruments.length; f++){
        if (current16thNote%(instruments[f].rhythm.looplength*16) == instruments[f].rhythm[instruments[f].rhythm.index]){  
            instruments[f].note(noteToPlay(f),noteDuration(f),time,noteVelocity(f));
            instruments[f].rhythm.index++;
            if (instruments[f].rhythm.index == instruments[f].rhythm.length){
                instruments[f].rhythm.index = 0;
            }
        }
    }
}


function nextNote() {
    secondsPerBeat = 60.0 / tempo;    
    nextNoteTime += 0.25 * secondsPerBeat;    
    current16thNote++; //advance to the next position for a note
}




// param: choices, array of possible durations
function randomDuration(choices){
    return choices[Math.floor(Math.random()*choices.length)];
}

// param: choices, array of possible durations
//        probabilities, array of probabilities 
function randomDurationWithProbabilities(choices,probabilities){
    var num=Math.random();
    var cdf = 0; //cumulative distribution function
    for (var t = 0; t < choices.length; t++){    
        cdf =  cdf + probabilities[t];
        if(num < cdf) {
            return choices[t]; 
        }
    }
}

// param: choices, array of possible velocities
function randomVelocity(choices){
    var i = choices[Math.floor(Math.random()*choices.length)];
    return i;
}

// param: min, max define the range of possible velocities
// (when min=0 and max=127 return a value between all the possible velocity values)
function randomVelocityBetween(min,max){
    var i = Math.floor(Math.random()*(max+1-min)) + min;
    return i;
}

// param: choices, array of possible velocities
//        probabilities, array of probabilities 
function randomVelocityWithProbabilities(choices,probabilities){
    var num=Math.random();
    var cdf = 0; //cumulative distribution function
    for (var t = 0; t < choices.length; t++){    
        cdf =  cdf + probabilities[t];
        if(num < cdf) {
            return choices[t]; 
        }
    }
}

// param: choices, array of possible durations
function randomNoteBetween(min,max){
    var i = (Math.floor(Math.random()*(max+1-min)))+min;
    return musicscale.getNotes()[i];
}

// param: choices, array of possible durations
function randomNoteWithProbabilities(choices,probabilities){
    var num=Math.random();
    var cdf = 0; //cumulative distribution function
    for (var t = 0; t < choices.length; t++){    
        cdf =  cdf + probabilities[t];
        if(num < cdf) {
            return musicscale.getNotes()[choices[t]]; 
        }
    }
}


function noteFromRandomLoop(f){
    if (instruments[f].notesloopindex == instruments[f].loopOfNotes.length){
        instruments[f].notesloopindex = 0;
    }
    return musicscale.getNotes()[instruments[f].loopOfNotes[instruments[f].notesloopindex++]];

}

function noteToPlay(f){
    var note;
    switch (parseInt(jsonFile.synthesizers[f].noteradio)){
            case 0:
                note = randomNoteBetween(parseInt(jsonFile.synthesizers[f].noterandommin),parseInt(jsonFile.synthesizers[f].noterandommax));
                break;
            case 1:
                note = randomNoteWithProbabilities(JSON.parse(jsonFile.synthesizers[f].noterandomvalues),JSON.parse(jsonFile.synthesizers[f].noterandomprob));   
                break;
            case 2:
                note = noteFromRandomLoop(f);
                break;
            case 3:
                note = noteByHand(JSON.parse(jsonFile.synthesizers[f].notehand),f);   
                break;
    }
    return note;
}

function noteDuration(f){
    var dur;
    switch (parseInt(jsonFile.synthesizers[f].durationradio)){
            case 0:
                dur = randomDuration(JSON.parse(jsonFile.synthesizers[f].durationrandom));
                break;
            case 1:
                dur = randomDurationWithProbabilities(JSON.parse(jsonFile.synthesizers[f].durationrandomvalues),JSON.parse(jsonFile.synthesizers[f].durationrandomprob));   
                break;
            case 2:
                dur = durationByHand(JSON.parse(jsonFile.synthesizers[f].durationhand),f);   
                break;
    }
    return dur;
}

function noteVelocity(f){
    var vel;
    switch (parseInt(jsonFile.synthesizers[f].velocityradio)){
            case 0:
                vel = randomVelocityBetween(parseInt(jsonFile.synthesizers[f].velocityrandommin),parseInt(jsonFile.synthesizers[f].velocityrandommax));
                break;
            case 1:
                vel = randomVelocity(JSON.parse(jsonFile.synthesizers[f].velocityrandomchoice));   
                break;
            case 2:
                vel = randomVelocityWithProbabilities(JSON.parse(jsonFile.synthesizers[f].velocityrandomvalues),JSON.parse(jsonFile.synthesizers[f].velocityrandomprob));   
                break;    
            case 3:
                vel = velocityByHand(JSON.parse(jsonFile.synthesizers[f].velocityhand),f);   
                break;
    }
    return vel;
}

function noteByHand(notes,f){
    if (instruments[f].notesindex == notes.length){
        instruments[f].notesindex = 0;
    }
    return musicscale.getNotes()[notes[instruments[f].notesindex++]]; 
}

function durationByHand(durations,f){
    if (instruments[f].durations.index == durations.length){
        instruments[f].durations.index = 0;
    }
    return durations[instruments[f].durations.index++]; 
}

function velocityByHand(velocities,f){
    if (instruments[f].velocitiesindex == velocities.length){
        instruments[f].velocitiesindex = 0;
    }
    return velocities[instruments[f].velocitiesindex++]; 
}






