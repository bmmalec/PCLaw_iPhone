//THIS IS PUSHED TO THE NEW BRANCH

$(function () {

	checkForTable();
	
	TL();

	var months = ['January','February','March','April','May','June','July','August','September','October','November','December'];
	var monthsTrunc = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
	var days = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
	var today = new Date();
	
	//Set selected date and normalize to first of the month at midnight
	var selectedMonth = new Date(today);
	selectedMonth.setDate(1);
	selectedMonth.setHours(0);
	selectedMonth.setMinutes(0);
	selectedMonth.setSeconds(0);
	
	var selectedDay = new Date(today);
	selectedDay.setHours(0);
	selectedDay.setMinutes(0);
	selectedDay.setSeconds(0);
	selectedDay.setMilliseconds(0);
	
	var selectedWeek = new Date(today.getFullYear(),today.getMonth(),today.getDate()-today.getDay());
	
	$('.storedVars').html('<span class="mthVar">'+selectedMonth+'</span><span class="wkVar">'+selectedWeek+'</span><span class="dayVar">'+selectedDay+'</span>');
	
	firstLoadMonth(selectedMonth,months,monthsTrunc);
	
	/*$('.syncButton').tap(function() {
		sync();
	});*/
	
	$(document).bind('pagechange', function() {
  		$('.ui-page-active .ui-listview').listview('refresh');
	});
	
	/*$('#monthHeader .wkBtnLeft').tap(function() {
		selectedMonth = goBackOneMonth(selectedMonth,months,monthsTrunc);
		$('.storedVars .mthVar').html(selectedMonth);
	});
	$('#monthHeader .wkBtnRight').tap(function() {
		selectedMonth = goForwardOneMonth(selectedMonth,months,monthsTrunc);
		$('.storedVars .mthVar').html(selectedMonth);
	});
	
	$('#weekHeader .wkBtnLeft').tap(function() {
		selectedWeek = goBackOneWeek(selectedWeek,days);
		$('.storedVars .wkVar').html(selectedWeek);
	});
	$('#weekHeader .wkBtnRight').tap(function() {
		selectedWeek = goForwardOneWeek(selectedWeek,days);
		$('.storedVars .wkVar').html(selectedWeek);
	});
	
	$('#dayHeader .wkBtnLeft').tap(function() {
		selectedDay = goBackOneDay(selectedDay,days);
		$('.storedVars .dayVar').html(selectedDay);
	});
	$('#dayHeader .wkBtnRight').tap(function() {
		selectedDay = goForwardOneDay(selectedDay,days);
		$('.storedVars .dayVar').html(selectedDay);
	});*/
	
	$('#monthView #monthHeader').on('swiperight',function() {
		selectedMonth = goBackOneMonth(selectedMonth,months,monthsTrunc);
		$('.storedVars .mthVar').html(selectedMonth);
	});
	$('#monthView #monthHeader').on('swipeleft',function() {
		selectedMonth = goForwardOneMonth(selectedMonth,months,monthsTrunc);
		$('.storedVars .mthVar').html(selectedMonth);
	});
	$('#weekView #weekHeader').on('swiperight',function() {
		var week = new Date($('.storedVars .wkVar').html());
		selectedWeek = goBackOneWeek(week,days);
		$('.storedVars .wkVar').html(selectedWeek);
	});
	$('#weekView #weekHeader').on('swipeleft',function() {
		var week = new Date($('.storedVars .wkVar').html());
		selectedWeek = goForwardOneWeek(week,days);
		$('.storedVars .wkVar').html(selectedWeek);
	});
	$('#dayView #dayHeader').on('swiperight',function() {
		var day = new Date($('.storedVars .dayVar').html());
		selectedDay = goBackOneDay(day,days);
		$('.storedVars .dayVar').html(selectedDay);
	});
	$('#dayView #dayHeader').on('swipeleft',function() {
		var day = new Date($('.storedVars .dayVar').html());
		selectedDay = goForwardOneDay(day,days);
		$('.storedVars .dayVar').html(selectedDay);
	});
	
	//evt Handlers for Lwr and Config Transitions
	$('.l_img').click(function() {
		goTo('#toggle');
	});
	$('.c_img').click(function() {
		goTo('#settingspage');
	});
	
	//evt Handlers for Time Frame Change Buttons
	$('#monthsBack').click(function() {
		switchTimeFrame('#monthsBack span span','Back');
	});
	$('#monthsForward').click(function() {
		switchTimeFrame('#monthsForward span span','Forward');
	});
	
	$('#dbreset').click(function() {
		dbResetAndReload();
	});
	$('#test_db').click(function() {
		dbDiagnostics();
	});
	
	evtHand(selectedMonth);
	
	//loadToggleList();
	
	$('.ui-icon').addClass('ui-icon-alt');
	
}); //end ready

function grabVars() {
	var mth = new Date($('.storedVars .mthVar').text());
	var wk = new Date($('.storedVars .wkVar').text());
	var day = new Date($('.storedVars .dayVar').text());
	var days = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
	return new Array(mth,wk,day,days);
}

// ---------------- Month View Rendering Functions ------------------- //

function evtHand(selectedMonth) {
	$('#monthView table td').tap(function() {
		var date;
		if ($(this).hasClass('before')) {
			//var date = new Date(selectedMonth.getFullYear(),selectedMonth.getMonth()-1,$(this).text());
			//$('#monthView .dateInfo').text('You have selected: '+(date.getMonth()+1)+'/'+date.getDate()+'/'+date.getFullYear());
		} else if ($(this).hasClass('after')) {
			//var date = new Date(selectedMonth.getFullYear(),selectedMonth.getMonth()+1,$(this).text());
			//$('#monthView .dateInfo').text('You have selected: '+(date.getMonth()+1)+'/'+date.getDate()+'/'+date.getFullYear());
		} else {
			var date = new Date(selectedMonth.getFullYear(),selectedMonth.getMonth(),$(this).text());
			
			//getEventCount here
			getEventCount(date,'#monthView .dateInfo');
			load();
			
			//$('#monthView .dateInfo').text('You have selected: '+(date.getMonth()+1)+'/'+date.getDate()+'/'+date.getFullYear());
			$('#monthView .gotoday').text('Go to '+(date.getMonth()+1)+'/'+date.getDate());
			//Set selected Date to this date
			$('.storedVars .dayVar').html(date);
			$('.storedVars .wkVar').html(new Date(date.getFullYear(),date.getMonth(),date.getDate()-date.getDay()));
			
			$('#monthView .storedDate').text(date);
		}
	});
	$('#monthView .gotoday').tap(function() {
		if ($('#monthView .storedDate').text() == "") {
			var d = new Date();
		} else {
			var d = new Date($('#monthView .storedDate').text());
		}
		var days = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
		firstLoadDay(d,days);
		var w = new Date(d.getFullYear(),d.getMonth(),d.getDate()-d.getDay());
		firstLoadWeek(w,days);
	});
}

function loadMonthTable(selMon) {
	//get vars for weekday offset, number of days in month, and multiple of 7 to include all
	var offset;
	var numDays;
	var totalSpots;
	offset = selMon.getDay();
	var d = new Date(selMon.getFullYear(),selMon.getMonth()+1,0);
	numDays = d.getDate();
	totalSpots = offset+numDays;
	while (totalSpots % 7 != 0) {
		totalSpots += 1;
	}
	//create six before and six after
	var sixBefore = new Array();
	var sixAfter = new Array();
	var monthDays = new Array();
	
	//fill sixBefore, sixAfter, and monthDays with dates
	for (var x = 1; x <= numDays; x++) {
		monthDays.push(new Date(selMon.getFullYear(),selMon.getMonth(),x));
	}
	for (var x = 0; x > -6; x--) {
		sixBefore.push(new Date(selMon.getFullYear(),selMon.getMonth(),x));
	}
	for (var x = 1; x < 7; x++) {
		sixAfter.push(new Date(selMon.getFullYear(),selMon.getMonth(),numDays+x));
	}
	
	var tableFiller = '<tr><th>Sun</th><th>Mon</th><th>Tue</th><th>Wed</th><th>Thu</th><th>Fri</th><th>Sat</th></tr><tr>';
	for (var i = 0; i < totalSpots; i++) {
		if (i % 7 == 0 && i != 0 && i != totalSpots-1) {
			tableFiller += '</tr><tr>';
		}
		if (i < offset) {
			tableFiller += '<td class="before">'+sixBefore[offset-1-i].getDate()+'</td>'
		} else if (offset <= i && i < numDays + offset) {
			tableFiller += '<td>'+monthDays[i-offset].getDate()+'</td>'
		} else {
			tableFiller += '<td class="after">'+sixAfter[i-numDays-offset].getDate()+'</td>'
		}
		if (i == totalSpots - 1) {
			tableFiller += '</tr>';
		}
	}
	$('#monthView table').html(tableFiller);
}

function firstLoadMonth(date,m,mt) {
	var dates = lastNowNext(date);
	setMonthHeader(dates[0],dates[1],dates[2],m,mt);
	loadMonthTable(date);
}

function setMonthHeader(last,now,next,months,monthsTrunc) {
	$('#monthHeader h1').html(months[now.getMonth()] + ' ' + now.getFullYear());
	$('#monthHeader .mthBtnLeft').text(monthsTrunc[last.getMonth()]);
	$('#monthHeader .mthBtnRight').text(monthsTrunc[next.getMonth()]);
}

function lastNowNext(now) {
	var last = new Date(now);
	var next = new Date(now);
	if (now.getMonth() == 0) {
		last.setMonth(11);
		last.setFullYear(last.getFullYear() - 1);
		next.setMonth(next.getMonth() + 1);
	} else if (now.getMonth() == 11) {
		next.setMonth(0);
		next.setFullYear(next.getFullYear() + 1);
		last.setMonth(last.getMonth() - 1);
	} else {
		next.setMonth(next.getMonth() + 1);
		last.setMonth(last.getMonth() - 1);
	}
	return [last, now, next];
}

function goBackOneMonth(current,m,mt) {
	var dates = lastNowNext(current);
	var oneMonthBack = dates[0];
	var datesOneMonthBack = lastNowNext(oneMonthBack);
	setMonthHeader(datesOneMonthBack[0],datesOneMonthBack[1],datesOneMonthBack[2],m,mt);
	
	//Put in function to populate table with correct dates here...
	loadMonthTable(datesOneMonthBack[1]);
	evtHand(oneMonthBack);
	
	$('#monthView .dateInfo').text("Please Select a date.");
	
	return oneMonthBack;
}

function goForwardOneMonth(current,m,mt) {
	var dates = lastNowNext(current);
	var oneMonthForward = dates[2];
	var datesOneMonthForward = lastNowNext(oneMonthForward);
	setMonthHeader(datesOneMonthForward[0],datesOneMonthForward[1],datesOneMonthForward[2],m,mt);
	
	//Put in function to populate table with correct dates here...
	loadMonthTable(datesOneMonthForward[1]);
	evtHand(oneMonthForward);
	
	$('#monthView .dateInfo').text('Please Select a date.');
	
	return oneMonthForward;
}



// --------------- Week View Rendering Functions -------------------- //

function firstLoadWeek(sunday,days) {
	setWeekHeader(sunday);
	populateWeekView(sunday,days);
}

/*function loadWeekList(selWk,days) {
	var sun = new Date(selWk);
	var mon = new Date(selWk.getFullYear(),selWk.getMonth(),selWk.getDate()+1);
	var tue = new Date(selWk.getFullYear(),selWk.getMonth(),selWk.getDate()+2);
	var wed = new Date(selWk.getFullYear(),selWk.getMonth(),selWk.getDate()+3);
	var thu = new Date(selWk.getFullYear(),selWk.getMonth(),selWk.getDate()+4);
	var fri = new Date(selWk.getFullYear(),selWk.getMonth(),selWk.getDate()+5);
	var sat = new Date(selWk.getFullYear(),selWk.getMonth(),selWk.getDate()+6);
	var wk = [sun,mon,tue,wed,thu,fri,sat];
	var wkList = '';
	for (var x = 0; x < 7; x++) {
		wkList += '<li style="font-weight:200" data-role=list-divider>'+days[x]+' '+(wk[x].getMonth()+1)+'/'+wk[x].getDate()+'/'+(wk[x].getFullYear().toString().substr(2,2))+'</li>'
		var stop = Math.floor(Math.random()*4)+1;
		for (var n = 0; n < stop; n++) {
			wkList += '<li><a href=#testEvent>Event '+(n+1)+'</a></li>'
		}
	}
	$('#weekList').html(wkList);
} */

function setWeekHeader(sunday) {
	var saturday = new Date(sunday.getFullYear(),sunday.getMonth(),sunday.getDate()+6);
	$('#weekView h1').text((sunday.getMonth()+1)+'/'+sunday.getDate()+'/'+sunday.getFullYear().toString().substr(2,2)+' - '+(saturday.getMonth()+1)+'/'+saturday.getDate()+'/'+saturday.getFullYear().toString().substr(2,2));
	$('#weekHeader .ui-btn-left').text("Back");
	$('#weekHeader .ui-btn-right').text("Next");
}

function goBackOneWeek(current,days) {
	var last = new Date(current.getFullYear(), current.getMonth(), current.getDate()-7);
	setWeekHeader(last);
	populateWeekView(last,days);
	return last;
}

function goForwardOneWeek(current,days) {
	var next = new Date(current.getFullYear(), current.getMonth(), current.getDate()+7);
	setWeekHeader(next);
	populateWeekView(next,days);
	return next;
}



// ---------------------- Day View Rendering Functions ------------------------ //

function firstLoadDay(day,days) {
	//loadDayList(day,days);
	populateDayView(day);
	setDayHeader(day,days);
}

/*function loadDayList(selDay,days) {
	var num = Math.floor(Math.random()*15)+1;
	var dayList = '';
	for (var i = 0; i < num; i++) {
		dayList += '<li><a href=#testEvent>Event '+(i+1)+'</a></li>'
	}
	$('#dayView #events').html(dayList);
} */

function setDayHeader(day,days) {
	$('#dayHeader h1').text(days[day.getDay()]+' '+(day.getMonth()+1)+'/'+day.getDate()+'/'+day.getFullYear().toString().substr(2,2));
}

function goBackOneDay(current,days) {
	var last = new Date(current.getFullYear(), current.getMonth(), current.getDate()-1);
	setDayHeader(last,days);
	//loadDayList(last,days);
	populateDayView(last);
	return last;
}

function goForwardOneDay (current,days) {
	var next = new Date(current.getFullYear(), current.getMonth(), current.getDate()+1);
	setDayHeader(next,days);
	//loadDayList(next,days);
	populateDayView(next);
	return next;
}



// ----------------- Populate Day View -------------------- //
/*
function getEvents(day) {
	//Pass in day to receive array for, return array of events (array of arrays)

	//For testing, create array of test events
	var first = new Date(2013,9,15,8,0,0);
	var second = new Date(2013,9,15,9,0,0);
	var third = new Date(2013,9,15,10,0,0);
	var fourth = new Date(2013,9,15,17,0,0);
	
	var first2 = new Date(2013,9,20,8,0,0);
	var second2 = new Date(2013,9,20,10,0,0);
	var third2 = new Date(2013,9,20,14,0,0);
	
	var a1 = [first, new Date(2013,9,15,8,30,0), 'Party Time', "Where the party's at", 'LWR'];
	var a2 = [second, new Date(2013,9,15,9,30,0), 'Breakfast', "Denny's", 'ABC'];
	var a3 = [third, new Date(2013,9,15,10,30,0), 'Emergency', 'The Bathroom', 'YOU'];
	var a4 = [fourth, new Date(2013,9,15,17,30,0), 'Drinking with the guys, Strippers after that, then a huge coke binge because we can', 'The Bar', 'LWR'];
	
	var b1 = [first2, new Date(2013,9,20,8,30,0), 'Court Appearance', 'The Courthouse', 'LWR'];
	var b2 = [second2, new Date(2013,9,20,10,30,0), 'Work Time', 'Work', 'LWR'];
	var b3 = [third2, new Date(2013,9,20,14,30,0), 'Screw off', 'Work again', 'LWR'];
	
	var events1 = [a1,a2,a3,a4];
	var events2 = [b1,b2,b3];
	
	if (day.getFullYear() == 2013 && day.getMonth() == 9 && day.getDate() == 15) {
		//console.log('first');
		return events1;
	} else if (day.getFullYear() == 2013 && day.getMonth() == 9 && day.getDate() == 20) {
		//console.log('second');
		return events2;
	} else {
		//console.log('No events for today');
		return 'No events for today';
	}
}
*/

function timeString(date) {
	var hour = date.getHours();
	var min = date.getMinutes();
	var hr12;
	var min12;
	var aa;
	if (hour == 0) {
		hr12 = 12;
		aa = 'AM';
	} else if (hour <= 11) {
		hr12 = hour;
		aa = 'AM';
	} else if (hour == 12) {
		hr12 = 12;
		aa = 'PM';
	} else {
		hr12 = hour - 12;
		aa = 'PM';
	}
	if (min < 10) {
		min12 = '0' + min;
	} else {
		min12 = min;
	}
	return hr12+':'+min12+' '+aa;
}

function timeTrunc(string) {
	var pos = string.search(' ');
	if (pos == -1) {
		var all = "12:00 AM";
		return all;
	} else {
	var time = string.substr(pos+1);
	var pos2;
	var first = 0;
	for (var i = 0; i < time.length; i++) {
		if (time.charAt(i) == ':') {
			if (first == 1) {
				pos2 = i;
			}
			first += 1;
		}
	}
	var time2 = time.substr(0,pos2);
	var addon = time.substr(pos2+3);
	var ret = time2+addon;
	return ret;
	}
}

function timeTrunc2(string) {
	var pos = string.search(' ');
	if (pos == -1) {
		var all = "12:00 AM";
		return all;
	} else {
	var date = string.substr(0,pos+1);
	var time = string.substr(pos+1);
	var pos2;
	var first = 0;
	for (var i = 0; i < time.length; i++) {
		if (time.charAt(i) == ':') {
			if (first == 1) {
				pos2 = i;
			}
			first += 1;
		}
	}
	var time2 = time.substr(0,pos2);
	var addon = time.substr(pos2+3);
	var ret = date+time2+addon;
	return ret;
	}
}

function truncDay() {
	$('#dayView .testevent .subject').each(function() {
		if ($(this).text().length > 15) {
			$(this).text($(this).text().substr(0,14)+' ...');
		}
	});
	$('#weekView .testevent .subject').each(function() {
		if ($(this).text().length > 15) {
			$(this).text($(this).text().substr(0,14)+' ...');
		}
	});
}

function dayEvtHandler() {
	$('.testevent').click(function() {
		$('#testEvent .infoWrap .subject').text($(this).find('.subjectNonTrunc').text());
		$('#testEvent .locationWrap .loc').text($(this).find('.location').text());
		$('#testEvent .infoWrap .start').text('Start: '+$(this).find('.startNonTrunc').text());
		$('#testEvent .infoWrap .end').text('End: '+$(this).find('.end').text());
		$('#testEvent .lawyerWrap .lwr').text($(this).find('.lawyerNonTrunc').text());
		
		$.mobile.changePage($('#testEvent'),{transition:'none'});
	});
}

function showDay(events,container,isSingleDay,extra) {

    //Create html string to add to unordered list
    html = '';

    if (events.rows.length == 0) {

        html += '<li>No Events for Today<li>';

    } else if (!containsActiveLawyers(events)) {
    	html += '<li>No Events for Today<li>';
    } else {

        for (var x = 0; x < events.rows.length; x++) {

            var event = events.rows.item(x);
            
            if (isActiveLawyer(event.lawyer)) {

            	html += '<li><a href=""><div class="testevent">\
					<p class="lawyer">'+ event.subject.substr(0,3) + '</p>\
					<p style="display:none" class="lawyerNonTrunc">'+event.lawyer+'</p>\
					<p class="time">'+ timeTrunc(event.starttm) + '</p>\
					<p style="display:none" class="startNonTrunc">'+timeTrunc2(event.starttm)+'</p>\
					<p class="subject">'+ event.subject.substr(4) + '</p>\
					<p style="display:none" class="subjectNonTrunc">'+ event.subject.substr(4) + '</p>\
					<p style="display:none" class="location">'+ event.loc + '</p>\
					<p style="display:none" class="end">'+ timeTrunc2(event.endtm) + '</p>\
				</div></a></li>';
			} else {
			}

        }
        
    }
    if (isSingleDay) {
    	$(container).html(html);
    } else {
    	$(container).append(extra); //List Divider for date
    	$(container).append(html);
    }
    truncDay();
    $('.ui-page-active .ui-listview').listview('refresh');
    dayEvtHandler();
}

function showEventCount(events,container,date) {
	var count = 0;
	for (var x = 0; x < events.rows.length; x++) {
		var event = events.rows.item(x);
		if (isActiveLawyer(event.lawyer)) {
			count += 1;
		}
	}
	if (count == 0) {
		$(container).text('No events on ' + (date.getMonth()+1)+'/'+date.getDate()+'/'+date.getFullYear());
	} else if (count == 1) {
		$(container).text('You have ' + count + ' event on ' + (date.getMonth()+1)+'/'+date.getDate()+'/'+date.getFullYear());
	} else {
		$(container).text('You have ' + count + ' events on ' + (date.getMonth()+1)+'/'+date.getDate()+'/'+date.getFullYear());
	}
}

function containsActiveLawyers(events) {
	var count = 0;
	var a = new Array();
	$('.toggleLawyers p').each(function() {
		a.push($(this).text());
	});
	for (var x = 0; x < a.length; x++) {
		for (var y = 0; y < events.rows.length; y++) {
			var evtLwr = events.rows.item(y).lawyer;
			var actLwr = a[x];
			if (evtLwr.indexOf(actLwr.substr(0,actLwr.length-1)) != -1) {
				count += 1;
			}
		}
	}
	return count > 0;
}

function isActiveLawyer(lwr) {
	var a = new Array();
	$('.toggleLawyers p').each(function() {
		a.push($(this).text());
	});
	for (var x = 0; x < a.length; x++) {
		if (lwr.indexOf(a[x].substr(0,a[x].length-1)) != -1) {
			return true;
		}
	}
	return false;
}

function populateDayView(day) {
	//This is the method to call to return events array
    getEvents(day,'#dayView .customEvents',true,'');
}

function populateWeekView(sunday,days) {
	var mon = new Date(sunday.getFullYear(),sunday.getMonth(),sunday.getDate()+1);
	var tue = new Date(sunday.getFullYear(),sunday.getMonth(),sunday.getDate()+2);
	var wed = new Date(sunday.getFullYear(),sunday.getMonth(),sunday.getDate()+3);
	var thu = new Date(sunday.getFullYear(),sunday.getMonth(),sunday.getDate()+4);
	var fri = new Date(sunday.getFullYear(),sunday.getMonth(),sunday.getDate()+5);
	var sat = new Date(sunday.getFullYear(),sunday.getMonth(),sunday.getDate()+6);
	
	$('#weekList').html('<span></span>');
	
	var sunDiv = '<li style="font-weight:200" data-role=list-divider>'+'Sunday '+(sunday.getMonth()+1)+'/'+sunday.getDate()+'/'+(sunday.getFullYear().toString().substr(2,2))+'</li>';
	getEvents(sunday,'#weekList',false,sunDiv);
	var monDiv = '<li style="font-weight:200" data-role=list-divider>'+'Monday '+(mon.getMonth()+1)+'/'+mon.getDate()+'/'+(mon.getFullYear().toString().substr(2,2))+'</li>';
	getEvents(mon,'#weekList',false,monDiv);
	var tueDiv = '<li style="font-weight:200" data-role=list-divider>'+'Tuesday '+(tue.getMonth()+1)+'/'+tue.getDate()+'/'+(tue.getFullYear().toString().substr(2,2))+'</li>';
	getEvents(tue,'#weekList',false,tueDiv);
	var wedDiv = '<li style="font-weight:200" data-role=list-divider>'+'Wednesday '+(wed.getMonth()+1)+'/'+wed.getDate()+'/'+(wed.getFullYear().toString().substr(2,2))+'</li>';
	getEvents(wed,'#weekList',false,wedDiv);
	var thuDiv = '<li style="font-weight:200" data-role=list-divider>'+'Thursday '+(thu.getMonth()+1)+'/'+thu.getDate()+'/'+(thu.getFullYear().toString().substr(2,2))+'</li>';
	getEvents(thu,'#weekList',false,thuDiv);
	var friDiv = '<li style="font-weight:200" data-role=list-divider>'+'Friday '+(fri.getMonth()+1)+'/'+fri.getDate()+'/'+(fri.getFullYear().toString().substr(2,2))+'</li>';
	getEvents(fri,'#weekList',false,friDiv);
	var satDiv = '<li style="font-weight:200" data-role=list-divider>'+'Saturday '+(sat.getMonth()+1)+'/'+sat.getDate()+'/'+(sat.getFullYear().toString().substr(2,2))+'</li>';
	getEvents(sat,'#weekList',false,satDiv);
}

function load() {
	var a = grabVars();
	firstLoadDay(a[2],a[3]);
	firstLoadWeek(a[1],a[3]);
	$('.loadButton').css({'visibility':'hidden'});
	$('.syncButton').css({'visibility':'hidden'});
}

function sync() {
	setupdb();
}



// ----------- Toggle Lawyers Functions ------------ //

function checkForDuplicates(arr) {
	var unique = [];
	$.each(arr, function(i, el) {
		if ($.inArray(el, unique) === -1) unique.push(el);
	});
	return unique;
}

function loadToggleList() {

	$('#toggle #toggleList #tList').html('');

	var law = new Array();
	$('.totalLawyers p').each(function() {
		law.push($(this).text());
	});
	
	var lawyers = checkForDuplicates(law);
	
	var lawyersOn = new Array();
	$('.toggleLawyers p').each(function() {
		lawyersOn.push($(this).text());
	});
	
	html = '';//'<ul data-role=listview>';
	for (var x = 0; x < lawyers.length; x++) {
		if (lawyersOn.indexOf(lawyers[x]) != -1) {
			html += '<li data-icon=check><a href="">'+lawyers[x]+'</a></li>';
		} else {
			html += '<li data-icon=false><a href="">'+lawyers[x]+'</a></li>';
		}
	}
	//html += '</ul>';
	$('#toggle #toggleList #tList').html(html);
	$('#tList').trigger('create');
	toggle();
}

function toggle() {
	$('#toggle #toggleList li').click(function() {
		var lwrToChange = $(this).text();
		t = lwrToChange.substr(0,lwrToChange.length-1);
		
		if ($(this).attr('data-icon') == 'check') {
			$('.toggleLawyers p').each(function() {
				if ($(this).text().indexOf(t) != -1) {
					$(this).remove();
				}
			});
			loadToggleList();
			load();
			$('#dayView .customEvents, #weekView #weekList').trigger('create');
		} else {
			$('.toggleLawyers').append('<p style="display:none;">'+lwrToChange+'</p>');
			loadToggleList();
			load();
		}
	});
}

// ------------ Misc Functions -------------- //

function checkForTable() {  //Called on Line 1 of doc ready
	var sql = "SELECT * FROM appts LIMIT 1";
	db.transaction(function(transaction) {
		transaction.executeSql(sql,undefined,function(transaction,result) {
			//Successful grab. Is a table, hide sync button, load tables
			$('.syncButton').css({'visibility':'hidden'});
			load();
		},
		function() {
			//Error. No table, unhide sync button
			$('.syncButton').css({'visibility':'visible'});
		});
	});
}

function goTo(page) {
	$.mobile.changePage($(page),{transition:'none'});
}

function switchTimeFrame(container,direction) {
	var tf_str = $(container).text();
	var tf;
	if (tf_str.charAt(1) == ' ') {
		tf = tf_str.substr(0,1);
	} else {
		tf = tf_str.substr(0,2);
	}
	if (tf == 1) {
		$(container).text('3 Months ' + direction);
	} else if (tf == 3) {
		$(container).text('6 Months ' + direction);
	} else if (tf == 6) {
		$(container).text('12 Months ' + direction);
	} else {
		$(container).text('1 Month ' + direction);
	}
}

function dbResetAndReload() {
	//Confirm Deletion
	if (!confirm("Are you sure you want to sync?", "")) return;;
    db.transaction(function (transaction) {
        var sql = "DROP TABLE appts";
        transaction.executeSql(sql, undefined, ok, error);
    });
    setupdb();
}

function dbDiagnostics() {
	var c = '#db_test_results';
	$(c).html('');
	$(c).append('<li data-role=list-divider>Test Results</li>');
	
	//test 1
	test_db_exists(c);
	
	//test 2
	test_table_exists(c);
	
	//test 3
	table_count(c);
	
	$(c).listview('refresh');
}

function test_db_exists(c) {
	if (db) {
		$(c).append('<li>Database Exists</li>');
	} else {
		$(c).append('<li>Database Error: Does not exist</li>');
	}
}
function test_table_exists(c) {
	var sql = "SELECT * FROM appts LIMIT 1";
	db.transaction(function(transaction) {
		transaction.executeSql(sql, undefined, function() { $(c).append('<li>Table Exists</li>');$(c).listview('refresh'); }, function() { $(c).append('<li>Database Error: Table not found</li>');$(c).listview('refresh'); });
	});
}
function table_count(c) {
	var sql = "SELECT COUNT(*) AS cnt from appts";
	db.transaction(function(transaction) {
		transaction.executeSql(sql, undefined, function(transaction,result) {
			$(c).append('<li>' + result.rows.item(0).cnt + ' records found in table</li>');
			$(c).listview('refresh');
		}, function () {
			$(c).append('<li>Error in finding record count</li>');
			$(c).listview('refresh');
		});
	});
}