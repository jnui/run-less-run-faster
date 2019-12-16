
var rlrf = {
	distanceSettings :	{
		// these are the increments in seconds between the 144 levels and lowest starting time.
		//[gap btwn 5k levels in seconds, lowest starting time in seconds (level 1 = 16:00min 5k)]
			st:  [3.215278, 326],
			mt:  [3.215278, 341],
			lt:  [3.215278, 356],
			mp: [3.715278,356],
			hmp: [3.541667,339],
			400 : [0.805556,67],
			600 : [1.208333,103],
			800 : [1.611111,138],
			1000 : [2.013889,175],
			1200 : [2.409722,214],
			1600 : [3.215278,293],
			2000 : [4.027778,371]
		},
	compareGrid : [
		// these details show the gap between each 10sec 5k compared to other distances,
		// first param is the gap, second is the lowest time in seconds, third is the training data object name
		// in order 5k, 10k, half marathon, marathon
		[10, 960, 'runData5k'],
		[10, 960, 'runData5kN'],
		[10, 960, 'runData5kI'],
		[20.91666667, 2009, 'runData10k'],
		[46.34722222, 4450, 'runDataHm'],
		[97.3125, 9342, 'runDataM'],
		[97.3125, 9342, 'runDataMN']
	]
}
data.userSetting = { level: 1};
 var rowString = '';

function displayActivity(obj){
	var actStr = '',
	plusSeconds = 0;
	console.log(obj);	

	for (var i = 0; i < obj.length; i++) {
		if( typeof obj[0].plus != "undefined" ){
			plusSeconds = obj[0].plus;
			console.log('plsSeconds' + plusSeconds);
		}
		if (i>0){actStr += '<br/>'}
		if (obj[i].distUnit == 'm' || obj[i].repeat > 1){
			actStr += '<span id="act' + i + '">' + obj[i].repeat + ' x ' + obj[i].dist + ' ' + obj[i].distUnit + convertMilesToKm(obj[i].dist, obj[i].distUnit) + '</span>\n';
		} else {
			actStr += '<span id="act' + i + '">' + obj[i].dist + ' ' + obj[i].distUnit + convertMilesToKm(obj[i].dist, obj[i].distUnit) + '</span>\n';
		}
		actStr += displayTarget(obj[i].speed, obj[i].dist, obj[i].distUnit, plusSeconds);
	};
	return actStr;
}
function displayRestInterval(obj){
	var riStr = '';
	if(obj.rest > 0){
		riStr += '<br/><span class="interval">Rest Interval ' + obj.rest + ' ' + obj.ritype + '</span>';
	}
	return riStr;
}
function displayNotes(obj){
	var noteStr = '';
	if( typeof obj.activities[0].note != "undefined" ){
		noteStr += '<br/><span class="runNote">' + obj.activities[0].note + '</span>';
	}
	return noteStr;
}
function convertMilesToKm(dist, type){
	var unit = '';
	if (type == 'miles'){
		unit =  ' <span class="km">(' + Math.round( (dist * 1.609344) * 10 ) / 10 + ' km)</span>';
	}	
	return unit;
}

function displayTarget(speed, dist, distUnit, plusSeconds){
	var targetStr = '';
	//console.log('speed= ', speed, ' dist=', dist, ' unit= ', distUnit);
	//if speed is truthy then compare to pace table
	if (speed){
		if(speed === 'easy'){
			targetStr += ' easy';
		} else {
			//console.log('rlrf.distanceSettings[',speed, '][0] = ',rlrf.distanceSettings[speed],  'userSetting=', userSetting.level, 'myltiply=', rlrf.distanceSettings[speed][0] * userSetting.level);
			var thePace = rlrf.distanceSettings[speed][0] * data.userSetting.level + rlrf.distanceSettings[speed][1] + plusSeconds,
			mph = Math.round(3600/thePace * 10)/10,
			kph = Math.round(3600/thePace * 10 * 1.60934 )/10,
			tot ='',
			kmPace = thePace/1.60934;
			if(distUnit === 'miles'){ tot =  getTime(thePace * dist) + ' total time';};
			//console.log('distunit=' , distUnit) ;
			rlrf.distanceSettings[speed][0] * data.userSetting.level
			targetStr += '@ ' + getTime(thePace) +' min/mile <span class="km">(' + getTime(kmPace) + ' min/km, ' + mph + ' mph, ' + kph + ' kph)</span>' ;
		}
	}
	//if this is a short track interval session calculate it differently
	if (!speed && distUnit === 'm'){
		var mydist = 'm' + dist;
		//console.log('rlrf.distanceSettings.'+ dist, rlrf.distanceSettings[dist]);
		var thePace = rlrf.distanceSettings[dist][0] * data.userSetting.level + rlrf.distanceSettings[dist][1] + plusSeconds;
		kph = Math.round(3600/(thePace * (1000/dist)) * 10 )/10,
		mph = Math.round((kph/1.60934) * 10)/10;
		targetStr += '@ ' + getTime(thePace) +' <span class="km">(' + mph + ' mph, ' + kph + ' kph)</span>' ;
	}
	return targetStr;
}
function getTime(time){
	// Minutes and seconds
	var mins = ~~(time / 60);
	var secs = time % 60;

	// Hours, minutes and seconds
	var hrs = ~~(time / 3600);
	var mins = ~~((time % 3600) / 60);
	var secs = time % 60;

	// Output like "1:01" or "4:03:59" or "123:03:59"
	ret = "";

	if (hrs > 0)
	    ret += "" + hrs + ":" + (mins < 10 ? "0" : "");

	ret += "" + mins + ":" + (secs < 10 ? "0" : "");
	ret += "" + Math.round(secs);
	return ret;
}

function makeTable(run,timeSecs, is5k){
	//console.log(rlrf.compareGrid);
	console.log('isfk',is5k);
	//console.log('timeSecs =' + timeSecs, 'rlrf.compareGrid[' + run +'][1]' + rlrf.compareGrid[run][1], 'rlrf.compareGrid[run][0]' + rlrf.compareGrid[run][0], 'run' + run);
	if(is5k == 0){
		data.userSetting.level = Math.round((timeSecs - rlrf.compareGrid[run][1])/rlrf.compareGrid[run][0]);
		console.log('run=', run);
	} else {
		data.userSetting.level = Math.round((timeSecs - rlrf.compareGrid[0][1])/rlrf.compareGrid[0][0]);
		console.log('run should be 0=', run);
	}
	console.log('usersettinglevel=',data.userSetting.level);
	var runTable = data[rlrf.compareGrid[run][2]];
	//console.log('runtable = ', runTable);
	//main loop for table contents (based on weeks in data)
	for (var i = 0; i < runTable.length; i++) {
		rowString += '<tr>\n';
		rowString += '  <td>' + runTable[i].week + '</td>\n';
		rowString += '<td>&nbsp;</td>\n';
		//console.log(runTable);
			for (var j = 0; j < runTable[i].runs.length; j++) {
				rowString += '<td id="r'+ i + '-' + j + '">' 
					rowString += displayActivity(runTable[i].runs[j].activities);
					rowString += displayRestInterval(runTable[i].runs[j]);
					rowString += displayNotes(runTable[i].runs[j]);
				rowString += '</td><td>&nbsp;</td>\n';
			};
		rowString += '</tr>\n';
		
	};
	$('table#training tbody').append(rowString);
}
function setForm(whichGuide){
	console.log('wg',whichGuide);
	switch(Number(whichGuide)){
		case 0:
			$('#operator').html('the target time for your distance');
			break;
		case 1:
			$('#operator').html('your 5k time');
			//set all the options to equal zero (5k)

			console.log('case 1');
			break;
		
	}
}
$(function(){
 	$('#chooseGuide').on('change', function(e){
 		setForm($(this).val());
 		console.log('setform set to ',$(this).val());
 	})
	$('#setit').on('click', function(e){
		var run, timeSecs, is5k = $('#chooseGuide').val();
		console.log('chooseguid set to', is5k);
		e.preventDefault();
		//empty table
		$('#training tbody').html('');
		//empty string of rows.
		rowString = '';
		run = $('#guide').val();
		timeSecs = (Number($('#hours').val()) * 60 * 60) + (Number($('#minutes').val()) * 60) + Number($('#seconds').val()); 
		makeTable(run,timeSecs,is5k);
	});
	$('#training').dragtable();
	$('button.print').on('click', function(){
		window.print();
	});

}); // end of jquery document ready

