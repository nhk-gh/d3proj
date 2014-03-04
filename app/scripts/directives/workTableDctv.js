'use strict';

angular.module('d3projApp')
  .directive('workTable', function ($log, $window, docIconSize) {
    return {
      restrict: 'AC',
      link: function (scope, element) {
        var svg = d3.select('svg');
        var diagonal = d3.svg.diagonal();
        var connectionsVisible = false;
        var paths, circles, labels = [];

        scope.initDocIconSize = function() {
          scope.elementWidth = element.width();
        };
        scope.initDocIconSize();

        angular.element($window).bind('resize', function(evt){
          scope.elementWidth = element.width();
          scope.$apply();
        });

        scope.$watch('elementWidth', function(newVal, oldVal){
          docIconSize.width = docIconSize.width * newVal / oldVal;
          docIconSize.height = docIconSize.width * 1.2;

          scope.workTableW = newVal;
          scope.redrawDocs();
          scope.redrawConnections();
        });

        scope.connectDocs = function() {
          var source = {
            x: scope.mainDoc.x + scope.mainDoc.w,
            y: scope.mainDoc.y + scope.mainDoc.h/2
          };

          var targets = [];
          for (var i=0; i < scope.docs.length; i++) {
            var item = {};
            var d = scope.docs[i];
            item.x = d.x;
            item.y = d.y + d.h/2;
            targets.push(item);
          }

          // create the link pairs
          var links = targets.map(function(target) {
            return { source: source, target: target };
          });

          // use the diagonal generator to take our links and create the the curved paths
          // to connect our nodes
          paths = svg.selectAll('path').data(links).enter().append('path')
            .attr({
              d:      diagonal,
              stroke:'firebrick',
              fill:  'none',
              class: 'path-hover'
            })
            .on('click', function(evt){
              element.find('#path-prop').removeClass('hidden');

            });

          // add all the nodes!
          var nodes = targets.concat(source);
          //$log.info(nodes);
          circles = svg.selectAll('circle').data(nodes).enter().append('circle')
            .attr({
              r: 2,
              cx: function(d){ return d.x; },
              cy: function(d){ return d.y; },
              fill: 'firebrick',
              stroke: '#333'
            });

          for (var j=0; j<targets.length; j++) {
            // check for common tags
            var commonTags = scope.mainDoc.tags.filter(function(tag) {
              return scope.docs[j].tags.indexOf(tag) !== -1;
            });

            if (commonTags.length > 0) {
              labels.push(svg.append('text').text(commonTags.join(', '))
                .attr({
                  x: targets[j].x - 150,
                  y: targets[j].y
                })
                .style({
                  'font-size': '10px',
                  'font-family': 'arial'
                }) );
            } else {
              paths[0][j].remove();
              circles[0][j].remove();
            }
          }
          connectionsVisible = true;
        };

        scope.redrawConnections = function() {
          if (connectionsVisible) {
            /*for (var i=0; i<paths.length; i++) {
              if (paths[i]) {
                paths.remove();
              }
            }
            for (var j=0; j<circles.length; j++) {
              if (circles[j]) {
                circles.remove();
              }
            }*/
            paths.remove();
            circles.remove();
            labels = [];

            svg.selectAll('text').remove();
            //svg.selectAll('.path-hover').remove();
            //svg.selectAll('circle').remove();

            scope.connectDocs();
          }
        };

        scope.setMainDoc = function(ind){
          svg.select('#g'+ind).transition().duration(2000)
            .attr('transform', 'scale(2,2) ' +
              'translate('+(scope.mainDoc.x*0.5-scope.docs[ind].x)+','+(scope.mainDoc.y*0.5-scope.docs[ind].y)+')');


            svg.select('#main-doc').transition().duration(2000)
              .attr('transform',
                'translate('+(scope.docs[ind].x-scope.mainDoc.x*0.5)+','+(scope.docs[ind].y-scope.mainDoc.y*0.5) + ') '+
                'scale(0.5,0.5)')
              .each('end', function() {
                scope.$apply(function() {
                  var temp = scope.docs[ind];
                  scope.docs[ind] = scope.mainDoc;
                  scope.mainDoc = temp;
                  svg.select('#main-doc').attr('transform','');
                  scope.redrawDocs();
                });
                //
              });

        };
      }
    };
  });
