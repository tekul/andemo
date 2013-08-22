function fvcPieChart() {
  var width = 500,
      height = 500,
      r      = 200,
      minSlice = 0.007,
      xValue = function(d) { return d[0]; },
      yValue = function(d) { return +d[1]; };

  function chart(selection) {
    selection.each(function(data) {
      // Convert data to standard representation greedily;
      // this is needed for nondeterministic accessors.
      data = data.map(function(d, i) {
        return [xValue.call(data, d, i), yValue.call(data, d, i)];
      });

      var total = d3.sum(data, function(d) { return d[1]; });
      var otherTotal = 0;

      // Add anything less than minSlice to "other"
      data = data.filter(function(d) {
        var bigEnough = d[1]/total >= minSlice;
        if (!bigEnough) {
          otherTotal += d[1];
        }
        return bigEnough;
      });

      data.push(["other", otherTotal]);

      var svg = d3.select(this).selectAll("svg").data([data]);

      var color = d3.scale.category20c();

      svg.enter()
        .append("svg")
        .append("g");
      svg.attr("width", width);
      svg.attr("height", height);

      var g = svg.select("g")
          .attr("transform", "translate(" + width/2 + "," + height/2 + ")");
      //var r = Math.min(width, height) / 2;

      var arc = d3.svg.arc()
          .outerRadius(r - 10)
          .innerRadius(0);

      var pie = d3.layout.pie()
          .sort(null)
          .value(function(d) { return d[1]; });

      var pieData = pie(data);

      g.selectAll(".arc").remove();
      var arcs = g.selectAll(".arc")
          .data(pieData);

      arcs.enter().append("g")
          .attr("class", "arc");

      arcs.append("path")
          .attr("d", arc)
          .style("fill", function(d) { return color(d.data[0]); });

      g.selectAll("line").remove();

      var lines = g.selectAll("line").data(pieData);
      lines.enter().append("line")
        .attr("x1", 0)
        .attr("x2", 0)
        .attr("y1", -r-3)
        .attr("y2", -r-8)
        .attr("stroke", "gray")
        .attr("transform", function(d) {
          return "rotate(" + (d.startAngle+d.endAngle)/2 * (180/Math.PI) + ")";
        });

      var textOffset = 14;
      arcs.append("text")
        .attr("transform", function(d) {
              var centroid = arc.centroid(d),
                  x = centroid[0],
                  y = centroid[1];
          return "translate(" + 2.3*x  + "," + 2.3*y + ")"; })
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

  chart.r = function(_) {
    if (!arguments.length) return r;
    r = _;
    return chart;
  };

  chart.minSlice = function(_) {
    if (!arguments.length) return minSlice;
    minSlice = _;
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
