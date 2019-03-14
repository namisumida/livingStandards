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
                             {year: 1960, value: 40, group:"ldc"}, {year: 1980, value: 48, group:"ldc"}, {year: 2000, value: 56, group:"world"}, {year: 2016, value: 64, group:"ldc"}]
  var data_undernourished = [{year: 2000, value: .15, group:"world"}, {year: 2016, value: .11, group:"world"},
                             {year: 2000, value: .03, group:"usa"}, {year: 2016, value: .03, group:"usa"},
                             {year: 2000, value: .23, group:"ldc"}, {year: 2016, value: .35, group:"ldc"}]
  var data_under5mortality = [{year: 1990, value: 93, group:"world"}, {year: 2000, value: 77, group:"world"}, {year: 2010, value: 52, group:"world"}, {year: 2017, value: 30, group:"world"},
                             {year: 1990, value: 11, group:"usa"}, {year: 2000, value: 8, group:"usa"}, {year: 2010, value: 7, group:"usa"}, {year: 2017, value: 7, group:"usa"},
                             {year: 1990, value: 175, group:"ldc"}, {year: 2000, value: 137, group:"ldc"}, {year: 2010, value: 90, group:"world"}, {year: 2017, value: 66, group:"ldc"}]
  var data_maternalMortality = [{year: 1990, value: 385, group:"world"}, {year: 2000, value: 341, group:"world"}, {year: 2010, value: 246, group:"world"}, {year: 2015, value: 174, group:"world"},
                             {year: 1990, value: 12, group:"usa"}, {year: 2000, value: 12, group:"usa"}, {year: 2010, value: 14, group:"usa"}, {year: 2015, value: 14, group:"usa"},
                             {year: 1990, value: 903, group:"ldc"}, {year: 2000, value: 732, group:"ldc"}, {year: 2010, value: 519, group:"world"}, {year: 2015, value: 436, group:"ldc"}]
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
  var w_locationLabel = (w - marginLeft - marginRight)/3;
  console.log(w);
  console.log(w_locationLabel);
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
                      .attr("y", 310)
                      .text(function(d) { return d; })
                      .call(wrap, 150)
    svg_lifeExpectancy.selectAll("rect")
                      .data(data_lifeExpectancy)

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
