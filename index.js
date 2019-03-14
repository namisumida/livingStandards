function init() {
  // Assign svg variables
  var svg_lifeExpectancy = d3.select("#svg-lifeExpectancy");
  var svg_undernourished = d3.select("#svg-undernourished");
  var svg_other = d3.select("#svg-otherMetrics");
  var svg_healthExpense = d3.select("#svg-healthExpense");

  // Data
  var data_locations = ["WORLD", "UNITED STATES", "LEAST DEVELOPED COUNTRIES"];
  var data_lifeExpectancy = [{year: 1960, value: 53, group:"world"}, {year: 1980, value: 63, group:"world"}, {year: 2000, value: 68, group:"world"}, {year: 2016, value: 72, group:"world"},
                             {year: 1960, value: 70, group:"usa"}, {year: 1980, value: 74, group:"usa"}, {year: 2000, value: 77, group:"usa"}, {year: 2016, value: 79, group:"usa"},
                             {year: 1960, value: 40, group:"ldc"}, {year: 1980, value: 48, group:"ldc"}, {year: 2000, value: 56, group:"ldc"}, {year: 2016, value: 64, group:"ldc"}]
  var data_undernourished = [{year: 2000, value: .15, group:"world"}, {year: 2016, value: .11, group:"world"},
                             {year: 2000, value: .03, group:"usa"}, {year: 2016, value: .03, group:"usa"},
                             {year: 2000, value: .23, group:"ldc"}, {year: 2016, value: .35, group:"ldc"}]
  var data_under5mortality = [{year: 1990, value: 93, group:"world"}, {year: 2000, value: 77, group:"world"}, {year: 2010, value: 52, group:"world"}, {year: 2017, value: 30, group:"world"},
                             {year: 1990, value: 11, group:"usa"}, {year: 2000, value: 8, group:"usa"}, {year: 2010, value: 7, group:"usa"}, {year: 2017, value: 7, group:"usa"},
                             {year: 1990, value: 175, group:"ldc"}, {year: 2000, value: 137, group:"ldc"}, {year: 2010, value: 90, group:"ldc"}, {year: 2017, value: 66, group:"ldc"}]
  var data_maternalMortality = [{year: 1990, value: 385, group:"world"}, {year: 2000, value: 341, group:"world"}, {year: 2010, value: 246, group:"world"}, {year: 2015, value: 174, group:"world"},
                             {year: 1990, value: 12, group:"usa"}, {year: 2000, value: 12, group:"usa"}, {year: 2010, value: 14, group:"usa"}, {year: 2015, value: 14, group:"usa"},
                             {year: 1990, value: 903, group:"ldc"}, {year: 2000, value: 732, group:"ldc"}, {year: 2010, value: 519, group:"ldc"}, {year: 2015, value: 436, group:"ldc"}]
  var data_sanitationUrban = [{year: 2000, value: .78, group:"world"}, {year: 2015, value: .82, group:"world"},
                             {year: 2000, value: 1, group:"usa"}, {year: 2015, value: 1, group:"usa"},
                             {year: 2000, value: .39, group:"ldc"}, {year: 2015, value: .46, group:"ldc"}]
  var data_sanitationRural = [{year: 2000, value: .38, group:"world"}, {year: 2015, value: .5, group:"world"},
                             {year: 2000, value: 1, group:"usa"}, {year: 2015, value: 1, group:"usa"},
                             {year: 2000, value: .17, group:"ldc"}, {year: 2015, value: .26, group:"ldc"}]
  var data_healthExpense = [{year: 2000, value: 473, group:"world"}, {year: 2015, value: 1002, group:"world"},
                            {year: 2000, value: 4562, group:"usa"}, {year: 2015, value: 9536, group:"usa"},
                            {year: 2000, value: 12, group:"ldc"}, {year: 2015, value: 45, group:"ldc"}];

  // Margins
  var w = document.getElementById("svg-lifeExpectancy").getBoundingClientRect().width;
  var marginLeft = 10;
  var marginRight = 10;
  var marginTop = 5;
  var w_locationLabel = (w - marginLeft - marginRight)/3;
  var w_bar = 70;
  var h_maxBar = 275;
  // Height of svgs
  var h_svg = 350;
  document.getElementById("svg-lifeExpectancy").style.height = h_svg + "px";
  document.getElementById("svg-undernourished").style.height = h_svg + "px";
  document.getElementById("svg-otherMetrics").style.height = h_svg + "px";
  document.getElementById("svg-healthExpense").style.height = h_svg + "px";

  ////////////////////////////////////////////////////////////////////////////////
  function setup() {
    // LIFE EXPECTANCY
    svg_lifeExpectancy.selectAll("locationLabel")
                      .data(data_locations)
                      .enter()
                      .append("text")
                      .attr("class", "locationLabel")
                      .attr("x", function(d,i) { return marginLeft + i*(w_locationLabel) + w_locationLabel/2; })
                      .attr("y", 315)
                      .text(function(d) { return d; })
                      .call(wrap, 150);
    svg_lifeExpectancy.selectAll("rect")
                      .data(data_lifeExpectancy)
                      .enter()
                      .append("rect")
                      .attr("class", "lifeExpectancyBars")
                      .attr("x", function(d,i) {
                        if (d.group == "world") { return marginLeft + w_locationLabel/2 - w_bar/2; }
                        else if (d.group == "usa") { return marginLeft + w_locationLabel*1.5 - w_bar/2; }
                        else { return marginLeft + w_locationLabel*2.5 - w_bar/2; }
                      })
                      .attr("y", function(d) { return marginTop + h_maxBar - runBarScale("lifeExpectancy", d.value); })
                      .attr("width", w_bar)
                      .attr("height", function(d) { return runBarScale("lifeExpectancy", d.value); })
    svg_lifeExpectancy.selectAll("line")
                      .data(data_lifeExpectancy)
                      .enter()
                      .append("line")
                      .attr("class", "lineMarkers")
                      .attr("x1", function(d,i) {
                        if (d.group == "world") { return marginLeft + w_locationLabel/2 - w_bar/2; }
                        else if (d.group == "usa") { return marginLeft + w_locationLabel*1.5 - w_bar/2; }
                        else { return marginLeft + w_locationLabel*2.5 - w_bar/2; }
                      })
                      .attr("x2", function(d,i) {
                        if (d.group == "world") { return marginLeft + w_locationLabel/2 + w_bar/2; }
                        else if (d.group == "usa") { return marginLeft + w_locationLabel*1.5 + w_bar/2; }
                        else { return marginLeft + w_locationLabel*2.5 + w_bar/2; }
                      })
                      .attr("y1", function(d) { return marginTop + h_maxBar - runBarScale("lifeExpectancy", d.value); })
                      .attr("y2", function(d) { return marginTop + h_maxBar - runBarScale("lifeExpectancy", d.value); })


    // UNDERNOURISHED

    // OTHER METRICS

    // HEALTH EXPENDITURE

  }; // end setup
  function reset() {
  }; // end reset function
  function resize() {
  }; // end resize function
  function wrap(text, width) { // text wrapping function
    text.each(function () {
      var text = d3.select(this),
          words = text.text().split(/\s+/).reverse(),
          word,
          line = [],
          lineNumber = 0,
          lineHeight = 1.3, // ems
          x = text.attr("x"),
          y = text.attr("y"),
          dy = 0, //parseFloat(text.attr("dy")),
          tspan = text.text(null)
                      .append("tspan")
                      .attr("x", x)
                      .attr("y", y)
                      .attr("dy", dy + "em");
      while (word = words.pop()) {
          line.push(word);
          tspan.text(line.join(" "));
          if (tspan.node().getComputedTextLength() > width) {
              line.pop();
              tspan.text(line.join(" "));
              line = [word];
              tspan = text.append("tspan")
                          .attr("x", x)
                          .attr("y", y)
                          .attr("dy", ++lineNumber * lineHeight + dy + "em")
                          .text(word);
          }
      }
    });
  }; // end wrap function
  d3.selection.prototype.moveToFront = function() {
        return this.each(function(){
          this.parentNode.appendChild(this);
        });
  }; // end moveToFront function
  function runBarScale(type, value) {
    if (type=="lifeExpectancy") { var dataset = data_lifeExpectancy; }
    else if (type=="undernourished") { var dataset = data_undernourished; }
    else if (type=="under5mortality") { var dataset = data_under5mortality; }
    else if (type=="maternalMortality") { var dataset = data_maternalMortality; }
    else if (type=="sanitationUrban") { var dataset = data_sanitationUrban; }
    else if (type=="sanitationRural") { var dataset = data_sanitationRural; }
    else { var dataset = data_healthExpense; };
    var barScale = d3.scaleLinear()
                     .domain([0, d3.max(dataset, function(d) { return d.value; })])
                     .range([0, h_maxBar]);
    return barScale(value);
  }; // end getScale

  setup();

  // Interactivity
  // LDC accordion //// TODO: Change this if I only have 1 accordion
  var accordions = jQuery(".accordion");
  for (var i=0; i<accordions.length; i++) {
    accordions[i].addEventListener("click", function() {
      var panel = this.nextElementSibling;
      if (panel.style.maxHeight) { // if hiding panel
        this.classList.remove("active");
        panel.style.maxHeight = null;
      }
      else { // showing panel
        this.classList.toggle("active");
        panel.style.maxHeight = panel.scrollHeight + "px"; // show the panel clicked on
      }
    })
  }; // end for loop
}; // end init
////////////////////////////////////////////////////////////////////////////////
init();
