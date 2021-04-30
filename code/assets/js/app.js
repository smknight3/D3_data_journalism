// @TODO: YOUR CODE HERE!
$(document).ready(function() {
    makePlot();

    $(window).resize(function() {
        makePlot();
    });
});

function makePlot() {
    d3.csv("assets/data/data.csv").then(function(census_data) {
        console.log(census_data);

        $("#scatter").empty();

        var svgWidth = window.innerWidth;
        var svgHeight = 500;

        var margin = {
            top: 20,
            right: 40,
            bottom: 60,
            left: 50
        };

        var chart_width = svgWidth - margin.left - margin.right;
        var chart_height = svgHeight - margin.top - margin.bottom;

        var svg = d3.select("#scatter")
            .append("svg")
            .attr("width", svgWidth)
            .attr("height", svgHeight)
            .classed("chart", true);

        var chartGroup = svg.append("g")
            .attr("transform", `translate(${margin.left}, ${margin.top})`);

        census_data.forEach(function(row) {
            row.poverty = +row.poverty;
            row.healthcare = +row.healthcare;
        });

        var xScale = d3.scaleLinear()
            .domain(d3.extent(census_data, d => d.poverty))
            .range([0, chart_width]);

        var yScale = d3.scaleLinear()
            .domain(d3.extent(census_data, d => d.healthcare))
            .range([chart_height, 0]);

        var leftAxis = d3.axisLeft(yScale);
        var bottomAxis = d3.axisBottom(xScale);

        chartGroup.append("g")
            .attr("transform", `translate(0, ${chart_height})`)
            .call(bottomAxis);

        chartGroup.append("g")
            .call(leftAxis);


        var circlesGroup = chartGroup.append("g")
            .selectAll("circle")
            .data(census_data)
            .enter()
            .append("circle")
            .attr("cx", d => xScale(d.poverty))
            .attr("cy", d => yScale(d.healthcare))
            .attr("r", "10")
            .attr("fill", "purple")
            .attr("border-color", "black")
            .attr("stroke", "black")
            .attr("stroke-width", "2")
            .classed("stateCircle", true);


        chartGroup.append("text")
            .attr("transform", "rotate(-90)")
            .attr("y", 0 - margin.left + 0)
            .attr("x", 0 - (chart_height / 1.5))
            .attr("dy", "1em")
            .attr("class", "axisText")
            .text("Percentage Without Healthcare");

        chartGroup.append("text")
            .attr("transform", `translate(${chart_width / 2.5}, ${chart_height + margin.top + 30})`)
            .attr("class", "axisText")
            .text("Percentage Poverty");


        var toolTip = d3.tip()
            .attr("class", "d3-tip")
            .offset([180, -60])
            .html(function(d) {
                return (`<strong>${d.state}<strong><hr><strong>Poverty: ${d.poverty}%</strong><hr><strong>Lacks Healthcare: ${d.healthcare}%</strong>`);
            });

        circlesGroup.call(toolTip);

        circlesGroup.on("mouseover", function(event, d) {
                toolTip.show(d, this);

            })
            .on("mouseout", function(event, d) {
                toolTip.hide(d);

                d3.select(this)
                    .transition()
                    .duration(1000)
                    .attr("r", 15);
            });



    }).catch(function(error) {
        console.log(error);
    });
}