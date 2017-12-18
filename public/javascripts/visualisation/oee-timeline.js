$(document).ready(function () {
    var widthTimeline = $('#myTimeline').width()- 30;
    console.log('the Wid: '+widthTimeline);
    $.ajax({
        dataType: 'json',
        method: 'GET',
        url: 'http://localhost:3000/data',
        success: function (data) {

            var myData = oeeData(data),
                myPlot = TimelinesChart()
                    .width(widthTimeline).animationsEnabled(false)
                    .zDataLabel("OEE/TAK: ").enableOverview(true);
            myPlot(document.getElementById("myPlot"), myData);
        },
        error: function (xhr,status,message) {
            alert("Can not reach the Registration Web Server");
            alert(JSON.stringify(xhr));
            alert(status);
            alert(message);
        }
    })
});

function convertDateTime(dateTime){
    dateTime = dateTime.split(" ");
    var date = dateTime[0].split(".");
    var yyyy = date[2];
    var mm = date[1];
    var dd = date[0];
    var time = dateTime[1].split(":");
    var h = time[0];
    var m = time[1];
    return new Date(yyyy,mm,dd,h,m);
}

function oeeData(data) {
    var Open1=[],
        Open4=[],
        Open5=[],
        Open6=[],
        WetEnd=[],
        PreDryer=[],
        AfterDryer=[],
        PopeReel=[],
        JumboBackStand=[],
        ReWinder=[];
    //var obj = [];
    var sortDates = data.sort(function (a, b) {
        a = new Date(convertDateTime(a['Starttid']));
        b = new Date(convertDateTime(b['Starttid']));
        return a - b;
    });

    //console.log(sortDates);

    function oeeColor(a) {
        var parse = parseFloat(a.replace(',','.'));
        var temp = parse == 0 ? NaN : parse;
        return temp;
    }
    sortDates.forEach(function (p1, p2, p3) {
        switch (p1['M?tpunkt']){
            case 'Open1':
                temp = {timeRange: [convertDateTime(p1['Starttid']), convertDateTime(p1['Sluttid'])], val: oeeColor(p1['TAK']), tak:p1['TAK'], start:p1['Starttid'], end:p1['Sluttid'], domID:p1['domID']};
                Open1.push(temp);
                break;
            case 'Open4':
                temp = {timeRange: [convertDateTime(p1['Starttid']), convertDateTime(p1['Sluttid'])], val: oeeColor(p1['TAK']), tak:p1['TAK'], start:p1['Starttid'], end:p1['Sluttid'], domID:p1['domID']};
                Open4.push(temp);
                break;
            case 'Open5':
                temp = {timeRange: [convertDateTime(p1['Starttid']), convertDateTime(p1['Sluttid'])], val: oeeColor(p1['TAK']), tak:p1['TAK'], start:p1['Starttid'], end:p1['Sluttid'], domID:p1['domID']};
                Open5.push(temp);
                break;
            case 'Open6':
                temp = {timeRange: [convertDateTime(p1['Starttid']), convertDateTime(p1['Sluttid'])], val: oeeColor(p1['TAK']), tak:p1['TAK'], start:p1['Starttid'], end:p1['Sluttid'], domID:p1['domID']};
                Open6.push(temp);
                break;
            case '02 - Wet end':
                temp = {timeRange: [convertDateTime(p1['Starttid']), convertDateTime(p1['Sluttid'])], val: oeeColor(p1['TAK']), tak:p1['TAK'], start:p1['Starttid'], end:p1['Sluttid'], domID:p1['domID']};
                WetEnd.push(temp);
                break;
            case '05 - Pre-Dryer':
                temp = {timeRange: [convertDateTime(p1['Starttid']), convertDateTime(p1['Sluttid'])], val: oeeColor(p1['TAK']), tak:p1['TAK'], start:p1['Starttid'], end:p1['Sluttid'], domID:p1['domID']};
                PreDryer.push(temp);
                break;
            case '07 - After-Dryer':
                temp = {timeRange: [convertDateTime(p1['Starttid']), convertDateTime(p1['Sluttid'])], val: oeeColor(p1['TAK']), tak:p1['TAK'], start:p1['Starttid'], end:p1['Sluttid'], domID:p1['domID']};
                AfterDryer.push(temp);
                break;
            case '08 - Pope Reel':
                temp = {timeRange: [convertDateTime(p1['Starttid']), convertDateTime(p1['Sluttid'])], val: oeeColor(p1['TAK']), tak:p1['TAK'], start:p1['Starttid'], end:p1['Sluttid'], domID:p1['domID']};
                PopeReel.push(temp);
                break;
            case '09 - Jumbo Back Stand':
                temp = {timeRange: [convertDateTime(p1['Starttid']), convertDateTime(p1['Sluttid'])], val: oeeColor(p1['TAK']), tak:p1['TAK'], start:p1['Starttid'], end:p1['Sluttid'], domID:p1['domID']};
                JumboBackStand.push(temp);
                break;
            case '10 - Re Winder':
                temp = {timeRange: [convertDateTime(p1['Starttid']), convertDateTime(p1['Sluttid'])], val: oeeColor(p1['TAK']), tak:p1['TAK'], start:p1['Starttid'], end:p1['Sluttid'], domID:p1['domID']};
                ReWinder.push(temp);
                break;
            default:
                console.log('not an declared mesuring point');
        }
    });
    var obj = [{group: "Open1", data: [{label:"Open1", data:Open1}]},
               {group: "Open4", data: [{label:"Open4", data:Open4}]},
               {group: "Open5", data: [{label:"Open5", data:Open5}]},
               {group: "Open6", data: [{label:"Open6", data:Open6}]},
               {group: "WetEnd", data: [{label:"WetEnd", data:WetEnd}]},
               {group: "PreDryer", data: [{label:"PreDryer", data:PreDryer}]},
               {group: "AfterDryer", data: [{label:"AfterDryer", data:AfterDryer}]},
               {group: "PopeReel", data: [{label:"PopeReel", data:PopeReel}]},
               {group: "JumboBackStand", data: [{label:"JumboBackStand", data:JumboBackStand}]},
               {group: "ReWinder", data: [{label:"ReWinder", data:ReWinder}]}];

    return obj;
}
