'use strict';

angular.module('d3projApp')
  .directive('workTable', function ($log, $window, docIconSize) {
    return {
      restrict: 'AC',
      link: function (scope, element) {

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

          scope.redrawDocs();
        });
      }
    };
  });
