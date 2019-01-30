var myApp = angular.module('myApp');

myApp.controller('CalendarCtrl', ['$scope', '$transitions', '$http', '$anchorScroll', '$location', '$stateParams', '$timeout', '$state', '$rootScope', '$window', 'FormService', '$sce', 'DataService', 'ParseVariablesService', '$q', 'CalendarService', function($scope, $transitions, $http, $anchorScroll, $location, $stateParams, $timeout, $state, $rootScope, $window, FormService, $sce, DataService, ParseVariablesService, $q, CalendarService) {
    console.log('inside calendar controller');
    $scope.eventObj = {}
    $scope.adjustTimeForCalendar = CalendarService.adjustTimeForCalendar;

    //agenda here refers to a detailed day view of the monthly calendar after selecting day.
    $scope.initAgenda = function() {
      $scope.hideModal('calendarModal');
      $scope.hideModal('addOrShowModal');
      var promise = $scope.viewCalendarEventsPromise();
      promise.then(function(data){
        // console.log('calendar events are ', $scope.calendarEvents);
        $('#calendar').fullCalendar({
          defaultView: 'agendaDay',
          height: 650,
          editable: true,
          selectable: true,
          slotEventOverlap: true,
          minTime: "08:00:00",
          eventRender: function(event, element){
              console.log("rendering " +event.title, 'elem is ', element);
          },
          eventClick: function(calEvent, jsEvent, view) {
            console.log('calEvent is ', calEvent);
            $(this).css('border-color', 'red');
            var reconstructEvent = $scope.reconstructEventObjByTitle(calEvent);
            swal({
              title: "Event Details",
              html: "<h2>" + reconstructEvent.title + "</h2><p>" + reconstructEvent.description + "</p> <em>by " + reconstructEvent.author + "</em>",
              showCancelButton: true,
              showConfirmButton: true,
              confirmButtonColor: "red",
              confirmButtonText: "Delete event",
              type: "warning"
            }).then(function(eventToDelete){
              //if user confirms to delete
              if (eventToDelete.value) {
                $scope.serverMessage = "Deleting event..."
                $scope.deleteAgendaEventPromise(reconstructEvent, calEvent, 'calendar')
                .then(function(response){
                    $scope.resetEventObj();
                    swal("Deleted!","Your event was deleted.","success")
                  }).catch(function(error){
                    swal("Oops!","Your event couldn't be deleted.","error");
                  })
              }
            })
          },
          dayClick: function(event) {
            $scope.$apply(function() {
                $scope.dayClicked = event._d;
            });
            $('#calendarModal').modal('show');
          }
        })//end of calendar config
        //day agenda only accepts today's date. Agenda has been hacked so we only care about time.
        var date = new Date();
        var d = date.getDate();
        var m = date.getMonth();
        var y = date.getFullYear();
        var theEvent = {};
        $scope.eventsArr = [];

        //check if agenda defaults to today, then readjust dateformatted
        if ($scope.loadAgendaDirectly) {
          $scope.selectedEventDatePreviousFormatted =  new Date($scope.selectedEventDatePrevious).toDateString();
        }
        for (calendarEvent in $scope.calendarEvents) {
          //only parse events for that day
          var calendarEventDay = new Date($scope.calendarEvents[calendarEvent].day).addDays(1)
          calendarEventDay = calendarEventDay.toDateString();

          if (calendarEventDay === $scope.selectedEventDateFormatted) {
            //placing events in day agenda according to start and end times.
            var st = $scope.calendarEvents[calendarEvent].startTime;
            var adjustedSt = $scope.adjustTimeForCalendar(st);
            var et = $scope.calendarEvents[calendarEvent].endTime;
            var adjustedEt = $scope.adjustTimeForCalendar(et);
            var startTime = new Date(y, m, d, adjustedSt.hour, adjustedSt.min);
            var endTime = new Date(y, m, d, adjustedEt.hour, adjustedEt.min);
            //draw on DOM
            theEvent = {title: $scope.calendarEvents[calendarEvent].title, start: startTime, end: endTime, description: $scope.calendarEvents[calendarEvent].description, author: $scope.calendarEvents[calendarEvent].author};
            $("#calendar").fullCalendar("renderEvent", theEvent);
            $scope.eventsArr.push(theEvent);
          }
        }
      });//end of promise
    };


    $scope.reconstructEventObjByTitle = function(calEvent) {
      var fullEvent = {};
      for (var i in $scope.eventsArr){
        if ($scope.eventsArr[i].title === calEvent.title){
          fullEvent.title = calEvent.title;
          fullEvent.startTime = $scope.eventsArr[i].startTime;
          fullEvent.endTime = $scope.eventsArr[i].endTime;
          fullEvent.description = $scope.eventsArr[i].description;
          fullEvent.author = $scope.eventsArr[i].author;
          return fullEvent;
        }
      }
    };

    $scope.initMonthCalendar = function(){
      $('#calendar').fullCalendar({
        dayClick: function(event) {
          $scope.$apply(function() {
              $scope.dayClicked = event._d;
          });
          console.log('a day has been clicked! event is ', $scope.dayClicked);
          $('#addOrShowModal').modal('show');
        }
      });
    };


    $scope.convert24ToPm = function(time){
      var adjustedTime;
      if ((time > 0) && (time < 12)){
        adjustedTime = time + 'AM';
      } else if ((time >= 13) && (time < 24)){
        adjustedTime = (time-12) + 'PM';
      } else {
        adjustedTime = time + 'PM'
      }
      return adjustedTime;
    };


    $scope.initWeekCalendar = function(calendarType, affiliateName) {
      $scope.serverMessage = "Loading calendar...";
      $scope.hideModal('calendarModal');
      $scope.hideModal('addOrShowModal');
      var promise;
      if (calendarType === 'affiliate'){
        // DataService.generateRESTUrl($scope.itnAffiliate.name, 'shift-scheduler');
        console.log('fetching calendar events, affiliateName is ', affiliateName);
        promise = $scope.viewAffiliateCalendarEventsPromise(affiliateName);
      } else {
        promise = $scope.viewRISCalendarEventsPromise();
      }
      promise.then(function(data){
        console.log('ris events are ', $scope.calendarEvents);
        $scope.serverMessage = "";

        $('#calendar-week').fullCalendar({
          defaultView: 'agendaWeek',
          height: 650,
          editable: true,
          selectable: true,
          slotEventOverlap: true,
          minTime: "08:00:00",
          maxTime: "20:00:00",
          nowIndicator: true,
          header: {
            left: 'prev,next today',
            center: 'Week of',
            right: 'agendaWeek,agendaDay'
          },
          eventRender: function(event, element){
              console.log("rendering " + event.title, 'elem is ', element);
          },
          eventClick: function(calEvent, jsEvent, view) {
            console.log('cal event is ', calEvent, 'js event is ', jsEvent);
            $scope.theCalEvent = calEvent;
            $scope.theJsEvent = jsEvent;
            $(this).css('border-color', 'red');
            var complexEventObj = calEvent;
            swal({
              title: "Event Details",
              html: "<h2>" + $scope.theCalEvent.title + "</h2><p>" + $scope.theCalEvent.description + "</p> <em>by " + $scope.theCalEvent.author + "</em>",
              showCancelButton: true,
              showConfirmButton: true,
              confirmButtonColor: "red",
              confirmButtonText: "Delete event",
              type: "warning"
            }).then(function(readyToDelete){
              //On confirm, delete event from db
              if (readyToDelete.value && calendarType === 'affiliate'){
                console.log('event is ', complexEventObj);
                var simpleEventObjToDelete = $scope.convertComplexToSimpleEventObj(complexEventObj);
                $scope.deleteAffiliateCalendarEventPromise(simpleEventObjToDelete, affiliateName)
                  .then(function(response){
                    console.log('final response from delete is ', response);
                    location.reload()





                    //removeEvents from fullcalendar not working so much force event to hide on DOM with CSS
                    var cssElem = $scope.theJsEvent.currentTarget.className;
                    var idx = cssElem.indexOf(' ');
                    var cssCutoff = cssElem.substring(0, idx);
                    var cssElemReady = '.' + cssCutoff;
                    console.log('css elem ready is ', cssElemReady);
                    var allEvents = $(cssElemReady).show();
                    console.log('all obj with class name are ', allEvents);
                    var matchedElem = $scope.matchRelevantEvent(allEvents, calEvent);
                    console.log('matched event ', matchedElem);
                    $(cssElemReady).css('display','none');
                    $scope.resetEventObj();
                    swal("Deleted!","Your event was deleted.","success");
                  })
                  .catch(function(error){
                    swal("Oops!","Your event couldn't be deleted.","error");
                  })
              }
              else if (readyToDelete.value){
                $scope.deleteRISCalendarEventPromise(complexEventObj, 'calendar-ris')
                  .then(function(response){
                    swal("Deleted!","Your event was deleted.","success");
                  }).catch(function(error){
                    swal("Oops!","Your event couldn't be deleted.","error");
                  })
              }
            })
          },
          dayClick: function(event, jsEvent) {
            $scope.$apply(function() {
                $scope.dayClicked = event._d;
            });
            $scope.eventObj.startTime = $scope.dayClicked.getHours() + 4;
            $scope.$apply(function() {
                $scope.eventObj.startTime = $scope.convert24ToPm($scope.eventObj.startTime);
            });
            $('#calendarModal').modal('show');
        },
        events: $scope.calendarEvents
        })//end of calendar config
      });//end of promise
    };


    $scope.matchRelevantEvent = function(allEvents, calEvent){
      var eventTitle = calEvent.title;
      var eventTitleSquashed = calEvent.title.replace(/[^a-zA-Z0-9]+/g, "");
      console.log('cal event is ', calEvent.title, eventTitleSquashed);
      for (var obj in allEvents){
        var eventsObj = allEvents[obj];
        var substr = eventsObj.innerText.replace(/[^a-zA-Z0-9]+/g, "");
        substr = substr.replace(/[0-9]/g, '');
        console.log('substr is ', substr);
        if (substr === eventTitleSquashed){
          console.log('a match!! the match is ', substr);
          return substr;
        }
      }
    };


    $scope.convertComplexToSimpleEventObj = function(eventToDelete) {
      for (var i in $scope.calendarEvents){
        if ( ($scope.calendarEvents[i].author === eventToDelete.author) && ($scope.calendarEvents[i].description === eventToDelete.description) && ($scope.calendarEvents[i].title === eventToDelete.title) && ($scope.calendarEvents[i].day === eventToDelete.day) && ($scope.calendarEvents[i].startTime === eventToDelete.startTime) && ($scope.calendarEvents[i].endTime === eventToDelete.endTime) && ($scope.calendarEvents[i].day === eventToDelete.day) ){
          console.log('a match ', $scope.calendarEvents[i]);
          return $scope.calendarEvents[i];
        }
      }
    };


    $scope.resetEventObj = function(){
      $scope.eventObj = {};
      $scope.serverMessage = "";
    };


    $scope.completeEventObj = function(){
      var date = $scope.dayClicked;
      var d = date.getDate();
      var m = date.getMonth();
      var y = date.getFullYear();
      var st = $scope.eventObj.startTime;
      var adjustedSt = $scope.adjustTimeForCalendar(st);
      var et = $scope.eventObj.endTime;
      var adjustedEt = $scope.adjustTimeForCalendar(et);
      var startTime = new Date(y, m, d, adjustedSt.hour - 4, adjustedSt.min);
      var endTime = new Date(y, m, d, adjustedEt.hour - 4, adjustedEt.min);
      $scope.eventObj.start = startTime;
      $scope.eventObj.end = endTime;
    };


    $scope.addCalendarEvent = function(calendarType, affiliateName){
      console.log('is calendar Type and affiliateName ', calendarType, affiliateName);
      $scope.serverMessage = "Adding event...";
      //selects previous day by default, so need to adjust
      $scope.eventObj.day = new Date($scope.dayClicked.getTime());
      console.log('event obj is ', $scope.eventObj);
      //save event to database
      if (calendarType === 'RIS'){
        $scope.completeEventObj();
        DataService.addRISCalendarEvent($scope.eventObj).then(function(data){
          $('#calendarModal').modal('hide');
          $scope.serverMessage = "Your event has been succesfully added.";
          //updates events on DOM
          $scope.viewRISCalendarEventsPromise().then(function(response){
            $('#calendar-week').fullCalendar('removeEvents');
            $('#calendar-week').fullCalendar('addEventSource', $scope.calendarEvents);
            $('#calendar-week').fullCalendar('rerenderEvents');
            $scope.resetEventObj();
          })
        })
      } else if (calendarType === 'affiliate' && affiliateName) {
        console.log('is affiliate add');
        $scope.completeEventObj();
        DataService.addAffiliateCalendarEvent($scope.eventObj, affiliateName)
        .then(function(data){
          $('#calendarModal').modal('hide');
          $scope.serverMessage = "Your event has been succesfully added.";
          //updates events on DOM
          $scope.viewAffiliateCalendarEventsPromise(affiliateName).then(function(response){
            $('#calendar-week').fullCalendar('removeEvents');
            $('#calendar-week').fullCalendar('addEventSource', $scope.calendarEvents);
            $('#calendar-week').fullCalendar('rerenderEvents');
            $scope.resetEventObj();
          })
        })
      } else if (calendarType === 'affiliate') {
        console.log('is affiliate add');
        console.log('scope itn affiliate is ', $scope.itnAffiliate);
        $scope.completeEventObj();
        DataService.addAffiliateCalendarEvent($scope.eventObj, $scope.itnAffiliate)
        .then(function(data){
          $('#calendarModal').modal('hide');
          $scope.serverMessage = "Your event has been succesfully added.";
          console.log("event added to db");
          //updates events on DOM
          $scope.viewAffiliateCalendarEventsPromise($scope.itnAffiliate).then(function(response){
            $('#calendar-week').fullCalendar('removeEvents');
            $('#calendar-week').fullCalendar('addEventSource', $scope.calendarEvents);
            $('#calendar-week').fullCalendar('rerenderEvents');
            $scope.resetEventObj();
          })
        })
      } else {
        console.log('inside calendar event');
        DataService.addCalendarEvent($scope.eventObj).then(function(data){
          $('#calendarModal').modal('hide');
          $scope.serverMessage = "Your event has been succesfully added.";
          //updates events on DOM
          $scope.emptyCalendar();
          $scope.viewCalendarEventsPromise();
          $scope.resetEventObj();
        })
      }
    };


    $scope.addAgendaEvent = function(){
      //selects following day by default, so need to adjust
      $scope.eventObj.day = $scope.selectedEventDatePrevious;
      //save event to database
      DataService.addCalendarEvent($scope.eventObj).then(function(data){
        $('#calendarModal').modal('hide');
        $scope.serverMessage = "Your event has been succesfully added.";
        //updates events on DOM
        var date = new Date();
        var d = date.getDate();
        var m = date.getMonth();
        var y = date.getFullYear();
        var st = $scope.eventObj.startTime;
        var adjustedSt = $scope.adjustTimeForCalendar(st);
        var et = $scope.eventObj.endTime;
        var adjustedEt = $scope.adjustTimeForCalendar(et);
        var startTime = new Date(y, m, d, adjustedSt.hour, adjustedSt.min);
        var endTime = new Date(y, m, d, adjustedEt.hour, adjustedEt.min);
        var theEvent = {title: $scope.eventObj.title, start: startTime, end: endTime, description: $scope.eventObj.description, author: $scope.eventObj.author};
        $("#calendar").fullCalendar("renderEvent", theEvent);
        $scope.resetEventObj();
      })
    };


    $scope.deleteAgendaEventPromise = function(eventToDelete, calEventToDelete, dbName){
      //delete event from database
      var deferred = $q.defer();
      DataService.deleteAgendaEvent(eventToDelete, dbName)
        .then(function(data){
          $('#calendarModal').modal('hide');
          $("#calendar").fullCalendar("removeEvents", calEventToDelete._id);
          $scope.serverMessage = "Your event has been succesfully deleted.";
          deferred.resolve(data);
        }).catch(function(error){
          deferred.resolve(error)
        })
      return deferred.promise
    };


    $scope.deleteRISCalendarEventPromise = function(eventToDelete, dbName){
      //delete event from database
      var deferred = $q.defer();
      DataService.deleteRISCalendarEvent(eventToDelete, dbName)
        .then(function(data){
          $('#calendarModal').modal('hide');
          $scope.serverMessage = "Your event has been succesfully deleted.";
          $("#calendar-week").fullCalendar("removeEvents", calEventToDelete._id);
          deferred.resolve(data);
        }).catch(function(error){
          deferred.resolve(error)
        })
      return deferred.promise
    };


    $scope.deleteAffiliateCalendarEventPromise = function(eventToDelete, affiliateName){
      var deferred = $q.defer();
      console.log('before delete affiliate calendar event call');
      DataService.deleteAffiliateCalendarEvent(eventToDelete, affiliateName)
        .then(function(data){
          console.log('scheduler data is ', data.data[0].scheduler);
          if (data.data[0] && data.data[0].scheduler){
            console.log('rendering something');
            $scope.serverMessage = "Your event has been succesfully deleted.";
            // $("#calendar-week").fullCalendar("removeEvents", eventToDelete._id);
            deferred.resolve(data);
          } else {
            console.log('rendering nothing');
            $scope.serverMessage = "There was a problem deleting your event.";
            deferred.resolve(error);
          }
          $('#calendarModal').modal('hide');
        }).catch(function(error){
          deferred.resolve(error)
        })
      return deferred.promise
    };


    $scope.viewCalendarEventsPromise = function(){
      var deferred = $q.defer();
      //get events from database
      DataService.viewCalendarEvents()
      .then(function(data){
        $scope.calendarEvents = data.data;
        $scope.drawEventsOnCalendar();
        deferred.resolve('Resolved: ', data.data);
      }).catch(function(err){
        deferred.resolve('Error: ', err);
      })
      return deferred.promise;
    };


    $scope.viewRISCalendarEventsPromise = function(){
      var deferred = $q.defer();
      //get events from database
      DataService.viewRISCalendarEvents()
      .then(function(data){
        $scope.calendarEvents = data.data;
        console.log('RIS calendar events are ', $scope.calendarEvents);
        deferred.resolve(data.data);
      }).catch(function(err){
        deferred.resolve('Error: ', err);
      })
      return deferred.promise;
    };

    $scope.viewAffiliateCalendarEventsPromise = function(affiliateName){
      console.log('view affiliate calendar events promise, affiliate name is ',affiliateName);
      var deferred = $q.defer();
      //get events from database
      DataService.viewAffiliateCalendarEvents(affiliateName)
      .then(function(data){
        console.log("data from viewAffiliateCalendarEventsPromise func is ", data);
        if (data.data[0]){
          $scope.calendarEvents = data.data[0].scheduler;
          console.log('Affiliate calendar events are ', $scope.calendarEvents);
          deferred.resolve(data.data);
        } else {
          deferred.resolve('Error');
        }
      }).catch(function(err){
        deferred.resolve('Error');
      })
      return deferred.promise;
    };


    //place events on their respective day tabs
    //unlike the weekly calendar, which provides build-in help for drawing events, monthly calendar does not so I had to reinvent the wheel using JQuery to manually draw events on DOM.
    $scope.drawEventsOnCalendar = function(){
      $scope.eventsinFC = [];
      $('.fc-day').each(function(){
        var tabDate = $(this).context.dataset.date;
        var count = 0;
        var ctx;
        for (event in $scope.calendarEvents){
          var event = $scope.calendarEvents[event];
          var eventDateShort = event.day.slice(0,10);
          if (eventDateShort === tabDate){
            ctx = $(this).context;
            // console.log('a match! event is ', event, 'tab ctx is ', $(this).context);
            //orders events chronologically for a given day
            var later = $scope.isLaterTime(event, $(this).context);
            if (later){
              $(this).context.innerHTML = $(this).context.innerHTML + '<h6 class="agenda-link"><span class="badge badge-secondary">' + event.startTime + '-' + event.endTime + '<br>' + event.title + '</span></h6>';
            } else {
              $(this).context.innerHTML = '<h6 class="agenda-link"><span class="badge badge-secondary">' + event.startTime + '-' + event.endTime + '<br>' + event.title + '</span></h6>' + $(this).context.innerHTML;
            }

            //if more than 2 events on tab, add the more button to prevent overflow
            count = ctx.childElementCount;
            if (count > 3) {
              $(this).children().eq(1).nextAll().css("display","none");
              var moreBtn = '<button class="btn btn-sm" style="height:20px;width:70%;margin-top:-230px;font-size:14px;color: black">Show more</button>';
              $(this).context.innerHTML = $(this).context.innerHTML + moreBtn;
            }
          }
        }
      })
    };


    $scope.isLaterTime = function(theEvent, theContext){
      var numEventsInCell = theContext.children.length;
      var lastChild = theContext.children[theContext.children.length -1];
      if (lastChild){
        var slicedTime = lastChild.innerText.slice(0, lastChild.innerText.indexOf('-'));
        var eventAdjustedTime = $scope.adjustTimeForCalendar(theEvent.startTime);
        var adjustedTime = $scope.adjustTimeForCalendar(slicedTime);
        if (eventAdjustedTime.hour >= adjustedTime.hour){
          return true
        } else {
          return false;
        }
      }
    };


    $scope.emptyCalendar = function(){
      $('.fc-day').each(function(){
        $(this).context.innerHTML = ""
      })
    };

    $scope.retrieveFromSelectedEvent = function(){
      $scope.selectedEventDatePrevious = $stateParams.selectedEventDate;
      var isValid = moment($scope.selectedEventDatePrevious, moment.ISO_8601, true).isValid();
      //if user loads agenda page without parameter, default to today
      if (isValid){
        $scope.selectedEventDatePrevious = new Date($scope.selectedEventDatePrevious);
        $scope.loadAgendaDirectly = true;
      }
      $scope.selectedEventDate = $scope.selectedEventDatePrevious.addDays(1);
      $scope.selectedEventDateFormatted = new Date($scope.selectedEventDate).toDateString();

    };

    $scope.isAfterStartTime = function(endTime, startTime){
      var adjustedEndTime = $scope.adjustTimeForCalendar(endTime);
      var adjustedStartTime = $scope.adjustTimeForCalendar(startTime);
      if (adjustedEndTime.hour > adjustedStartTime.hour){
        $scope.afterStartTime = false;
        return true;
      } else if (adjustedEndTime.hour < adjustedStartTime.hour){
        $scope.afterStartTime = true;
        return false;
      } else if ( (adjustedEndTime.hour === adjustedStartTime.hour) && (adjustedEndTime.min < adjustedStartTime.min) ){
        $scope.afterStartTime = true;
        return false;
      } else if ( (adjustedEndTime.hour === adjustedStartTime.hour) && (adjustedEndTime.min > adjustedStartTime.min) ){
        $scope.afterStartTime = false;
        return true;
      } else {
        $scope.afterStartTime = true;
        return false;
      }
    };

    function compareNumbers(a, b) {
      return a - b;
    } //use as: numArray.sort(compareNumbers)

    Date.prototype.addDays = function(days) {
      var date = new Date(this.valueOf());
      date.setDate(date.getDate() + days);
      return date;
    };

}]);
