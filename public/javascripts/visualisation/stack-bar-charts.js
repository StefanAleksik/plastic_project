/**
 * Created by Stefan Aleksik on 26.7.2017.
 */
$(document).ready(function () {
    $.ajax({
        dataType: 'json',
        method: 'GET',
        url: 'http://localhost:3000/data',
        success: function (data) {
            stackBarChartProducedAmount(data);
            TAKcards(data, function (obj) {
                oeeBars(obj)
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
function stackBarChartProducedAmount(data) {
    var arrey =[];
    var arrayOrders = [];
    data.forEach(function (p1, p2, p3) {
        if(true) {
            var obj = {
                order: 'no: ' + p2 + ' ' + p1['Ordernummer'],
                approved: p1['Godk?nd m?ngd'],
                rejected: p1['Kasserad m?ngd'],
                revised: p1['Omarbetad m?ngd']
            };
            arrey.push(obj);
            arrayOrders.push('no: ' + p2 + ' ' + p1['Ordernummer']);
        }
    });
    var keys = ['approved', 'rejected', 'revised'];
    var margin = {top: 20, right: 20, bottom: 30, left: 50},
        width = 960 - margin.left - margin.right,
        height = 500 - margin.top - margin.bottom,
        xScale = d3.scaleBand().range([0, width]).padding(0.1),
        yScale = d3.scaleLinear().range([height, 0]),
        color = d3.scaleOrdinal(d3.schemeCategory10),
        xAxis = d3.axisBottom(xScale),
        yAxis =  d3.axisLeft(yScale),
        svg = d3.select("#stacked-bar-chart").append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            .append("g")
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    var stack = d3.stack()
        .keys(keys)
        .order(d3.stackOrderNone)
        .offset(d3.stackOffsetNone);

    var layers= stack(arrey);
    //arrey.sort(function(a, b) { return b.total - a.total; });
    xScale.domain(arrey.map(function(d) { return d.order; }));
    yScale.domain([0, d3.max(layers[layers.length - 1], function(d) { return d[0] + d[1]; }) ]).nice();

    //console.log(layers);

    var layer = svg.selectAll(".layer")
        .data(layers)
        .enter().append("g")
        .attr("class", "layer")
        .style("fill", function(d, i) { return color(i);});

    var rect = layer.selectAll("rect")
        .data(function(d) { return d; });

        rect
            .enter().append("rect")
            //.transition().duration(750)
            .attr("x", function(d) { return xScale(d.data.order); })
            .attr("y", function(d) { return yScale(d[1]); })
            .attr("height", function(d) { return yScale(d[0]) - yScale(d[1]); })
            .attr("width", xScale.bandwidth());

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
        .call(yAxis);
function update(data) {
$('.cluster').on('click', function () {
    var clusterValue = this.getAttribute('value');
    var array = [];
    data.forEach(function (p1, p2, p3) {
        if(p1['Cluster labels'] == clusterValue){
            var obj = {
                order: 'no: ' + p2 + ' ' + p1['Ordernummer'],
                approved: p1['Godk?nd m?ngd'],
                rejected: p1['Kasserad m?ngd'],
                revised: p1['Omarbetad m?ngd']
            };
            array.push(obj);
            //arrayOrders.push('no: ' + p2 + ' ' + p1['Ordernummer']);
        }
    });

    layers= stack(array);
    //arrey.sort(function(a, b) { return b.total - a.total; });
    xScale.domain(array.map(function(d) { return d.order; }));
    yScale.domain([0, d3.max(layers[layers.length - 1], function(d) { return d[0] + d[1]; }) ]).nice();

    layer = d3.selectAll('.layer').data(layers);
    rect = layer.selectAll('rect').data(function (d) { return d });

    //rect.exit().remove();
    //layer.exit().remove();

    layer.enter().append("g")
        .attr("class", "layer")
        .style("fill", function(d, i) { return color(i);});

    rect.enter().append("rect")
        .attr("x", function(d) { return xScale(d.data.order); })
        .attr("y", function(d) { return yScale(d[1]); })
        .attr("height", function(d) { return yScale(d[0]) - yScale(d[1]); })
        .attr("width", xScale.bandwidth());
    console.log(layer);
    console.log(rect);

    layer.exit().remove();
    rect.exit().remove();
    svg.selectAll('.axis').remove();

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
        .call(yAxis);

})
}
update(data);
}
function TAKcards(data, callback) {
    data.forEach(function (p1, p2, p3) {
        var availability = parseFloat(p1['Tillg?nglighet'].replace(',','.'));
        var performance = parseFloat(p1['Anl?ggningsutbyte'].replace(',','.'));
        var quality = parseFloat(p1['Kvalitetsutbyte'].replace(',','.'));
        var obj = {
            oee: p1['TAK'],
            availability: availability,
            performance: performance,
            quality: quality,
            domBarID: 'domBarID' + p2,
            bar: [availability, availability*performance/100, (availability*performance/100)*quality/100]
        };
        var domelement = '<div class="col-md-3 py-3"><div class="card"><div class="card-header bg-inverse text-white"><div class="mx-auto text-center"><h3>'+ obj.oee +'%</h3><h4>TAK/OEE</h4></div></div><div id='+ obj.domBarID +' class="card-block p-0 m-0"></div><div class="card-footer"><div class="row"></div></div></div></div>';
        $('#TAKCard').append(domelement);
        callback(obj);
    })
}
function oeeBars(obj) {
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
        .attr('width', '33.3%')
        .attr('height', function (d) {return d})
        .attr('x', function (d,i) { return width/3*i })
        .attr('y', function (d) { return height-d })
        .style('fill', function (d,i) { return color[i] })

}