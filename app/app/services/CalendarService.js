var myApp = angular.module('myApp');

myApp.service('CalendarService', ['$http','$q', function($http, $q){
  
  this.adjustTimeForCalendar = function(theTime) {
    var time = theTime.replace(" ", "");
    time = time.toUpperCase();
    var adjustedTime = {
      hour: 0,
      min: 0
    };
     if (time.includes("AM") && time.includes(":")){
        adjustedTime.hour = time.substr(0,time.indexOf(':'));
        adjustedTime.min = time.substr(time.indexOf(':')+1,time.indexOf('AM')-2);
    } else if (time.includes("AM")){
        adjustedTime.hour = time.substr(0,time.indexOf('AM'));
        adjustedTime.min = 0;
    } else if (time.includes("PM") && time.includes(":")){
        adjustedTime.hour = parseInt(time.substr(0,time.indexOf(':')));
        if (adjustedTime.hour < 12){
          adjustedTime.hour = adjustedTime.hour + 12;
        }
        adjustedTime.min = time.substr(time.indexOf(':')+1,time.indexOf('PM')-2);
    } else if (time.includes("PM")){
        adjustedTime.hour = parseInt(time.substr(0,time.indexOf('PM')));
        if (adjustedTime.hour < 12){
          adjustedTime.hour = adjustedTime.hour + 12;
        }
        adjustedTime.min = 0;
    }
    adjustedTime.hour = parseInt(adjustedTime.hour);
    adjustedTime.min = parseInt(adjustedTime.min);
    return adjustedTime;
  };
  this.convertMinsToHoursMinsObj = function(data) {
    return {
      mins: data % 60,
      hours: (data - (data % 60))/ 60
    }
  };

}]);
