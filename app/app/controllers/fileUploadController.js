var myApp = angular.module('myApp');

myApp.controller('FileUploadCtrl', ['$scope', '$transitions', '$http', '$anchorScroll', '$location', '$stateParams', '$timeout', '$state', '$rootScope', '$window', 'FormService', '$sce', 'DataService', '$q', 'FileUploadService', 'Upload', 'LongVariablesService', 'ParseVariablesService', '$filter', function($scope, $transitions, $http, $anchorScroll, $location, $stateParams, $timeout, $state, $rootScope, $window, FormService, $sce, DataService, $q, FileUploadService, Upload, LongVariablesService, ParseVariablesService, $filter) {
    console.log('inside file upload controller', $stateParams);
    $scope.filePathArray = [];
    
    $scope.getDocuments = function() {
      $scope.serverMessage = "Please wait a few seconds while the comments are loading.";
        DataService.getDocuments().then(function(response){
          console.log('response file uploads get ', response)
          $scope.fileUploads = response.data;
          $scope.fileUploads2 = response.data;
          $scope.displayThumbnailImgs(); // once files retrieves, display their thumbnails imgs
          $scope.serverMessage = "";
        });
    };

    // upload on file select or drop
    $scope.upload = function (file) {
            console.log('about to upload ', file, 'file name is ', file.name, 'file format is ', typeof(file));
      $scope.serverMessage = "Your file is being uploaded. Please wait.";
      $scope.hideLibrary = true;
      var fd = new FormData();
      fd.append('file', file);
            console.log('fd about to be sent is ', fd);
      FileUploadService.uploadFileToDB(fd);
      //upload service cannot work with promises, so listen to response instead using $rootScope
      $rootScope.$on('file upload ok', function(){
        console.log('file upload success');
        $scope.hideLibrary = true;
        $scope.serverMessage = "Your file was successfully uploaded. Reloading page.";
        location.reload();
      });
    };


    $scope.removeFile = function(file){
            console.log('inside removeFile func, file is ', file, file.name);
      $scope.serverMessage = "Your file is being removed. Please wait.";
      $scope.hideLibrary = true;
      FileUploadService.removeFile(file)
        .then(function(response){
          $scope.hideLibrary = false;
          if (response.status === 200){
                  console.log('file delete success');
            $scope.hideLibrary = true;
            $timeout(function(){
              $scope.serverMessage = "Your file was successfully removed. Reloading page.";
              location.reload();
            }, 5000);
          } else {
            $scope.serverMessage = "There was an error removing your file. Please try again.";
          }
        }).catch(function(err){
          $scope.serverMessage = "There was an error removing your file. Please try again.";
        })
    };

    $scope.addCategory = function(file, category){
            console.log('category is ', category, 'file is ', file);
      $scope.serverMessage = "The category is being updated. Please wait.";
      FileUploadService.addCategory(file, category)
      .then(function(response){
        $scope.hideLibrary = false;
        if (response.status === 200){
          console.log('update category success, response is ', response);
          $scope.hideLibrary = true;
          $timeout(function(){
            $scope.serverMessage = "Your file's category has been successfully updated.";
            location.reload();
          }, 5000);
        } else {
          $scope.serverMessage = "There was an error updating the category. Please try again.";
        }
      }).catch(function(err){
        $scope.serverMessage = "There was an error updating the category. Please try again.";
      })
    };


    $scope.fileUploads2 = angular.copy($scope.fileUploads);
    
    $scope.assignFileCategoryFilter = function(category){
      $scope.fileCategoryFilter = category.dbName;
      console.log('inside assignFileCategoryFilter, cat filtered is ', $scope.fileCategoryFilter);
      $scope.fileUploads = $filter('filter')($scope.fileUploads2, {category: $scope.fileCategoryFilter});
    };
    

    $scope.findFileMimeType = function(file){
      var fileFormat = file.name.substr(file.name.length - 3);
      fileFormat = fileFormat.toLowerCase();
      if (fileFormat === 'png' || fileFormat === 'jpg' || fileFormat === 'peg'){
        return 'png'
      } else if (fileFormat === 'pdf'){
        return 'pdf'
      } else if (fileFormat === 'doc' || fileFormat === 'ocx'){
        return 'doc'
      } else if (fileFormat === 'xls' || fileFormat === 'lsx' || fileFormat === 'xlr' || fileFormat === 'ods'){
        return 'excel'
      } else if (fileFormat === 'ptx' || fileFormat === 'ppt' || fileFormat === 'pps' || fileFormat === 'odp'){
        return 'pptx'
      } else if (fileFormat === 'mp3' || fileFormat === 'mp4' || fileFormat === 'mov' || fileFormat === 'mp4' || fileFormat === 'avi' || fileFormat === '3gp' || fileFormat === 'flv' || fileFormat === 'swf' || fileFormat === 'wmv' || fileFormat === '.rm' || fileFormat === 'mp4'){
        return 'audiovid'
      }  else { //if entering new file format, make sure to add icon for thumbnail, as '<fileFormat>-icon.png'
        return fileFormat;
      }
    };

    $scope.base64ToImgSrc = function(base64){
      if (base64 && $scope.fileMimeType){
        var newImgUrl;
        if ($scope.fileMimeType === 'png'){
          newImgUrl = 'data:image/png;base64,' + base64;
        } else if ($scope.fileMimeType === 'blah'){
        newImgUrl = 'data:image/blah;base64,' + base64;
        }
        return newImgUrl;
     }
   };
   
   $scope.displayThumbnailImgs = function(){
     var filePath;
     for (var i=0; i < $scope.fileUploads.length; i++){
       var file = $scope.fileUploads[i];
       $scope.fileMimeType = $scope.findFileMimeType(file);
       if ($scope.fileMimeType === 'png'){ //replace icon with thumnail of that img
         filePath = $scope.base64ToImgSrc(file.data);
       } else { //replace with icon of that file format
         filePath = $scope.assetsPath + '/images/icons/' + $scope.fileMimeType + '-icon.png';
       }
       file.thumbnailUrlNew = filePath;
       $scope.filePathArray.push(filePath);
     };
     // console.log("file path array is ", $scope.filePathArray);
   };

   $scope.displayThumbnailImg = function(file){
     $scope.fileMimeType = $scope.findFileMimeType(file);
     if ($scope.fileMimeType === 'png'){ //replace icon with thumnail of that img
       $scope.filePath = $scope.base64ToImgSrc(file.data);
     } else { //replace with icon of that file format
       $scope.filePath = $scope.assetsPath + '/images/icons/' + $scope.fileMimeType + '-icon.png';
     }
     $scope.filePathArray.push($scope.filePath);
     console.log('new filePath is ', $scope.filePath);
     console.log('updated file path array ', $scope.filePathArray);
     return $scope.filePath;
   };

   $scope.base64ToPDF = function(formType, formObj) {
       console.log('form type is ', formType, 'form obj is ', formObj);
       if (formObj && formObj.pdf) {
           var base64 = formObj.pdf;
           base64 = base64.replace("data:application/pdf;base64,", "");
           var binaryImg = window.atob(base64);
           var length = binaryImg.length;
           var arrayBuffer = new ArrayBuffer(length);
           var uintArray = new Uint8Array(arrayBuffer);
           for (var i = 0; i < length; i++) {
               uintArray[i] = binaryImg.charCodeAt(i);
           }
           var currentBlob = new Blob([uintArray], {
               type: 'application/pdf'
           });
           $scope.pdfUrl = URL.createObjectURL(currentBlob);
           console.log('redirecting to pdf', formType, formObj);
           window.open($scope.pdfUrl);
       } else {
           return $scope.pdfUrl = "This form does not contain a PDF";
       }
   };

   $scope.downloadPNG = function(formObj, idx) {
       console.log('inside base64 func');
       console.log('form obj is ', formObj);
       if (formObj && formObj.data) {
           var base64 = formObj.data;
           base64 = base64.replace("data:application/png;base64,", "");
           var binaryImg = window.atob(base64);
           var length = binaryImg.length;
           var arrayBuffer = new ArrayBuffer(length);
           var uintArray = new Uint8Array(arrayBuffer);
           for (var i = 0; i < length; i++) {
               uintArray[i] = binaryImg.charCodeAt(i);
           }
           var currentBlob = new Blob([uintArray], {
               type: 'application/png'
           });
           $window.saveAs(currentBlob, formObj.name);

       } else {
           return $scope.pdfUrl = "This form does not contain a PDF";
       }
   };

   $scope.downloadPDF = function(formObj) {
       console.log('form obj is ', formObj);
       if (formObj && formObj.data) {
           var base64 = formObj.data.replace("data:application/pdf;base64,", "");
           var binaryImg = window.atob(base64);
           var arrayBuffer = new ArrayBuffer(binaryImg.length);
           var uintArray = new Uint8Array(arrayBuffer);
           for (var i = 0; i < length; i++) {
               uintArray[i] = binaryImg.charCodeAt(i);
           }
           var currentBlob = new Blob([uintArray], {
               type: 'application/pdf'
           });
           $scope.pdfUrl = URL.createObjectURL(currentBlob);
           // window.location.href = $scope.pdfUrl;
           window.open($scope.pdfUrl);
       } else {
           return $scope.pdfUrl = "This form does not contain a PDF";
       }
   };


   $scope.downloadBLOB = function(file, idx){
     var blob = new Blob([s2ab(atob(file.data))], {
         type: ''
     });
     // href = URL.createObjectURL(blob);
     $window.saveAs(blob, file.name);
   };

   $scope.downloadFile = function(file, idx){
     var fileMimeType = $scope.findFileMimeType(file);
     console.log("file is ", file, 'type is ', fileMimeType);
     if (fileMimeType === 'png'){
       $scope.downloadPNG(file, idx)
     } else if (fileMimeType !== 'png'){
       $scope.downloadBLOB(file)
     } //audio, video, photoshop, svg
   };

   $scope.catchFormObj = function() {
       $scope.formObj = $stateParams.formObj;
       $scope.formObjType = $stateParams.formType;
       console.log('formobj is ', $scope.formObj);
   };

    function hexToBase64(str) {
      return btoa(String.fromCharCode.apply(null, str.replace(/\r|\n/g, "").replace(/([\da-fA-F]{2}) ?/g, "0x$1 ").replace(/ +$/, "").split(" ")));
    }; //

    function s2ab(s) {
      var buf = new ArrayBuffer(s.length);
      var view = new Uint8Array(buf);
      for (var i=0; i!=s.length; ++i) view[i] = s.charCodeAt(i) & 0xFF;
      return buf;
    };

}]);
