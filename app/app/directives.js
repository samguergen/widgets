var myApp = angular.module('myApp');

myApp.directive('fileModel', ['$parse', function ($parse) {
   return {
      restrict: 'A',
      link: function(scope, element, attrs) {
         var model = $parse(attrs.fileModel);
         var modelSetter = model.assign;
         
         element.bind('change', function(){
            scope.$apply(function(){
               modelSetter(scope, element[0].files[0]);
            });
         });
      }
   };
}]);

myApp.directive('match', function($parse) {
    return {
        require: 'ngModel',
        link: function(scope, elem, attrs, ctrl) {
            scope.$watch(function() {
                return $parse(attrs.match)(scope) === ctrl.$modelValue;
            }, function(currentValue) {
                ctrl.$setValidity('mismatch', currentValue);
            });
        }
    };
});

myApp.directive('contactForm', function() {
    return {
        restrict: "E",
        templateUrl: "../views/contact-form.html"
    }
})