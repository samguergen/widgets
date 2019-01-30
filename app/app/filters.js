var myApp = angular.module('myApp');

myApp.filter('inputSelected', function() {
    return function(formData) {
        var keyArr = [];
        var word = [];
        if (formData) {
            Object.keys(formData).forEach(function(key) {
                if (formData[key]) {
                    var keyCap = key.charAt(0).toUpperCase() + key.slice(1);
                    for (var char = 0; char < keyCap.length; char++) {
                        if (keyCap[char] == keyCap[char].toUpperCase()) {
                            var spacedLetter = ' ' + keyCap[char];
                            word.push(spacedLetter);
                        } else {
                            word.push(keyCap[char]);
                        }
                    }
                }
                keyArr.push(word.join(''))
                word = [];
            })
            return keyArr.toString();
        }
    }
});

myApp.filter('filterLongObj', function($filter) {
    return function(formObj) {
        if (Object.keys(formObj).length > 1 && formObj.constructor === Object) {
            var pretty = JSON.stringify(formObj).replace(/{|}|"/g, "");
            return pretty;
        } else if (formObj.constructor === Object) {
            return $filter('inputSelected')(formObj);
        } else {
            return formObj;
        }
    }
});

myApp.filter('newlines', function($sce) {
    return function(formObj) {
        if (formObj) {
          return $sce.trustAsHtml(formObj.replace(/,/g, '<br>'));
        }
    }
});

myApp.filter('timestamp', function() {
    return function(formObj) {
        var timestamp = formObj._id.toString().substring(0, 8);
        var date = new Date(parseInt(timestamp, 16) * 1000);
        return date;
    }
});

myApp.filter('tableToFormName', function() {
    return function(tableName) {
        if (tableName === 'memberapp') {
            return 'Membership'
        } else if (tableName === 'volunteerapp') {
            return 'Volunteer'
        } else if (tableName === 'nonriderapp') {
            return 'Non-Rider'
        } else if (tableName === 'contactform') {
            return 'Contact'
        } else {
            return 'Other'
        }
    }
});

myApp.filter('reverse', function() {
    return function(items) {
      if (items){
        return items.slice().reverse();
      }
    };
});

myApp.filter('hexToBase64', function() {
    return function(str) {
      if (str){
        return btoa(String.fromCharCode.apply(null, str.replace(/\r|\n/g, "").replace(/([\da-fA-F]{2}) ?/g, "0x$1 ").replace(/ +$/, "").split(" ")));
      }
    };
});
 //img.src = 'data:image/jpeg;base64,' + hexToBase64('your-binary-data');

 myApp.filter('base64ToImgSrcOld', function($filter) {
     return function(base64) {
       if (base64){
         return 'data:image/jpeg;base64,' + $filter('hexToBase64')(base64);
       }
     };
 });

 myApp.filter('base64ToImgSrc', function() {
     return function(base64) {
        if (base64){
         return 'data:image/png;base64,' + base64;
       }
     };
 });

 myApp.filter('isAbs', function () {
  return function(val) {
    if (val === Math.abs(val)){
      return val;
    } else {
      return 0;
    }

  }
});
