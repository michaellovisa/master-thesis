var starter = require('./session/sessionStarter');

var valuesOfThisInterval = []; //array of values for the current interval (current settings of adaptation)
var maxOfThisInterval = 0;
var minOfThisInterval = 100;
var sumOfThisInterval = 0;
var meanOfThisInterval = 0;
var sumOfSquaresOfThisInterval = 0;
var standardDevOfThisInterval = 100;
var maxMeanOverall = 0;
var indexMaxMeanOverall = 0;
var standardDevOverall = 100;

var music = 0;
var numRows = 0;

var table = document.getElementById("datatable");


/* Add value of relaxation to the array of values for the current interval when a new packet arrives */
exports.addPacket = function addPacket(packet){
    valuesOfThisInterval.push(packet.meditation); // add value of current relaxation to the array valuesOfThisInterval

    if (valuesOfThisInterval.length == 1) {
        insertRow();
        numRows++;
    }

    if (valuesOfThisInterval.length % 60 == 0) { // update every 60 packets/seconds
        updateRow(numRows);
    }
}   

// Compute statistics and reset array of values of the current interval and all the statistics variables, call the update for the display of those values 
exports.endInterval = function endInterval(scriptName){
    maxOfThisInterval = getMaxOfArray(valuesOfThisInterval);
    minOfThisInterval = getMinOfArray(valuesOfThisInterval);
    for (var f=0;f<valuesOfThisInterval.length;f++){
        sumOfThisInterval = sumOfThisInterval + valuesOfThisInterval[f];
    }
    meanOfThisInterval = sumOfThisInterval / (valuesOfThisInterval.length);
    for (var f=0;f<valuesOfThisInterval.length;f++){
        sumOfSquaresOfThisInterval = sumOfSquaresOfThisInterval + Math.pow((valuesOfThisInterval[f] - meanOfThisInterval),2);
    }
    standardDevOfThisInterval = Math.sqrt(sumOfSquaresOfThisInterval / valuesOfThisInterval.length);

    finalizeRow(scriptName,numRows); 

    // Reset mean variables
    maxOfThisInterval = 0;
    minOfThisInterval = 100;
    sumOfThisInterval = 0;
    meanOfThisInterval = 0;
    valuesOfThisInterval.length = 0; 
    sumOfSquaresOfThisInterval = 0;
    standardDevOfThisInterval = 0;
}   


exports.musicPlaying = function musicPlaying(isMusicPlaying){
    music = isMusicPlaying;
}

function insertRow(){
    var row = table.insertRow(-1);
    var cell0 = row.insertCell(0); 
    var cell1A = row.insertCell(1);
    var cell1B = row.insertCell(2);
    var cell2= row.insertCell(3);
    var cell3 = row.insertCell(4);
    var cell4= row.insertCell(5);
    var cell5 = row.insertCell(6);
    var cell6= row.insertCell(7);
    var cell7 = row.insertCell(8);
    var cell8= row.insertCell(9);
    var cell9= row.insertCell(10);
    var cell10= row.insertCell(11);
    var cell11= row.insertCell(12);

    //cell 0, index of interval
    cell0.innerHTML = table.rows.length - 1;

    //cell 1B, music ON or OFF
    if (music == 1) {
        cell1B.innerHTML = "ON";
    
    //cell 2
    if (starter.getVolumeTask().switch == 1){
        if (starter.getVolumeTask().instrumentNumber == 0){
            cell2.innerHTML = "ON: " + starter.getVolumeTask().functionType + "," + starter.getVolumeTask().functionEffect + "," + "global";
        } else {
            cell2.innerHTML = "ON: " + starter.getVolumeTask().functionType + "," + starter.getVolumeTask().functionEffect + "," + starter.getVolumeTask().instrumentNumber;
        }
    } else {
        cell2.innerHTML = "OFF";
    }

    //cell 3
    if (starter.getBpmTask().switch == 1){
        cell3.innerHTML = "ON: " + starter.getBpmTask().functionType + "," + starter.getBpmTask().functionEffect;
    } else {
        cell3.innerHTML = "OFF";
    }

    //cell 4
    if (starter.getFilterTask().switch == 1){
        if (starter.getFilterTask().instrumentNumber == 0){
            cell4.innerHTML = "ON: " + starter.getFilterTask().functionType + "," + starter.getFilterTask().functionEffect + "," + "global";
        } else {
            cell4.innerHTML = "ON: " + starter.getFilterTask().functionType + "," + starter.getFilterTask().functionEffect + "," + starter.getFilterTask().instrumentNumber;
        }
    } else {
        cell4.innerHTML = "OFF";
    }

    //cell 5
    if (starter.getLightsIntensityTask().color != "OFF" &&  (starter.getVolumeTask().switch == 1 || starter.getFilterTask().switch == 1)){
        cell5.innerHTML = "ON: " + starter.getLightsIntensityTask().follow + "," + starter.getLightsIntensityTask().color;
    } else {
        cell5.innerHTML = "OFF";
    }

    } else {
        cell1B.innerHTML = "OFF";
    }

    //cell 6
    cell6.innerHTML = "Waiting for data";
    
    //cell 7
    cell7.innerHTML = "Waiting for data";

    //cell 8
    cell8.innerHTML = "Waiting for data";

    //cell 9
    cell9.innerHTML = "Waiting for data";
}


function updateRow(row){
    maxOfThisInterval = getMaxOfArray(valuesOfThisInterval);
    minOfThisInterval = getMinOfArray(valuesOfThisInterval);
    for (var f=0;f<valuesOfThisInterval.length;f++){
        sumOfThisInterval = sumOfThisInterval + valuesOfThisInterval[f];
    }
    meanOfThisInterval = sumOfThisInterval / (valuesOfThisInterval.length);
    for (var f=0;f<valuesOfThisInterval.length;f++){
        sumOfSquaresOfThisInterval = sumOfSquaresOfThisInterval + Math.pow((valuesOfThisInterval[f] - meanOfThisInterval),2);
    }
    standardDevOfThisInterval = Math.sqrt(sumOfSquaresOfThisInterval / valuesOfThisInterval.length);

    //cell 6
    if (minOfThisInterval != Infinity){
        table.rows[row].cells[7].innerHTML = minOfThisInterval;
    } else {
        table.rows[row].cells[7].innerHTML = "Not enough data";
    }

    //cell 7
    if (maxOfThisInterval != -Infinity){
        table.rows[row].cells[8].innerHTML = maxOfThisInterval;
    } else {
        table.rows[row].cells[8].innerHTML = "Not enough data";
    }

    //cell 8
    if (meanOfThisInterval !== meanOfThisInterval){ //if meanOfThisInterval is Nan
        table.rows[row].cells[9].innerHTML = "Not enough data"; 
    } else {
        table.rows[row].cells[9].innerHTML = Number(meanOfThisInterval).toFixed(2);
    }

    //cell 9
    if (standardDevOfThisInterval !== standardDevOfThisInterval){ //if standardDevOfThisInterval is Nan
        table.rows[row].cells[10].innerHTML = "Not enough data";
    } else {
        table.rows[row].cells[10].innerHTML = Number(standardDevOfThisInterval).toFixed(2);
    }


    maxOfThisInterval = 0;
    minOfThisInterval = 100;
    sumOfThisInterval = 0;
    meanOfThisInterval = 0;
    sumOfSquaresOfThisInterval = 0;
    standardDevOfThisInterval = 0;
}

function finalizeRow(scriptName,row){

    //cell 1A, music script name
    if (table.rows[row].cells[2].innerHTML == "ON"){
        table.rows[row].cells[1].innerHTML = scriptName;
    }

    //cell 6
    if (minOfThisInterval != Infinity){
        table.rows[row].cells[7].innerHTML = minOfThisInterval;
    } else {
        table.rows[row].cells[7].innerHTML = "Not enough data";
    }

    //cell 7
    if (maxOfThisInterval != -Infinity){
        table.rows[row].cells[8].innerHTML = maxOfThisInterval;
    } else {
        table.rows[row].cells[8].innerHTML = "Not enough data";
    }

    //cell 8
    if (meanOfThisInterval !== meanOfThisInterval){ //if meanOfThisInterval is Nan
        table.rows[row].cells[9].innerHTML = "Not enough data"; 
    } else {
        table.rows[row].cells[9].innerHTML = Number(meanOfThisInterval).toFixed(2);
    }

    //cell 9
    if (standardDevOfThisInterval !== standardDevOfThisInterval){ //if standardDevOfThisInterval is Nan
        table.rows[row].cells[10].innerHTML = "Not enough data";
    } else {
        table.rows[row].cells[10].innerHTML = Number(standardDevOfThisInterval).toFixed(2);
    }

    //cell 10
    if (table.rows.length - 1 != 1 && table.rows[row].cells[9].innerHTML != "Not enough data" && table.rows[table.rows[row].cells[0].innerHTML - 1].cells[8].innerHTML != "Not enough data"){
        if (meanOfThisInterval > table.rows[table.rows[row].cells[0].innerHTML - 1].cells[9].innerHTML){
            table.rows[row].cells[11].innerHTML = "<img src='arrow-up.png' alt='up' style='width:24px;height:24px;' >"; 
        } else if (meanOfThisInterval < table.rows[table.rows[row].cells[0].innerHTML - 1].cells[9].innerHTML) {
            table.rows[row].cells[11].innerHTML = "<img src='arrow-down.png' alt='up' style='width:24px;height:24px;' >";
        } else {
            if (standardDevOfThisInterval > table.rows[table.rows[row].cells[0].innerHTML - 1].cells[10].innerHTML){
                table.rows[row].cells[11].innerHTML = "<img src='arrow-down.png' alt='up' style='width:24px;height:24px;' >"; 
            } else if (standardDevOfThisInterval < table.rows[table.rows[row].cells[0].innerHTML - 1].cells[10].innerHTML){
                table.rows[row].cells[11].innerHTML = "<img src='arrow-up.png' alt='up' style='width:24px;height:24px;' >"; 
            } else {
                table.rows[row].cells[11].innerHTML = "<img src='arrow-equal.png' alt='up' style='width:24px;height:24px;' >"; 
            }
        }
    }


    //cell 11
    if (meanOfThisInterval > maxMeanOverall){
        if (table.rows.length - 1 != 1){ 
            table.rows[indexMaxMeanOverall].cells[12].innerHTML = ""; //delete "best" icon from previous best
        }
        maxMeanOverall = meanOfThisInterval;
        indexMaxMeanOverall = table.rows[row].cells[0].innerHTML;
        standardDevOverall = standardDevOfThisInterval;
        table.rows[row].cells[12].innerHTML = "<img src='arrow-star.png' alt='up' style='width:24px;height:24px;' >"; 
    } else if (meanOfThisInterval == maxMeanOverall){
        if (standardDevOfThisInterval < standardDevOverall){
            if (table.rows.length - 1 != 1){ 
                table.rows[indexMaxMeanOverall].cells[12].innerHTML = ""; //delete "best" icon from previous best
            }
            maxMeanOverall = meanOfThisInterval;
            indexMaxMeanOverall = table.rows[row].cells[0].innerHTML;
            standardDevOverall = standardDevOfThisInterval;
            table.rows[row].cells[12].innerHTML = "<img src='arrow-star.png' alt='up' style='width:24px;height:24px;' >"; 
        }
    }

}

function getMaxOfArray(numArray) {
  return Math.max.apply(null, numArray);
}

function getMinOfArray(numArray) {
  return Math.min.apply(null, numArray);
}