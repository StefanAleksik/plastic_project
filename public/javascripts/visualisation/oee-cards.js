/**
 * Created by Stefan Aleksik on 10.8.2017.
 */



$(document).ready(function () {
    $(".draggable").draggable({
        handle: ".modal-header"
    });
    slider();
    //refresh();
    $.ajax({
        dataType: 'json',
        method: 'GET',
        url: 'http://localhost:3000/data',
        success: function (data) {
            compareOEECards(data, function (filteredData) {
                OEEcards(filteredData,'#OEECard', false, function (obj) {
                    oeeBars(obj);
                    productionLoss(obj)
                });
            });

        },
        error: function (xhr,status,message) {
            alert("Can not reach the Registration Web Server");
            alert(JSON.stringify(xhr));
            alert(status);
            alert(message);
        }
    })
});
function clickCompareOEECards(data, callback) {

        $('#OEECard').empty();

        var min = $( "#slider-range" ).slider("values",0) || 0;
        var max = $( "#slider-range" ).slider("values",1) || 100;

        var valCluster =[];
        var checkboxID = ['#cluster1', '#cluster2', '#cluster3', '#cluster4'];
        checkboxID.forEach(function (p1, p2, p3) {
            if($(p1).is(":checked")){
                valCluster.push(parseInt($(p1).val(), 10))
            }
        });

        var filteredData = data.filter(function (p1, p2, p3) {
            var oee = parseFloat(p1['TAK'].replace(',','.'));
            var clusterDataBase = parseFloat(p1['Cluster labels']);
            if (valCluster.length == 0){
                return false;
            }
            else {
                var cluster = valCluster.filter(function (e) {
                    return clusterDataBase == e
                });
                return oee >= min && oee <= max && clusterDataBase == cluster[0];
            }
        });
        callback(filteredData);

}
function initClick() {
    console.log('hi');
    $.ajax({
        dataType: 'json',
        method: 'GET',
        url: 'http://localhost:3000/data',
        success: function (data) {
            clickCompareOEECards(data, function (Data) {
                OEEcards(Data,'#OEECard', false, function (ob) {
                    oeeBars(ob);
                    productionLoss(ob)
                });
            })

        },
        error: function (xhr,status,message) {
            alert("Can not reach the Registration Web Server");
            alert(JSON.stringify(xhr));
            alert(status);
            alert(message);
        }
    })
}
function compareOEECards(data, callback) {
    $('#slider-range').on('slide', function (e) {
        /*e.preventDefault();*/
        $('#OEECard').empty();
        var min = $( "#slider-range" ).slider("values",0) || 0;
        var max = $( "#slider-range" ).slider("values",1) || 100;

        var valCluster =[];
        var checkboxID = ['#cluster1', '#cluster2', '#cluster3', '#cluster4'];
        checkboxID.forEach(function (p1, p2, p3) {
            if($(p1).is(":checked")){
                valCluster.push(parseInt($(p1).val(), 10))
            }
        });

        console.log(valCluster);
        var filteredData = data.filter(function (p1, p2, p3) {
            var oee = parseFloat(p1['TAK'].replace(',','.'));
            var clusterDataBase = parseFloat(p1['Cluster labels']);
            if (valCluster.length == 0){
                return false;
            }
            else {
                var cluster = valCluster.filter(function (e) {
                    return clusterDataBase == e
                });
                return oee >= min && oee <= max && clusterDataBase == cluster[0];
            }
        });
        callback(filteredData);
    })
}

function selectOEECards(d) {
    $.ajax({
        dataType: 'json',
        method: 'GET',
        url: 'http://localhost:3000/data',
        success: function (data) {
            compareSelect(data, d, function (filter) {
                OEEcards(filter,'#OEECard', false, function (obj) {
                    oeeBars(obj);
                    productionLoss(obj)
                });
            })
        },
        error: function (xhr,status,message) {
            alert("Can not reach the Registration Web Server");
            alert(JSON.stringify(xhr));
            alert(status);
            alert(message);
        }
    })
}

function compareSelect(data, d, callback) {
    var datafilter = data.filter(function (p1, p2, p3){
        if(p1['TAK'] == d.tak && p1['Starttid'] == d.start && p1['Sluttid'] == d.end){
            return true
        }
        else {
            return false
        }
    })
    callback(datafilter)
}
function makeid() {
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";

    for (var i = 0; i < 10; i++)
        text += possible.charAt(Math.floor(Math.random() * possible.length));

    return text;
}
//
function OEEcards(data, dom, bol, callback) {
    data.forEach(function (p1, p2, p3) {
        var availability = parseFloat(p1['Tillg?nglighet'].replace(',','.'));
        var performance = parseFloat(p1['Anl?ggningsutbyte'].replace(',','.'));
        var quality = parseFloat(p1['Kvalitetsutbyte'].replace(',','.'));
        var oee = parseFloat(p1['TAK'].replace(',','.'));
        var cluster = parseFloat(p1['Cluster labels']);
        var measuringPoint = p1['M?tpunkt'];
        var startTime = p1['Starttid'];
        var endTime = p1['Sluttid'];
        var order = p1['Order'];
        var good = parseFloat(p1['Godk?nd m?ngd']);
        var revised = parseFloat(p1['Omarbetad m?ngd']);
        var rejected = parseFloat(p1['Kasserad m?ngd']);
        var goal =  parseFloat(p1['M?lproduktion'].replace(',','.'));
        var id = bol ? 'domBarID' + p2 : makeid();
        var timeLineID= p1['domID']
        var obj = {
            oee: oee,
            domBarID: id,
            domBarIDLoss: id+'Loss',
            domBarFooter: id+'Footer',
            tooltipString: ['Availability', 'Performance', 'Quality'],
            tooltipValue: [availability, performance, quality],
            clusterValue: cluster,
            tooltipValueLoss: [(100-availability).toFixed(2), (100-performance).toFixed(2), (100-quality).toFixed(2)],
            bar: [availability, availability*performance/100, (availability*performance/100)*quality/100],
            goalGoods: goal,
            producedItems:[{good: good, revised: revised, rejected: rejected}],
            producedKeys:['good', 'revised', 'rejected'],
            order: order,
            startTime: startTime,
            endTime: endTime,
            measure: measuringPoint,
            timeLineID: timeLineID
        };
        var aprClass = obj.producedItems[0].good >= obj.goalGoods ? 'b-key-dot':'s-key-dot';
        var goalClass = obj.producedItems[0].good <= obj.goalGoods ? 'b-key-dot':'s-key-dot';
        var highlight = 'onclick="changeColor('+obj.timeLineID+', '+obj.domBarFooter+')"';

        var domelement =
            '<div class="col-md-2 col-sm-4 col-6 py-3"><div class="card">' +
            '<div class="card-header bg-inverse text-white panel-heading">' +
            '<div class="mx-auto text-center">' +
            '<h6>' + obj.oee +'% TAK/OEE</h6>' +
            '</div>' +
            '</div>' +
            '<div id='+ obj.domBarID +' class="card-block m-0 pb-1 px-2">' +
            '</div>' +
            '<span class="card-block m-0 pt-0 pb-0 px-2 text-center">Produced items</span>' +
            '<div id='+ obj.domBarIDLoss +' class="card-block m-0 pt-0 pb-0 px-2">' +
            '</div>' +
            '<div class="card-block m-0 pt-0 pb-1 px-2">' +
            '<div class="legend">' +
            '<div class="legend2">' +
            '<p class="textProduct">' +
            '<span class="'+goalClass+' goal ttooltip"><span class="ttooltiptext goal">Goal</span>' +
            '</span>'+obj.goalGoods+'</p>' +
            '</div>' +
            '<div class="legend2">' +
            '<p class="textProduct">' +
            '<span class="'+aprClass+' approved ttooltip"><span class="ttooltiptext approved">Approved</span>' +
            '</span>'+obj.producedItems[0].good+'</p>' +
            '</div>' +
            '<div class="legend2">' +
            '<p class="textProduct">' +
            '<span class="key-dot revised ttooltip"><span class="ttooltiptext revised">Revised</span>' +
            '</span>'+obj.producedItems[0].revised+'</p>' +
            '</div>' +
            '<div class="legend2">' +
            '<p class="textProduct">' +
            '<span class="key-dot rejected ttooltip"><span class="ttooltiptext rejected">Rejected</span>' +
            '</span>'+obj.producedItems[0].rejected+'</p>' +
            '</div>' +
            '</div></div>'+
            '<div id='+ obj.domBarFooter +' class="card-footer"' +highlight+' style="cursor:pointer"><ul class="textOrder">' +
            '<li>Order: '+obj.order+' </li>' +
            '<li>Machine: '+obj.measure+' </li>'+
            '<li>Start Time: '+obj.startTime+' </li>'+
            '<li>End Time: '+obj.endTime+' </li>'+
            '</ul><div class="row">' +
            '</div>' +
            '</div>' +
            '</div>' +
            '</div>';
        $(dom).append(domelement);
        callback(obj);
    })
}
function changeColor(id, dom) {
    $(dom).toggleClass('select');
    var clas = $(id).attr('class');
    if (clas == 'series-segment'){
        $(id).attr('class','glow series-segment')
    }
    else {
        $(id).attr('class','series-segment')
    }
}
function oeeBars(obj) {
    var tooltip = d3.select("body").append("div").attr("class", "toolTip");
    var width = $('#'+obj.domBarID).width();
    var height = 100;
    var color = ['#e92325', '#e8d31c', '#abacb7'];
    var x = d3.scaleBand()
        .range([0, width]);
    x.domain(obj.bar);
    var svg = d3.select('#'+obj.domBarID).append("svg")
        .attr("width", '100%')
        .attr("height", height)
        .style('background', '#333338')
        .append("g");
    svg.selectAll('rect')
        .data(obj.bar)
        .enter()
        .append('rect')
        .attr("class", "bar")
        .attr('width', '33.33%')
        .attr('height', function (d) {return 0})
        .attr('x', function (d,i) { return width/obj.bar.length*i })
        .attr('y', function (d) { return height })
        .style('fill', function (d,i) { return color[i] })
        .transition()
        .delay(500)
        .ease(d3.easeLinear)
        .attr('y', function (d) { return height-d })
        .attr('height', function (d) { return d});

    svg.selectAll('.bar')
        .on("mousemove", function(d, i){
            tooltip
                .style("left", d3.event.pageX - 70 +"px")
                .style("top", d3.event.pageY - 50 +"px")
                .style("display", "inline-block")
                .html('<strong class="text-primary">'+(obj.tooltipString[i])+':</strong><strong> '+ obj.tooltipValue[i] +'%</strong>'
                    +'<br><strong class="text-danger"> '+(obj.tooltipString[i])+' loss:</strong><strong> '+ obj.tooltipValueLoss[i] +'%</strong>');
        })
        .on("mouseout", function(d){ tooltip.style("display", "none");});
    $( ".sort" ).sortable({ handle: '.panel-heading'});
}

function refresh() {
    $('#selectRefreshOEE').on('click', function (e) {
        e.preventDefault();
        $('#OEECard').empty();
    });
}

function productionLoss(obj) {
    var tooltip = d3.select("body").append("div").attr("class", "toolTip");
    var width = $('#'+obj.domBarIDLoss).width();
    var height = 30;
    var color = ['#2a9049', '#e8d31c', '#e92325'];
    var x = d3.scaleLinear()
        .range([0, width])
        .domain([0, obj.goalGoods]);
    var stack = d3.stack()
        .keys(obj.producedKeys)
        /*.order(d3.stackOrder)*/
        .offset(d3.stackOffsetNone);
    var layers= stack(obj.producedItems);

    var svg = d3.select('#'+obj.domBarIDLoss).append("svg")
        .attr("width", '100%')
        .attr("height", height)
        .style('background', '#333338')
        .append("g");
    var layer = svg.selectAll(".layer")
        .data(layers)
        .enter().append("g")
        .attr("class", "layer")
        .style("fill", function(d, i) { return color[i]; });
    layer.selectAll("rect")
        .data(function(d) { return d; })
        .enter().append("rect")
        .attr("y", 0)
        .attr("x", function(d) { return x(d[0]); })
        .attr("height", height)
        .attr("width", function(d) { return x(d[1]) - x(d[0]) });

}

function slider() {
    $( "#slider-range" ).slider({
        range: true,
        min: 0,
        max: 100,
        values: [ 0, 100 ],
        slide: function( event, ui ) {
            $( "#minOEE" ).val(ui.values[0] );
            $( "#maxOEE" ).val(ui.values[1] );
        },
        classes: {
            "ui-slider": "ui-corner-all",
            "ui-slider-handle": "ui-corner-all"
        }
    });
    $( "#minOEE" ).val( $( "#slider-range" ).slider( "values", 0 ) );
    $( "#maxOEE" ).val( $( "#slider-range" ).slider( "values", 1 ) );
}