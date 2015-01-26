/**
 * Created by PAVEI on 30/09/2014.
 * Updated by Ross Martin on 12/05/2014
 * Updated by Chuehnone on 26/01/2015
 */

angular.module('ionicLazyLoad', []);

angular.module('ionicLazyLoad')

.directive('lazyScroll', ['$rootScope', '$timeout', function($rootScope, $timeout) {
  return {
    restrict: 'A',
    link: function ($scope, $element) {
      var scrollTimeoutId = 0;

      $scope.invoke = function() {
        $rootScope.$broadcast('lazyScrollEvent');
      };

      $element.bind('scroll', function() {
        $timeout.cancel(scrollTimeoutId);

        // wait and then invoke listeners (simulates stop event)
        scrollTimeoutId = $timeout($scope.invoke, 0);
      });
    }
  };
}])

.directive('imageLazySrc', ['$document', '$timeout', function ($document, $timeout) {
  return {
    restrict: 'A',
    link: function ($scope, $element, $attributes) {
      function isInView() {
        // console.log("is:"+$attributes.imageId+"\n");
        var imageRect = $element[0].getBoundingClientRect();
        var imageRectTop = imageRect.top;
        var imageRectBottom = imageRect.bottom;
        var clientHeight = $document[0].documentElement.clientHeight + (imageRectBottom - imageRectTop);
        // console.log("T:"+imageRect.top+", B:"+imageRect.bottom+",N:"+clientHeight+"\n");
        return imageRectTop >= 0 && imageRectBottom <= clientHeight;
      }

      // on load set src
      if (isInView()) {
        // console.log("init:"+$attributes.imageId+"\n");
        $element[0].src = $attributes.imageLazySrc;
      }

      $scope.$on('lazyScrollEvent', function () {
        $scope.$evalAsync(function(){
          // console.log($attributes.imageId+"\n");
          if ($element[0].src != $attributes.imageLazySrc && isInView()) {
            $element[0].src = $attributes.imageLazySrc;
          }
        });
      });

      // unbind event listeners if element was destroyed
      // it happens when you change view, etc
      $element.on('$destroy', function () {
        // console.log("destroy\n");
      });
    }
  };
}]);