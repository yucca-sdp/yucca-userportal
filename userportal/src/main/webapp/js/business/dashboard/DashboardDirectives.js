/*
 * SPDX-License-Identifier: EUPL-1.2
 * 
 * (C) Copyright 2019 - 2021 Regione Piemonte
 * 
 */

'use strict';

/* Directives */
var appDirectives = appDirectives || angular.module('userportal.directives', []);
/*
appDirectives.directive('streamCard', function() {
	return {
		restrict : 'E',
		templateUrl : 'partials/dashboard/stream-card.html?'+BuildInfo.timestamp,
	};
});

appDirectives.directive('streamRealtime', function() {
	return {
		restrict : 'E',
		templateUrl : 'partials/dashboard/stream-realtime.html?'+BuildInfo.timestamp,
	};
});
*/

/*
appDirectives.directive('dashboardMenu', function() {
	return {
		restrict : 'E',
		templateUrl : 'partials/dashboard/dashboard-menu.html?'+BuildInfo.timestamp,
	};
});
*/

/** Example real time chart with 3djs - not used, use instead nv3d */
/*
appDirectives.directive('streamComponentsRealTime', function() {
	return {
		restrict : 'E',
		scope : {
			data : '='
		},
		link : function(scope, element) {
			scope.$watchCollection('data', function(newVal, oldVal) {
				redrawLineChart();
			});

			var margin  = {
					top : 10,
					right : 20,
					bottom : 10,
					left : 27
				};
			
			var width = 550 - margin.left - margin.right;
			var height = 280 - margin.top - margin.bottom;
			
			var svg = d3.select(element[0]).append("svg");
			var xAxis, xAxisTop, yAxis, yAxisRight;
			var lineFunc;
			var pathClass="path";

			function setChartParameters() {

				var minX = d3.min(scope.data, function(d) {
					return d.x;
				});
				var maxX = d3.max(scope.data, function(d) {
					return d.x;
				});

				var minY = d3.min(scope.data, function(d) {
					return d.y;
				});
				var maxY = d3.max(scope.data, function(d) {
					return d.y;
				});
//				if (maxY - minY == 0)
//					maxY = 1;
				var xRange = d3.scale.linear().range([ margin.left, width - margin.right ]).domain([ minX, maxX]);
				var yRange = d3.scale.linear().range([ height - margin.top, margin.bottom ]).domain([ minY, maxY ]);
				
				xAxis = d3.svg.axis().scale(xRange).tickSize(1).tickSubdivide(true).ticks(6);
				xAxisTop = d3.svg.axis().scale(xRange).tickSize(1).orient('top').tickSubdivide(false).ticks(6);
				yAxis = d3.svg.axis().scale(yRange).tickSize(1).orient('left').tickSubdivide(true).ticks(5);
				yAxisRight = d3.svg.axis().scale(yRange).tickSize(1).orient('right').tickSubdivide(true).ticks(5);

				// line
				lineFunc = d3.svg.line().x(function(d) {
					return xRange(d.x);
				}).y(function(d) {
					return yRange(d.y);
				}).interpolate('basis');

				
			}

			function drawLineChart() {
					setChartParameters();
				svg.attr('width', width + margin.left + margin.right).attr('height', height + margin.top + margin.bottom).attr("class","graph-container-svg").append("g").attr("transform",
						"translate(" + margin.left + "," + margin.top + ")");

				svg.append('svg:g').attr('class', 'x axis bottom_axis').attr('transform', 'translate(0,' + (height - margin.bottom) + ')').call(xAxis);
				svg.append('svg:g').attr('class', 'x axis top_axis').attr('transform', 'translate(0,' + (0 + margin.top) + ')').call(xAxisTop);
				svg.append('svg:g').attr('class', 'y axis left_axis').attr('transform', 'translate(' + (margin.left) + ',0)').call(yAxis);
				svg.append('svg:g').attr('class', 'y axis right_axis').attr('transform', 'translate(' + (width - margin.right) + ',0)').call(yAxisRight);

				svg.selectAll(".hline").data(d3.range(4)).enter().append("line").attr("y1", function(d) {
					return (d + 1) * (height- margin.bottom -margin.top) / 4;
				}).attr("y2", function(d) {
					return (d + 1) * (height- margin.bottom -margin.top) / 4;
				}).attr("x1", function(d) {
					return 0;
				}).attr("x2", function(d) {
					return width - margin.right - margin.left;
				}).style("stroke", "#eee").attr("transform", "translate(" + margin.left + "," + margin.top + ")");
				
				svg.selectAll(".vline").data(d3.range(5)).enter().append("line").attr("x1", function(d) {
					return (d + 1)  *( width- margin.left - margin.right) / 6 + margin.left;
				}).attr("x2", function(d) {
					return (d + 1) *( width- margin.left - margin.right) / 6 + margin.left;
				}).attr("y1", function(d) {
					return 0 + margin.bottom;
				}).attr("y2", function(d) {
					return height - margin.bottom;
				}).style("stroke", "#eee");

				svg.append('svg:path').attr('d', lineFunc(scope.data)).attr('stroke', '#0084c8').attr('stroke-width', 2).attr('fill', 'none').attr('class', pathClass);
			}

			function redrawLineChart() {
				setChartParameters();
				svg.selectAll("g.x.axis.top_axis").call(xAxisTop);
				svg.selectAll("g.x.axis.bottom_axis").call(xAxis);
				svg.selectAll("g.y.axis.right_axis").call(yAxisRight);
				svg.selectAll("g.y.axis.left_axis").call(yAxis);

				svg.selectAll("." + pathClass).attr({
					d : lineFunc(scope.data)
				});

			}

			drawLineChart();

		}
	};
});
*/

/** Example linebar chart with 3djs - not used, use instead nv3d */
/*
appDirectives.directive('crD3Bars', function() {
	return {
		restrict : 'E',
		scope : {
			data : '='
		},
		link : function(scope, element) {
			var margin = {
				top : 0,
				right : 0,
				bottom : 0,
				left : 0
			}, width = 400 - margin.left - margin.right, height = 360 - margin.top - margin.bottom;
			var svg = d3.select(element[0]).append("svg").attr('width', width + margin.left + margin.right).attr('height', height + margin.top + margin.bottom)
					.append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")");

			var x = d3.scale.ordinal().rangeRoundBands([ 0, width ], .1);
			var y = d3.scale.linear().range([ height, 0 ]);

			var xAxis = d3.svg.axis().scale(x).orient("bottom");

			var yAxis = d3.svg.axis().scale(y).orient("left").ticks(10);

			// Render graph based on 'data'
			scope.render = function(data) {
				// Set our scale's domains
				x.domain(data.map(function(d) {
					return d.name;
				}));
				y.domain([ 0, d3.max(data, function(d) {
					return d.count;
				}) ]);
				// Redraw the axes
				svg.selectAll('g.axis').remove();
				// X axis
				svg.append("g").attr("class", "x axis").attr("transform", "translate(0," + height + ")").call(xAxis);
				// Y axis
				svg.append("g").attr("class", "y axis").call(yAxis).append("text").attr("transform", "rotate(-90)").attr("y", 6).attr("dy", ".71em").style(
						"text-anchor", "end").text("Count");
				var bars = svg.selectAll(".bar").data(data);
				bars.enter().append("rect").attr("class", "bar").attr("x", function(d) {
					return x(d.name);
				}).attr("width", x.rangeBand());

				// Animate bars
				bars.transition().duration(1000).attr('height', function(d) {
					return height - y(d.count);
				}).attr("y", function(d) {
					return y(d.count);
				});
			};

			// Watch 'data' and run scope.render(newVal) whenever it changes
			// Use true for 'objectEquality' property so comparisons are done on
			// equality and not reference
			scope.$watch('data', function() {
				scope.render(scope.data);
			}, true);
		}
	};
});*/