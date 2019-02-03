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
   this.uploadFileToDB = function(fd){
      return $http.post('/uploadFiles', fd, {
        headers: {'Content-Type': undefined}
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
   this.removeFile = function(file){
     console.log('file is ', file, 'id is ', file._id);
     return $http.delete('/removeFile', {
       params: {
         fileId: file._id
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
   this.addCategory = function(file, category){
     console.log('category is ', category.dbName, 'file id is ', file._id);
     return $http.put('/updateCategory', {
         fileName: file.name,
         categoryDbName: category.dbName,
         fileId: file._id
     })
     .then(function(data){
       if (data.status === 200){
         return data;
       } else {
         return data;
       }
     }).catch(function(error){
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
