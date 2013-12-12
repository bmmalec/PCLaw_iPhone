var db = openDatabase("PCLawCal2", "1.0", "PCLawCal2", 2500000);

function setupdb() {
    
    // Create table for appointments
    db.transaction(function (transaction) {
        var sql = "CREATE TABLE appts " +
            " (id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT, " +
            "caldate varchar(100), starttm VARCHAR(100) NOT NULL, " +
            "endtm VARCHAR(100) NOT NULL, lawyer VARCHAR(100) NOT NULL, subject VARCHAR(500) NOT NULL)"
        transaction.executeSql(sql, undefined, function () {
            alert("Table created");
        }, error);
    });

    // Call web service and get appointments
    InfoByDate('10/1/2013', '12/31/2013');

}

/*
$("#create").bind("click", function (event) {
    db.transaction(function (transaction) {
        var sql = "CREATE TABLE appts " +
            " (id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT, " +
            "starttm VARCHAR(100) NOT NULL, " +
            "endtm VARCHAR(100) NOT NULL, lawyer VARCHAR(100) NOT NULL, subject VARCHAR(500) NOT NULL)"
        transaction.executeSql(sql, undefined, function () {
            alert("Table created");
        }, error);
    });
});

$("#remove").bind("click", function (event) {
    if (!confirm("Delete table?", "")) return;;
    db.transaction(function (transaction) {
        var sql = "DROP TABLE appts";
        transaction.executeSql(sql, undefined, ok, error);
    });
});

$("#insert").bind("click", function (event) {
    var starttm = $("#lname").val();
    var endtm = $("#fname").val();

    db.transaction(function (transaction) {
        var sql = "INSERT INTO appts (starttm, endtm, lawyer, subject) VALUES (?, ?, ?, ?)";
        transaction.executeSql(sql, [starttm, endtm, starttm, endtm], function () {
            alert("Appt inserted");
        }, error);
    });
});

*/
function getEvents(day,container,isSingleDay,extra) {

    var events; 
    db.transaction(function (transaction) {
        var dt = new Date(day);
        //var dt2 = new Date(dt.setDate(dt.getDate()+1));

        var sql = "SELECT * FROM appts where caldate between ? and ?";

        transaction.executeSql(sql, [ToCalDate(dt), ToCalDate(dt)], //[ "'"+ (dt.getMonth()+1)  + '/' + dt.getDate() + '/' + dt.getFullYear() + "'", "'" + (dt.getMonth()+ 1) + '/' + (dt.getDate() + 1) + "/" + dt.getFullYear() + "'"],
        function (transaction, result) { showDay(result,container,isSingleDay,extra); }, error );
    });
}

function getEventCount(day,container) {
	
	db.transaction(function (transaction) {
	
		var dt = new Date(day);

		var sql = "SELECT * FROM appts where caldate between ? and ?";
	
		transaction.executeSql(sql, [ToCalDate(dt), ToCalDate(dt)],
		function (transaction, result) { showEventCount(result,container,day); }, error );
	});
}

function ToCalDate(dt) {
    var ret = "";
    var dt1 = new Date(dt);

    var dtmn = Right("00" + (dt1.getMonth() + 1).toString(), 2);
    var dtdy = Right("00" + dt1.getDate(), 2);

    ret = ret.concat(dt1.getFullYear(), dtmn, dtdy);

    return ret; 
}

function Right(str, len) {
    var ret = "";
    ret = str;
    var strlen = str.length;
    
    ret = str.substr(strlen - len, len);
    return ret;
}

function TL() {
	var webMethod = "http://bruninglaw.com/PCLawGateway.asmx/GetLawyerList";
	
	$('.totalLawyers').html('');
	
	$.ajax({
		type: "POST",
		url: webMethod,
		contentType: "application/json; charset=utf-8",
		crossDomain: true,
		dataType: 'json',
		success: function(msg) {
			var data = eval("(" + msg.d + ")");
			jQuery.each(data, function (rec) {
				var lwr = this.LawyerName;
				$('.totalLawyers').append('<p style="display:none;">' + lwr + '</p>');
			});
			loadToggleList();
		},
		error: function(e) {
			console.log('error');
		}
	});
}

function InfoByDate(sDate, eDate) {
    var divToBeWorkedOn = "#Results";
    // var webMethod = "http://localhost:56404/PCLawGateway.asmx/GetCalendarByDates";
    var webMethod = "http://bruninglaw.com/PCLawGateway.asmx/GetCalendarByDates";

    var parameters = "{StartDate:'10/1/2013', EndDate:'12/31/2013'}";

    $.ajax({
        type: "POST",
        url: webMethod,
        data: parameters,
        contentType: "application/json; charset=utf-8",
        crossDomain: true,
        dataType: 'json',
        success: function (msg) {
            // var data = eval("(" + msg + ")");
            var data = eval("(" + msg.d + ")");
            var t = "<p>" + msg.d + "</p>< br/><table border=1> <tr>" +
              "<td> <strong>StartTime</strong></td> <td> " +
              "<strong>EndTime</strong></td> <td> " +
              "<strong>Subject</strong></td> <td> " +
              "<strong>Location</strong></td> </tr> ";
            jQuery.each(data, function (rec) {
                var dt = this.StartDate ; 
                var caldt = ToCalDate(dt);
                var sttm = this.StartDate;
                var edtm = this.EndDate;
                var law = this.Lawyer;
                var sub = this.Subject;

                db.transaction(function (transaction) {
                    var sql = "INSERT INTO appts (caldate, starttm, endtm, lawyer, subject) VALUES (?, ?, ?, ?, ?)";
                    transaction.executeSql(sql, [caldt, sttm, edtm, law, sub], function () { }, error);
                });

            });
        },
        error: function (e) {
            $(divToBeWorkedOn).html("Unavailable");
        }
    });
    alert("WS inserted");
};

function ok() {
}

function error(transaction, err) {
    alert("DB error : " + err.message);
    return false;
}

