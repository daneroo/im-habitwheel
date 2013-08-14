
var g = d3.select("svg").append("g").attr("id", "chart");

// radius range maping
var radius = d3.scale.linear().domain([0,5]).range([100,270]);
var radiusPad = 0.1; // blank space in a stack
var ir = function(d, i) {return radius(d.radius+0+radiusPad);}
var or = function(d, i) {return radius(d.radius+1-radiusPad);}

var angle = d3.scale.linear().domain([0,5]).range([0,2*Math.PI]);
var anglePad = .1; // blank angle between stacks
var sa = function(d, i) {return angle(d.angle+0+anglePad);}
var ea = function(d, i) {return angle(d.angle+1-anglePad);}

// http://hslpicker.com/
// http://chir.ag/projects/name-that-color/
var hues = { 
  red:0,
  orange:30,
  yellow:60,
  chartreuse:90,
  green:120,
  springgreen:150,
  cyan:180,
  azure:210,
  blue:240,
  violet:270,
  magenta:300,
  rose:330
}

var sat = d3.scale.linear().domain([0.0, 1]).range([.2,1]);
// var hue = d3.scale.linear().domain([0, 4]).range([0,360]);
// var hue = d3.scale.quantize().domain([0, 4]).range([hues.red,hues.orange,hues.yellow,hues.green,hues.azure]);
var hue = d3.scale.quantize().domain([0, 4]).range([hues.red,hues.green,hues.yellow,hues.orange,hues.azure]);

var color = function(d, i) {
  var h = hue(d.angle);
  var s = sat(d.value)
  return d3.hsl(h,s,.5)
}
 
//Draw the chart
// var color = d3.scale.linear().domain([0.04, 1]).range(["white", "red"]);
// console.log(color)
d3.select('#chart').selectAll('path').data(habit_data)
  .enter().append('svg:path')
  .attr('d', d3.svg.arc().innerRadius(ir).outerRadius(or).startAngle(sa).endAngle(ea))
  .attr('transform', 'translate(300, 300)')
  // .attr('fill', color)
  .attr('fill', color)
  .attr("stroke", "gray")
  .attr("stroke-width", "0.1px")
  .on('mouseover', render_value)
  .on('mouseout', randText);

//Labels
var day_labels = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
for(var i=0; i<5; i++) {
  var label_rad = radius(i+.3);
  var label = day_labels[i];
  // var label = '-01234567890123456789-';
  var label_angle = 4.73;
  d3.select("svg").append("def")
    .append("path")
    .attr("id", "day_path"+i)
    .attr("d", "M"+(300-label_rad)+" 300 a"+label_rad+" "+label_rad+" 0 1 1 0 1");
  d3.select("svg").append("text")
    .attr("class", "day label")
    .attr("text-anchor","middle")
    .append("textPath")
    .attr("xlink:href", "#day_path"+i)
    .attr("startOffset","25%")
    .text(label);
}

// Labels over the radial stacks
label_rad = 280;
d3.select("svg").append("def")
  .append("path")
  .attr("id", "time_path")
  .attr("d", "M300 "+(300-label_rad)+" a"+label_rad+" "+label_rad+" 0 1 1 -1 0");
for(var i=0; i<5; i++) {
  d3.select("svg").append("text")
    .attr("class", "time label")
    .attr("text-anchor","middle")
    .append("textPath")
    .attr("xlink:href", "#time_path")
    .attr("startOffset", ((i+0.5)*100/5)+"%")
    .text('habit-'+(i+1));
}

randText();

//Define events

d3.selectAll("#status").on('click', function() {
  randText();
});

d3.select('#upweek').on('click', function() {
  randText();
  randData();
});

d3.select('#downweek').on('click', function() {
  randText();
  randData(true);
})

function rnd(max,precision){
  max=max||1;
  precision=precision||0;
  var r = Math.random()*max; 
  return r.toFixed(precision);
}

function randData(round) {  
  habit_data.forEach(function(d){
    d.value=Math.random();;
    if (round) d.value=Math.round(d.value);
  });
  d3.select('#chart').selectAll('path').data(habit_data).attr('fill', color);
}

function render_value(d, i) {
  d3.select('#status g.first text.time').text('Habit-'+(d.angle+1));
  d3.select('#status g.first text.value').text(d.value.toFixed(2));
  d3.select('#status g.first text.units').text('points');
}

function randText() {
  d3.select('#status g.first text.time').text('Score');
  d3.select('#status g.second text.time').text('Second-'+rnd());
  d3.select('#status g.third text.time').text('Third-'+rnd());

  d3.select('#status g.first text.value').text(rnd(10,2));
  d3.select('#status g.second text.value').text(rnd(10,2));
  d3.select('#status g.third text.value').text(rnd(10,2));

  d3.select('#status g.first text.units').text('units-'+rnd());
  d3.select('#status g.second text.units').text('units-'+rnd());
  d3.select('#status g.third text.units').text('units-'+rnd());
}

