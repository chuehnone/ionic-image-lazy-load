/**
 * Created by PAVEI on 30/09/2014.
 * Updated by Ross Martin on 12/05/2014
 * Updated by Chuehnone on 04/02/2015
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
        var top = $element[0].getBoundingClientRect().top;
        var clientHeight = $document[0].documentElement.clientHeight;
        return top >= 0 && top <= clientHeight;
      }

      // on load set src
      if (isInView()) {
        $element[0].src = $attributes.imageLazySrc;
      }

      $scope.$on('lazyScrollEvent', function () {
        $timeout(function(){
          if ($element[0].src != $attributes.imageLazySrc && isInView()) {
            $element[0].src = $attributes.imageLazySrc;
          }
        }, 0);
      });

      // unbind event listeners if element was destroyed
      // it happens when you change view, etc
      $element.on('$destroy', function () {
        // console.log("destroy\n");
      });
    }
  };
}]);