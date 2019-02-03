var myApp = angular.module('myApp');

myApp.service('DataService', ['$http','$q', function($http, $q){
  
  this.getTimesheets = function(affiliateName){
    console.log('in service, getting ts');
    return $http.get('/getTimesheets')
    .then(function(data){
      console.log('log from post is ', data);
      if (data.status === 200){
        return data
      } else {
        return error
      }
    }).catch(function(error) {
        return error
    })
  };
  this.addTimesheet = function(timesheet){
    console.log('ts to be saved is ', timesheet);
    return $http.post('/addTimesheet', {timesheet: timesheet})
      .then(function(data){
        console.log('log from post is ', data);
        if (data.status === 200){
          return data
        } else {
          return error
        }
      }).catch(function(error) {
          return error
      })
  };
  this.deleteTimesheet = function(timesheet){
    console.log('timesheet to delete in service is ', timesheet._id);
    // return $http.delete('/deleteTimesheet', {timesheetId: timesheet._id})
    return $http.delete('/deleteTimesheet', {
      params: {
        timesheetId: timesheet._id
      }
    })
    .then(function(data){
      console.log('log from post is ', data);
      if (data.status === 200){
        return data
      } else {
        return error
      }
    }).catch(function(error) {
        return error
    })
  };
  this.editTimesheet = function(timesheet){
    return $http.put('/editTimesheet')
    .then(function(data){
      console.log('log from post is ', data);
      if (data.status === 200){
        return data
      } else {
        return error
      }
    }).catch(function(error) {
        return error
    })
  };
  

  this.getDocuments = function(){
    return $http.get('/getDocuments')
    .then(function(data){
      return data;
    })
  };
  
  this.getComments = function(){
    return $http.get('/getComments')
    .then(function(data){
      console.log('log from post is ', data);
      if (data.status === 200){
        return data
      } else {
        return error
      }
    }).catch(function(error) {
        return error
    })
  };
  this.addComment = function(comment){
    return $http.post('/addComment', {comment: comment})
      .then(function(data){
        console.log('data returned from add comment service is ', data);
        return data;
      })
  };
  this.deleteComment = function(comment){
    console.log('comment id is is ', comment, 'id is ', comment._id)
    return $http.delete('/deleteComment', {
        params: {
          commentId: comment._id
        }
      })
      .then(function(data){
        console.log('data returned is ', data);
        return data;
      }).catch(function(error){
        console.log('error is ', error);
        return error;
      })
  };
  
  // this.editCommentDraft = function(content, affiliate){
  //   console.log('inside delete comment service, content is ', content, 'affiliate is ', affiliate);
  //   var payload = {content: content, affiliate: affiliate, operation: 'delete'};
  //   return $http.delete('/deleteComment', {params: payload})
  //   .then(function(data){
  //     console.log('return from update comments', data);
  //     return data;
  //   })
  // };

  
  this.viewWeeklyCalendarEvents = function(){
    return $http.get('/viewWeeklyCalendarEvents')
      .then(function(data){
        return data;
      }).catch(function(error){ 
        return error 
      })
  };
  this.addWeeklyCalendarEvent = function(newEvent){
    console.log('event in add calendar event is ', newEvent);
    return $http.post('/addWeeklyCalendarEvent', {newEvent: newEvent})
      .then(function(data){
        console.log('data returned from add calendar event service is ', data);
        return data;
      }).catch(function(error){ 
        return error 
      })
  };
  this.deleteWeeklyCalendarEvent = function(agendaEvent){
    console.log('agenda event is ', agendaEvent, 'id is ', agendaEvent._id)
    return $http.delete('/deleteWeeklyCalendarEvent', {
        params: {
          eventId: agendaEvent._id
        }
      })
      .then(function(data){
        console.log('data returned is ', data);
        return data;
      }).catch(function(error){
        console.log('error is ', error);
        return error;
      })
  };


  // this.deleteAgendaEvent = function(agendaEvent, dbName){
  //   console.log('event is ', agendaEvent, 'from ', dbName);
  //   return $http.delete('/deleteAgendaEvent', {
  //       params: {
  //           agendaEvent: agendaEvent,
  //           dbName: dbName
  //       }
  //   }).then(function(data){
  //     console.log('data returned is ', data);
  //     return data;
  //   }).catch(function(error){
  //     console.log('error is ', error);
  //     return error;
  //   })
  // };


}]);
