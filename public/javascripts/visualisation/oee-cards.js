/**
 * Created by Stefan Aleksik on 10.8.2017.
 */
$(document).ready(function () {
    $.ajax({
        dataType: 'json',
        method: 'GET',
        url: 'http://localhost:3000/data',
        success: function (data) {
            OEEcards(data, 0, 100, function (obj) {
                oeeBars(obj)
            });
            compareOEECards(data, function (data, min, max) {
                OEEcards(data, min, max, function (obj) {
                    oeeBars(obj)
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
    var min = $('#minOEE').val();
    var max = $('#maxOEE').val();

    $('#OEECard').empty();
    callback(data, min, max);
})
}
function OEEcards(data, min, max, callback) {
    var min = min || 0;
    var max = max || 100;
        data.forEach(function (p1, p2, p3) {
        var availability = parseFloat(p1['Tillg?nglighet'].replace(',','.'));
        var performance = parseFloat(p1['Anl?ggningsutbyte'].replace(',','.'));
        var quality = parseFloat(p1['Kvalitetsutbyte'].replace(',','.'));
        var oee = parseFloat(p1['TAK'].replace(',','.'));
        if(oee >= min && oee <= max ){
            var obj = {
                oee: oee,
                domBarID: 'domBarID' + p2,
                tooltipString: ['Availability', 'Performance', 'Quality'],
                tooltipValue: [availability, performance, quality],
                tooltipValueLoss: [(100-availability).toFixed(2), (100-performance).toFixed(2), (100-quality).toFixed(2)],
                bar: [availability, availability*performance/100, (availability*performance/100)*quality/100]
            };
            var domelement = '<div class="col-md-2 py-3"><div class="card"><div class="card-header bg-inverse text-white"><div class="mx-auto text-center"><h4>'+ obj.oee +'% TAK/OEE</h4></div></div><div id='+ obj.domBarID +' class="card-block m-0"></div><div class="card-footer"><div class="row"></div></div></div></div>';
            $('#OEECard').append(domelement);
            callback(obj);
        }
        else {
            console.log(oee)
        }

    })
}
function oeeBars(obj) {
    var tooltip = d3.select("body").append("div").attr("class", "toolTip");
    var width = $('#'+obj.domBarID).width();
    var height = 100;
    var color = ['red', 'yellow', 'grey'];
    var x = d3.scaleBand()
        .range([0, width]);
    var svg = d3.select('#'+obj.domBarID).append("svg")
        .attr("width", '100%')
        .attr("height", height)
        .style('background', 'black')
        .append("g");
    svg.selectAll('rect')
        .data(obj.bar)
        .enter()
        .append('rect')
        .attr("class", "rect")
        .attr('width', '33.3%')
        .attr('height', function (d) {return 0})
        .attr('x', function (d,i) { return width/3*i })
        .attr('y', function (d) { return height })
        .style('fill', function (d,i) { return color[i] })
        .transition()
        .delay(1000)
        .ease(d3.easeLinear)
        .attr('y', function (d) { return height-d })
        .attr('height', function (d) { return d});

        svg.selectAll('.rect')
        .on("mousemove", function(d, i){
            tooltip
                .style("left", d3.event.pageX + 10 + "px")
                .style("top", d3.event.pageY + 10 + "px")
                .style("display", "inline-block")
                .html('<strong class="text-primary">'+(obj.tooltipString[i])+':</strong><strong> '+ obj.tooltipValue[i] +'%</strong>'
                +'<br><strong class="text-danger"> '+(obj.tooltipString[i])+' loss:</strong><strong> '+ obj.tooltipValueLoss[i] +'%</strong>');
        })
        .on("mouseout", function(d){ tooltip.style("display", "none");});

}