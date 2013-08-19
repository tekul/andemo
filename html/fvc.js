function fvcPieChart() {
  var width = 960,
      height = 500,
      xValue = function(d) { return d[0]; },
      yValue = function(d) { return +d[1]; };

  var color = d3.scale.ordinal()
      .range(["#98abc5", "#8a89a6", "#7b6888", "#6b486b", "#a05d56", "#d0743c", "#ff8c00"]);

  function chart(selection) {
    selection.each(function(data) {
      // Convert data to standard representation greedily;
      // this is needed for nondeterministic accessors.
      data = data.map(function(d, i) {
        return [xValue.call(data, d, i), yValue.call(data, d, i)];
      });

      var svg = d3.select(this).selectAll("svg").data([data]);

      svg.enter()
        .append("svg")
        .append("g");
      svg.attr("width", width);
      svg.attr("height", height);

      var g = svg.select("g")
          .attr("transform", "translate(" + width/2 + "," + height/2 + ")");
      var radius = Math.min(width, height) / 2;

      var arc = d3.svg.arc()
          .outerRadius(radius - 10)
          .innerRadius(0);

      var pie = d3.layout.pie()
          .sort(null)
          .value(function(d) { return d[1]; });
      
      g.selectAll(".arc").remove();
      var arcs = g.selectAll(".arc")
          .data(pie(data));

      arcs.enter().append("g")
          .attr("class", "arc");
      arcs.exit().remove();

      arcs.append("path")
          .attr("d", arc)
          .style("fill", function(d) { return color(d.data[0]); });

      arcs.append("text")
          .attr("transform", function(d) { return "translate(" + arc.centroid(d) + ")"; })
          .attr("dy", ".35em")
          .style("text-anchor", "middle")
          .text(function(d) { return d.data[0]; });
 
   });
  }

  chart.width = function(_) {
    if (!arguments.length) return width;
    width = _;
    return chart;
  };

  chart.height = function(_) {
    if (!arguments.length) return height;
    height = _;
    return chart;
  };

  chart.x = function(_) {
    if (!arguments.length) return xValue;
    xValue = _;
    return chart;
  };

  chart.y = function(_) {
    if (!arguments.length) return yValue;
    yValue = _;
    return chart;
  };

  return chart;
}
