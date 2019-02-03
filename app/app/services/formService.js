var myApp = angular.module('myApp');

myApp.service('FormService', ['$http', function($http) {
    this.getNDAForms = function() {
        return $http.get('/getNDAForms').then(function(data) {
            console.log('data is ', data);
            return data.data;
        })
    };
    this.getContactForms = function() {
        return $http.get('/getContactForms').then(function(data) {
            console.log('data is ', data);
            return data.data;
        })
    };

    this.sendMail = function(formObj) {
      var responseMsg = {
        loading: false,
        contactPerson: null
      };
      console.log('inside sendmail, responsemsg is ', formObj, typeof(formObj));
      return $http.post('/sendmail', formObj)
          .then(function(res) {
              responseMsg.serverMessage = 'Your comment was submitted successfully and emailed to the relevant staff';
              return responseMsg;
          }).catch(function(err) {
              responseMsg.serverMessage = 'There was an error submitting your comment.';
              return responseMsg;
          });
    }
    this.fetchMail = function(formType, formObj) {
      var responseMsg = {
        loading: false,
        contactPerson: null
      };
      console.log('inside fetchmail, responsemsg is ', formObj, typeof(formObj));
      return $http.get('/fetchBlah', {params: formObj})
          .then(function(res) {
              responseMsg.serverMessage = 'Your comment was submitted successfully and emailed to the relevant staff';
              return responseMsg;
          }).catch(function(err) {
              responseMsg.serverMessage = 'There was an error submitting your comment.';
              return responseMsg;
          });
    }
}]);
