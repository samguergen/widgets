var myApp = angular.module('myApp');

myApp.service('ParseVariablesService', ['$http','$q', function($http, $q){

  this.fixCorruptedParams = function(stateParams){
    var corruptedIdx = stateParams.indexOf('=');
    if (corruptedIdx){
       return stateParams.slice(corruptedIdx + 1, stateParams.length)
    } else {
      return stateParams;
    }
  };
}]);
