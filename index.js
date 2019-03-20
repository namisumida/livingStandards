function init() {
  // Assign svg variables
  var svg_lifeExpectancy_topline = d3.select("#svg-lifeExpectancy_topline");
  var svg_lifeExpectancy_timeline = d3.select("#svg-lifeExpectancy_timeline");
  var svg_lifeExpectancy_comp = d3.select("#svg-lifeExpectancy_comp");
  var svg_otherMetrics = d3.select("#svg-otherMetrics");
  // Dataset
  var dataset_randomSubset;
  var dataset_metric; // dataset that holds countries that qualify for currMetric;
  var dataset_randomSubset; // dataset that holds random set of countries that will be displayed
  var sort, currMetric;
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
  var h_svgComp = 370;
  var h_svgOther_init = 200;
  var h_svgOther = 475;
  document.getElementById("svg-lifeExpectancy_topline").style.height = h_svgTopline + "px";
  document.getElementById("svg-lifeExpectancy_timeline").style.height = h_svgTimeline + "px";
  document.getElementById("svg-lifeExpectancy_comp").style.height = h_svgComp + "px";
  document.getElementById("svg-otherMetrics").style.height = h_svgOther_init + "px";
  // Colors
  var backgroundGray = d3.color("#F1F1F1");
  var blue = d3.color("#669BB5");
  var babyBlue = d3.color("#D6ECFD");
  var accentColor = d3.color("#FC5742");
  var lightBlue = d3.color("#BACFDA");
  var yellow = d3.color("#E2CA84");
  var red = d3.color("#FE707C");

  ////////////////////////////////////////////////////////////////////////////////
  function setup() {
    // LIFE EXPECTANCY
    currMetric = "lifeExpectancy";
    // Topline; all countries
    dataset_metric = dataset_countries.filter(function(d) { return !isNaN(d.lifeExpectancy_old) & !isNaN(d.lifeExpectancy_latest); });
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
    var randomArray = randomGenerate(20, dataset_metric.length);
    dataset_randomWorldSubset = dataset_metric.filter(function(d,i) { return randomArray.includes(i); }).sort(function(a,b) { return b.lifeExpectancy_latest - a.lifeExpectancy_latest; });
    svg_lifeExpectancy_timeline.selectAll("lineMarkers")
                               .data([63,72])
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
                               })
                               .style("opacity", function(d,i) {
                                 if (i==0) { return 0.5; }
                                 else { return 0.3; }
                               });
    svg_lifeExpectancy_timeline.selectAll("lineMarkerLabels")
                               .data([63,72])
                               .enter()
                               .append("text")
                               .attr("class", "lineMarkerLabels")
                               .attr("x", function(d) { return runDotScale("lifeExpectancy", d, "timeline"); })
                               .attr("y", h_svgTimeline-20)
                               .text(function(d,i) {
                                 if (i==0) { return "1960 global avg"; }
                                 else { return "2016 global avg"}
                               })
                               .call(wrap, 60)
                               .style("fill", function(d,i) {
                                 if (i==0) { return yellow; }
                                 else { return blue; }
                               });
    svg_lifeExpectancy_timeline.selectAll("compGroup")
                               .data(dataset_randomWorldSubset)
                               .enter()
                               .append("g")
                               .attr("class", "compGroup");
    svg_lifeExpectancy_timeline.selectAll(".compGroup")
                               .append("rect")
                               .attr("class", "timelineRect")
                               .attr("x", function(d) { return runDotScale("lifeExpectancy", d.lifeExpectancy_old, "timeline"); })
                               .attr("y", function(d,i) { return 19 + (i*22); })
                               .attr("height", 12)
                               .attr("width", function(d) { return runDotScale("lifeExpectancy", d.lifeExpectancy_latest, "timeline") - runDotScale("lifeExpectancy", d.lifeExpectancy_old, "timeline"); });
    svg_lifeExpectancy_timeline.selectAll(".compGroup")
                               .append("circle")
                               .attr("class", "timelineDots_old")
                               .attr("r", 7)
                               .attr("cx", function(d) { return runDotScale("lifeExpectancy", d.lifeExpectancy_old, "timeline"); })
                               .attr("cy", function(d,i) { return 25 + (i*22); });
    svg_lifeExpectancy_timeline.selectAll(".compGroup")
                                .append("circle")
                                .attr("class", "timelineDots")
                                .attr("r", 7)
                                .attr("cx", function(d) { return runDotScale("lifeExpectancy", d.lifeExpectancy_latest); })
                                .attr("cy", function(d,i) { return 25 + (i*22); });
    svg_lifeExpectancy_timeline.selectAll(".compGroup")
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
                               .attr("id", "axisLabelYear")
                               .text(function(d) { return d; })
                               .attr("x", function(d,i) {
                                 if (i==0) { return runDotScale("lifeExpectancy", dataset_randomWorldSubset[0].lifeExpectancy_old, "timeline"); }
                                 else { return runDotScale("lifeExpectancy", dataset_randomWorldSubset[0].lifeExpectancy_latest, "timeline"); }
                               })
                               .attr("y", 10);
    // on mouseover
    svg_lifeExpectancy_timeline.selectAll(".compGroup")
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
                               });
    // Comparison
    svg_lifeExpectancy_comp.selectAll("lineMarkers")
                           .data([70,79])
                           .enter()
                           .append("line")
                           .attr("class", "lineMarkers_timeline")
                           .attr("x1", function(d) { return runDotScale("lifeExpectancy", d, "timeline"); })
                           .attr("x2", function(d) { return runDotScale("lifeExpectancy", d, "timeline"); })
                           .attr("y1", 20)
                           .attr("y2", h_svgComp-20)
                           .style("opacity", function(d,i) {
                             if (i==0) { return 0.5; }
                             else { return 0.3; }
                           })
                           .style("stroke", function(d,i) {
                             if (i==0) { return yellow; }
                             else { return blue; }
                           });
    svg_lifeExpectancy_comp.selectAll("lineMarkerLabels")
                           .data([70,79])
                           .enter()
                           .append("text")
                           .attr("class", "lineMarkerLabels")
                           .attr("x", function(d) { return runDotScale("lifeExpectancy", d, "timeline"); })
                           .attr("y", h_svgComp-5)
                           .text(function(d,i) {
                             if (i==0) { return "1960 USA avg"; }
                             else { return "2016 USA avg"}
                           })
                           .call(wrap, 60)
                           .style("fill", function(d,i) {
                             if (i==0) { return yellow; }
                             else { return blue; }
                           });
    svg_lifeExpectancy_comp.selectAll("axisLabel")
                           .data(["1960", "2016"])
                           .enter()
                           .append("text")
                           .attr("class", "axisLabel")
                           .attr("id", "axisLabelYear")
                           .text(function(d) { return d; })
                           .attr("x", function(d,i) {
                             if (i==0) { return runDotScale("lifeExpectancy", 70, "timeline"); }
                             else { return runDotScale("lifeExpectancy", 79, "timeline"); }
                           })
                           .attr("y", 10);
    svg_lifeExpectancy_comp.selectAll("compAvgGroup")
                           .data([{"country": "USA", "old": 70, "latest": 79}, {"country": "LDC", "old": 40, "latest": 63}])
                           .enter()
                           .append("g")
                           .attr("class", "compAvgGroup");
    svg_lifeExpectancy_comp.selectAll(".compAvgGroup")
                           .append("rect")
                           .attr("class", "timelineRect")
                           .attr("x", function(d) { return runDotScale("lifeExpectancy", d.old, "timeline"); })
                           .attr("y", function(d,i) {
                             if (i==1) { return 17 + (i*30); }
                             else { return 19 + (i*30); }
                           })
                           .attr("height", function(d,i) {
                             if (i==1) { return 16; }
                             else { return 12; }
                           })
                           .attr("width", function(d) { return runDotScale("lifeExpectancy", d.latest, "timeline") - runDotScale("lifeExpectancy", d.old, "timeline"); });
    svg_lifeExpectancy_comp.selectAll(".compAvgGroup")
                           .append("circle")
                           .attr("class", "timelineDots_old")
                           .attr("cx", function(d) { return runDotScale("lifeExpectancy", d.old, "timeline"); })
                           .attr("cy", function(d,i) { return 25 + i*30; })
                           .attr("r", function(d,i) {
                             if (i==1) { return 10; }
                             else { return 7; }
                           });
    svg_lifeExpectancy_comp.selectAll(".compAvgGroup")
                           .append("circle")
                           .attr("class", "timelineDots")
                           .attr("cx", function(d) { return runDotScale("lifeExpectancy", d.latest, "timeline"); })
                           .attr("cy", function(d,i) { return 25 + i*30; })
                           .attr("r", function(d,i) {
                             if (i==1) { return 10; }
                             else { return 7; }
                           });
    svg_lifeExpectancy_comp.selectAll(".compAvgGroup")
                           .append("text")
                           .attr("class", "timelineLabels")
                           .text(function(d,i) {
                             if (i==0) { return "USA"; }
                             else { return "Least developed countries (avg)"; }
                           })
                           .attr("x", function(d) {
                             if (runDotScale("lifeExpectancy", d.latest, "timeline") - runDotScale("lifeExpectancy", d.old, "timeline") > 90) { return runDotScale("lifeExpectancy", d.old, "timeline") + 15; }
                             else { return runDotScale("lifeExpectancy", d.old, "timeline") - 10; }
                           })
                           .attr("y", function(d,i) { return 29 + i*30; })
                           .style("text-anchor", function(d) {
                             if (runDotScale("lifeExpectancy", d.latest, "timeline") - runDotScale("lifeExpectancy", d.old, "timeline") > 90) { return "start"; }
                             else { return "end"; }
                           })
                           .style("font-weight", 800)
                           .style("font-size", "12px");
    svg_lifeExpectancy_comp.selectAll(".compAvgGroup")
                           .append("text")
                           .attr("class", "axisLabel")
                           .text(function(d) { return Math.round(d.old); })
                           .attr("x", function(d) {
                             if (runDotScale("lifeExpectancy", d.latest, "timeline") - runDotScale("lifeExpectancy", d.old, "timeline") > 90) { return runDotScale("lifeExpectancy", d.old, "timeline")-15; }
                             else { return runDotScale("lifeExpectancy", d.old, "timeline")+10; }
                           })
                           .attr("y", function(d,i) { return 29 + i*30; })
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
                           .attr("y", function(d,i) { return 29 + i*30; })
                           .style("text-anchor", function(d) {
                             if (runDotScale("lifeExpectancy", d.latest, "timeline") - runDotScale("lifeExpectancy", d.old, "timeline") > 90) { return "start"; }
                             else { return "end"; }
                           })
                           .style("fill", blue);
    var dataset_metric = dataset_countries.filter(function(d) { return !isNaN(d.lifeExpectancy_latest) & d.ldc == 1; }).sort(function(a,b) { return b.lifeExpectancy_latest - a.lifeExpectancy_latest; });
    var randomArray10 = randomGenerate(10, dataset_metric.length);
    dataset_randomCompSubset = dataset_metric.filter(function(d,i) { return randomArray10.includes(i); });
    svg_lifeExpectancy_comp.selectAll("compLDCgroup")
                           .data(dataset_randomCompSubset)
                           .enter()
                           .append("g")
                           .attr("class", "compGroup");
    svg_lifeExpectancy_comp.selectAll(".compGroup")
                           .append("rect")
                           .attr("class", "timelineRect")
                           .attr("y", function(d,i) { return 69 + (i+1)*25; })
                           .attr("height", 12)
                           .attr("width", function(d) { return Math.abs(runDotScale("lifeExpectancy", d.lifeExpectancy_latest, "timeline") - runDotScale("lifeExpectancy", d.lifeExpectancy_old, "timeline")); })
                           .attr("x", function(d) {
                             return runDotScale("lifeExpectancy", d.lifeExpectancy_old, "timeline");
                           })
                           .style("fill", function(d) {
                             if (d.lifeExpectancy_latest > d.lifeExpectancy_old) { return lightBlue; }
                             else { return red; }
                           });
    svg_lifeExpectancy_comp.selectAll(".compGroup")
                           .append("circle")
                           .attr("class", "timelineDots")
                           .attr("r", 7)
                           .attr("cy", function(d,i) { return 75 + (i+1)*25; })
                           .attr("cx", function(d) { return runDotScale("lifeExpectancy", d.lifeExpectancy_latest, "timeline"); })
                           .style("fill", blue);
    svg_lifeExpectancy_comp.selectAll(".compGroup")
                           .append("circle")
                           .attr("class", "timelineDots_old")
                           .attr("r", 7)
                           .attr("cx", function(d) { return runDotScale("lifeExpectancy", d.lifeExpectancy_old, "timeline"); })
                           .attr("cy", function(d,i) { return 75 + (i+1)*25; });
    svg_lifeExpectancy_comp.selectAll(".compGroup")
                           .append("text")
                           .text(function(d) { return d.countryName; })
                           .attr("class", "timelineLabels")
                           .attr("x", function(d) {
                             if (runDotScale("lifeExpectancy", d.lifeExpectancy_latest, "timeline") - runDotScale("lifeExpectancy", d.lifeExpectancy_old, "timeline") > 90) { return runDotScale("lifeExpectancy", d.lifeExpectancy_old, "timeline") + 10; }
                             else { return runDotScale("lifeExpectancy", d.lifeExpectancy_old, "timeline") - 10; }
                           })
                           .attr("y", function(d,i) { return 79 + (i+1)*25; })
                           .style("text-anchor", function(d) {
                             if (runDotScale("lifeExpectancy", d.lifeExpectancy_latest, "timeline") - runDotScale("lifeExpectancy", d.lifeExpectancy_old, "timeline") > 90) { return "start"; }
                             else { return "end"; }
                           });
    svg_lifeExpectancy_comp.selectAll(".compGroup")
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
    // Other metrics - initial load is undernourished
    svg_otherMetrics.selectAll("lineMarkers")
                     .data([2.5,2.5])
                     .enter()
                     .append("line")
                     .attr("class", "lineMarkers_timeline")
                     .attr("x1", function(d) { return runDotScale("undernourished", d, "timeline"); })
                     .attr("x2", function(d) { return runDotScale("undernourished", d, "timeline"); })
                     .attr("y1", 5)
                     .attr("y2", h_svgOther-20)
                     .style("stroke", "none")
                     .style("opacity", function(d,i) {
                       if (i==0) { return 0.5; }
                       else { return 0.3; }
                     });
    svg_otherMetrics.selectAll("lineMarkerLabels")
                     .data([2.5,2.5])
                     .enter()
                     .append("text")
                     .attr("class", "lineMarkerLabels")
                     .attr("x", function(d) { return runDotScale("undernourished", d, "timeline"); })
                     .attr("y", h_svgOther-5)
                     .text(function(d,i) {
                       if (i==1) { return "US avg"; }
                       else { return ""}
                     })
                     .call(wrap, 60)
                     .style("fill", "none");
    svg_otherMetrics.selectAll("compAvgGroup")
                     .data([{"country": "world", "old": 15, "latest": 11}, {"country": "USA", "old": 2.5, "latest": 2.5}, {"country": "LDC", "old": 35, "latest": 23}])
                     .enter()
                     .append("g")
                     .attr("class", "compAvgGroup");
    svg_otherMetrics.selectAll(".compAvgGroup")
                     .append("rect")
                     .attr("class", "timelineRect")
                     .attr("x", function(d) { return runDotScale("undernourished", d.latest, "timeline"); })
                     .attr("y", function(d,i) {
                       if (i==1) { return 7 + (i*30); }
                       else { return 4 + (i*30); }
                     })
                     .attr("height", function(d,i) {
                       if (i==1) { return 16; }
                       else { return 12; }
                     })
                     .attr("width", function(d) { return runDotScale("undernourished", d.old, "timeline") - runDotScale("undernourished", d.latest, "timeline"); });
    svg_otherMetrics.selectAll(".compAvgGroup")
                     .append("circle")
                     .attr("class", "timelineDots_old")
                     .attr("cx", function(d) { return runDotScale("undernourished", d.old, "timeline"); })
                     .attr("cy", function(d,i) { return 10 + i*30; })
                     .attr("r", function(d,i) {
                       if (i==1) { return 10; }
                       else { return 7; }
                     });
    svg_otherMetrics.selectAll(".compAvgGroup")
                     .append("circle")
                     .attr("class", "timelineDots")
                     .attr("cx", function(d) { return runDotScale("undernourished", d.latest, "timeline"); })
                     .attr("cy", function(d,i) { return 10 + i*30; })
                     .attr("r", function(d,i) {
                       if (i==1) { return 10; }
                       else { return 7; }
                     });
    svg_otherMetrics.selectAll(".compAvgGroup")
                     .append("text")
                     .attr("class", "timelineLabels")
                     .text(function(d,i) {
                       if (i==0) { return "World (avg)"; }
                       else if (i==1) { return "USA"; }
                       else { return "Least developed countries (avg)"; }
                     })
                     .attr("x", function(d,i) {
                       if (i!=1) { return runDotScale("undernourished", d.old, "timeline") + 35; }
                       else { return runDotScale("undernourished", d.old, "timeline") + 15; }
                     })
                     .attr("y", function(d,i) { return 14 + i*30; })
                     .style("text-anchor", "start")
                     .style("font-weight", 800)
                     .style("font-size", "12px");
    svg_otherMetrics.selectAll(".compAvgGroup")
                     .append("text")
                     .attr("class", "axisLabel")
                     .attr("id", "axisLabelOld")
                     .text(function(d,i) { if (i!=1) { return Math.round(d.old); } })
                     .attr("x", function(d) { return runDotScale("undernourished", d.old, "timeline")+15; })
                     .attr("y", function(d,i) { return 14 + i*30; })
                     .style("text-anchor", "start")
                     .style("fill", yellow);
    svg_otherMetrics.selectAll(".compAvgGroup")
                     .append("text")
                     .attr("class", "axisLabel")
                     .attr("id", "axisLabelLatest")
                     .text(function(d) { return Math.round(d.latest); })
                     .attr("x", function(d) {
                       if (runDotScale("undernourished", d.latest, "timeline") - runDotScale("undernourished", d.old, "timeline") > 90) { return runDotScale("undernourished", d.latest, "timeline")+15; }
                       else { return runDotScale("undernourished", d.latest, "timeline")-15; }
                     })
                     .attr("y", function(d,i) { return 14 + i*30; })
                     .style("text-anchor", function(d) {
                       if (runDotScale("undernourished", d.latest, "timeline") - runDotScale("undernourished", d.old, "timeline") > 90) { return "start"; }
                       else { return "end"; }
                     })
                     .style("fill", blue);
    var dataset_metrics = dataset_countries.filter(function(d) { return !isNaN(d.undernourished_latest) & !isNaN(d.undernourished_old) & d.ldc == 1; }).sort(function(a,b) { return a.undernourished_latest - b.undernourished_latest; });
    var randomArray10 = randomGenerate(15, dataset_metrics.length);
    dataset_randomOtherSubset = dataset_metrics.filter(function(d,i) { return randomArray10.includes(i); });
    svg_otherMetrics.selectAll("compLDCgroup")
                     .data(dataset_randomOtherSubset)
                     .enter()
                     .append("g")
                     .attr("class", "compGroup");
    svg_otherMetrics.selectAll(".compGroup")
                     .append("rect")
                     .attr("class", "timelineRect")
                     .attr("x", function(d) { return runDotScale("undernourished", d.undernourished_old, "timeline"); })
                     .attr("y", function(d,i) { return 64 + (i+1)*25; })
                     .attr("height", 12);
    svg_otherMetrics.selectAll(".compGroup")
                     .append("circle")
                     .attr("class", "timelineDots")
                     .attr("r", 7)
                     .attr("cx", function(d) { return runDotScale("undernourished", d.undernourished_old, "timeline"); })
                     .attr("cy", function(d,i) { return 70 + (i+1)*25; })
                     .style("fill", "none");
    svg_otherMetrics.selectAll(".compGroup")
                     .append("circle")
                     .attr("class", "timelineDots_old")
                     .attr("r", 7)
                     .attr("cx", runDotScale("undernourished", 35, "timeline"))
                     .attr("cy", 70);
    svg_otherMetrics.selectAll(".compGroup")
                     .append("text")
                     .attr("class", "timelineLabels")
                     .attr("x", function(d) {
                       // if it doesn't fit into rect
                       if (Math.abs(runDotScale("undernourished", d.undernourished_old, "timeline") - runDotScale("undernourished", d.undernourished_latest, "timeline")) > 90)
                        if (d.undernourished_old > d.undernourished_latest){ return runDotScale("undernourished", d.undernourished_old, "timeline") - 10; }
                        else { return runDotScale("undernourished", d.undernourished_old, "timeline") + 15; }
                       else if (d.undernourished_old > d.undernourished_latest) { return runDotScale("undernourished", d.undernourished_old, "timeline") + 15; }
                       else { return runDotScale("undernourished", d.undernourished_old, "timeline") - 15; } // if increased over time
                     })
                     .attr("y", function(d,i) { return 74 + (i+1)*25; })
                     .style("text-anchor", function(d) {
                       if (Math.abs(runDotScale("undernourished", d.undernourished_old, "timeline") - runDotScale("undernourished", d.undernourished_latest, "timeline")) > 90) {
                         if (d.undernourished_old > d.undernourished_latest) { return "end"; }
                         else { return "start"; }
                       }
                       else if (d.undernourished_old > d.undernourished_latest) { return "start"; }
                       else { return "end"; }
                     });
    svg_otherMetrics.selectAll(".compGroup")
                     .on("mouseover", function(d) {
                       var currGroup = d3.select(this);
                       currGroup.select(".timelineDots").style("fill", accentColor);
                       currGroup.select(".timelineDots_old").style("fill", accentColor);
                       currGroup.append("text")
                                .attr("class", "axisLabel")
                                .text(function(d) { return Math.round(d.undernourished_old); })
                                .attr("x", function(d) {
                                  // if country name doesn't fit in rectangle
                                  if (Math.abs(runDotScale("undernourished", d.undernourished_latest, "timeline") - runDotScale("undernourished", d.undernourished_old, "timeline")) < 90) {
                                    if (d.undernourished_old > d.undernourished_latest) { return runDotScale("undernourished", d.undernourished_old, "timeline") + parseFloat(currGroup.select(".timelineLabels").node().getBBox().width) + 20; }
                                    else { return runDotScale("undernourished", d.undernourished_old, "timeline") - parseFloat(currGroup.select(".timelineLabels").node().getBBox().width) - 20; }
                                  }
                                  // if it does fit
                                  else {
                                    if (d.undernourished_old > d.undernourished_latest) { return parseFloat(currGroup.select(".timelineDots_old").attr("cx"))+15; }
                                    else { return parseFloat(currGroup.select(".timelineDots_old").attr("cx"))-15; }
                                  }
                                })
                                .attr("y", parseFloat(currGroup.select(".timelineLabels").attr("y")))
                                .style("text-anchor", function(d) {
                                  if (Math.abs(runDotScale("undernourished", d.undernourished_latest, "timeline") - runDotScale("undernourished", d.undernourished_old, "timeline")) > 90 & d.undernourished_old > d.undernourished_latest) { return "start"; }
                                  else {
                                    if (d.undernourished_old > d.undernourished_latest) { return "start"; }
                                    else { return "end"; }
                                  }
                                })
                                .style("fill", accentColor);
                      currGroup.append("text")
                               .attr("class", "axisLabel")
                               .text(function(d) { return Math.round(d.undernourished_latest); })
                               .attr("x", function(d) {
                                 if (d.undernourished_old < d.undernourished_latest) { return runDotScale("undernourished", d.undernourished_latest, "timeline") + 15; }
                                 else { return parseFloat(currGroup.select(".timelineDots").attr("cx"))-15; }
                               })
                               .attr("y", parseFloat(currGroup.select(".timelineLabels").attr("y")))
                               .style("text-anchor", function(d) {
                                 if (d.undernourished_old < d.undernourished_latest) { return "start"; }
                                 else { return "end"; }
                               })
                               .style("fill", accentColor);
                     })
                     .on("mouseout", function() {
                       var currGroup = d3.select(this);
                       currGroup.select(".timelineDots").style("fill", blue);
                       currGroup.select(".timelineDots_old").style("fill", yellow);
                       currGroup.selectAll(".axisLabel").remove();
                     });

  }; // end setup
  function reset() {
    sort = "metric";
    currMetric = "undernourished";
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
    else if (metric=="under5") {
      if (type=="topline") { var min = d3.min(dataset_countries, function(d) { return d.under5_latest; }); }
      else { var min = d3.min(dataset_countries, function(d) { return d.under5_old; }); }
      var max = d3.max(dataset_countries, function(d) { return d.under5_old; })
    }
    else if (metric=="maternal") {
      if (type=="topline") { var min = d3.min(dataset_countries, function(d) { return d.maternal_latest; }); }
      else { var min = d3.min(dataset_countries, function(d) { return d.maternal_old; }); }
      var max = d3.max(dataset_countries, function(d) { return d.maternal_old; })
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
  function updateView(svg, type, svgID) {
    // Affects 3 different SVGs: 1) Life expectancy around the world;  2) Life expectancies in the US and LDCs; 3) Other living standards
    var variableOld = currMetric + "_old";
    var variableLatest = currMetric + "_latest";
    // Three types of interactions/changes that all lead to updating the dots: 1) Showing another set of countries
    if (svgID==1) { // world view
      if (type == "sortChange") {
        sort = "change";
        svg.selectAll(".compGroup").data(dataset_randomWorldSubset.sort(function(a,b) { return (b[variableLatest]-b[variableOld]) - (a[variableLatest]-a[variableOld]); }));
      }
      else if (type == "sortMetric") {
        sort = "metric";
        svg.selectAll(".compGroup").data(dataset_randomWorldSubset.sort(function(a,b) { return b[variableLatest] - a[variableLatest]; }));
      }
      else { // randomize
        dataset_metric = dataset_countries.filter(function(d) { return !isNaN(d[variableOld]) & !isNaN(d[variableLatest]); });
        var randomArray = randomGenerate(20, dataset_metric.length);
        dataset_randomWorldSubset = dataset_metric.filter(function(d,i) { return randomArray.includes(i); });
        // Sort appropriately
        if (sort == "metric") { dataset_randomWorldSubset = dataset_randomWorldSubset.sort(function(a,b) { return b[variableLatest] - a[variableLatest]; }) }
        else { dataset_randomWorldSubset = dataset_randomWorldSubset.sort(function(a,b) { return (b[variableLatest]-b[variableOld]) - (a[variableLatest]-a[variableOld]); }) };
        // Set new data to groups
        svg.selectAll(".compGroup").data(dataset_randomWorldSubset);
      }
    }
    else if (svgID==2) {
      dataset_metric = dataset_countries.filter(function(d) { return !isNaN(d[variableOld]) & !isNaN(d[variableLatest]) & d.ldc == 1; });
      if (type == "sortChange") {
        sort = "change";
        svg.selectAll(".compGroup").data(dataset_randomCompSubset.sort(function(a,b) { return (b[variableLatest]-b[variableOld]) - (a[variableLatest]-a[variableOld]); }));
        dataset_metric = dataset_countries.filter(function(d) { return !isNaN(d[variableOld]) & !isNaN(d[variableLatest]) & d.ldc == 1; });
      }
      else if (type == "sortMetric") {
        sort = "metric";
        svg.selectAll(".compGroup").data(dataset_randomCompSubset.sort(function(a,b) { return b[variableLatest] - a[variableLatest]; }));
      }
      else { // randomize
        var randomArray = randomGenerate(10, dataset_metric.length);
        dataset_randomCompSubset = dataset_metric.filter(function(d,i) { return randomArray.includes(i); });
        if (sort == "metric") { dataset_randomCompSubset = dataset_randomCompSubset.sort(function(a,b) { return b[variableLatest] - a[variableLatest]; }) }
        else { dataset_randomCompSubset = dataset_randomCompSubset.sort(function(a,b) { return (b[variableLatest]-b[variableOld]) - (a[variableLatest]-a[variableOld]); }) };
        // Set new data to groups
        svg.selectAll(".compGroup").data(dataset_randomCompSubset);
      }
    }
    else {
      if (type == "sortChange") {
        sort = "change";
        svg.selectAll(".compGroup").data(dataset_randomOtherSubset.sort(function(a,b) { return (b[variableLatest]-b[variableOld]) - (a[variableLatest]-a[variableOld]); }));
      }
      else if (type == "sortMetric") {
        sort = "metric";
        svg.selectAll(".compGroup").data(dataset_randomOtherSubset.sort(function(a,b) { return b[variableLatest] - a[variableLatest]; }));
      }
      else { // randomize
        var randomArray = randomGenerate(15, dataset_metric.length);
        dataset_randomOtherSubset = dataset_metric.filter(function(d,i) { return randomArray.includes(i); });
        if (sort == "metric") { dataset_randomCompSubset = dataset_randomCompSubset.sort(function(a,b) { return b[variableLatest] - a[variableLatest]; }) }
        else { dataset_randomOtherSubset = dataset_randomOtherSubset.sort(function(a,b) { return (b[variableLatest]-b[variableOld]) - (a[variableLatest]-a[variableOld]); }) };
        // Set new data to groups
        svg.selectAll(".compGroup").data(dataset_randomOtherSubset);
      }
    }

    // Update elements
    svg.selectAll(".compGroup")
       .select(".timelineRect")
       .attr("x", function(d) { return runDotScale("lifeExpectancy", d[variableOld], "timeline"); })
       .attr("width", function(d) { return runDotScale("lifeExpectancy", d[variableLatest], "timeline") - runDotScale("lifeExpectancy", d[variableOld], "timeline"); })
    svg.selectAll(".compGroup")
       .select(".timelineDots_old")
       .attr("cx", function(d) { return runDotScale("lifeExpectancy", d[variableOld], "timeline"); });
    svg.selectAll(".compGroup")
       .select(".timelineDots")
       .attr("cx", function(d) { return runDotScale("lifeExpectancy", d[variableLatest], "timeline"); });
    svg.selectAll(".compGroup")
       .select(".timelineLabels")
       .text(function(d) {
         if (d.countryName == "Federated States of Micronesia") { return "Micronesia"; }
         else if (d.countryName == "St. Vincent and the Grenadines") { return "St. Vincent & Grenadines"; }
         else { return d.countryName; }
       })
       .attr("x", function(d) {
         if (runDotScale("lifeExpectancy", d[variableLatest], "timeline") - runDotScale("lifeExpectancy", d[variableOld], "timeline") > 90) { return runDotScale("lifeExpectancy", d[variableOld], "timeline") + 10; }
         else { return runDotScale("lifeExpectancy", d[variableOld], "timeline") - 10; }
       })
       .style("text-anchor", function(d) {
         if (runDotScale("lifeExpectancy", d[variableLatest], "timeline") - runDotScale("lifeExpectancy", d[variableOld], "timeline") > 90) { return "start"; }
         else { return "end"; }
       });
    if (svgID==1) {
      svg.selectAll("#axisLabelYear")
         .attr("x", function(d,i) {
           if (i==0) { return runDotScale("lifeExpectancy", dataset_randomWorldSubset[0][variableOld], "timeline"); }
           else { return runDotScale("lifeExpectancy", dataset_randomWorldSubset[0][variableLatest], "timeline"); }
         });
    };

  }; // end updateViews



  function showLDC(svg, metric) { // show LDC countries
    var variableOld = metric+"_old";
    var variableLatest = metric+"_latest";
    svg.selectAll(".compGroup").select(".timelineDots_old")
       .transition()
       .ease(d3.easeLinear)
       .duration(800)
       .attr("cx", function(d) { return runDotScale(metric, d[variableOld], "timeline"); })
       .attr("cy", function(d,i) { return 70 + (i+1)*25; });
    svg.selectAll(".compGroup").select(".timelineRect")
       .transition()
       .ease(d3.easeLinear)
       .delay(1000)
       .duration(1200)
       .attr("width", function(d) { return Math.abs(runDotScale(metric, d[variableLatest], "timeline") - runDotScale(metric, d[variableOld], "timeline")); })
       .attr("x", function(d) {
         if (metric=="undernourished" | metric=="under5" | metric=="maternal") {
           if (d[variableOld] > d[variableLatest]) { return runDotScale(metric, d[variableLatest], "timeline"); }
           else { return runDotScale(metric, d[variableOld], "timeline"); }
         }
         else { return runDotScale(metric, d[variableOld], "timeline"); }
       })
       .style("fill", function(d) {
         if (metric=="undernourished" | metric=="under5" | metric=="maternal") {
           if (d[variableOld] > d[variableLatest]) { return lightBlue; }
           else { return red; }
         }
         else {
           if (d[variableLatest] > d[variableOld]) { return lightBlue; }
           else { return red; }
         }
       });
    svg.selectAll(".compGroup").select(".timelineDots")
       .transition()
       .ease(d3.easeLinear)
       .delay(1000)
       .duration(1200)
       .attr("cx", function(d) { return runDotScale(metric, d[variableLatest], "timeline"); })
       .style("fill", blue);
    svg.selectAll(".compGroup").select(".timelineLabels")
       .transition()
       .ease(d3.easeLinear)
       .duration(1000)
       .delay(2500)
       .text(function(d) { return d.countryName; })
       .style("fill", "black");
    svg.selectAll(".lineMarkers_timeline")
       .transition()
       .ease(d3.easeLinear)
       .duration(1000)
       .delay(2800)
       .style("stroke", function(d,i) {
         if (i==0) { return yellow; }
         else { return blue; }
       });
    svg.selectAll(".lineMarkerLabels")
       .transition()
       .ease(d3.easeLinear)
       .duration(1000)
       .delay(2800)
       .style("fill", function(d,i) {
         if (i==0) { return yellow; }
         else { return blue; }
       });
  }; // end showLDC
  /*function updateLDCView(svg, type) { // randomize, change sort
    var variableOld = currMetric+"_old";
    var variableLatest = currMetric+"_latest";
    dataset_metric = dataset_countries.filter(function(d) { return !isNaN(d[variableLatest]) & !isNaN(d[variableOld]) & d.ldc == 1; }).sort(function(a,b) { return b[variableLatest] - a[variableLatest]; });
    if (type=="randomize") {
      var randomArray10 = randomGenerate(15, dataset_metric.length);
      dataset_randomSubset = dataset_metric.filter(function(d,i) { return randomArray10.includes(i); });
      if (sort == "metric") {
        if (currMetric == "undernourished" | currMetric == "under5" | currMetric == "maternal") { dataset_randomSubset = dataset_randomSubset.sort(function(a,b) { return a[variableLatest] - b[variableLatest]; }) }
        else { dataset_randomSubset = dataset_randomSubset.sort(function(a,b) { return b[variableLatest] - a[variableLatest]; }) }
      }
      else { dataset_randomSubset = dataset_randomSubset.sort(function(a,b) { return (b[variableOld]-b[variableLatest]) - (a[variableOld]-a[variableLatest]); }) };
      svg.selectAll(".compGroup").data(dataset_randomSubset);
    }
    else if (type=="sortChange") {
      sort = "change";
      svg.selectAll(".compGroup")
         .data(dataset_randomSubset.sort(function(a,b) { return (b[variableOld]-b[variableLatest]) - (a[variableOld]-a[variableLatest]); }));
      d3.select("#button-otherMetric").style("background-color", backgroundGray);
      d3.select("#button-otherChange").style("background-color", accentColor);
    }
    else {
      sort = "metric";
      d3.select("#button-otherMetric").style("background-color", accentColor);
      d3.select("#button-otherChange").style("background-color", backgroundGray);
      svg.selectAll(".compGroup")
         .data(dataset_randomSubset.sort(function(a,b) { return a[variableLatest] - b[variableLatest]; }));
    };
    svg.selectAll(".compGroup").select(".timelineRect")
        .attr("x", function(d) {
          if (currMetric=="undernourished" | currMetric=="under5" | currMetric=="maternal") {
            if (d[variableOld] > d[variableLatest]) { return runDotScale(currMetric, d[variableLatest], "timeline"); }
            else { return runDotScale(currMetric, d[variableOld], "timeline"); }
          }
          else { return runDotScale(currMetric, d[variableOld], "timeline"); }
        })
        .attr("width", function(d) { return Math.abs(runDotScale(currMetric, d[variableLatest], "timeline") - runDotScale(currMetric, d[variableOld], "timeline")); })
        .style("fill", function(d) {
          if (currMetric=="undernourished" | currMetric=="under5" | currMetric=="maternal") {
            if (d[variableOld] > d[variableLatest]) { return lightBlue; }
            else { return red; }
          }
          else {
            if (d[variableLatest] > d[variableOld]) { return lightBlue; }
            else { return red; }
          }
        });
    svg.selectAll(".compGroup").select(".timelineDots")
       .attr("cx", function(d) { return runDotScale(currMetric, d[variableLatest], "timeline"); });
    svg.selectAll(".compGroup").select(".timelineDots_old")
       .attr("cx", function(d) { return runDotScale(currMetric, d[variableOld], "timeline"); })
    svg.selectAll(".compGroup").select(".timelineLabels")
        .text(function(d) { return d.countryName; })
        .attr("x", function(d) {
          // if it doesn't fit into rect
          if (Math.abs(runDotScale(currMetric, d[variableOld], "timeline") - runDotScale(currMetric, d[variableLatest], "timeline")) > 90)
           if (d[variableOld] > d[variableLatest]){ return runDotScale(metric, d[variableOld], "timeline") - 10; }
           else { return runDotScale(currMetric, d[variableOld], "timeline") + 15; }
          else if (d[variableOld] > d[variableLatest]) { return runDotScale(currMetric, d[variableOld], "timeline") + 15; }
          else { return runDotScale(currMetric, d[variableOld], "timeline") - 15; } // if increased over time
        })
        .style("text-anchor", function(d) {
          if (Math.abs(runDotScale(currMetric, d[variableOld], "timeline") - runDotScale(currMetric, d[variableLatest], "timeline")) > 90) {
            if (d[variableOld] > d[variableLatest]) { return "end"; }
            else { return "start"; }
          }
          else if (d[variableOld] > d[variableLatest]) { return "start"; }
          else { return "end"; }
        });
  }; // end updateLDCView*/
  function changeMetric(metric) { // change to a different metric
    d3.selectAll(".button-otherMetrics").style("background-color", "transparent"); // make all buttons transparent
    var variableOld = metric+"_old";
    var variableLatest = metric+"_latest";
    if (metric=="undernourished") {
      dataset_linemarkers = [2.5, 2.5];
      dataset_compAvg = [{"country": "world", "old": 15, "latest": 11}, {"country": "USA", "old": 2.5, "latest": 2.5}, {"country": "LDC", "old": 35, "latest": 23}];
    }
    else if (metric=="under5") {
      dataset_linemarkers = [11, 7];
      dataset_compAvg = [{"country": "world", "old": 93, "latest": 39}, {"country": "USA", "old": 11, "latest": 7}, {"country": "LDC", "old": 175, "latest": 66}];
    }
    else if (metric=="maternal") {
      dataset_linemarkers = [12, 14];
      dataset_compAvg = [{"country": "world", "old": 385, "latest": 174}, {"country": "USA", "old": 12, "latest": 14}, {"country": "LDC", "old": 903, "latest": 436}];
    }
    else if (metric=="sanitation") {
      dataset_linemarkers = [100, 100];
      dataset_compAvg = [{"country": "world", "old": 58, "latest": 68}, {"country": "USA", "old": 100, "latest": 100}, {"country": "LDC", "old": 22, "latest": 32}];
    }
    else if (metric=="electricity") {
      dataset_linemarkers = [100, 100];
      dataset_compAvg = [{"country": "world", "old": 71, "latest": 87}, {"country": "USA", "old": 100, "latest": 100}, {"country": "LDC", "old": 9, "latest": 45}];
    }
    svg_otherMetrics.selectAll(".lineMarkers_timeline")
                     .data(dataset_linemarkers)
                     .attr("x1", function(d) { return runDotScale(metric, d, "timeline"); })
                     .attr("x2", function(d) { return runDotScale(metric, d, "timeline"); })
                     .style("stroke", "none"); // keep hidden for now
    svg_otherMetrics.selectAll(".lineMarkerLabels")
                     .data(dataset_linemarkers)
                     .attr("x", function(d) { return runDotScale(metric, d, "timeline"); })
                     .attr("y", h_svgOther-5)
                     .text("US avg")
                     .call(wrap, 60)
                     .style("fill", "none");
    svg_otherMetrics.selectAll(".compAvgGroup").data(dataset_compAvg);
    svg_otherMetrics.selectAll(".compAvgGroup").select(".timelineRect")
                     .attr("x", function(d) { return runDotScale(metric, d.latest, "timeline"); })
                     .attr("width", function(d) { return Math.abs(runDotScale(metric, d.old, "timeline") - runDotScale(metric, d.latest, "timeline")); });
    svg_otherMetrics.selectAll(".compAvgGroup").select(".timelineDots_old")
                    .attr("cx", function(d) { return runDotScale(metric, d.old, "timeline"); });
    svg_otherMetrics.selectAll(".compAvgGroup").select(".timelineDots")
                    .attr("cx", function(d) { return runDotScale(metric, d.latest, "timeline"); });
    svg_otherMetrics.selectAll(".compAvgGroup").select(".timelineLabels")
                     .attr("x", function(d,i) {
                       if ((metric=="undernourished" | metric=="under5" | metric=="maternal") & i!=1) {
                         if (d.old>99) { return runDotScale(metric, d.old, "timeline") + 45; }
                         else { return runDotScale(metric, d.old, "timeline") + 35; }
                       }
                       else { return runDotScale(metric, d.old, "timeline") + 15; }
                     });
    svg_otherMetrics.selectAll(".compAvgGroup").select("#axisLabelOld")
                     .text(function(d,i) { if (i!=1) { return Math.round(d.old); } })
                     .attr("x", function(d) {
                       if (metric=="undernourished" | metric=="under5" | metric=="maternal") { return runDotScale(metric, d.old, "timeline")+15; }
                       else { return runDotScale(metric, d.old, "timeline")-15; }
                     });
    svg_otherMetrics.selectAll(".compAvgGroup").select("#axisLabelLatest")
                     .text(function(d) { return Math.round(d.latest); })
                     .attr("x", function(d) {
                       if (runDotScale(metric, d.latest, "timeline") - runDotScale(metric, d.old, "timeline") > 90) { return runDotScale(metric, d.latest, "timeline")+15; }
                       else { return runDotScale(metric, d.latest, "timeline")-15; }
                     })
                     .style("text-anchor", function(d) {
                       if (runDotScale(metric, d.latest, "timeline") - runDotScale(metric, d.old, "timeline") > 90) { return "start"; }
                       else { return "end"; }
                     });
    var dataset_otherMetrics = dataset_countries.filter(function(d) { return !isNaN(d[variableLatest]) & !isNaN(d[variableOld]) & d.ldc == 1; }).sort(function(a,b) { return a[variableLatest] - b[variableLatest]; });
    var randomArray10 = randomGenerate(15, dataset_otherMetrics.length);
    dataset_randomSubset = dataset_otherMetrics.filter(function(d,i) { return randomArray10.includes(i); });
    svg_otherMetrics.selectAll(".compGroup").data(dataset_randomSubset);
    svg_otherMetrics.selectAll(".compGroup").select(".timelineRect")
                     .attr("x", function(d) { return runDotScale(metric, d[variableOld], "timeline"); })
                     .attr("width",0);
    svg_otherMetrics.selectAll(".compGroup").select(".timelineDots")
                     .attr("cx", function(d) { return runDotScale(metric, d[variableOld], "timeline"); })
                     .style("fill", "none");
    svg_otherMetrics.selectAll(".compGroup").select(".timelineDots_old")
                     .attr("cx", runDotScale(metric, dataset_compAvg.filter(function(d) { return d.country=="LDC"})[0].old, "timeline"))
                     .attr("cy", 70);
    svg_otherMetrics.selectAll(".compGroup").select(".timelineLabels")
                     .attr("x", function(d) {
                       // if it doesn't fit into rect
                       if (Math.abs(runDotScale(metric, d[variableOld], "timeline") - runDotScale(metric, d[variableLatest], "timeline")) > 90)
                        if (d[variableOld] > d[variableLatest]){ return runDotScale(metric, d[variableOld], "timeline") - 10; }
                        else { return runDotScale(metric, d[variableOld], "timeline") + 15; }
                       else if (d[variableOld] > d[variableLatest]) { return runDotScale(metric, d[variableOld], "timeline") + 15; }
                       else { return runDotScale(metric, d[variableOld], "timeline") - 15; } // if increased over time
                     })
                     .style("text-anchor", function(d) {
                       if (Math.abs(runDotScale(metric, d[variableOld], "timeline") - runDotScale(metric, d[variableLatest], "timeline")) > 90) {
                         if (d[variableOld] > d[variableLatest]) { return "end"; }
                         else { return "start"; }
                       }
                       else if (d[variableOld] > d[variableLatest]) { return "start"; }
                       else { return "end"; }
                     })
                     .style("fill", "none");

    // HTML changes
    document.getElementById("svg-otherMetrics").style.height = h_svgOther_init + "px";
    document.getElementById("button-otherShow").style.display = "inline";
    document.getElementById("button-otherRandomize").style.display = "none";
    document.getElementById("button-otherChange").style.display = "none";
    document.getElementById("button-otherMetric").style.display = "none";
    document.getElementById("otherMetricsTitle").innerHTML = "Access to electricity";

    if (metric == "undernourished") {
      var title = "Prevalence of undernourishment: <tspan id='otherMetricsSubhead'></tspan>";
      var subhead = "Percentage of the population whose food intake is insufficient to meet dietary energy requirements continuously"
    }
    else if (metric == "under5") {
      var title = "Under 5 mortality rate: <tspan id='otherMetricsSubhead'></tspan>";
      var subhead = "Probability per 1,000 that a newborn baby will die before reaching age five";
    }
    else if (metric == "maternal") {
      var title = "Maternal mortality rate: <tspan id='otherMetricsSubhead'></tspan>";
      var subhead = "Number of women who die from pregnancy-related causes while pregnant or within 42 days of pregnancy termination per 100,000 live births";
    }
    else if (metric == "sanitation") {
      var title = "Access to basic sanitation services: <tspan id='otherMetricsSubhead'></tspan>";
      var subhead = "Percentage of people using improved sanitation facilities that are not shared with other households";
    }
    else if (metric == "electricity") {
      var title = "Access to electricity: <tspan id='otherMetricsSubhead'></tspan>";
      var subhead = "Percentage of population with access to electricity";
    }
    document.getElementById("otherMetricsTitle").innerHTML = title;
    document.getElementById("otherMetricsSubhead").innerHTML = subhead;
  }; // end changeMetric
  reset();
  setup();

  // Interactivity
  // TIMELINE BUTTONS
  // Randomize 20 countries
  d3.select("#button-worldRandomize").on("click", function() {
    currMetric = "lifeExpectancy";
    updateView(svg_lifeExpectancy_timeline, "randomize", 1);
  });
  // Sort by years increased
  d3.select("#button-worldChange").on("click", function() {
    currMetric = "lifeExpectancy";
    updateView(svg_lifeExpectancy_timeline, "sortChange", 1);
    // update button styles
    d3.selectAll(".button-world").style("background-color", "transparent");
    d3.select(this).style("background-color", accentColor);
  }); // end on click button-change
  // Sort by life expectancy
  d3.select("#button-worldMetric").on("click", function() {
    currMetric = "lifeExpectancy";
    d3.selectAll(".button-world").style("background-color", "transparent");
    updateView(svg_lifeExpectancy_timeline, "sortMetric", 1);
    // update button styles
    d3.select(this).style("background-color", accentColor);
  }); // end on click button-change

  // LDC BUTTONS
  // Randomize 10
  d3.select("#button-compRandomize").on("click", function() {
    currMetric = "lifeExpectancy";
    updateView(svg_lifeExpectancy_comp, "randomize", 2);
  });
  // Sort by years increased
  d3.select("#button-compChange").on("click", function() {
    currMetric = "lifeExpectancy";
    updateView(svg_lifeExpectancy_comp, "sortChange", 2);
    // update button styles
    d3.selectAll(".button-comp").style("background-color", "transparent");
    d3.select(this).style("background-color", accentColor);
  }); // end on click button-change
  // Sort by metric
  d3.select("#button-compMetric").on("click", function() {
    currMetric = "lifeExpectancy";
    d3.selectAll(".button-comp").style("background-color", "transparent");
    updateView(svg_lifeExpectancy_comp, "sortMetric", 2);
    // update button styles
    d3.select(this).style("background-color", accentColor);
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

  // Other metrics buttons
  d3.select("#button-undernourished").on("click", function() {
    currMetric = "undernourished";
    changeMetric("undernourished");
    d3.select(this).style("background-color", accentColor);
  });
  d3.select("#button-under5").on("click", function() {
    currMetric = "under5";
    changeMetric("under5");
    d3.select(this).style("background-color", accentColor);
  });
  d3.select("#button-maternal").on("click", function() {
    currMetric = "maternal";
    changeMetric("maternal");
    d3.select(this).style("background-color", accentColor);
  });
  d3.select("#button-sanitation").on("click", function() {
    currMetric = "sanitation";
    changeMetric("sanitation");
    d3.select(this).style("background-color", accentColor);
  });
  d3.select("#button-electricity").on("click", function() {
    currMetric = "electricity";
    changeMetric("electricity");
    d3.select(this).style("background-color", accentColor);
  });

  // Show metrics
  d3.select("#button-otherShow").on("click", function() {
    document.getElementById("svg-otherMetrics").style.height = h_svgOther + "px";
    document.getElementById("button-otherShow").style.display = "none";
    document.getElementById("button-otherRandomize").style.display = "inline";
    document.getElementById("button-otherChange").style.display = "inline";
    document.getElementById("button-otherMetric").style.display = "inline";
    showLDC(svg_otherMetrics, "undernourished");
  });
  // Show more LDCs
  d3.select("#button-otherRandomize").on("click", function() {
    updateLDCView(svg_otherMetrics, "randomize");
  });
  d3.select("#button-otherChange").on("click", function() {
    updateLDCView(svg_otherMetrics, "sortChange");
  });
  d3.select("#button-otherMetric").on("click", function() {
    updateLDCView(svg_otherMetrics, "sortMetric");
  });
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
