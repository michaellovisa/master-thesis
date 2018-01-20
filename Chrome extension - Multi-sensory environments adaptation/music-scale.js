var scale;
var majmin;
var numbers_of_notes = [];
var notes = []; // contains the notes of the selected scale 
var baseline = []; //used to compute notes of a scale
var rootnote = 0; //number of the root note of the scale inside the array called notes
var possible_scales = ['C','C#','D','D#','E','F','F#','G','G#','A','A#','B']; // for random choosing of scale

// frequencies of notes from C0 to B7
var all_frequencies = [16.35,17.32,18.35,19.45,20.60,21.83,23.12,24.50,25.96,27.50,29.14,30.87,
32.70,34.65,36.71,38.89,41.20,43.65,46.25,49.00,51.91,55.00,58.27,61.74,
65.41,69.30,73.42,77.78,82.41,87.31,92.50,98.00,103.83,110.00,116.54,123.47,
130.81,138.59,146.83,155.56,164.81,174.61,185.00,196.00,207.65,220.00,233.08,246.94,
261.63,277.18,293.66,311.13,329.63,349.23,369.99,392.00,415.30,440.00,466.16,493.88,
523.25,554.37,587.33,622.25,659.26,698.46,739.99,783.99,830.61,880.00,932.33,987.77,
1046.50,1108.73,1174.66,1244.51,1318.51,1396.91,1479.98,1567.98,1661.22,1760.00,1864.66,1975.53,
2093.00,2217.46,2349.32,2489.02,2637.02,2793.83,2959.96,3135.96,3322.44,3520.00,3729.31,3951.07]; 


exports.getNotes = function(){
    return notes;
}

$(document).ready(function(){
    scale = $('#select-scale').attr("value");
    console.log(scale);
    majmin = $('#select-majmin').attr("value");
    console.log(majmin);

    //initialize the first scale using the default value of the dropdown menù
    if (scale == 'random'){
        scale = possible_scales[Math.floor(Math.random() * 12)]; 
    }
    notesOfThisScale(scale);
    console.log("scale : " , scale,majmin,notes); 
});



// this function is called when a new scale is selected on the dropdown menù
exports.selectscale = function selectscale() {
    numbers_of_notes.length = 0; // reset, var used in notesofthisscale
    notes.length = 0; //reset the notes of the scale if a new scale is selected
    
    scale = $('#select-scale').attr("value");
    majmin =  $('#select-majmin').attr("value");
    console.log(majmin);

    if (scale == 'random'){
        scale = possible_scales[Math.floor(Math.random() * 12)]; 
    }

    notesOfThisScale(scale);
    console.log("scale : " , scale,majmin,notes); 
}

exports.selectmajmin = function selectmajmin(){
    majmin = $('#select-majmin').attr("value");
    numbers_of_notes.length = 0; 
    notes.length = 0; 
    notesOfThisScale(scale);
    console.log("scale : " , scale,majmin,notes);
}


function notesOfThisScale(selected_scale){

    // baseline is the first octave of the scale, to compute all the other notes
    if (majmin == "major"){
        //major scales
        switch (selected_scale){
            case 'C': 
                baseline = [0,2,4,5,7,9,11]; // DO - no DIESIS
                rootnote = 0; 
                break;
                case 'C#':
                baseline = [0,1,3,5,6,8,10]; // DO# - DIESIS: do,re,mi,fa,sol,la,si
                rootnote = 1;
                break;            
                case 'D':
                baseline = [1,2,4,6,7,9,11]; // RE - DIESIS: do,fa
                rootnote = 1;
                break;
                case 'D#':
                baseline = [0,2,3,5,7,8,10]; // RE# - BEMOLLE: mi,la,si
                rootnote = 2;
                break;
                case 'E':
                baseline = [1,3,4,6,8,9,11]; // MI - DIESIS: do,re,fa,sol
                rootnote = 2;
                break;
                case 'F':
                baseline = [0,2,4,5,7,9,10]; // FA - BEMOLLE: si
                rootnote = 3;
                break;
                case 'F#':
                baseline = [1,3,5,6,8,10,11]; // FA# - DIESIS: do,re,mi,fa,sol,la
                rootnote = 3;
                break;
                case 'G':
                baseline = [0,2,4,6,7,9,11]; // SOL - DIESIS: fa
                rootnote = 4;
                break;
                case 'G#':
                baseline = [0,1,3,5,7,8,10]; // SOL# - BEMOLLE: re,mi,la,si
                rootnote = 5;
                break;
                case 'A':
                baseline = [1,2,4,6,8,9,11]; // LA - DIESIS: do,fa,sol
                rootnote = 5;
                break;  
                case 'A#':
                baseline = [0,2,3,5,7,9,10]; // LA# - BEMOLLE: mi,si
                rootnote = 6;
                break;
                case 'B':
                baseline = [1,3,4,6,8,10,11]; // SI - DIESIS: do,re,fa,sol,la
                rootnote = 6;
                break;      
            }
    } else {
        //minor scales
        switch (selected_scale){
            case 'C': 
                baseline = [0,2,3,5,7,8,10]; // DO - BEMOLLE: mi,la,si
                rootnote = 0;
                break;
                case 'C#':
                baseline = [1,3,4,6,8,9,11]; // DO# - DIESIS: do,re,fa,sol
                rootnote = 0;
                break;            
                case 'D':
                baseline = [0,2,4,5,7,9,10]; // RE - BEMOLLE: si
                rootnote = 1;
                break;
                case 'D#':
                baseline = [1,3,5,6,8,10,11]; // RE# - DIESIS: do,re,mi,fa,sol,la
                rootnote = 1;
                break;
                case 'E':
                baseline = [0,2,4,6,7,9,11]; // MI - DIESIS: fa
                rootnote = 2;
                break;
                case 'F':
                baseline = [0,1,3,5,7,8,10]; // FA - scale: do,do#,re#,fa,sol,sol#,la#
                rootnote = 3;
                break;
                case 'F#':
                baseline = [1,2,4,6,8,9,11]; // FA# - DIESIS: do,fa,sol
                rootnote = 3;
                break;
                case 'G':
                baseline = [0,2,3,5,7,9,10]; // SOL - BEMOLLE: mi,si
                rootnote = 4;
                break;
                case 'G#':
                baseline = [1,3,4,6,8,10,11]; // SOL# - DIESIS: do,re,fa,sol,la
                rootnote = 4;
                break;
                case 'A':
                baseline = [0,2,4,5,7,9,11]; // LA - no DIESIS
                rootnote = 5;
                break;  
                case 'A#':
                baseline = [0,1,3,5,6,8,10]; // LA# - DIESIS: do,re,mi,fa,sol,la,si
                rootnote = 6;
                break;
                case 'B':
                baseline = [1,2,4,6,7,9,11]; // SI - DIESIS: do,fa
                rootnote = 6;
                break;      
            }

        }
        for (var i = 0; i < 8; i++){
            for (var j = 0; j < 7; j++){
                numbers_of_notes.push(12*i+baseline[j]);
            }
        }
        for (var n = 0; n < numbers_of_notes.length; n++){
            notes.push(all_frequencies[numbers_of_notes[n]]);
        }   
}


