'use strict';

angular.module('d3projApp')
  .controller('MainCtrl', function ($scope, docIconSize) {
    $scope.docs = [];

    var left = docIconSize.width/2;
    var top = docIconSize.width/2;
    var width = docIconSize.width;
    var height = docIconSize.height;
    var w_gap = docIconSize.width/2;

    $scope.Init = function() {
      for (var i=0; i<3; i++) {
        var doc = {};
        doc.x = left + i * (width + w_gap);
        doc.y = top;
        doc.w = width;
        doc.h = height;
        doc.link = '#' + i;
        doc.id = CryptoJS.MD5(Date.now().toString());

        $scope.docs.push(doc);
      }

      $scope.top_zone = 15;

      $scope.docs[0].tags = ['apple','peach','plum'];
      $scope.docs[1].tags = ['apple'];
      $scope.docs[2].tags = ['carrot','onion'];
       /*$scope.docs[3].tags = ['peach','plum']; */
    };

    $scope.addDoc = function(file){
      var doc = {};

      doc.x = file.x; // left + $scope.docs.length * (width + w_gap);
      doc.y = file.y; // top;
      doc.w = width;
      doc.h = height;
      doc.link = file.name;
      doc.tags = ['peach','plum'];
      doc.id = CryptoJS.MD5(Date.now().toString());

      $scope.$apply(function(){
        $scope.docs.push(doc);
        //$scope.redrawDocs();
      });

    };

    $scope.redrawDocs = function(){
      left = docIconSize.width/2;
      top = docIconSize.width/2;
      width = docIconSize.width;
      height = docIconSize.height;
      w_gap = docIconSize.width/2;

      if (width) {
        for (var i=0; i<$scope.docs.length; i++) {
          $scope.docs[i].x = left + i * (width + w_gap);
          $scope.docs[i].y = top;
          $scope.docs[i].w = width;
          $scope.docs[i].h = height;
/*
          $scope.docs[i].x = $scope.workTableW - w_gap - width;
          $scope.docs[i].y = $scope.top_zone *(i+1) + i*height;
          $scope.docs[i].w = width;
          $scope.docs[i].h = height; */
        }
      }
    };
  });
