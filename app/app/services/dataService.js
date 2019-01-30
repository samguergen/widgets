var myApp = angular.module('myApp');

myApp.service('DataService', ['$http','$q', function($http, $q){
  this.getAllRides = function(){
    return $http.get('/getAllRides')
    .then(function(data){
      // console.log('rides data is ', data);
      return data;
    })
  };
  this.updateAffiliateRidesData = function(affiliateName){
    return $http.put('/updateAffiliateRidesData', affiliateName)
    .then(function(data){
      return data;
    })
  };
  this.getCommentsPhoto = function(){
    return $http.get('/getCommentsPhoto')
    .then(function(data){
      return data;
    })
  };
  this.fetchCommentsPerAffiliate = function(affiliateName){
    return $http.get('/fetchCommentsPerAffiliate', {
      params: {
        affiliateName: affiliateName
      }
    })
    .then(function(data){
      console.log('data returned from fetch comments per aff frontend service is ', data);
      return data;
    }).catch(function(error){ return error })
  };
  this.fetchImages = function(affiliateName){
    return $http.get('/fetchCommentsPhoto', {
      params: {
        affiliateName: affiliateName
      }
    })
    .then(function(data){
      console.log('data returned from fetch images frontend service is ', data);
      return data;
    }).catch(function(error){ return error })
  };
  this.addComment2 = function(content, affiliate){
    return $http.put('/updateCommentsPhoto', {content: content, affiliate: affiliate, operation: 'add'})
    .then(function(data){
      console.log('data returned from add comment service is ', data);
      return data;
    })
  };
  this.fetchComment = function(content, affiliate){
    var newComment = {content: content, affiliate: affiliate};
    return $http.get('/fetchComment', {params: newComment})
    .then(function(data){
      console.log('data returned from fetch comment service 1 is ', data);
      return data;
    })
  };
  this.deleteComment = function(content, affiliate){
    console.log('inside delete comment service, content is ', content, 'affiliate is ', affiliate);
    var payload = {content: content, affiliate: affiliate, operation: 'delete'};
    return $http.delete('/deleteComment', {params: payload})
    .then(function(data){
      console.log('return from update comments', data);
      return data;
    })
  };
  this.addRISCalendarEvent = function(newEvent){
    console.log('event is ', newEvent);
    return $http.get('/fetchRISSchedulerEvent', {
      params: {
        newEvent: newEvent
      }
    })
      .then(function(data){
      console.log('data returned from add calendar event service is ', data);
      return data;
    }).catch(function(error){ return error })
  };
  this.addAffiliateCalendarEvent = function(newEvent, affiliateName){
    console.log('event is ', newEvent);
    return $http.get('/fetchAffiliateSchedulerEvent', {
      params: {
        newEvent: newEvent,
        affiliateName: affiliateName
      }
    })
      .then(function(data){
      console.log('data returned from add affiliate calendar service is ', data);
      return data;
    }).catch(function(error){ return error })
  };
  this.addCalendarEvent = function(newEvent){
    console.log('event in add calendar event is ', newEvent);
    return $http.post('/addCalendarEvent', {newEvent: newEvent}).then(function(data){
      console.log('data returned from add calendar event service is ', data);
      return data;
    }).catch(function(error){ return error })
  };
  // this.addCalendarEventAffiliate = function(newEvent){
  //   console.log('event is ', newEvent);
  //   return $http.get('/addCalendarEventAffiliate', {
  //     params: {
  //       newEvent: newEvent,
  //       affiliateName: affiliateName
  //     }
  //   })
  //     .then(function(data){
  //     console.log('data returned from add affiliate calendar service is ', data);
  //     return data;
  //   }).catch(function(error){ return error })
  // };
  this.deleteRISCalendarEvent = function(agendaEvent, dbName){
    //special circular object, do not send full agendaEvent obj to backend.
    console.log('event is ', agendaEvent, 'from ', dbName);
    return $http.delete('/deleteRISCalendarEvent/' + agendaEvent._id, {params: {dbName: dbName}} ).then(function(data){
      console.log('data returned is ', data);
      return data;
    }).catch(function(error){
      console.log('error is ', error);
      return error;
    })
  };
  this.deleteAffiliateCalendarEvent = function(agendaEvent, affiliateName){
    console.log('event is ', agendaEvent, 'from ', affiliateName);
    var affiliateObj = {
      affiliateName: affiliateName,
      event: agendaEvent
    };
    console.log('affiliate obj is ', affiliateObj, 'type is ', typeof(affiliateObj));
    return $http.delete('/deleteAffiliateEventObj', {params: affiliateObj})
      .then(function(data){
        console.log('data returned is ', data);
        return data;
      }).catch(function(error){
        console.log('error is ', error);
        return error;
      })
  };
  this.viewRISCalendarEvents = function(){
    return $http.get('/viewRISCalendarEvents')
      .then(function(data){
        return data;
    }).catch(function(error){ return error })
  };
  this.viewAffiliateCalendarEvents = function(affiliateName){
    return $http.get('/viewAffiliateCalendarEvents', {
      params: {
        affiliateName: affiliateName
      }
    }).then(function(data){
      return data;
    }).catch(function(error){ return error })
  };
  this.viewCalendarEvents = function(){
    return $http.get('/viewCalendarEvents')
    .then(function(data){
      return data;
    }).catch(function(error){ return error })
  };
  this.deleteAgendaEvent = function(agendaEvent, dbName){
    console.log('event is ', agendaEvent, 'from ', dbName);
    return $http.delete('/deleteAgendaEvent', {
        params: {
            agendaEvent: agendaEvent,
            dbName: dbName
        }
    }).then(function(data){
      console.log('data returned is ', data);
      return data;
    }).catch(function(error){
      console.log('error is ', error);
      return error;
    })
  };
  this.getEmployees = function(){
    return $http.get('/getEmployees')
    .then(function(data){
      return data;
    }).catch(function(error){ return error })
  };
  this.updateEmployee = function(employee){
    return $http.put('/updateEmployee', {employee: employee})
    .then(function(data){
      return data;
    }).catch(function(error){ return error })
  };
  this.login = function(formData, tableName) {
    console.log('inside DataService login ', formData, tableName);
      return $http.get('/loginStandard', {
              params: {
                  formData: formData,
                  tableName: tableName
              }
          })
          .then(function(data) {
              return data;
          }).catch(function(error) {
              return error
          })
  };
  this.loginPrivilege = function(formData, tableName, privilegeType) {
    console.log('inside DataService login ', formData, tableName, privilegeType);
      return $http.get('/loginPrivilege', {
              params: {
                  formData: formData,
                  tableName: tableName,
                  privilegeType: privilegeType
              }
          })
          .then(function(data) {
              return data;
          }).catch(function(error) {
              return error
          })
  };
  this.loginEmployees = function(formData, employeeSelected){
    console.log('inside login employees' , employeeSelected);
    return $http.get('/loginEmployees', {
            params: {
                formData: formData,
                employeeSelected: employeeSelected
            }
        })
      .then(function(data){
        console.log('good is ', data);
        return data;
      }).catch(function(error) {
        console.log('bad is ', error);
          return error
      })
  };
  this.addEmployee = function(newEmployee){
    return $http.post('/addEmployee', {newEmployee: newEmployee})
    .then(function(data){
      console.log('data returned from employee post req ', data);
      return data;
    }).catch(function(error){ return error })
  };
  this.generateRESTUrl = function(affiliate, routeName){
    var baseUrl = window.location.origin;
    var url = '/' + routeName + '?filter=' + affiliate.name;
    window.location.href = url;
  };
  this.fetchgeneralInfoPerAffiliate = function(affiliateName){
    console.log('inside fetch general info' , affiliateName);
    return $http.get('/fetchgeneralInfoPerAffiliate', {
            params: {
                affiliateName: affiliateName
            }
        })
      .then(function(data){
        console.log('good is ', data);
        return data;
      }).catch(function(error) {
        console.log('bad is ', error);
          return error
      })
  };
  this.retrieveTimesheets = function(affiliateName){
    console.log('in service, getting ts from affiliate ', affiliateName);
    return $http.get('/getTimesheets', {
      params: {
        affiliateName: affiliateName
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
  this.saveTimesheet = function(timesheet){
    console.log('ts to be saved is ', timesheet);
    return $http.put('/saveTimesheet', {timesheet: timesheet})
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
    console.log('timesheet to delete in service is ', timesheet);
    return $http.delete('/deleteTimesheet', {
      params: {
        timesheet: timesheet,
        affiliateName: timesheet.affiliate
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

}]);
