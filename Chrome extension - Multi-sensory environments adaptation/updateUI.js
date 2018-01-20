
var musicscale = require('./music-scale.js');

var prevScriptNumOfInstr = document.getElementById("vol-numinstrument-dropdown").childElementCount - 1;

// Update UI with values of the uploaded music script
exports.updateUI = function updateUI(scale,scaletype,numberOfInstruments){
  selectDefaultScale(scale,scaletype);
  numberOfInst("vol-numinstrument-dropdown","filt-numinstrument-dropdown",numberOfInstruments);
}

function selectDefaultScale(scale,scaletype){
  switch (scale){
    case 'C#': 
      $('#select-scale').html("C#/Db" + ' <span class="caret"></span>');
      $('#select-scale').val(scale);
      break;
    case 'D#': 
      $('#select-scale').html("D#/Eb" + ' <span class="caret"></span>');
      $('#select-scale').val(scale);
      break;          
    case 'F#': 
      $('#select-scale').html("F#/Gb" + ' <span class="caret"></span>');
      $('#select-scale').val(scale);
      break;
    case 'G#': 
      $('#select-scale').html("G#/Ab" + ' <span class="caret"></span>');
      $('#select-scale').val(scale);
      break;
    case 'A#': 
      $('#select-scale').html("A#/Bb" + ' <span class="caret"></span>');
      $('#select-scale').val(scale);
      break;
    default:
      $('#select-scale').html(scale + ' <span class="caret"></span>');
      $('#select-scale').val(scale);
  }
  selectDefaultScaleType(scaletype);
  musicscale.selectscale();
}

function selectDefaultScaleType(scaletype){ 
  $('#select-majmin').html(scaletype + ' <span class="caret"></span>');
  $('#select-majmin').val(scaletype);
}

function numberOfInst(idDropdown1,idDropdown2,n){
  var list = document.getElementById(idDropdown1); 
  var list2 = document.getElementById(idDropdown2);
  var numchildren = list.childElementCount;

  if (n < prevScriptNumOfInstr) { //hide the numbers not used by the new music script
    for (var i = prevScriptNumOfInstr; i > n; i-- ){ 
      list.children[i].style.display = 'none';
      list2.children[i].style.display = 'none';
    }
  } else if (n > prevScriptNumOfInstr) { //show numbers used by the new music script
    for (var i = prevScriptNumOfInstr; i < n + 1; i++){ 
      list.children[i].style.display = 'inline';
      list2.children[i].style.display = 'inline';
    }
  }
  prevScriptNumOfInstr = n;
}
