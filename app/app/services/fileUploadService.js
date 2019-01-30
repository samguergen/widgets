var myApp = angular.module('myApp');

myApp.service('FileUploadService', ['$http','$q','$rootScope', function ($http, $q, $rootScope) {
  var self = this;
   this.uploadFileToUrl = function(file, uploadUrl){
      var fd = new FormData();
      fd.append('file', file);

      $http.post(uploadUrl, fd, {
         transformRequest: angular.identity,
         headers: {'Content-Type': undefined}
      })
   };
   this.uploadFileToDB = function(fd, tableName){
      $http.post('/uploadFiles', fd, {
        headers: {'Content-Type': undefined},
        params: {tableName: tableName}
      })
      .then(function(data){
        if (data.status === 200){
          console.log('succesfully uploaded file ', data);
          $rootScope.$broadcast('file upload ok', data);
        } else {
          console.log('error uploading file ', data);
          $rootScope.$broadcast('file upload error', data);
        }
        return data;
      })
   };
   this.removeFile = function(file, tableName){
     console.log('file is ', file, 'tableName is ', tableName);
     return $http.get('/removeFile', {
       params: {
         fileName: file.name,
         tableName: tableName
       }
     })
     .then(function(data){
       if (data.status === 200){
         return data;
       } else {
         throw 500;
       }
     }).catch(function(error){
       return error;
     })
   };
   this.addCategory = function(file, tableName, category){
     console.log('file is ', file, 'category is ', category, 'table is ', tableName);
     return $http.get('/updateCategory', {
       params: {
         fileName: file.name,
         tableName: tableName,
         categoryName: category.name
       }
     })
     .then(function(data){
       if (data.status === 200){
         // $rootScope.$broadcast('add category ok', data);
         return data;
       } else {
         // $rootScope.$broadcast('add category error', data);
         return data;
       }
     }).catch(function(error){
       // $rootScope.$broadcast('add category error', error);
       return error;
     })
   };
   this.isJsonString = function(str) {
    try {
        JSON.parse(str);
    } catch (e) {
        return false;
    }
    return true;
}

}]);
