function initializeGraphs(){
        
    $("#main-content").append('<div id="cont1" style="width:60%; height:300px; margin: auto;"></div>');
    $("#main-content").append('<div id="cont2" style="width:60%; height:300px; margin: auto;"></div>');
    
    chart1 = AmCharts.makeChart("cont1",
				{
					"type": "serial",
					"categoryField": "date",
					"dataDateFormat": "YYYY-MM-DD HH:NN:SS",
					"maxSelectedSeries": -1,
					"marginTop": 16,
					"color" : "#73879C",
					"fontFamily": "Helvetica Neue",
					"colors": [
						"#ed5565", //gentelella red
						"#26b99a", //gentelella green
						"#CD0D74", //purple
						"#FCD202", //yellow
						"#2A0CD0", //dark blue
						"#333333", //dark grey
						"#ffffff", //white
						"#CC0000", //dark red
						"#00CC00", //green
						"#0000CC", //dark blue
						"#DDDDDD", //light grey
						"#999999", //medium grey
						"#990000"  //dark red
					],
					"categoryAxis": {
						"minPeriod": "ss",
						"parseDates": true
					},
					"chartCursor": {
						"enabled": true,
						"categoryBalloonDateFormat": "JJ:NN:SS"
					},
					"chartScrollbar": {
						"enabled": true,
						"selectedBackgroundColor": "#F7F7F7",
        				"selectedBackgroundAlpha": 1,
        				"backgroundColor": "#e1e4e9",
        				"backgroundAlpha": 1
					},
					"trendLines": [],
					"graphs": [
						{
							"bullet": "round",
							"id": "Attention",
							"title": "Attention",
							"valueField": "column-1"
						},
						{
							"bullet": "square",
							"id": "Relaxation",
							"title": "Relaxation",
							"valueField": "column-2"
						}//,
					],
					"guides": [],
					"valueAxes": [
						{
							"id": "ValueAxis-1",
							"maximum": 100,
							"minimum": 0,
							"title": "Value",
						}
					],
					"allLabels": [],
					"balloon": {},
					"legend": {
						"enabled": true,
						"useGraphSettings": true
					},
					"titles": [
						{
							"id": "Title-1",
							"size": 15,
							"bold" : true,
							"text": "Realtime EEG levels"
						}
					],
					"dataProvider": []
				}
			);
    
    chart2 = AmCharts.makeChart("cont2",
				{
					"type": "serial",
					"categoryField": "date",
					"dataDateFormat": "YYYY-MM-DD HH:NN:SS",
					"maxSelectedSeries": -1,
					"marginTop": 16,
        	        "zoomOutOnDataUpdate": false, //diverso
        	        "color" : "#73879C",
        	        "fontFamily": "Helvetica Neue",
					"colors": [
						"#ed5565", //gentelella red
						"#26b99a", //gentelella green
						"#CD0D74", //purple
						"#FCD202", //yellow
						"#2A0CD0", //dark blue
						"#333333", //dark grey
						"#ffffff", //white
						"#CC0000", //dark red
						"#00CC00", //green
						"#0000CC", //dark blue
						"#DDDDDD", //light grey
						"#999999", //medium grey
						"#990000"  //dark red
					],
					"categoryAxis": {
						"minPeriod": "ss",
						"parseDates": true
					},
					"chartCursor": {
						"enabled": true,
						"categoryBalloonDateFormat": "JJ:NN:SS"
					},
					"chartScrollbar": {
						"enabled": true,
						"selectedBackgroundColor": "#F7F7F7",
        				"selectedBackgroundAlpha": 1,
        				"backgroundColor": "#e1e4e9",
        				"backgroundAlpha": 1
					},
					"trendLines": [],
					"graphs": [
						{
							"bullet": "square",
							"id": "Lights Intensity",
							"title": "Lights Intensity",
							"valueField": "column-1"
						},{
							"bullet": "round",
							"id": "Music Volume",
							"title": "Music Volume",
							"valueField": "column-2"
						},{
							"bullet": "round",
							"id": "Music Bpm",
							"title": "Music Bpm",
							"valueField": "column-3"
						},{
							"bullet": "round",
							"id": "Music Filter",
							"title": "Music Filter",
							"valueField": "column-4"
						}
					],
					"guides": [],
					"valueAxes": [
						{
							"id": "ValueAxis-1",
							"maximum": 100,
							"minimum": 0,
							"title": "Value"
						}
					],
					"allLabels": [],
					"balloon": {},
					"legend": {
						"enabled": true,
						"useGraphSettings": true
					},
					"titles": [
						{
							"id": "Title-1",
							"size": 15,
							"bold" : true,
							"text": "Responsive levels"
						}
					],
					"dataProvider": []
				}
			);
    
    chart1.addListener("dataUpdated", scale1);
    chart2.addListener("dataUpdated", scale2);
        
};

function scale1(){
    if(chart1.dataProvider.length > 10)
    
    chart1.zoomToIndexes(chart1.dataProvider.length - 10, chart1.dataProvider.length -1);   
}

function scale2(){
    if(chart2.dataProvider.length > 10)
    
    chart2.zoomToCategoryValues(chart2.dataProvider.length - 10, chart2.dataProvider.length -1);   
}