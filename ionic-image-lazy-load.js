/**
 * Created by PAVEI on 30/09/2014.
 * Updated by Ross Martin on 12/05/2014
 * Updated by Chuehnone on 14/01/2015
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
        var clientHeight = $document[0].documentElement.clientHeight;
        var clientWidth = $document[0].documentElement.clientWidth;
        var imageRect = $element[0].getBoundingClientRect();
        return imageRect.top >= 0 && imageRect.bottom/3 <= clientHeight;
      }

      // on load set src
      if (isInView()) {
        $element[0].src = $attributes.imageLazySrc;
      }

      var deregistration = $scope.$on('lazyScrollEvent', function () {
        if (isInView() && $element[0].src != $attributes.imageLazySrc) {
          $element[0].src = $attributes.imageLazySrc;
        }
      });

      // unbind event listeners if element was destroyed
      // it happens when you change view, etc
      $element.on('$destroy', function () {
        deregistration();
      });
    }
  };
}]);