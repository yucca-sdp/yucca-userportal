/*
 * SPDX-License-Identifier: EUPL-1.2
 * 
 * (C) Copyright 2019 - 2021 Regione Piemonte
 * 
 */

appDirectives.directive('browseTree', function() {
	return {
		restrict : 'E',
		scope : {
			data : '='
		},
		template : '<div id="browseTree{{panelIndex}}"></div>',
		link : function(scope, elem, attr) {
			console.log("attr", attr);
			console.log("elem", elem);
			console.log("scope", scope);
			scope.panelIndex = Math.floor((Math.random() * 10000) + 1);

			var margin = {
				top : 20,
				right : 120,
				bottom : 20,
				left : 120
			};
			
			if((typeof attr.marginTop != 'undefined' && attr.marginTop != null))
				margin.top = parseInt(attr.marginTop);
			if((typeof attr.marginRight != 'undefined' && attr.marginRight != null))
				margin.right = parseInt(attr.marginRight);
			if((typeof attr.marginBottom != 'undefined' && attr.marginBottom != null))
				margin.bottom = parseInt(attr.marginBottom);
			if((typeof attr.marginLeft != 'undefined' && attr.marginLeft != null))
				margin.left = parseInt(attr.marginLeft);
			
			console.log("margin",margin);
			var fixHeight = (typeof attr.fixHeight != 'undefined' && attr.fixHeight == 'true') ?  true:false;
			var nodeIndex = 0, root;
			var rowHeight = (typeof attr.rowHeight == 'undefined' || attr.rowHeight == null) ?  32  :attr.rowHeight;
			var rowDepth = (typeof attr.rowDepth == 'undefined' || attr.rowDepth == null) ?  280  :attr.rowDepth;
			var radius = (typeof attr.radius == 'undefined' || attr.radius == null) ?  rowHeight/3 : parseInt(attr.radius);
			var levelDepth = {};
			
			var emptyColor = (typeof attr.emptyColor == 'undefined' || attr.emptyColor == null) ?  "#f1f1ab"  :attr.emptyColor;
			var fullColor = (typeof attr.fullColor == 'undefined' || attr.fullColor == null) ?  "#fff"  :attr.fullColor;

			scope.$watch('data', function() {
				console.log("attr.width in", attr.width);
				var width = (typeof attr.width == 'undefined' || attr.width == null) ? 800 : parseInt(attr.width);
				var height = (typeof attr.height == 'undefined' || attr.height == null) ? 50 : parseInt(attr.height);
				height = height - margin.top - margin.bottom;
				console.log("width in", width);

				var tree = d3.layout.tree().size([ height, width ]);

				var diagonal = d3.svg.diagonal().projection(function(d) {
					return [ d.y, d.x ];
				});

				d3.select("#browseTree" + scope.panelIndex + " svg").remove();
				var vis = d3.select("#browseTree" + scope.panelIndex).append("svg").attr("width", width + margin.right + margin.left).attr("height",
						height + margin.top + margin.bottom).append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")");

				root = scope.data;

				// d3.select(self.frameElement).style("height", "500px");
				root.x0 = height / 2;
				root.y0 = 0;

				function toggleAll(d) {
					if (d.children) {
						d.children.forEach(toggleAll);
						toggle(d);
					}
				}

				root.children.forEach(toggleAll);
				update(root);
				function update(source) {
					var duration = d3.event && d3.event.altKey ? 5000 : 500;

					// compute the new height
					var levelWidth = new Array();
					levelWidth[0] = 1;
					var childCount = function(level, n) {

						if (n.children && n.children.length > 0) {
							if (levelWidth.length <= level + 1)
								levelWidth.push(0);

							levelWidth[level + 1] += n.children.length;
							n.children.forEach(function(d) {
								childCount(level + 1, d);
							});
						}
					};
					childCount(0, root);
					var newHeight = d3.max(levelWidth) * rowHeight;
					console.log("hhhh", newHeight);
					if(fixHeight)
						d3.select("#browseTree" + scope.panelIndex).attr("style", "height:"+newHeight+"px");
					d3.select("#browseTree" + scope.panelIndex + " svg").attr("height", newHeight);
					tree = tree.size([ newHeight, width ]);

					// Compute the new tree layout.
					var nodes = tree.nodes(root).reverse();

					// Normalize for fixed-depth.
					nodes.forEach(function(d) {
						//var currentDepth = d.name.length * 12;
						var invisible = vis.append("svg:text").attr("id", "invisible").attr("class",d.cssClass).attr("x",0).attr("y",0).text(d.name + " [000]" );
						var currentDepth = invisible.node().getBBox().width*1.8;
						d3.select("#invisible").remove();
						if (typeof levelDepth["depth_" + d.depth] == 'undefined')
							levelDepth["depth_" + d.depth] = d.children || d._children ? currentDepth : rowDepth;
						else if (currentDepth > levelDepth["depth_" + d.depth])
							levelDepth["depth_" + d.depth] = currentDepth;

					});

					nodes.forEach(function(d) {
						d.y = 0;
						for (var int = 0; int <= d.depth; int++) {
							d.y += levelDepth["depth_" + int];
						}
					});

					// Update the nodes...
					var node = vis.selectAll("g.node").data(nodes, function(d) {
						return d.id || (d.id = ++nodeIndex);
					});

					// Enter any new nodes at the parent's previous position.
					var nodeEnter = node.enter().append("svg:g").attr("class", "node").attr("transform", function(d) {
						return "translate(" + source.y0 + "," + source.x0 + ")";
					});

					nodeEnter.append("svg:circle").attr("r", 1e-6).style("fill", function(d) {
						return d._children ? emptyColor : fullColor;
					}).on("click", function(d) {
						toggle(d);
						update(d);
					});
					

					nodeEnter.append("svg:text").attr("id", function(d) {
						return "text_" + d.depth + "_" + d.id;
					}).attr("x", function(d) {
						return d.count ? (d.children || d._children ? "-3em" : "3em"):"-"+(rowHeight/2);
					}).attr("dy", ".35em").attr("text-anchor", function(d) {
						return d.children || d._children ? "end" : "start";
					}).attr("class", function(d) {
						return d.cssClass;
					}).text(function(d) {
						return d.name;
					}).style("fill-opacity", 1e-6).on("click", function(d) {
						d.search(d.filter);
						//update(d);
					});

					nodeEnter.append("svg:text").attr("x", function(d) {
						return d.children || d._children ? -15 : 15;
					}).attr("dy", ".35em").attr("text-anchor", function(d) {
						return d.children || d._children ? "end" : "start";
					}).attr("class", "count").text(function(d) {
						return d.count ? "[" + d.count + "]" : "";
					}).style("fill-opacity", 1);

					nodeEnter.append("svg:text").attr("x", function(d) {
						var xResult = -1 * d3.select("#text_" + d.depth + "_" + d.id).node().getBBox().x;
						return d.children || d._children ? -1 * xResult - 10 : xResult + 10;
					}).attr("dy", ".35em").attr("text-anchor", function(d) {
						return d.children || d._children ? "end" : "start";
					}).attr("class", function(d) {
						return d.cssIcon;
					}).text(function(d) {
						return d.icon;
					}).style("fill-opacity", 1);

					// Transition nodes to their new position.
					var nodeUpdate = node.transition().duration(duration).attr("transform", function(d) {
						return "translate(" + d.y + "," + d.x + ")";
					});

					nodeUpdate.select("circle").attr("r", radius).style("fill", function(d) {
						return d._children ? emptyColor : fullColor;
					});

					nodeUpdate.select("text").style("fill-opacity", 1);

					// Transition exiting nodes to the parent's new position.
					var nodeExit = node.exit().transition().duration(duration).attr("transform", function(d) {
						return "translate(" + source.y + "," + source.x + ")";
					}).remove();

					nodeExit.select("circle").attr("r", 1e-6);

					nodeExit.select("text").style("fill-opacity", 1e-6);

					// Update the links…
					var link = vis.selectAll("path.link").data(tree.links(nodes), function(d) {
						return d.target.id;
					});

					// Enter any new links at the parent's previous position.
					link.enter().insert("svg:path", "g").attr("class", "link").attr("d", function(d) {
						var o = {
							x : source.x0,
							y : source.y0
						};
						return diagonal({
							source : o,
							target : o
						});
					}).transition().duration(duration).attr("d", diagonal);

					// Transition links to their new position.
					link.transition().duration(duration).attr("d", diagonal);

					// Transition exiting nodes to the parent's new position.
					link.exit().transition().duration(duration).attr("d", function(d) {
						var o = {
							x : source.x,
							y : source.y
						};
						return diagonal({
							source : o,
							target : o
						});
					}).remove();

					// Stash the old positions for transition.
					nodes.forEach(function(d) {
						d.x0 = d.x;
						d.y0 = d.y;
					});
				}

				// Toggle children.
				function toggle(d) {
					if (d.children) {
						d._children = d.children;
						d.children = null;
					} else {
						d.children = d._children;
						d._children = null;
					}
				}

			});

		}
	};
});
