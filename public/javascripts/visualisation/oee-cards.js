/**
 * Created by Stefan Aleksik on 10.8.2017.
 */
$(document).ready(function () {
    $(".draggable").draggable({
        handle: ".modal-header"
    });
    refresh();
        $.ajax({
        dataType: 'json',
        method: 'GET',
        url: 'http://localhost:3000/data',
        success: function (data) {
           /* OEEcards(data, 0, 100, function (obj) {
                oeeBars(obj)
            });*/
            compareOEECards(data, function (filteredData) {
                OEEcards(filteredData,'#OEECard', false, function (obj) {
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
});
function compareOEECards(data, callback) {
$('#compareOEE').on('click', function (e) {
    e.preventDefault();
    var min = $('#minOEE').val() || 0;
    var max = $('#maxOEE').val() || 100;

    var clusterValue = $('#clusterCard').val();
    var cluster = parseInt(clusterValue, 10);

    var filteredData = data.filter(function (p1, p2, p3) {
        var oee = parseFloat(p1['TAK'].replace(',','.'));

        var clusterDataBase = parseFloat(p1['Cluster labels']);
        if (cluster == 4){
            return oee >= min && oee <= max;
        }
        else {
         return oee >= min && oee <= max && clusterDataBase == cluster;
        }
    });
    //$('#OEECard').empty();
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
        var obj = {
            oee: oee,
            domBarID: id,
            domBarIDLoss: id+'Loss',
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
            measure: measuringPoint
    };
        var domelement =
            '<div class="col-md-2 py-3 draggable"><div class="card">' +
            '<div class="card-header bg-inverse text-white panel-heading">' +
            '<div class="mx-auto text-center">' +
            '<h4>' + obj.oee +'% TAK/OEE</h4>' +
            '</div>' +
            '</div>' +
            '<div id='+ obj.domBarID +' class="card-block m-0 pb-1">' +
            '</div>' +
            '<div id='+ obj.domBarIDLoss +' class="card-block m-0 pt-1 pb-0">' +
            '</div>' +
            '<div class="card-block m-0 pt-0 pb-1">' +
            '<h6>Goal: '+obj.goalGoods+'</h6>'+
            '<h6>Approved: '+obj.producedItems[0].good+'</h6>' +
            '<h6>Revised: '+obj.producedItems[0].revised+'</h6>'+
            '<h6>Rejected: '+obj.producedItems[0].rejected+'</h6></div>'+
            '<div class="card-footer text-muted">' +
            '<h6>Order: '+obj.order+'</h6>' +
            '<h6>Machine: '+obj.measure+'</h6>'+
            '<h6>Start Time: '+obj.startTime+'</h6>'+
            '<h6>End Time: '+obj.endTime+'</h6>'+
            '<div class="row">' +
            '</div>' +
            '</div>' +
            '</div>' +
            '</div>';
        $(dom).append(domelement);
        callback(obj);
    })
}
function oeeBars(obj) {
    var tooltip = d3.select("body").append("div").attr("class", "toolTip");
    var width = $('#'+obj.domBarID).width();
    var height = 100;
    var color = ['red', 'yellow', 'grey'];
    var x = d3.scaleBand()
        .range([0, width]);
    x.domain(obj.bar);
    var svg = d3.select('#'+obj.domBarID).append("svg")
        .attr("width", '100%')
        .attr("height", height)
        .style('background', 'black')
        .append("g");
    svg.selectAll('rect')
        .data(obj.bar)
        .enter()
        .append('rect')
        .attr("class", "bar")
        .attr('width', '33.3333%')
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
                .style("left", d3.event.pageX + 10 + "px")
                .style("top", d3.event.pageY + 10 + "px")
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
    var color = ['green', 'yellow', 'red'];
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
        .style('background', 'black')
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