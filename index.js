function init() {
  // Assign svg variables
  var svg_lifeExpectancy_comp = d3.select("#svg-lifeExpectancy_comp");
  var svg_lifeExpectancy_topline = d3.select("#svg-lifeExpectancy_topline");
  var svg_lifeExpectancy_timeline = d3.select("#svg-lifeExpectancy_timeline");
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
  var w = document.getElementById("svg-lifeExpectancy_comp").getBoundingClientRect().width;
  var marginLeft = 10;
  var marginRight = 10;
  var marginTop = 5;
  // Margins for topline
  var w_maxDot = w - marginRight - marginLeft;
  // Margins for comparison view
  var w_locationLabel = (w - marginLeft - marginRight)/3;
  var w_bar = 70;
  var h_maxBar = 275;
  // Height of svgs
  var h_svgComp = 350;
  var h_svgTopline = 80;
  var h_svgTimeline = 310;
  document.getElementById("svg-lifeExpectancy_topline").style.height = h_svgTopline + "px";
  document.getElementById("svg-lifeExpectancy_timeline").style.height = h_svgTimeline + "px";
  document.getElementById("svg-lifeExpectancy_comp").style.height = h_svgComp + "px";
  document.getElementById("svg-undernourished").style.height = h_svgComp + "px";
  document.getElementById("svg-otherMetrics").style.height = h_svgComp + "px";
  document.getElementById("svg-healthExpense").style.height = h_svgComp + "px";
  // Colors
  var backgroundGray = d3.color("#F1F1F1");
  var blue = d3.color("#669BB5");
  var lightBlue = d3.color("#D6ECFD");
  var accentColor = d3.color("#FC5742");

  ////////////////////////////////////////////////////////////////////////////////
  function setup() {
    // LIFE EXPECTANCY
    // Topline; all countries
    var dataset_lifeExpectancy = dataset_countries.filter(function(d) { return !isNaN(d.lifeExpectancy_latest); });
    var lifeExpectancy_highlights = [d3.min(dataset_countries, function(d) { return d.lifeExpectancy_latest; }), d3.max(dataset_countries, function(d) { return d.lifeExpectancy_latest; }), 72];
    svg_lifeExpectancy_topline.selectAll("toplineDots")
                               .data(dataset_lifeExpectancy.sort(function(a,b) { return b.lifeExpectancy_latest - a.lifeExpectancy_latest; }))
                               .enter()
                               .append("circle")
                               .attr("class", "toplineDots")
                               .attr("r", 7)
                               .attr("cx", function(d) { return runDotScale("lifeExpectancy", d.lifeExpectancy_latest); })
                               .attr("cy", 20)
                               .style("stroke", function(d) {
                                 if (lifeExpectancy_highlights.includes(d.lifeExpectancy_latest)) { return accentColor; }
                               })
                               .style("stroke-width", function(d) {
                                 if (lifeExpectancy_highlights.includes(d.lifeExpectancy_latest)) { return 4; }
                               });
    svg_lifeExpectancy_topline.append("line")
                               .attr("class", "avgLine")
                               .attr("x1", runDotScale("lifeExpectancy", 72))
                               .attr("x2", runDotScale("lifeExpectancy", 72))
                               .attr("y1", 5)
                               .attr("y2", 35);
    svg_lifeExpectancy_topline.selectAll("highlightText")
                               .data(lifeExpectancy_highlights)
                               .enter()
                               .append("text")
                               .attr("class", "highlightText")
                               .attr("x", function(d) { return runDotScale("lifeExpectancy", d); })
                               .attr("y", 50)
                               .text(function(d,i) {
                                 if (i == 0) { return "Minimum: " + Math.round(d); }
                                 else if (i == 1) { return "Maximum: " + Math.round(d); }
                                 else { return "Average: " + Math.round(d); }
                               })
                               .call(wrap, 70);
    svg_lifeExpectancy_topline.selectAll("axisLabel")
                               .data([60, 80])
                               .enter()
                               .append("text")
                               .attr("class", "axisLabel")
                               .attr("x", function(d) { return runDotScale("lifeExpectancy", d); })
                               .attr("y", 50)
                               .text(function(d) { return d; });
    // Timeline; random set of countries
    var randomArray = randomGenerate(20, dataset_lifeExpectancy.length);
    var random_lifeExpectancy = dataset_lifeExpectancy.filter(function(d,i) { return randomArray.includes(i); });
    svg_lifeExpectancy_timeline.selectAll("circle")
                                .data(random_lifeExpectancy.sort(function(a,b) { return b.lifeExpectancy_latest - a.lifeExpectancy_latest; }))
                                .enter()
                                .append("circle")
                                .attr("class", "toplineDots")
                                .attr("r", 7)
                                .attr("cx", function(d) { return runDotScale("lifeExpectancy", d.lifeExpectancy_latest); })
                                .attr("cy", function(d,i) { return 10 + (i*15); })
    // Comparison
    svg_lifeExpectancy_comp.selectAll("locationLabel")
                            .data(data_locations)
                            .enter()
                            .append("text")
                            .attr("class", "locationLabel")
                            .attr("x", function(d,i) { return marginLeft + i*(w_locationLabel) + w_locationLabel/2; })
                            .attr("y", 315)
                            .text(function(d) { return d; })
                            .call(wrap, 150);
    svg_lifeExpectancy_comp.selectAll("rect")
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
    svg_lifeExpectancy_comp.selectAll("line")
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
  function runDotScale(type, value) {
    if (type=="lifeExpectancy") { var variable = "lifeExpectancy_latest"; }
    else if (type=="undernourished") { var variable = "lifeExpectancy_latest"; }
    else if (type=="under5mortality") { var variable = "lifeExpectancy_latest"; }
    else if (type=="maternalMortality") { var variable = "lifeExpectancy_latest"; }
    else if (type=="sanitationUrban") { var variable = "lifeExpectancy_latest"; }
    else if (type=="sanitationRural") { var variable = "lifeExpectancy_latest"; }
    else { var variable = "lifeExpectancy_latest"; }
    var dotScale = d3.scaleLinear()
                     .domain([45, d3.max(dataset_countries, function(d) { return d[variable]; })])
                     .range([marginLeft, w_maxDot-20]);
    return dotScale(value);
  }; // end runDotScale
  function randomGenerate(length, max) {
    var array = [];
    while (array.length < length) {
      var random = Math.floor(Math.random()*max);
      if (array.indexOf(random) === -1) { array.push(random); }
    }
    return array;
  }
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
function rowConverter(d) {
  return {
    countryCode: d.countryCode,
    countryName: d.countryName,
    ldc: parseInt(d.ldc),
    undernourished_old: parseFloat(d.undernourished2000),
    undernourished_latest: parseFloat(d.undernourished2016),
    under5_old: parseFloat(d.under5_1960),
    under5_latest: parseFloat(d.under5_2017),
    sanitationUrban_old: parseFloat(d.sanitationUrban2000),
    sanitationUrban_latest: parseFloat(d.sanitationUrban2015),
    sanitationRural_old: parseFloat(d.sanitationRural2000),
    sanitationRural_latest: parseFloat(d.sanitationRural2015),
    lifeExpectancy_old: parseFloat(d.lifeExpectancy1960),
    lifeExpectancy_latest: parseFloat(d.lifeExpectancy2016),
    healthExpenditure_old: parseFloat(d.healthExpenditure2000),
    healthExpenditure_latest: parseFloat(d.healthExpenditure2015),
    maternal_old: parseFloat(d.maternal1990),
    maternal_latest: parseFloat(d.maternal2015),
  }
}; // end rowConverter
d3.csv("Data & analysis/Data files/merged.csv", rowConverter, function(data) {
  dataset_countries = data;
  init();
})
