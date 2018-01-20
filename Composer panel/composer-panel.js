//create the audiocontext (this is the line for every web browser)
var audioContext = new (window.AudioContext || window.webkitAudioContext)();


// SET DEFAULT VALUES FOR THIS SCRIPT
defaultScale = "C";
defaultBpm = 60;



var instruments = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]; // Array of instruments used to have access to the instruments by index

var nextNoteTime = 0.0; // when the next note is due.
var scheduleAheadTime = 1;// How far ahead to schedule audio (in sec)
var lookahead = 25.0;       // How frequently to call scheduling function (in milliseconds)
var tempo = defaultBpm; 
var secondsPerBeat = 60.0 / tempo; //second per every quarter note (every beat)
var current16thNote = 0; // 
var isMusicPlaying = 0;


var rhythm = [];
rhythm[0] = [0,4,8,12,16,20,24,28];
rhythm[1] = [0,2,4,8,10,12,16,18,20,24,26,28];
rhythm[2] = [0,8,16,24];
rhythm[3] = [0,2,4,6,8,10,12,14,16,18,20,22,24,26,28,30];
rhythm[4] = [0,1,2,3,4,8,9,10,11,12,16,17,18,19,20,24,25,26,27,28];
rhythm[5] = [0,3,4,7,8,11,12,15,16,19,20,23,24,27,28,31];
rhythm[6] = [4,12,20,28];
rhythm[7] = [0,16];



// param1 = i, param2 = n
function playsound(event){
    console.log("click on play sound button");

    instruments[event.data.param1] = new OscillatorObj(audioContext,$("#synth"+event.data.param1+"-osc1-wave").val(),$("#synth"+event.data.param1+"-osc1-gain").val(),parseInt($("#synth"+event.data.param1+"-osc1-transp").val()),$("#synth"+event.data.param1+"-osc2-wave").val(),$("#synth"+event.data.param1+"-osc2-gain").val(),parseInt($("#synth"+event.data.param1+"-osc2-transp").val()),$("#synth"+event.data.param1+"-osc3-wave").val(),$("#synth"+event.data.param1+"-osc3-gain").val(),parseInt($("#synth"+event.data.param1+"-osc3-transp").val()),$("#synth"+event.data.param1+"-filter-type").val(),$("#synth"+event.data.param1+"-filter-freq").val(),$("#synth"+event.data.param1+"-filter-q").val(),$("#synth"+event.data.param1+"-gain").val());
    instruments[event.data.param1].adsr($("#synth"+event.data.param1+"-attack-function").val(),Number($("#synth"+event.data.param1+"-attack").val()),$("#synth"+event.data.param1+"-decay-function").val(),Number($("#synth"+event.data.param1+"-decay").val()),Number($("#synth"+event.data.param1+"-sustain").val()),$("#synth"+event.data.param1+"-release-function").val(),Number($("#synth"+event.data.param1+"-release").val()));
    instruments[event.data.param1].note(notes[28],4,audioContext.currentTime,127); //noteToPlay, duration, startingTime, velocity
}

// param1 = i, param2 = n
function playsinglemusic(event){
    console.log("click on play single music button");
    tempo = JSON.parse($('#bpm').val()); //update tempo
    secondsPerBeat = 60.0 / tempo;
    console.log("tempo = ",tempo);
    instruments[event.data.param1] = new OscillatorObj(audioContext,$("#synth"+event.data.param1+"-osc1-wave").val(),$("#synth"+event.data.param1+"-osc1-gain").val(),parseInt($("#synth"+event.data.param1+"-osc1-transp").val()),$("#synth"+event.data.param1+"-osc2-wave").val(),$("#synth"+event.data.param1+"-osc2-gain").val(),parseInt($("#synth"+event.data.param1+"-osc2-transp").val()),$("#synth"+event.data.param1+"-osc3-wave").val(),$("#synth"+event.data.param1+"-osc3-gain").val(),parseInt($("#synth"+event.data.param1+"-osc3-transp").val()),$("#synth"+event.data.param1+"-filter-type").val(),$("#synth"+event.data.param1+"-filter-freq").val(),$("#synth"+event.data.param1+"-filter-q").val(),$("#synth"+event.data.param1+"-gain").val());
    instruments[event.data.param1].adsr($("#synth"+event.data.param1+"-attack-function").val(),Number($("#synth"+event.data.param1+"-attack").val()),$("#synth"+event.data.param1+"-decay-function").val(),Number($("#synth"+event.data.param1+"-decay").val()),Number($("#synth"+event.data.param1+"-sustain").val()),$("#synth"+event.data.param1+"-release-function").val(),Number($("#synth"+event.data.param1+"-release").val()));

    switch (parseInt($("input[name='synth"+event.data.param1+"-rhythm-radio']:checked").val())){
            case 0:
                console.log("rhythmradio = 0");
                console.log("rhythm random notes= ", JSON.parse($("#synth"+event.data.param1+"-rhythm-random-notes").val()));
                console.log("rhythm random length= ", JSON.parse($("#synth"+event.data.param1+"-rhythm-random-length").val()));
                instruments[event.data.param1].rhythmLoopRandom(JSON.parse($("#synth"+event.data.param1+"-rhythm-random-notes").val()),JSON.parse($("#synth"+event.data.param1+"-rhythm-random-length").val()));
                break;
            case 1:
                console.log("rhythmradio = 1");
                console.log("rhythm from library = ", $("#synth"+event.data.param1+"-rhythm-library").val());
                instruments[event.data.param1].rhythmLoopFromLibrary($("#synth"+event.data.param1+"-rhythm-library").val());
                break;
            case 2:
                console.log("rhythmradio = 2");
                instruments[event.data.param1].rhythmByHand(JSON.parse((JSON.parse('{"rhythm":"[' + $("#synth"+event.data.param1+"-rhythm-hand").val()+']"}').rhythm)));
                break;
    }

    if (parseInt($("input[name='synth"+event.data.param1+"-note-radio']:checked").val()) == 2){ //note for random loop
        for (var u = 0; u < parseInt($("#synth"+event.data.param1+"-note-loop-numofnotes").val()); u++){
            instruments[event.data.param1].loopOfNotes.push(Math.floor(Math.random()*(parseInt($("#synth"+event.data.param1+"-note-loop-max").val())+1-parseInt($("#synth"+event.data.param1+"-note-loop-min").val()))) + parseInt($("#synth"+event.data.param1+"-note-loop-min").val()));
        }
        console.log("loopOfNotes = ", instruments[event.data.param1].loopOfNotes);
    }
    console.log("INDICE STRUMENTO (playsinglemusic) = ", event.data.param1);
    playsingle(event.data.param1);

}


function playmusic(){
    tempo = JSON.parse($('#bpm').val()); //update tempo
    secondsPerBeat = 60.0 / tempo;
    for (var f = 0; f < n; f++){
        instruments[f] = new OscillatorObj(audioContext,$("#synth"+f+"-osc1-wave").val(),$("#synth"+f+"-osc1-gain").val(),parseInt($("#synth"+f+"-osc1-transp").val()),$("#synth"+f+"-osc2-wave").val(),$("#synth"+f+"-osc2-gain").val(),parseInt($("#synth"+f+"-osc2-transp").val()),$("#synth"+f+"-osc3-wave").val(),$("#synth"+f+"-osc3-gain").val(),parseInt($("#synth"+f+"-osc3-transp").val()),$("#synth"+f+"-filter-type").val(),$("#synth"+f+"-filter-freq").val(),$("#synth"+f+"-filter-q").val(),$("#synth"+f+"-gain").val());
        instruments[f].adsr($("#synth"+f+"-attack-function").val(),Number($("#synth"+f+"-attack").val()),$("#synth"+f+"-decay-function").val(),Number($("#synth"+f+"-decay").val()),Number($("#synth"+f+"-sustain").val()),$("#synth"+f+"-release-function").val(),Number($("#synth"+f+"-release").val()));

        switch (parseInt($("input[name='synth"+f+"-rhythm-radio']:checked").val())){
            case 0:
                console.log("rhythmradio = 0");
                console.log("rhythm random notes= ", JSON.parse($("#synth"+f+"-rhythm-random-notes").val()));
                console.log("rhythm random length= ", JSON.parse($("#synth"+f+"-rhythm-random-length").val()));
                instruments[f].rhythmLoopRandom(JSON.parse($("#synth"+f+"-rhythm-random-notes").val()),JSON.parse($("#synth"+f+"-rhythm-random-length").val()));
                break;
            case 1:
                console.log("rhythmradio = 1");
                console.log("rhythm from library = ", $("#synth"+f+"-rhythm-library").val());
                instruments[f].rhythmLoopFromLibrary($("#synth"+f+"-rhythm-library").val());
                break;
            case 2:
                console.log("rhythmradio = 2");
                instruments[f].rhythmByHand(JSON.parse((JSON.parse('{"rhythm":"[' + $("#synth"+f+"-rhythm-hand").val()+']"}').rhythm)));
                break;
        }

        if (parseInt($("input[name='synth"+f+"-note-radio']:checked").val()) == 2){ //note for random loop
            for (var u = 0; u < parseInt($("#synth"+f+"-note-loop-numofnotes").val()); u++){
                instruments[f].loopOfNotes.push(Math.floor(Math.random()*(parseInt($("#synth"+f+"-note-loop-max").val())+1-parseInt($("#synth"+f+"-note-loop-min").val()))) + parseInt($("#synth"+f+"-note-loop-min").val()));
            }
            console.log("loop = ", instruments[f].loopOfNotes);
        }
    }
    play();

}







//TOTAL GAIN
var gainNodeTotal = audioContext.createGain();
var defaultGlobalGain = 0.8;
gainNodeTotal.gain.value = defaultGlobalGain; 
gainNodeTotal.connect(audioContext.destination);

//TOTAL FILTER
var filterNodeTotal = audioContext.createBiquadFilter();
filterNodeTotal.connect(gainNodeTotal);
filterNodeTotal.type = "lowpass";
var defaultGlobalFreq = 20000;  
filterNodeTotal.frequency.value = defaultGlobalFreq; 





function computeDefaultMaxFreq(){
    console.log("instruments[0].defaultInstrumentFreq = ",instruments[0].defaultInstrumentFreq);
    defaultMaxFreq = instruments[0].defaultInstrumentFreq;
    for (var f = 1; f < instruments.length; f++){
        defaultMaxFreq = Math.max(defaultMaxFreq, instruments[f].defaultInstrumentFreq);  
    }
    console.log("defaultMaxFreq = ", defaultMaxFreq);
}

scriptflag = 1; //all the variables have been loaded, adaptations can start now



function play(){
    tempo = JSON.parse($('#bpm').val()); //update tempo
    secondsPerBeat = 60.0 / tempo;
    console.log("tempo = ",tempo);
    if (isMusicPlaying == 0){        
        nextNoteTime = audioContext.currentTime + 0.2; //little delay to give time to things like garbage collection, etc.
        secondsPerBeat = 60.0/tempo; 
        
        current16thNote = 0; 
        for (var t = 0; t < n; t++){
            instruments[t].rhythm.index = 0; 
        }

        isMusicPlaying = 1;

        $('#select-scale').prop('disabled', true); //disable select scale dropdown menu
        $('#select-majmin').prop('disabled', true); //disable select scale dropdown menu
        
        scheduler();
    } 
}

function playsingle(i){
    console.log("INDICE STRUMENTO (playsingle) = ", i);

    if (isMusicPlaying == 0){        
        nextNoteTime = audioContext.currentTime + 0.2; //little delay to give time to things like garbage collection, etc.
        secondsPerBeat = 60.0/tempo; 
        
        current16thNote = 0; 
        instruments[i].rhythm.index = 0; //reset the rhythm index for every instrument
        

        isMusicPlaying = 1;

        $('#select-scale').prop('disabled', true); //disable select scale dropdown menu
        $('#select-majmin').prop('disabled', true); //disable select scale dropdown menu
        
        schedulersingle(i);
    } 
}


function stop() {
    if (isMusicPlaying == 1){
        clearTimeout(t);
        console.log("STOP NOW!");
        for (var i = 0; i < n; i++){ 
            if (instruments[i].flag == 1){
                instruments[i].gain.gain.value = 0; 
                instruments[i].gain.disconnect();
                instruments[i].gain = audioContext.createGain();
                instruments[i].gain.connect(filterNodeTotal);
            }
        }


        beatIndex = 0; //start a new bar from the beginning
        isMusicPlaying = 0;

        $('#select-scale').prop('disabled', false); //enable select scale dropdown menu
        $('#select-majmin').prop('disabled', false); //enable select scale dropdown menu
    }

}


function stopsinglemusic(event) {
    if (isMusicPlaying == 1){
        clearTimeout(t);
        console.log("STOP NOW!");
    
            if (instruments[event.data.param1].flag == 1){
                instruments[event.data.param1].gain.gain.value = 0; 
                instruments[event.data.param1].gain.disconnect();
                instruments[event.data.param1].gain = audioContext.createGain();
                instruments[event.data.param1].gain.connect(filterNodeTotal);
            }
        

        beatIndex = 0; //start a new bar from the beginning
        isMusicPlaying = 0;

        $('#select-scale').prop('disabled', false); //enable select scale dropdown menu
        $('#select-majmin').prop('disabled', false); //enable select scale dropdown menu
    }

}


function OscillatorObj(context,oscwave1,gain1,transp1,oscwave2,gain2,transp2,oscwave3,gain3,transp3,filtertype,filterfreq,filterQ,totalGain){ 
    
    instruments.push(this); 
    this.flag = 1; // flag = 1 indicates synthesizers, flag = 0 indicates samplers (for future implementations)

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
        this.adsr.flag = 0; //simple ADSR, useful for drums/percussion sounds (no duration), (for future implementations)
    }

    this.adsr = function(attackType,attackTime,decayType,decayTime,sustainValue,releaseType,releaseTime){
        this.adsr.attack = attackTime; 
        this.adsr.attackType = attackType;
        this.adsr.decay = decayTime;
        this.adsr.decayType = decayType; 
        this.adsr.sustain = sustainValue; 
        this.adsr.release = releaseTime; 
        this.adsr.releaseType = releaseType; 
        this.adsr.flag = 1; //full ADSR 
    }

    //noteDuration is espressed with respect to a beat
    //when noteDuration=1 the note will last 1/4
    //when noteDuration=0.5 the note will last 1/8
    //when noteDuration=0.25 the note will last 1/16
    //when noteDuration=4 the note will last 4/4 (1 bar)
    this.note = function(noteToPlay,noteDuration,noteStartTime,velocity){ //every note has its own oscillators and envelope for polyphony
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
        this.oscillator1.frequency.value = notes[notes.indexOf(noteToPlay)+this.osctransp1]; 
        this.oscillator2.frequency.value = notes[notes.indexOf(noteToPlay)+this.osctransp2]; 
        this.oscillator3.frequency.value = notes[notes.indexOf(noteToPlay)+this.osctransp3]; 

        this.env.gain.value = 0; // initialize amplitude envelope starting point
        this.oscillator1.connect(this.gain1);
        this.oscillator2.connect(this.gain2);
        this.oscillator3.connect(this.gain3);

        this.filter.connect(this.env);
        this.env.connect(this.velocity);
        this.velocity.connect(this.gain);


        // for future implementations
        this.adsr.newrelease = this.adsr.release;
        this.adsr.newattack = this.adsr.attack;

        

        if (this.adsr.flag == 1){ //complete adsr
            if (noteDuration*secondsPerBeat <= this.adsr.newattack){ 
                console.log("SONO QUI 1");
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
                if (noteDuration*secondsPerBeat <= this.adsr.newattack + this.adsr.decay){
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
                } else {
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
                    if (this.adsr.newrelease == 0){ 
                        this.env.gain.linearRampToValueAtTime(0,noteStartTime+noteDuration*secondsPerBeat+this.adsr.newrelease+0.0000000001); 
                    } else { 
                        this.env.gain.linearRampToValueAtTime(0,noteStartTime+noteDuration*secondsPerBeat+this.adsr.newrelease);} 
                    break;
                case 'exp':
                    if (this.adsr.newrelease == 0){ 
                        this.env.gain.exponentialRampToValueAtTime(0.0001,noteStartTime+noteDuration*secondsPerBeat+this.adsr.newrelease+0.0000000001);
                    } else { 
                        this.env.gain.exponentialRampToValueAtTime(0.0001,noteStartTime+noteDuration*secondsPerBeat+this.adsr.newrelease);}
                    break;
            }
        } else { //simple adsr
            if (noteDuration*secondsPerBeat <= this.adsr.newattack){
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
                if (noteDuration*secondsPerBeat <= this.adsr.newattack + this.adsr.decay){
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
                } else {
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
    }

    this.rhythmByHand = function(rhythm){  
        this.rhythm = rhythm;
        this.rhythm.index = 0;
        this.rhythm.loop = 1; 
        console.log("rhythm =", this.rhythm);
        var v = 1;
        while (rhythm[rhythm.length-1]/16 > v){
            v++;
        }
        this.rhythm.looplength = v;
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


function schedulersingle(i) {
    // while there are notes that will need to play before the next interval, 
    // schedule them and advance the pointer.
    while (nextNoteTime < audioContext.currentTime + scheduleAheadTime) {
        scheduleNotesingle(nextNoteTime,i);
        nextNote();
    }
    t = setTimeout(function(){schedulersingle(i)}, lookahead); //call the function scheduler() after lookahead time 
}


function scheduleNote( time ) {
    for (var f = 0; f < n; f++){ 
        if (current16thNote%(instruments[f].rhythm.looplength*16) == instruments[f].rhythm[instruments[f].rhythm.index]){  
            instruments[f].note(noteToPlay(f),noteDuration(f),time,noteVelocity(f));

            instruments[f].rhythm.index++;
            if (instruments[f].rhythm.index == instruments[f].rhythm.length){
                instruments[f].rhythm.index = 0;
            }
        }
    }
}


function scheduleNotesingle( time,i ) {
    if (current16thNote%(instruments[i].rhythm.looplength*16) == instruments[i].rhythm[instruments[i].rhythm.index]){  
            instruments[i].note(noteToPlay(i),noteDuration(i),time,noteVelocity(i));

            instruments[i].rhythm.index++;
            if (instruments[i].rhythm.index == instruments[i].rhythm.length){
                instruments[i].rhythm.index = 0;
            }
    }
}


function nextNote() {
    // Advance current note and time by a 16th note...
    secondsPerBeat = 60.0 / tempo;    
    nextNoteTime += 0.25 * secondsPerBeat;   
   
    current16thNote++; 
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
    console.log("VELOCITY = ", i);
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
    console.log("NUM a caso = ", num);
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
    return notes[i];
}

// param: choices, array of possible durations
function randomNoteWithProbabilities(choices,probabilities){
    var num=Math.random();
    console.log("NUM a caso = ", num);
    var cdf = 0; //cumulative distribution function
    for (var t = 0; t < choices.length; t++){    
        cdf =  cdf + probabilities[t];
        if(num < cdf) {
            return notes[choices[t]]; 
        }
    }
}


function noteFromRandomLoop(f){
    if (instruments[f].notesloopindex == instruments[f].loopOfNotes.length){
        instruments[f].notesloopindex = 0;
    }
    return notes[instruments[f].loopOfNotes[instruments[f].notesloopindex++]];

}

function noteToPlay(f){
    var note;
    switch (parseInt($("input[name='synth"+f+"-note-radio']:checked").val())){
            case 0:
                note = randomNoteBetween(JSON.parse($("#synth"+f+"-note-random-min").val()),JSON.parse($("#synth"+f+"-note-random-max").val()));
                break;
            case 1:
                note = randomNoteWithProbabilities(JSON.parse((JSON.parse('{"value":"[' + $("#synth"+f+"-note-random-values").val()+']"}').value)),JSON.parse((JSON.parse('{"value":"[' + $("#synth"+f+"-note-random-prob").val()+']"}').value)));   
                break;
            case 2:
                note = noteFromRandomLoop(f);
                break;
            case 3:
                note = noteByHand(JSON.parse((JSON.parse('{"value":"[' + $("#synth"+f+"-note-hand").val()+']"}').value)),f);   
                break;
    }
    return note;
}



function noteDuration(f){
    var dur;
    switch (parseInt($("input[name='synth"+f+"-duration-radio']:checked").val())){
            case 0:
                dur = randomDuration(JSON.parse((JSON.parse('{"value":"[' + $("#synth"+f+"-duration-random").val()+']"}').value)));
                break;
            case 1:
                dur = randomDurationWithProbabilities(JSON.parse((JSON.parse('{"value":"[' + $("#synth"+f+"-duration-random-values").val()+']"}').value)),JSON.parse((JSON.parse('{"value":"[' + $("#synth"+f+"-duration-random-prob").val()+']"}').value)));   
                break;
            case 2:
                dur = durationByHand(JSON.parse((JSON.parse('{"value":"[' + $("#synth"+f+"-duration-hand").val()+']"}').value)),f);   
                break;
    }
    return dur;
}

function noteVelocity(f){
    var vel;
    switch (parseInt($("input[name='synth"+f+"-velocity-radio']:checked").val())){
            case 0:
                vel = randomVelocityBetween(JSON.parse($("#synth"+f+"-velocity-random-min").val()),JSON.parse($("#synth"+f+"-velocity-random-max").val()));
                break;
            case 1:
                vel = randomVelocity(JSON.parse((JSON.parse('{"value":"[' + $("#synth"+f+"-velocity-random-choice").val()+']"}').value)));   
                break;
            case 2:
                vel = randomVelocityWithProbabilities(JSON.parse((JSON.parse('{"value":"[' + $("#synth"+f+"-velocity-random-values").val()+']"}').value)),JSON.parse((JSON.parse('{"value":"[' + $("#synth"+f+"-velocity-random-prob").val()+']"}').value)));   
                break;    
            case 3:
                vel = velocityByHand(JSON.parse((JSON.parse('{"value":"[' + $("#synth"+f+"-velocity-hand").val()+']"}').value)),f);   
                break;
    }
    return vel;
}



function noteByHand(writtennotes,f){
    if (instruments[f].notesindex == writtennotes.length){
        instruments[f].notesindex = 0;
    }
    return notes[writtennotes[instruments[f].notesindex++]]; 
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

