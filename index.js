function init() {
  // Assign svg variables
  var svg_lifeExpectancy_topline = d3.select("#svg-lifeExpectancy_topline");
  var svg_lifeExpectancy_timeline = d3.select("#svg-lifeExpectancy_timeline");
  var svg_lifeExpectancy_comp = d3.select("#svg-lifeExpectancy_comp");
  var svg_lifeExpectancy_comp2 = d3.select("#svg-lifeExpectancy_comp2");
  var svg_undernourished = d3.select("#svg-undernourished");
  var svg_other = d3.select("#svg-otherMetrics");
  var svg_healthExpense = d3.select("#svg-healthExpense");
  // Dataset
  var random_lifeExpectancy;
  var sort;
  // Margins
  var w = document.getElementById("svg-lifeExpectancy_comp").getBoundingClientRect().width;
  var marginLeft = 10;
  var marginRight = 10;
  var marginTop = 5;
  // Margins for topline
  var w_maxDot = w - marginRight - marginLeft;
  // Margins for timeline
  var marginLeftMore = 30;
  // Margins for comparison view
  var w_locationLabel = (w - marginLeft - marginRight)/3;
  var w_bar = 70;
  var h_maxBar = 275;
  // Height of svgs
  var h_svgTopline = 80;
  var h_svgTimeline = 500;
  var h_svgComp = 80;
  document.getElementById("svg-lifeExpectancy_topline").style.height = h_svgTopline + "px";
  document.getElementById("svg-lifeExpectancy_timeline").style.height = h_svgTimeline + "px";
  document.getElementById("svg-lifeExpectancy_comp").style.height = h_svgComp + "px";
  document.getElementById("svg-lifeExpectancy_comp2").style.height = h_svgTimeline + "px";
  document.getElementById("svg-undernourished").style.height = h_svgComp + "px";
  document.getElementById("svg-otherMetrics").style.height = h_svgComp + "px";
  document.getElementById("svg-healthExpense").style.height = h_svgComp + "px";
  // Colors
  var backgroundGray = d3.color("#F1F1F1");
  var blue = d3.color("#669BB5");
  var babyBlue = d3.color("#D6ECFD");
  var accentColor = d3.color("#FC5742");
  var lightBlue = d3.color("#BACFDA");
  var yellow = d3.color("#E2CA84");

  ////////////////////////////////////////////////////////////////////////////////
  function setup() {
    // LIFE EXPECTANCY
    // Topline; all countries
    var lifeExpectancy_highlights = [d3.min(dataset_countries, function(d) { return d.lifeExpectancy_latest; }), d3.max(dataset_countries, function(d) { return d.lifeExpectancy_latest; }), 72];
    svg_lifeExpectancy_topline.selectAll("toplineDots")
                               .data(dataset_countries.filter(function(d) { return !isNaN(d.lifeExpectancy_latest); }).sort(function(a,b) { return b.lifeExpectancy_latest - a.lifeExpectancy_latest; }))
                               .enter()
                               .append("circle")
                               .attr("class", "toplineDots")
                               .attr("r", 7)
                               .attr("cx", function(d) { return runDotScale("lifeExpectancy", d.lifeExpectancy_latest, "topline"); })
                               .attr("cy", 20)
                               .style("stroke", function(d) {
                                 if (lifeExpectancy_highlights.includes(d.lifeExpectancy_latest)) { return accentColor; }
                               })
                               .style("stroke-width", function(d) {
                                 if (lifeExpectancy_highlights.includes(d.lifeExpectancy_latest)) { return 4; }
                               });
    svg_lifeExpectancy_topline.append("line")
                               .attr("class", "avgLine")
                               .attr("x1", runDotScale("lifeExpectancy", 72, "topline"))
                               .attr("x2", runDotScale("lifeExpectancy", 72, "topline"))
                               .attr("y1", 5)
                               .attr("y2", 35);
    svg_lifeExpectancy_topline.selectAll("highlightText")
                               .data(lifeExpectancy_highlights)
                               .enter()
                               .append("text")
                               .attr("class", "highlightText")
                               .attr("x", function(d) { return runDotScale("lifeExpectancy", d, "topline"); })
                               .attr("y", 50)
                               .text(function(d,i) {
                                 if (i == 0) { return "Minimum: " + Math.round(d); }
                                 else if (i == 1) { return "Maximum: " + Math.round(d); }
                                 else { return "Average: " + Math.round(d); }
                               })
                               .call(wrap, 70);
    // Timeline; random set of countries
    var dataset_lifeExpectancy20 = dataset_countries.filter(function(d) { return !isNaN(d.lifeExpectancy_old); })
    var randomArray = randomGenerate(20, dataset_lifeExpectancy20.length);
    random_lifeExpectancy = dataset_lifeExpectancy20.filter(function(d,i) { return randomArray.includes(i); }).sort(function(a,b) { return b.lifeExpectancy_latest - a.lifeExpectancy_latest; });
    svg_lifeExpectancy_timeline.selectAll("lineMarkers")
                               .data([63,52,72,84])
                               .enter()
                               .append("line")
                               .attr("class", "lineMarkers_timeline")
                               .attr("x1", function(d) { return runDotScale("lifeExpectancy", d, "timeline"); })
                               .attr("x2", function(d) { return runDotScale("lifeExpectancy", d, "timeline"); })
                               .attr("y1", 20)
                               .attr("y2", h_svgTimeline-35)
                               .style("stroke", function(d,i) {
                                 if (i==0) { return yellow; }
                                 else { return blue; }
                               });
    svg_lifeExpectancy_timeline.selectAll("lineMarkerLabels")
                               .data([63,52,72,84])
                               .enter()
                               .append("text")
                               .attr("class", "lineMarkerLabels")
                               .attr("x", function(d) { return runDotScale("lifeExpectancy", d, "timeline"); })
                               .attr("y", h_svgTimeline-20)
                               .text(function(d,i) {
                                 if (i==0) { return "1960 global avg"; }
                                 else if (i==1) { return "2016 global min"; }
                                 else if (i==1) { return "2016 global avg"; }
                                 else { return "2016 global max"}
                               })
                               .call(wrap, 60)
                               .style("fill", function(d,i) {
                                 if (i==0) { return yellow; }
                                 else { return blue; }
                               });
    svg_lifeExpectancy_timeline.selectAll("timelineGroup")
                               .data(random_lifeExpectancy)
                               .enter()
                               .append("g")
                               .attr("class", "timelineGroup");
    svg_lifeExpectancy_timeline.selectAll(".timelineGroup")
                               .append("rect")
                               .attr("class", "timelineRect")
                               .attr("x", function(d) { return runDotScale("lifeExpectancy", d.lifeExpectancy_old, "timeline"); })
                               .attr("y", function(d,i) { return 19 + (i*22); })
                               .attr("height", 12)
                               .attr("width", function(d) { return runDotScale("lifeExpectancy", d.lifeExpectancy_latest, "timeline") - runDotScale("lifeExpectancy", d.lifeExpectancy_old, "timeline"); });
    svg_lifeExpectancy_timeline.selectAll(".timelineGroup")
                               .append("circle")
                               .attr("class", "timelineDots_old")
                               .attr("r", 7)
                               .attr("cx", function(d) { return runDotScale("lifeExpectancy", d.lifeExpectancy_old, "timeline"); })
                               .attr("cy", function(d,i) { return 25 + (i*22); });
    svg_lifeExpectancy_timeline.selectAll(".timelineGroup")
                                .append("circle")
                                .attr("class", "timelineDots")
                                .attr("r", 7)
                                .attr("cx", function(d) { return runDotScale("lifeExpectancy", d.lifeExpectancy_latest); })
                                .attr("cy", function(d,i) { return 25 + (i*22); });
    svg_lifeExpectancy_timeline.selectAll(".timelineGroup")
                               .append("text")
                               .attr("class", "timelineLabels")
                               .text(function(d) {
                                 if (d.countryName == "Federated States of Micronesia") { return "Micronesia"; }
                                 else if (d.countryName == "St. Vincent and the Grenadines") { return "St. Vincent & Grenadines"; }
                                 else { return d.countryName; }
                               })
                               .attr("x", function(d) {
                                 if (runDotScale("lifeExpectancy", d.lifeExpectancy_latest, "timeline") - runDotScale("lifeExpectancy", d.lifeExpectancy_old, "timeline") > 90) { return runDotScale("lifeExpectancy", d.lifeExpectancy_old, "timeline") + 10; }
                                 else { return runDotScale("lifeExpectancy", d.lifeExpectancy_old, "timeline") - 10; }
                               })
                               .attr("y", function(d,i) { return 29 + (i*22)})
                               .style("text-anchor", function(d) {
                                 if (runDotScale("lifeExpectancy", d.lifeExpectancy_latest, "timeline") - runDotScale("lifeExpectancy", d.lifeExpectancy_old, "timeline") > 90) { return "start"; }
                                 else { return "end"; }
                               });
    svg_lifeExpectancy_timeline.selectAll("axisLabel")
                               .data(["1960", "2016"])
                               .enter()
                               .append("text")
                               .attr("class", "axisLabel")
                               .text(function(d) { return d; })
                               .attr("x", function(d,i) {
                                 if (i==0) { return runDotScale("lifeExpectancy", random_lifeExpectancy[0].lifeExpectancy_old, "timeline"); }
                                 else { return runDotScale("lifeExpectancy", random_lifeExpectancy[0].lifeExpectancy_latest, "timeline"); }
                               })
                               .attr("y", 10);
    // on click
    svg_lifeExpectancy_timeline.selectAll(".timelineGroup")
                               .on("mouseover", function(d) {
                                 var currGroup = d3.select(this);
                                 currGroup.select(".timelineDots").style("fill", accentColor);
                                 currGroup.select(".timelineDots_old").style("fill", accentColor);
                                 currGroup.append("text")
                                          .attr("class", "axisLabel")
                                          .text(function(d) { return Math.round(d.lifeExpectancy_old); })
                                          .attr("x", function(d) {
                                            if (runDotScale("lifeExpectancy", d.lifeExpectancy_latest, "timeline") - runDotScale("lifeExpectancy", d.lifeExpectancy_old, "timeline") > 90) { return parseFloat(currGroup.select(".timelineDots_old").attr("cx"))-15; }
                                            else { return parseFloat(currGroup.select(".timelineDots_old").attr("cx"))+10; }
                                          })
                                          .attr("y", parseFloat(currGroup.select(".timelineLabels").attr("y")))
                                          .style("text-anchor", function(d) {
                                            if (runDotScale("lifeExpectancy", d.lifeExpectancy_latest, "timeline") - runDotScale("lifeExpectancy", d.lifeExpectancy_old, "timeline") > 90) { return "end"; }
                                            else { return "start"; }
                                          })
                                          .style("fill", accentColor);
                                currGroup.append("text")
                                         .attr("class", "axisLabel")
                                         .text(function(d) { return Math.round(d.lifeExpectancy_latest); })
                                         .attr("x", parseFloat(currGroup.select(".timelineDots").attr("cx"))+15)
                                         .attr("y", parseFloat(currGroup.select(".timelineLabels").attr("y")))
                                         .style("text-anchor", "start")
                                         .style("fill", accentColor);
                               })
                               .on("mouseout", function() {
                                 var currGroup = d3.select(this);
                                 currGroup.select(".timelineDots").style("fill", blue);
                                 currGroup.select(".timelineDots_old").style("fill", yellow);
                                 currGroup.selectAll(".axisLabel").remove();
                               })
    // Comparison
    svg_lifeExpectancy_comp.selectAll("compGroup")
                           .data([{"country": "USA", "old": 70, "latest": 79}, {"country": "LDC", "old": 40, "latest": 64}])
                           .enter()
                           .append("g")
                           .attr("class", "compAvgGroup");
    svg_lifeExpectancy_comp.selectAll(".compAvgGroup")
                           .append("rect")
                           .attr("class", "timelineRect")
                           .attr("x", function(d) { return runDotScale("lifeExpectancy", d.old, "timeline"); })
                           .attr("y", function(d,i) { return 4 + (i*30); })
                           .attr("height", 12)
                           .attr("width", function(d) { return runDotScale("lifeExpectancy", d.latest, "timeline") - runDotScale("lifeExpectancy", d.old, "timeline"); });
    svg_lifeExpectancy_comp.selectAll(".compAvgGroup")
                           .append("circle")
                           .attr("class", "timelineDots_old")
                           .attr("cx", function(d) { return runDotScale("lifeExpectancy", d.old, "timeline"); })
                           .attr("cy", function(d,i) { return 10 + i*30; })
                           .attr("r", 7);
    svg_lifeExpectancy_comp.selectAll(".compAvgGroup")
                           .append("circle")
                           .attr("class", "timelineDots")
                           .attr("cx", function(d) { return runDotScale("lifeExpectancy", d.latest, "timeline"); })
                           .attr("cy", function(d,i) { return 10 + i*30; })
                           .attr("r", 7);
    svg_lifeExpectancy_comp.selectAll(".compAvgGroup")
                           .append("text")
                           .attr("class", "timelineLabels")
                           .text(function(d,i) {
                             if (i==0) { return "USA"; }
                             else { return "Least developed countries (avg)"; }
                           })
                           .attr("x", function(d) {
                             if (runDotScale("lifeExpectancy", d.latest, "timeline") - runDotScale("lifeExpectancy", d.old, "timeline") > 90) { return runDotScale("lifeExpectancy", d.old, "timeline") + 10; }
                             else { return runDotScale("lifeExpectancy", d.old, "timeline") - 10; }
                           })
                           .attr("y", function(d,i) { return 14 + i*30; })
                           .style("text-anchor", function(d) {
                             if (runDotScale("lifeExpectancy", d.latest, "timeline") - runDotScale("lifeExpectancy", d.old, "timeline") > 90) { return "start"; }
                             else { return "end"; }
                           });
    svg_lifeExpectancy_comp.selectAll(".compAvgGroup")
                           .append("text")
                           .attr("class", "axisLabel")
                           .text(function(d) { return Math.round(d.old); })
                           .attr("x", function(d) {
                             if (runDotScale("lifeExpectancy", d.latest, "timeline") - runDotScale("lifeExpectancy", d.old, "timeline") > 90) { return runDotScale("lifeExpectancy", d.old, "timeline")-15; }
                             else { return runDotScale("lifeExpectancy", d.old, "timeline")+10; }
                           })
                           .attr("y", function(d,i) { return 14 + i*30; })
                           .style("text-anchor", function(d) {
                             if (runDotScale("lifeExpectancy", d.latest, "timeline") - runDotScale("lifeExpectancy", d.old, "timeline") > 90) { return "end"; }
                             else { return "start"; }
                           })
                           .style("fill", yellow);
    svg_lifeExpectancy_comp.selectAll(".compAvgGroup")
                           .append("text")
                           .attr("class", "axisLabel")
                           .text(function(d) { return Math.round(d.latest); })
                           .attr("x", function(d) {
                             if (runDotScale("lifeExpectancy", d.latest, "timeline") - runDotScale("lifeExpectancy", d.old, "timeline") > 90) { return runDotScale("lifeExpectancy", d.latest, "timeline")+15; }
                             else { return runDotScale("lifeExpectancy", d.latest, "timeline")-15; }
                           })
                           .attr("y", function(d,i) { return 14 + i*30; })
                           .style("text-anchor", function(d) {
                             if (runDotScale("lifeExpectancy", d.latest, "timeline") - runDotScale("lifeExpectancy", d.old, "timeline") > 90) { return "start"; }
                             else { return "end"; }
                           })
                           .style("fill", blue);
    var dataset_lifeExpectancyComp = dataset_countries.filter(function(d) { return !isNaN(d.lifeExpectancy_latest) & d.ldc == 1; }).sort(function(a,b) { return b.lifeExpectancy_latest - a.lifeExpectancy_latest; });
    svg_lifeExpectancy_comp.selectAll("compLDCgroup")
                           .data(dataset_lifeExpectancyComp)
                           .enter()
                           .append("g")
                           .attr("class", "compGroup");
    svg_lifeExpectancy_comp.selectAll(".compGroup")
                           .append("circle")
                           .attr("class", "toplineDots")
                           .attr("r", 7)
                           .attr("cx", function(d) { return runDotScale("lifeExpectancy", d.lifeExpectancy_latest, "timeline"); })
                           .attr("cy", 70);
    svg_lifeExpectancy_comp.selectAll(".compGroup")
                           .append("circle")
                           .attr("class", "timelineDots_old")
                           .attr("r", 7)
                           .attr("cx", function(d) { return runDotScale("lifeExpectancy", d.lifeExpectancy_old, "timeline"); })
                           .attr("cy", 70)
                           .style("opacity", 0.3);






    // UNDERNOURISHED

    // OTHER METRICS

    // HEALTH EXPENDITURE

  }; // end setup
  function reset() {
    sort = "metric";
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
  function runDotScale(metric, value, type) {
    if (metric=="lifeExpectancy") {
      if (type=="topline") { var min = d3.min(dataset_countries, function(d) { return d.lifeExpectancy_latest; }); }
      else { var min = d3.min(dataset_countries, function(d) { return d.lifeExpectancy_old; }); }
      var max = d3.max(dataset_countries, function(d) { return d.lifeExpectancy_latest; });
    }
    else if (metric=="undernourished") {
      if (type=="topline") { var min = d3.min(dataset_countries, function(d) { return d.undernourished_latest; }); }
      else { var min = d3.min(dataset_countries, function(d) { return d.undernourished_old; }); }
      var max = d3.max(dataset_countries, function(d) { return d.undernourished_old; })
    }
    else if (metric=="under5mortality") {
      if (type=="topline") { var min = d3.min(dataset_countries, function(d) { return d.under5_latest; }); }
      else { var min = d3.min(dataset_countries, function(d) { return d.under5_old; }); }
      var max = d3.max(dataset_countries, function(d) { return d.under5_old; })
    }
    else if (metric=="maternalMortality") {
      if (type=="topline") { var min = d3.min(dataset_countries, function(d) { return d.maternal_latest; }); }
      else { var min = d3.min(dataset_countries, function(d) { return d.maternal_old; }); }
      var max = d3.max(dataset_countries, function(d) { return d.maternal_old; })
    }
    else if (metric=="sanitationUrban") {
      if (type=="topline") { var min = d3.min(dataset_countries, function(d) { return d.sanitationUrban_latest; }); }
      else { var min = d3.min(dataset_countries, function(d) { return d.sanitationUrban_old; }); }
      var max = d3.max(dataset_countries, function(d) { return d.sanitationUrban_latest; })
    }
    else if (metric=="sanitationRural") {
      if (type=="topline") { var min = d3.min(dataset_countries, function(d) { return d.sanitationRural_latest; }); }
      else { var min = d3.min(dataset_countries, function(d) { return d.sanitationRural_old; }); }
      var max = d3.max(dataset_countries, function(d) { return d.sanitationRural_latest; })
    }
    else {
      if (type=="topline") { var min = d3.min(dataset_countries, function(d) { return d.healthExpenditure_latest; }); }
      else { var min = d3.min(dataset_countries, function(d) { return d.healthExpenditure_old; }); }
      var max = d3.max(dataset_countries, function(d) { return d.healthExpenditure_latest; })
    }
    var dotScale = d3.scaleLinear()
                     .domain([min, max])
                     .range([marginLeftMore, w_maxDot-marginRight]);
    return dotScale(value);
  }; // end runDotScale
  function randomGenerate(length, max) {
    var array = [];
    while (array.length < length) {
      var random = Math.floor(Math.random()*max);
      if (array.indexOf(random) === -1) { array.push(random); }
    }
    return array;
  }; // end randomGenerate
  function updateTimeline(type) {
    var dataset_lifeExpectancy20 = dataset_countries.filter(function(d) { return !isNaN(d.lifeExpectancy_old); });
    if (type=="randomize") {
      var randomArray = randomGenerate(20, dataset_lifeExpectancy20.length);
      random_lifeExpectancy = dataset_lifeExpectancy20.filter(function(d,i) { return randomArray.includes(i); });
      if (sort == "metric") { random_lifeExpectancy = random_lifeExpectancy.sort(function(a,b) { return b.lifeExpectancy_latest - a.lifeExpectancy_latest; }) }
      else { random_lifeExpectancy = random_lifeExpectancy.sort(function(a,b) { return (b.lifeExpectancy_latest-b.lifeExpectancy_old) - (a.lifeExpectancy_latest-a.lifeExpectancy_old); }) };
      svg_lifeExpectancy_timeline.selectAll(".timelineGroup")
                                 .data(random_lifeExpectancy);
    }
    else if (type=="sortChange") {
      sort = "change";
      svg_lifeExpectancy_timeline.selectAll(".timelineGroup")
                                 .data(random_lifeExpectancy.sort(function(a,b) { return (b.lifeExpectancy_latest-b.lifeExpectancy_old) - (a.lifeExpectancy_latest-a.lifeExpectancy_old); }));
      d3.select("#button-metric").style("display", "inline");
      d3.select("#button-change").style("display", "none");
    }
    else {
      sort = "metric";
      svg_lifeExpectancy_timeline.selectAll(".timelineGroup")
                                 .data(random_lifeExpectancy.sort(function(a,b) { return b.lifeExpectancy_latest - a.lifeExpectancy_latest; }))
      d3.select("#button-change").style("display", "inline");
      d3.select("#button-metric").style("display", "none");
    }
    svg_lifeExpectancy_timeline.selectAll(".timelineGroup")
                               .select(".timelineRect")
                               .attr("x", function(d) { return runDotScale("lifeExpectancy", d.lifeExpectancy_old, "timeline"); })
                               .attr("width", function(d) { return runDotScale("lifeExpectancy", d.lifeExpectancy_latest, "timeline") - runDotScale("lifeExpectancy", d.lifeExpectancy_old, "timeline"); })
    svg_lifeExpectancy_timeline.selectAll(".timelineGroup")
                               .select(".timelineDots_old")
                               .attr("cx", function(d) { return runDotScale("lifeExpectancy", d.lifeExpectancy_old, "timeline"); });
    svg_lifeExpectancy_timeline.selectAll(".timelineGroup")
                               .select(".timelineDots")
                               .attr("cx", function(d) { return runDotScale("lifeExpectancy", d.lifeExpectancy_latest, "timeline"); });
    svg_lifeExpectancy_timeline.selectAll(".timelineGroup")
                               .select(".timelineLabels")
                               .text(function(d) {
                                 if (d.countryName == "Federated States of Micronesia") { return "Micronesia"; }
                                 else if (d.countryName == "St. Vincent and the Grenadines") { return "St. Vincent & Grenadines"; }
                                 else { return d.countryName; }
                               })
                               .attr("x", function(d) {
                                 if (runDotScale("lifeExpectancy", d.lifeExpectancy_latest, "timeline") - runDotScale("lifeExpectancy", d.lifeExpectancy_old, "timeline") > 90) { return runDotScale("lifeExpectancy", d.lifeExpectancy_old, "timeline") + 10; }
                                 else { return runDotScale("lifeExpectancy", d.lifeExpectancy_old, "timeline") - 10; }
                               })
                               .style("text-anchor", function(d) {
                                 if (runDotScale("lifeExpectancy", d.lifeExpectancy_latest, "timeline") - runDotScale("lifeExpectancy", d.lifeExpectancy_old, "timeline") > 90) { return "start"; }
                                 else { return "end"; }
                               });
    svg_lifeExpectancy_timeline.selectAll(".axisLabel")
                               .attr("x", function(d,i) {
                                 if (i==0) { return runDotScale("lifeExpectancy", random_lifeExpectancy[0].lifeExpectancy_old, "timeline"); }
                                 else { return runDotScale("lifeExpectancy", random_lifeExpectancy[0].lifeExpectancy_latest, "timeline"); }
                               });
  }; // end updateTimeline
  reset();
  setup();

  // Interactivity
  // Randomize 20 countries
  d3.select("#button-randomize").on("click", function() {
    updateTimeline("randomize");
  });
  // Sort by years increased
  d3.select("#button-change").on("click", function() {
    updateTimeline("sortChange")
  }); // end on click button-change
  // Sort by life expectancy
  d3.select("#button-metric").on("click", function() {
    updateTimeline("sortMetric")
  }); // end on click button-change
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
    ldc: parseInt(d.LDC) || 0,
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
d3.csv("Data & analysis/Data files/merged_edited.csv", rowConverter, function(data) {
  dataset_countries = data;
  init();
});
