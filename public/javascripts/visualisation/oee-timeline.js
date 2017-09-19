$(document).ready(function () {
    var widthTimeline = $('#oee-cards').width() - 10;
    console.log('the Wid: '+widthTimeline);
    $.ajax({
        dataType: 'json',
        method: 'GET',
        url: 'http://localhost:3000/data',
        success: function (data) {
            getMockupData();
            var myData = oeeData(data),
                myPlot = TimelinesChart()
                    .width(widthTimeline)
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

function sortData(data/*, callback*/) {
    var sortDates = data.sort(function (a, b) {
        a = new Date(convertDateTime(a['Starttid']));
        b = new Date(convertDateTime(b['Starttid']));
        return a - b;
    });

        var timeLineObj = [],
        temp;
    sortDates.forEach(function (p1, p2, p3) {
        switch (p1['M?tpunkt']){
            case 'Open1':
                temp = {timeRange: [convertDateTime(p1['Starttid']), convertDateTime(p1['Sluttid'])], val: Math.random()};
                Open1.push(temp);
            break;
            case 'Open4':
                temp = {timeRange: [convertDateTime(p1['Starttid']), convertDateTime(p1['Sluttid'])], val: Math.random()};
                Open4.push(temp);
                break;
            case 'Open5':
                temp = {timeRange: [convertDateTime(p1['Starttid']), convertDateTime(p1['Sluttid'])], val: Math.random()};
                Open5.push(temp);
                break;
            case 'Open6':
                temp = {timeRange: [convertDateTime(p1['Starttid']), convertDateTime(p1['Sluttid'])], val: Math.random()};
                Open6.push(temp);
                break;
            case '02 - Wet end':
                temp = {timeRange: [convertDateTime(p1['Starttid']), convertDateTime(p1['Sluttid'])], val: Math.random()};
                WetEnd.push(temp);
                break;
            case '05 - Pre-Dryer':
                temp = {timeRange: [convertDateTime(p1['Starttid']), convertDateTime(p1['Sluttid'])], val: Math.random()};
                PreDryer.push(temp);
                break;
            case '07 - After-Dryer':
                temp = {timeRange: [convertDateTime(p1['Starttid']), convertDateTime(p1['Sluttid'])], val: Math.random()};
                AfterDryer.push(temp);
                break;
            case '08 - Pope Reel':
                temp = {timeRange: [convertDateTime(p1['Starttid']), convertDateTime(p1['Sluttid'])], val: Math.random()};
                PopeReel.push(temp);
                break;
            case '09 - Jumbo Back Stand':
                temp = {timeRange: [convertDateTime(p1['Starttid']), convertDateTime(p1['Sluttid'])], val: Math.random()};
                JumboBackStand.push(temp);
                break;
            case '10 - Re Winder':
                temp = {timeRange: [convertDateTime(p1['Starttid']), convertDateTime(p1['Sluttid'])], val: Math.random()};
                ReWinder.push(temp);
                break;
            default:
                console.log('not an declared mesuring point');
        }
    });


    var objTimeLine = [{group: 'Open1', data: Open1}, {group: 'Open1', data: Open1}, {group: 'Open4', data: Open4}, {group: 'Open5', data: Open5},{group: 'Open6', data: Open6}];

    var obj = {
        sortedData: [Open1, Open4, Open5, Open6, WetEnd, PreDryer, AfterDryer, PopeReel, JumboBackStand, ReWinder],
        rangeTime: {startTime: data.reduce(function (p1, p2) { return convertDateTime(p1['Starttid']) < convertDateTime(p2['Starttid']) ? p1 : p2}),
        endTime: data.reduce(function (p1, p2) { return convertDateTime(p1['Sluttid']) > convertDateTime(p2['Sluttid']) ? p1 : p2})},
        yDomain: ['open1', 'open4', 'open5', 'open6', 'wetEnd', 'preDry', 'afterDry', 'popReel', 'jumboBackStand', 'reWinder']
    };



    console.log(objTimeLine);
    console.log(timelinesChart);
    console.log(obj);
    /*callback(obj);*/
}

function getMockupData() {

    var NGROUPS = 6;
    var MAXLINES = 15;
    var MAXSEGMENTS = 20;
    var MINTIME = new Date(new Date() - 3*365*24*60*60*1000);

    function getGroupData() {

        function getSegmentsData() {

            var segData=[];

            var nSegments = Math.ceil(Math.random()*MAXSEGMENTS);
            var segMaxLength = Math.round(((new Date())-MINTIME)/nSegments);
            var runLength = MINTIME;

            for (var i=0; i< nSegments; i++) {
                var tDivide = [Math.random(), Math.random()].sort();
                var start = new Date(runLength.getTime() + tDivide[0]*segMaxLength);
                console.log(start);
                var end = new Date(runLength.getTime() + tDivide[1]*segMaxLength);
                runLength = new Date(runLength.getTime() + segMaxLength);
                segData.push({
                    'timeRange': [start, end],
                    'val': Math.random()
                    //'labelVal': is optional - only displayed in the labels
                });
            }

            return segData;

        }

        var grpData = [];

        for (var i=0, nLines=Math.ceil(Math.random()*MAXLINES); i<nLines; i++) {
            grpData.push({
                'label': 'label' + (i+1),
                'data': getSegmentsData()
            });
        }
        return grpData;
    }

    var data = [];

    for (var i=0; i< NGROUPS; i++) {
        data.push({
            'group': 'group' + (i+1),
            'data': getGroupData()
        });
    }
    console.log(data);
    return data;
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
        var parse = parseFloat(a.replace(',','.'))/100;
        var temp = parse == 0 ? NaN : parse;
        return temp;
    }
    sortDates.forEach(function (p1, p2, p3) {
        switch (p1['M?tpunkt']){
            case 'Open1':
                temp = {timeRange: [convertDateTime(p1['Starttid']), convertDateTime(p1['Sluttid'])], val: oeeColor(p1['TAK'])};
                Open1.push(temp);
                break;
            case 'Open4':
                temp = {timeRange: [convertDateTime(p1['Starttid']), convertDateTime(p1['Sluttid'])], val: oeeColor(p1['TAK'])};
                Open4.push(temp);
                break;
            case 'Open5':
                temp = {timeRange: [convertDateTime(p1['Starttid']), convertDateTime(p1['Sluttid'])], val: oeeColor(p1['TAK'])};
                Open5.push(temp);
                break;
            case 'Open6':
                temp = {timeRange: [convertDateTime(p1['Starttid']), convertDateTime(p1['Sluttid'])], val: oeeColor(p1['TAK'])};
                Open6.push(temp);
                break;
            case '02 - Wet end':
                temp = {timeRange: [convertDateTime(p1['Starttid']), convertDateTime(p1['Sluttid'])], val: oeeColor(p1['TAK'])};
                WetEnd.push(temp);
                break;
            case '05 - Pre-Dryer':
                temp = {timeRange: [convertDateTime(p1['Starttid']), convertDateTime(p1['Sluttid'])], val: oeeColor(p1['TAK'])};
                PreDryer.push(temp);
                break;
            case '07 - After-Dryer':
                temp = {timeRange: [convertDateTime(p1['Starttid']), convertDateTime(p1['Sluttid'])], val: oeeColor(p1['TAK'])};
                AfterDryer.push(temp);
                break;
            case '08 - Pope Reel':
                temp = {timeRange: [convertDateTime(p1['Starttid']), convertDateTime(p1['Sluttid'])], val: oeeColor(p1['TAK'])};
                PopeReel.push(temp);
                break;
            case '09 - Jumbo Back Stand':
                temp = {timeRange: [convertDateTime(p1['Starttid']), convertDateTime(p1['Sluttid'])], val: oeeColor(p1['TAK'])};
                JumboBackStand.push(temp);
                break;
            case '10 - Re Winder':
                temp = {timeRange: [convertDateTime(p1['Starttid']), convertDateTime(p1['Sluttid'])], val: oeeColor(p1['TAK'])};
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
    console.log(obj);
    return obj;
}





function timelineOEE(obj) {
    var margin = {top: 5, right: 5, bottom: 65, left: 85},
        elementWidth = $('#timeline-chart').width(),
        width = elementWidth - margin.left - margin.right,
        height = 350 - margin.top - margin.bottom,
        yScale = d3.scaleBand().range([height, 0 ]).padding(0.1).domain(obj.yDomain),
        xScale = d3.scaleTime().range([0, width]).domain([convertDateTime(obj.rangeTime.startTime['Starttid']), convertDateTime(obj.rangeTime.endTime['Sluttid'])]),
        color = d3.scaleOrdinal(d3.schemeCategory10),
        xAxis = d3.axisBottom(xScale),
        yAxis =  d3.axisLeft(yScale),
        svg = d3.select("#timeline-chart").append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            .append("g")
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    var timeLineBarsClass = svg.selectAll('.timeLineBars')
        .data(obj.sortedData)
        .append('g')
        .attr('class', 'timeLineBars')
        .style("fill", function(d, i) { return color(i);});

    timeLineBarsClass.selectAll("rect")
        .data(function(d) { return d; console.log(d)});

    /* rect.enter().append("rect")
     //.transition().duration(750)
     .attr("y", function(d) { return xScale(d.data.order); })
     .attr("x", function(d) { return yScale(d[1]); })
     .attr("height", function(d) { return yScale(d[0]) - yScale(d[1]); })
     .attr("width", xScale.bandwidth());*/

    svg.append("g")
        .attr("class", "axis axis--x")
        .attr("transform", "translate(0," + (height+5) + ")")
        .call(xAxis)
        .selectAll("text")
        .style("text-anchor", "end")
        .attr("dx", "-.8em")
        .attr("dy", ".15em")
        .attr("transform", "rotate(-65)");

    svg.append("g")
        .attr("class", "axis axis--y")
        .attr("transform", "translate(0,0)")
        .call(yAxis)
        .selectAll("text")
        .style("text-anchor", "end");



}