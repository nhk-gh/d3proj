'use strict';

angular.module('d3projApp')
  .directive('drawLine', function ($log) {
    return {
      restrict: 'A',
      scope:{},
      
      link: function (scope, element, attr) {
        var svg = d3.select('svg');
        var lineGenerator = d3.svg.line()
          .x(function(d) { return d[0]; })
          .y(function(d) { return d[1]; });
        var lineData = [[0,0],[300,300]];
        var path;
        // $log.info(svg);

        var cursor = element.css('cursor');
        //var draw = SVG('drawing');
        var draw = false;

        var canvas = angular.element('#drawing');
        /*
        var ns = 'http://www.w3.org/2000/svg';
        scope.line = [];
        scope.tag = [];
        */
        var rect1;

        element.on('mouseover', function(){
          element.css('cursor', 'crosshair');
        });

        element.on('mouseleave', function(){
          //$log.info(event);
          element.css('cursor', cursor);
        });

        element.on('mousedown', function(event) {
          var evtPoint = eventCoord(event);

          rect1 = scope.$parent.$parent.docs[this.getAttribute('id')];

          var X = parseInt(attr.x) + parseInt(attr.width)/2;
          var Y = parseInt(attr.y) + scope.$parent.$parent.top_zone/2;

          lineData = [[X,Y],[evtPoint.x,evtPoint.y]];
          path = svg.append('path').datum(lineData).attr('d', lineGenerator).attr('stroke', 'red');

          draw = true;
        });

        canvas.on('mousemove', function(event){
          if (draw === true) {
            var evtPoint = eventCoord(event);

            lineData[1][0] = evtPoint.x;
            lineData[1][1] = evtPoint.y;
            path.datum(lineData).attr('d', lineGenerator);
          }
        })
        .on('mouseup', function(event) {
          var toRemove = true;

          if (draw) {
            draw = false;

            var evtPoint = eventCoord(event);
            var r, rects = scope.$parent.$parent.docs;

            for (var i=0; i< rects.length; i++) {
              r = rects[i];
              //$log.info(r.id + ' : ' + rect1.id);

              if (((evtPoint.x >= r.x) && (evtPoint.x <= (r.x+ r.w))) &&
                  ((evtPoint.y >= r.y) && (evtPoint.y <= (r.y+ r.h)))) {
                // mouse up event inside the rect

                /*if (!((parseInt(scope.line[0].getAttribute('x1')) === parseInt(r.x + r.w/2)) &&
                    (parseInt(scope.line[0].getAttribute('y1')) === parseInt(r.y)))) {*/
                if (r.id !== rect1.id) {
                  //but NOT inside the same rect

                  // check for common tags
                  var commonTags = rect1.tags.filter(function(tag){
                    return r.tags.indexOf(tag) !== -1;
                  });

                  if (commonTags.length > 0) {
                    /*scope.tag[0].setAttribute('x', parseInt(scope.line[0].getAttribute('x1')));
                    scope.tag[0].setAttribute('y', parseInt(scope.line[0].getAttribute('y1'))-20);
                    scope.tag[0].setAttribute('style', "font-size:10; stroke:#acacac");
                    scope.tag[0].textContent = commonTags.join(',');

                    scope.tag[1].setAttribute('x', r.x + r.w/2);
                    scope.tag[1].setAttribute('y', r.y-20);
                    scope.tag[1].setAttribute('style', "font-size:10; stroke:#acacac");
                    scope.tag[1].textContent = commonTags.join(',');    */
                    svg.append('text').text(commonTags.join(','))
                      .attr({
                        x: r.x + r.w/2,
                        y: r.y-20
                      })
                      .style({
                        'font-size': '10px',
                        'font-family': 'arial'
                      })
                  }

                  toRemove = false;
                  break;
                }
              }
            }

            if (toRemove) {
              // mouse up event inside the same rect or on the work table
              path.remove();

            }
          }
        });

        var eventCoord = function (event) {
          /*var posx = 0;
          var posy = 0;
          var e;

          if (!event)
            e = window.event;
          else
            e = event;

          if (e.pageX || e.pageY) {
            posx = e.pageX;
            posy = e.pageY;
          } else {
            if (e.clientX || e.clientY)	{
              posx = e.clientX + document.body.scrollLeft
                + document.documentElement.scrollLeft;
              posy = e.clientY + document.body.scrollTop
                + document.documentElement.scrollTop;
            }
          }
          // posx and posy contain the mouse position relative to the document
          // Do something with this information   */
          return {x: event.offsetX, y: event.offsetY};
        };
      }
    };
  });
