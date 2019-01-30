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
    this.getHRContactForms = function() {
        return $http.get('/getHRContactForms').then(function(data) {
            console.log('data is ', data);
            return data.data;
        })
    };
    this.getNewsletterForms = function() {
        return $http.get('/getNewsletterForms').then(function(data) {
            console.log('data is ', data);
            return data.data;
        })
    };
    this.deleteForm = function(formType, formObj) {
        return $http.delete('/deleteForm/' + formObj._id, {
            params: {
                formType: formType
            }
        }).then(function(data) {
            return data;
        })
    }
    this.sendMail = function(formType, formObj) {
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
