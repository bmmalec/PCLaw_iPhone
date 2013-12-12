$(function () {
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
	
	firstLoadMonth(selectedMonth,months,monthsTrunc);
	firstLoadWeek(selectedWeek,days);
	firstLoadDay(selectedDay,days);
	
	$(document).bind('pagechange', function() {
  		$('.ui-page-active .ui-listview').listview('refresh');
	});
	
	$('#monthHeader .mthBtnLeft').tap(function() {
		selectedMonth = goBackOneMonth(selectedMonth,months,monthsTrunc);
	});
	$('#monthHeader .mthBtnRight').tap(function() {
		selectedMonth = goForwardOneMonth(selectedMonth,months,monthsTrunc);
	});
	
	$('#weekHeader .wkBtnLeft').tap(function() {
		selectedWeek = goBackOneWeek(selectedWeek,days);
	});
	$('#weekHeader .wkBtnRight').tap(function() {
		selectedWeek = goForwardOneWeek(selectedWeek,days);
	});
	
	$('#dayHeader .dayBtnLeft').tap(function() {
		selectedDay = goBackOneDay(selectedDay,days);
	});
	$('#dayHeader .dayBtnRight').tap(function() {
		selectedDay = goForwardOneDay(selectedDay,days);
	});
	
	evtHand(selectedMonth);
	dayEvtHandler();
	
	testStringToDate();
}); //end ready

function testStringToDate() {
	var string = '2013-10-05T17:30:00';
	var year = string.substr(0,4);
	var month = string.substr(5,2);
	var day = string.substr(8,2);
	var date = new Date(year,month-1,day);
	console.log(date);
	var hour = string.substr(11,2);
	var minute = string.substr(14,2);
	var second = string.substr(17,2);
	var dateTime = new Date(year,month-1,day,hour,minute,second);
	console.log(dateTime);
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
			$('#monthView .dateInfo').text('You have selected: '+(date.getMonth()+1)+'/'+date.getDate()+'/'+date.getFullYear());
		}
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
	dayEvtHandler();
}

function loadWeekList(selWk,days) {
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
}

function setWeekHeader(sunday) {
	var saturday = new Date(sunday.getFullYear(),sunday.getMonth(),sunday.getDate()+6);
	$('#weekView h1').html((sunday.getMonth()+1)+'/'+sunday.getDate()+'/'+sunday.getFullYear().toString().substr(2,2)+' - '+(saturday.getMonth()+1)+'/'+saturday.getDate()+'/'+saturday.getFullYear().toString().substr(2,2));
	$('#weekHeader .ui-btn-left').text("Back");
	$('#weekHeader .ui-btn-right').text("Next");
}

function goBackOneWeek(current,days) {
	var last = new Date(current.getFullYear(), current.getMonth(), current.getDate()-7);
	setWeekHeader(last);
	populateWeekView(last,days);
	dayEvtHandler();
	return last;
}

function goForwardOneWeek(current,days) {
	var next = new Date(current.getFullYear(), current.getMonth(), current.getDate()+7);
	setWeekHeader(next);
	populateWeekView(next,days);
	dayEvtHandler();
	return next;
}



// ---------------------- Day View Rendering Functions ------------------------ //

function firstLoadDay(day,days) {
	//loadDayList(day,days);
	populateDayView(day);
	setDayHeader(day,days);
}

function loadDayList(selDay,days) {
	var num = Math.floor(Math.random()*15)+1;
	var dayList = '';
	for (var i = 0; i < num; i++) {
		dayList += '<li><a href=#testEvent>Event '+(i+1)+'</a></li>'
	}
	$('#dayView #events').html(dayList);
}

function setDayHeader(day,days) {
	$('#dayHeader h1').text(days[day.getDay()]+' '+(day.getMonth()+1)+'/'+day.getDate()+'/'+day.getFullYear().toString().substr(2,2));
}

function goBackOneDay(current,days) {
	var last = new Date(current.getFullYear(), current.getMonth(), current.getDate()-1);
	setDayHeader(last,days);
	//loadDayList(last,days);
	populateDayView(last);
	dayEvtHandler();
	return last;
}

function goForwardOneDay (current,days) {
	var next = new Date(current.getFullYear(), current.getMonth(), current.getDate()+1);
	setDayHeader(next,days);
	//loadDayList(next,days);
	populateDayView(next);
	dayEvtHandler();
	return next;
}



// ----------------- Populate Day View -------------------- //

function getEvents(day) {
	//Pass in day to receive array for, return array of events (array of arrays)

	//For testing, create array of test events
	var first = new Date(2013,9,15,8,0,0);
	var second = new Date(2013,9,15,9,0,0);
	var third = new Date(2013,9,15,10,0,0);
	var fourth = new Date(2013,9,15,17,0,0);
	
	var first2 = new Date(2013,9,17,8,0,0);
	var second2 = new Date(2013,9,17,10,0,0);
	var third2 = new Date(2013,9,17,14,0,0);
	
	var a1 = [first, new Date(2013,9,15,8,30,0), 'Party Time', "Where the party's at", 'LWR'];
	var a2 = [second, new Date(2013,9,15,9,30,0), 'Breakfast', "Denny's", 'ABC'];
	var a3 = [third, new Date(2013,9,15,10,30,0), 'Emergency', 'The Bathroom', 'YOU'];
	var a4 = [fourth, new Date(2013,9,15,17,30,0), 'Drinking with the guys, Strippers after that, then a huge coke binge because we can', 'The Bar', 'LWR'];
	
	var b1 = [first2, new Date(2013,9,17,8,30,0), 'Court Appearance', 'The Courthouse', 'LWR'];
	var b2 = [second2, new Date(2013,9,17,10,30,0), 'Work Time', 'Work', 'LWR'];
	var b3 = [third2, new Date(2013,9,17,14,30,0), 'Screw off', 'Work again', 'LWR'];
	
	var events1 = [a1,a2,a3,a4];
	var events2 = [b1,b2,b3];
	
	if (day.getFullYear() == 2013 && day.getMonth() == 9 && day.getDate() == 15) {
		//console.log('first');
		return events1;
	} else if (day.getFullYear() == 2013 && day.getMonth() == 9 && day.getDate() == 17) {
		//console.log('second');
		return events2;
	} else {
		//console.log('No events for today');
		return 'No events for today';
	}
}

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

function truncDay() {
	$('.testevent .subject').each(function() {
		if ($(this).text().length > 30) {
			$(this).text($(this).text().substr(0,29)+' ...');
		}
	});
}

function dayEvtHandler() {
	$('.testevent').tap(function() {
		$('#testEvent .subject').text($(this).find('.subjectNonTrunc').text());
		$('#testEvent .location').text($(this).find('.location').text());
		$('#testEvent .start').text($(this).find('.time').text());
		$('#testEvent .end').text($(this).find('.end').text());
	});
}

function populateDayView(day) {
	//This is the method to call to return events array
	var events = getEvents(day);
	
	//Create html string to add to unordered list
	html = '';
	
	if (events == 'No events for today') {
		html += '<p>No Events for Today</p>';
	} else {
		for (var x = 0; x < events.length; x++) {
			html += '<li><a href=#testEvent><div class="testevent">\
					<p class="lawyer">'+events[x][4]+'</p>\
					<p class="time">'+timeString(events[x][0])+'</p>\
					<p class="subject">'+events[x][2]+'</p>\
					<p style="display:none" class="subjectNonTrunc">'+events[x][2]+'</p>\
					<p style="display:none" class="location">'+events[x][3]+'</p>\
					<p style="display:none" class="end">'+timeString(events[x][1])+'</p>\
				</div></a></li>';
		}
	}
	$('#dayView .customEvents').html(html);
	truncDay();	
}

function populateWeekView(sunday,days) {
	var mon = new Date(sunday.getFullYear(),sunday.getMonth(),sunday.getDate()+1);
	var tue = new Date(sunday.getFullYear(),sunday.getMonth(),sunday.getDate()+2);
	var wed = new Date(sunday.getFullYear(),sunday.getMonth(),sunday.getDate()+3);
	var thu = new Date(sunday.getFullYear(),sunday.getMonth(),sunday.getDate()+4);
	var fri = new Date(sunday.getFullYear(),sunday.getMonth(),sunday.getDate()+5);
	var sat = new Date(sunday.getFullYear(),sunday.getMonth(),sunday.getDate()+6);
	var week = [sunday, mon, tue, wed, thu, fri, sat];
	html = ''
	for (var x = 0; x < 7; x++) {
		html += '<li style="font-weight:200" data-role=list-divider>'+days[x]+' '+(week[x].getMonth()+1)+'/'+week[x].getDate()+'/'+(week[x].getFullYear().toString().substr(2,2))+'</li>';
		var evts = getEvents(week[x]);
		if (evts == 'No events for today') {
			continue;
		} else {
			for (var n = 0; n < evts.length; n++) {
				html += '<li><a href=#testEvent><div class="testevent">\
					<p class="lawyer">'+evts[n][4]+'</p>\
					<p class="time">'+timeString(evts[n][0])+'</p>\
					<p class="subject">'+evts[n][2]+'</p>\
					<p style="display:none" class="subjectNonTrunc">'+evts[n][2]+'</p>\
					<p style="display:none" class="location">'+evts[n][3]+'</p>\
					<p style="display:none" class="end">'+timeString(evts[n][1])+'</p>\
				</div></a></li>';
			}
		}
	}
	$('#weekView #weekList').html(html);
	truncDay();
}
































