'use strict';

angular.module('d3projApp')
  .directive('drawLine', function ($log) {
    return {
      restrict: 'A',
      scope:{},
      
      link: function (scope, element, attr) {
        var svg = d3.select('svg');
       // $log.info(svg);

        var cursor = element.css('cursor');
        //var draw = SVG('drawing');
        var draw = false;
        var canvas = angular.element('#drawing');
        var ns = 'http://www.w3.org/2000/svg';
        scope.line = [];
        scope.tag = [];
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

          for (var i=0; i<scope.line.length; i++) {
            if (scope.line[i]) { scope.line[i].remove(); }
          }
          for (var j=0; j<scope.tag.length; j++) {
            if (scope.tag[j]) { scope.tag[j].remove(); }
          }

          rect1 = scope.$parent.$parent.docs[this.getAttribute('id')];

          var X = parseInt(attr.x) + parseInt(attr.width)/2;
          var Y = parseInt(attr.y);

          scope.line[0] = document.createElementNS(ns,'line');  // stick
          scope.line[0].setAttribute('x1', X);
          scope.line[0].setAttribute('y1', Y);
          scope.line[0].setAttribute('x2', X);
          scope.line[0].setAttribute('y2', Y-10);
          scope.line[0].style.stroke = 'brown';

          scope.line[1] = document.createElementNS(ns,'line');  // line
          scope.line[1].setAttribute('x1', X);
          scope.line[1].setAttribute('y1', Y-10);
          scope.line[1].setAttribute('x2',evtPoint.x);
          scope.line[1].setAttribute('y2',evtPoint.y);
          scope.line[1].style.stroke = 'brown';

          scope.line[2] = document.createElementNS(ns,'line');  // stick

          canvas.append(scope.line);

          scope.tag[0] = document.createElementNS(ns,'text');
          scope.tag[1] = document.createElementNS(ns,'text');
          canvas.append(scope.tag);

          draw = true;
        });

        canvas.on('mousemove', function(event){
          if (draw === true) {
            var evtPoint = eventCoord(event);
            scope.line[1].setAttribute('x2', evtPoint.x);
            scope.line[1].setAttribute('y2', evtPoint.y);
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

              if (((evtPoint.x >= r.x) && (evtPoint.x <= (r.x+ r.w))) &&
                  ((evtPoint.y >= r.y) && (evtPoint.y <= (r.y+ r.h)))) {
                // mouse up event inside the rect

                if (!((parseInt(scope.line[0].getAttribute('x1')) === parseInt(r.x + r.w/2)) &&
                    (parseInt(scope.line[0].getAttribute('y1')) === parseInt(r.y)))) {
                  // but not inside the same rect

                  scope.line[2].setAttribute('x1', r.x + r.w/2);
                  scope.line[2].setAttribute('y1', r.y);
                  scope.line[2].setAttribute('x2', r.x + r.w/2);
                  scope.line[2].setAttribute('y2', r.y-10);
                  scope.line[2].style.stroke = 'brown';

                  scope.line[1].setAttribute('x2', r.x + r.w/2);
                  scope.line[1].setAttribute('y2', r.y-10);

                  // check for common tags
                  var commonTags = rect1.tags.filter(function(tag){
                    return r.tags.indexOf(tag) !== -1;
                  });

                  if (commonTags.length > 0) {
                    scope.tag[0].setAttribute('x', parseInt(scope.line[0].getAttribute('x1')));
                    scope.tag[0].setAttribute('y', parseInt(scope.line[0].getAttribute('y1'))-20);
                    scope.tag[0].setAttribute('style', "font-size:10; stroke:#acacac");
                    scope.tag[0].textContent = commonTags.join(',');

                    scope.tag[1].setAttribute('x', r.x + r.w/2);
                    scope.tag[1].setAttribute('y', r.y-20);
                    scope.tag[1].setAttribute('style', "font-size:10; stroke:#acacac");
                    scope.tag[1].textContent = commonTags.join(',');
                  }

                  toRemove = false;
                  break;
                }
              }
            }

            if (toRemove) {
              for (var j=0; j<scope.line.length; j++) {
                if (scope.line[j]) { scope.line[j].remove(); }
              }
              for (var k=0; k<scope.tag.length; k++) {
                if (scope.tag[k]) { scope.tag[k].remove(); }
              }
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
