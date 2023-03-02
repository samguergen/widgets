var myApp = angular.module('myApp');

myApp.controller('MainCtrl', ['$scope', '$transitions', '$http', '$anchorScroll', '$location', '$stateParams', '$timeout', '$state', '$rootScope', '$window', 'FormService', '$sce', 'DataService', '$q', 'FileUploadService', 'Upload', 'LongVariablesService', 'ParseVariablesService', 'CalendarService', function($scope, $transitions, $http, $anchorScroll, $location, $stateParams, $timeout, $state, $rootScope, $window, FormService, $sce, DataService, $q, FileUploadService, Upload, LongVariablesService, ParseVariablesService, CalendarService) {
    console.log('inside main controller', $stateParams);
    $scope.comments = $stateParams.filter;
    $scope.assetsPath = "assets";
    $scope.viewsPath = "../views";
    if (location.host === "localhost:8080") {
        $scope.assetsPath = "app/assets";
        $scope.viewsPath = "../app/views";
    };
    $scope.affiliate = "America";
    $scope.zoomLevel = 1;
    $scope.tab = 1;
    $scope.loading = false;
    $scope.minlength = 2;
    $scope.maxlength = 50;
    $scope.maxMsgLength = 2000;
    $scope.ssnPattern = new RegExp(/^\d{3}-?\d{2}-?\d{4}$/);
    $scope.zipPattern = new RegExp(/^\d{5}$/);
    $scope.emailPattern = new RegExp(/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/);
    $scope.datePattern = new RegExp(/^(\d{2})\/(\d{2})\/(\d{4})$/);
    $scope.dobPattern = new RegExp(/^(\d{2})\/(\d{2})\/(\d{4})$/);
    $scope.phonePattern = new RegExp(/^\d{3}[- ]?\d{3}[- ]?\d{4}$/);
    $scope.errorMessages = LongVariablesService.errorMessages;
    $scope.dataPDF = null;
    $scope.formSubject = 'New application received';
    $scope.states = LongVariablesService.states;
    $scope.itnSources = LongVariablesService.itnSources;
    $scope.ratings = ['None', 1, 2, 3, 4, 5, 6];
    $scope.keyword = '';
    $scope.keywordPages = '';
    $scope.urlsWithKeyword = [];
    $scope.affiliateListArr = LongVariablesService.affiliateListArr;
    $scope.affiliateList = LongVariablesService.affiliateList;
    $scope.listOfPrograms = LongVariablesService.listOfPrograms;
    $scope.listOfProgramsObj = LongVariablesService.listOfProgramsObj;
    $scope.listOfUrls = LongVariablesService.listOfUrls;
    $scope.formType = '';
    $scope.ndaFormData = [];
    $scope.contactFormData = [];
    $scope.newsletterFormData = [];
    $scope.hrContactFormData = [];
    $scope.formObj = {};
    $scope.formObjType = {};
    $scope.session = null;
    // console.log('session is ', $scope.session);
    $scope.formCount = LongVariablesService.formCount;
    $scope.pdfUrl = '';
    $scope.formData = LongVariablesService.formData;
    var originalFormData = $scope.formData;
    $scope.showForm = false;
    $scope.blogEntries = [];
    $scope.showPortal = true;
    $scope.itnAffiliate = LongVariablesService.itnAffiliate;
    $scope.selected = {};
    $scope.showCommentInput = false;
    $scope.affiliateOfComment = null;
    $scope.myFile = null;
    $scope.isLogged = {};
    $scope.fileCategories = LongVariablesService.fileCategories;
    $scope.fileCategoryFilter = '';
    $scope.filePathArray = [];
    $scope.fileExtensionsObj = LongVariablesService.fileExtensionsObj
    $scope.commentData = {};
    $scope.timesForPicker = LongVariablesService.timesForPicker;
    $scope.adjustTimeForCalendar = CalendarService.adjustTimeForCalendar; //function
    $scope.convertMinsToHoursMinsObj = CalendarService.convertMinsToHoursMinsObj; //function




    // alternative to ng-init, functions that trigger on state/page changes.
    $transitions.onSuccess({}, function(transition) {
        if (transition.from().name !== 'dashboard') {
            $scope.resetFormData();
        }
        if (transition.from().name === 'keyword-pages') {
            angular.element(document).ready(function() {
                $scope.searchKeyword();
                $scope.scrollToTop();
                $scope.urlsWithKeyword = [];
            });
        }
        if (!$stateParams.anchor) {
            $scope.scrollToTop();
        }
    });


    function compareNumbers(a, b) {
      return a - b;
    }; //numArray.sort(compareNumbers)


    Date.prototype.addDays = function(days) {
      var date = new Date(this.valueOf());
      date.setDate(date.getDate() + days);
      return date;
    };


    //use this function instead of ng-href as ng-href is not compatible with html5mode
    $scope.redirectToURL = function(url) {
        $window.open(url, '_blank');
    };

    $scope.scrollTo = function(id) {
        var old = $location.hash();
        $location.hash(id);
        $anchorScroll();
        //reset to old to keep any additional routing logic from kicking in
        $location.hash(old);
    };

    $scope.catchAnchor = function() {
        console.log('stateparam is ', $stateParams, $stateParams.anchor);
        $scope.scrollTo($stateParams.anchor);
    };

    // $window.onscroll = function (){
    //     if ($stateParams.anchor) $stateParams.anchor = null;
    // };

    $scope.resetFormData = function() {
        $scope.formData = originalFormData;
        $scope.serverMessage = "";
        $scope.loading = false;
        $scope.tab = 1;
    };

    $scope.nextTabMemberApp = function(prev) {
        $(window).scrollTop(50);
        if (prev) {
            $scope.tab -= 1;
        } else {
            $scope.tab += 1;
        }
    };

    $scope.scrollToTop = function() {
        $(window).scrollTop(50);
    };

    $scope.readMore = function(divId) {
        var content = document.getElementById(divId);
        if (content.style.display === "none") {
            content.style.display = "block";
            content.nextElementSibling.nextElementSibling.nextElementSibling.innerText = "READ LESS";
        } else {
            content.style.display = "none";
            content.nextElementSibling.nextElementSibling.nextElementSibling.innerText = "READ MORE";
        }
    };

    $scope.zoom = function(direction) {
        if (direction == 'more') {
            $scope.zoomLevel += 1;
            var content = document.getElementByTagName(body);
            content.style.fontSize = $scope.zoomLevel + 'rem';
        } else if (direction == 'less') {
            $scope.zoomLevel -= 1;
        }
    };

    $scope.searchKeyword = function() {
        var myHilitor = new Hilitor("main-content");
        myHilitor.apply($scope.keyword);
    };

    $scope.searchKeywordInApp = function() {
        var x;
        for (x = 0; x < $scope.listOfUrls.length; x++) {
            apiCallToUrls(x)
        }
        $state.go('keyword-pages');
    };

    function apiCallToUrls(x) {
        $http.get($scope.listOfUrls[x].url)
            .then(function(data) {
                var matchWord = findWord($scope.keyword, data.data);
                if (matchWord) {
                    $scope.urlsWithKeyword.push($scope.listOfUrls[x])
                }
            })
    };

    function findWord(keyword, str) {
        var text = str.split(' ');
        for (var word = 0; word < text.length; word++) {
            if (text[word].toLowerCase().indexOf(keyword.toLowerCase()) !== -1) {
                return keyword
            }
        }
        return false;
    };

    $scope.animateValue = function(id, start, end, duration) {
        var range = end - start;
        var current = start;
        var increment = end > start ? 50 : -50;
        var stepTime = Math.abs(Math.floor(duration / range));
        var obj = document.getElementById(id);
        var timer = setInterval(function() {
            current += increment;
            obj.innerHTML = current;
            if (current >= end) {
                clearInterval(timer);
                obj.innerHTML = end;
            }
        }, stepTime);
    };

    var zoomLevel = 1;
    $scope.resizeText = function(multiplier) {
        if (multiplier) {
            zoomLevel += multiplier;
            $('#main-content-inner').css('transform', 'scale(' + zoomLevel + ')');
        } else {
            $('#main-content-inner').css('transform', 'scale(1)');
        }
    };

    $scope.searchTable = function(tableId) {
        var input, filter, table, tr, td, i;
        input = document.getElementById("searchInput");
        filter = input.value.toUpperCase();
        table = document.getElementById(tableId);
        tr = table.getElementsByTagName("tr");

        for (row = 0; row < tr.length; row++) {
            tdd = tr[row].getElementsByTagName("td");
            for (col = 0; col < tdd.length - 1; col++) {
                td = tr[row].getElementsByTagName("td")[col];
                if (td) {
                    if (td.innerHTML.toUpperCase().indexOf(filter) > -1) {
                        return tr[row].style.display = "table-row";
                    } else {
                        tr[row].style.display = "none";
                    }
                }
            }
        }
    };

    $scope.resetTable = function(tableId) {
        var input, filter, table, tr, td, i;
        input = document.getElementById("searchInput");
        filter = input.value.toUpperCase();
        table = document.getElementById(tableId);
        tr = table.getElementsByTagName("tr");

        for (row = 0; row < tr.length; row++) {
            tr[row].style.display = "table-row";
        }
    };

    $scope.authenticate = function() {
        if ($scope.session) {
            $scope.getApps();
        }
    };

    $scope.getApps = function() {
        FormService.getNDAForms().then(function(data) {
            $scope.ndaFormData = data;
            $scope.formCount.nda = data.length
        });
        FormService.getContactForms().then(function(data) {
            $scope.contactFormData = data;
            $scope.formCount.contact = data.length
        });
        FormService.getNewsletterForms().then(function(data) {
            $scope.newsletterFormData = data;
            $scope.formCount.newsletter = data.length
        });
        FormService.getHRContactForms().then(function(data) {
            $scope.hrContactFormData = data;
            $scope.formCount.hrContact = data.length
        });
    };

    $scope.askBeforeDelete = function(formType, formObj) {
        $scope.formData = formObj;
        $scope.formType = formType;
        $(document).ready(function() {
            $('#deleteAppModal').modal('show');
        })
    };

    $scope.askBeforeDeleteComment = function(comment) {
      console.log('comment is ', comment);
        $scope.commentToDelete = comment;
        $(document).ready(function() {
            $('#deleteAppModal').modal('show');
            $('#deleteAppModal').css('display','block');
        })
    };


    $scope.deleteForm = function(formType, formObj) {
        console.log('inside deleteform, form type', formType, 'form obj', formObj);
        if (formType !== 'other') {
            $(document).ready(function() {
                $('#deleteAppModal').modal('hide');
            })
        }
        FormService.deleteForm(formType, formObj).then(function(data) {
            console.log('record successfully deleted ', data);
            $scope.getApps();
        })
    };

    $scope.sort = function(keyname) {
        $scope.sortKey = keyname; //set the sortKey to the param passed
        $scope.reverse = !$scope.reverse; //if true make it false and vice versa
    };

    $scope.login = function(loginType, privilegeType, routeType, routeName) {
      var routeName;
      if (loginType === 'admins'){
        routeName = 'dashboard';
      } else if (loginType === 'staffusers'){
        routeName = 'portal';
      }
      console.log('login creds are ', $scope.formData);
      return DataService.loginPrivilege($scope.formData, loginType, privilegeType).then(function(response) {
          console.log('response is ', response);
          if (response.status === 200) {
              $scope.session = response.data;
              if (loginType !== 'employees'){
                $state.go(routeName)
              }
          } else {
              $scope.serverMessage = 'Incorrect login or password';
          }
      });
    };

    $scope.logout = function() {
        $window.location.reload();
    };

    $scope.prepopulate = function(currentModel, modelType) {
        if (modelType === 'date') {
            $scope.formData.requestDriverRecord.date = currentModel;
            $scope.formData.requestCriminalRecord.date = currentModel;
            $scope.formData.vehicleDescription.date = currentModel;
            $scope.formData.changeOfStatus.date = currentModel;
        } else if (modelType === 'signature') {
            $scope.formData.requestDriverRecord.signature = currentModel;
            $scope.formData.requestCriminalRecord.signature = currentModel;
            $scope.formData.vehicleDescription.signature = currentModel;
            $scope.formData.changeOfStatus.signature = currentModel;
        } else if (modelType === 'name') {
            $scope.formData.requestDriverRecord.name = currentModel;
            $scope.formData.requestCriminalRecord.name = currentModel;
        } else if (modelType === 'dob') {
            $scope.formData.requestCriminalRecord.dob = currentModel;
        } else if (modelType === 'maiden') {
            $scope.formData.requestCriminalRecord.maidenName = currentModel;
        }
    };

    $scope.checkRequiredFields = function(formType) {
        var requiredFieldsArray;
        if (formType === 'volunteer') {
            requiredFieldsArray = {
                'Volunteer Name': $scope.formData.riderName,
                'Gender': $scope.formData.riderGender,
                'Street': $scope.formData.streetAddress,
                'City': $scope.formData.city,
                'State': $scope.formData.state,
                'Zip': $scope.formData.zip,
                'Preferred phone': $scope.formData.preferredPhone,
                'First Emergency Contact name': $scope.formData.firstEmergencyContact.name,
                'First Emergency Contact relationship': $scope.formData.firstEmergencyContact.relationship,
                'First Emergency Contact street': $scope.formData.firstEmergencyContact.street,
                'First Emergency Contact city': $scope.formData.firstEmergencyContact.city,
                'First Emergency Contact state': $scope.formData.firstEmergencyContact.state,
                'First Emergency Contact zip': $scope.formData.firstEmergencyContact.zip,
                'Has adequate vision': $scope.formData.drivingExperience.adequateVision,
                'Current employment status': $scope.formData.currentEmployment,
                'Has past criminal conviction': $scope.formData.criminalConviction,
                'Has been convicted of moving violation in past 3 years': $scope.formData.movingViolation,
                'First reference name': $scope.formData.firstReference.name,
                'First reference phone or mailing address': $scope.formData.firstReference.phoneOrMailing,
                'How are you acquainted with your first reference': $scope.formData.firstReference.acquainted,
                'Second reference name': $scope.formData.secondReference.name,
                'Second reference phone or mailing address': $scope.formData.secondReference.phoneOrMailing,
                'How are you acquainted with your second reference': $scope.formData.secondReference.acquainted,
                'Third reference name': $scope.formData.thirdReference.name,
                'Third reference phone or mailing address': $scope.formData.thirdReference.phoneOrMailing,
                'How are you acquainted with your third reference': $scope.formData.thirdReference.acquainted,
                'Agree to check for references - signature': $scope.formData.references.signature,
                'Agree to check for references - date': $scope.formData.references.date,
                'Member of organization or union': $scope.formData.memberOfProfessionalOrgOrUnion,
                'Served in military': $scope.formData.servedInMilitary,
                'Authorization to Request Driver Record - name': $scope.formData.requestDriverRecord.name,
                'Authorization to Request Driver Record - date of birth': $scope.formData.requestDriverRecord.dob,
                'Authorization to Request Driver Record - license number': $scope.formData.requestDriverRecord.licenseNumber,
                'Authorization to Request Driver Record - from state': $scope.formData.requestDriverRecord.authorize,
                'Authorization to Request Driver Record - signature': $scope.formData.requestDriverRecord.signature,
                'Authorization to Request Driver Record - date': $scope.formData.requestDriverRecord.date,
                'Authorization to Request Driver Record - checkbox authorization': $scope.formData.requestDriverRecord.agree,
                'Authorization to Request Criminal Record - name': $scope.formData.requestCriminalRecord.name,
                'Authorization to Request Criminal Record - date of birth': $scope.formData.requestCriminalRecord.dob,
                'Authorization to Request Criminal Record - from state': $scope.formData.requestCriminalRecord.authorize,
                'Authorization to Request Criminal Record - signature': $scope.formData.requestCriminalRecord.signature,
                'Authorization to Request Criminal Record - date': $scope.formData.requestCriminalRecord.date,
                'Authorization to Request Driver Record - checkbox authorization': $scope.formData.requestCriminalRecord.agree,
                'Do you own the vehicle': $scope.formData.vehicleDescription.vehicleOwner,
                'Vehicle make': $scope.formData.vehicleDescription.make,
                'Vehicle model': $scope.formData.vehicleDescription.model,
                'Vehicle year': $scope.formData.vehicleDescription.year,
                'Vehicle registration plate': $scope.formData.vehicleDescription.registrationPlate,
                'Number of doors on vehicle': $scope.formData.vehicleDescription.numberOfDoors,
                'Vehicle registration expiration': $scope.formData.vehicleDescription.registrationExpiration,
                'Vehicle insurance company': $scope.formData.vehicleDescription.insuranceCompany,
                'Vehicle agent': $scope.formData.vehicleDescription.agent,
                'Vehicle agent email': $scope.formData.vehicleDescription.agentEmailAddress,
                'Can your vehicle transport a walker': $scope.formData.vehicleDescription.canTransportWalker,
                'Can your vehicle transport a wheelchair': $scope.formData.vehicleDescription.canTransportWheelChair,
                'Vehicle general condition': $scope.formData.vehicleDescription.generalCondition,
                'Vehicle passenger capacity': $scope.formData.vehicleDescription.passengerCapacity,
                'Vehicle can transport pets ': $scope.formData.vehicleDescription.canTransportPets,
                'Vehicle has large trunk': $scope.formData.vehicleDescription.hasLargeTrunk,
                'Vehicle has covered bed': $scope.formData.vehicleDescription.hasCoveredTruckBed,
                'Is it your only vehicle': $scope.formData.vehicleDescription.onlyVehicle,
                'Vehicle description - signature': $scope.formData.vehicleDescription.signature,
                'Vehicle description - date': $scope.formData.vehicleDescription.date,
                'Vehicle description - checkbox authorization': $scope.formData.vehicleDescription.authorize,
                'Change of Status - signature': $scope.formData.changeOfStatus.signature,
                'Change of Status - date': $scope.formData.changeOfStatus.date,
                'Checkbox authorization to contact references': $scope.formData.agree
            }
        } else if (formType === 'membership') {
            requiredFieldsArray = {
                'Rider Name': $scope.formData.riderName,
                'Membership Type': $scope.formData.membership,
                'Street': $scope.formData.streetAddress,
                'City': $scope.formData.city,
                'State': $scope.formData.state,
                'Zip': $scope.formData.zip,
                'Years at Address': $scope.formData.yearsAtAddress,
                'It is a Mailing address': $scope.formData.isMailingAddress,
                'It is a Billing address': $scope.formData.isBillingAddress,
                'It is a year-round residence': $scope.formData.isYearRoundResidence,
                'Primary phone': $scope.formData.primaryPhone,
                // 'First emergency contact (full)': $scope.formData.firstEmergencyContact,
                'First emergency contact name': $scope.formData.firstEmergencyContact.name,
                'First emergency contact relationship': $scope.formData.firstEmergencyContact.relationship,
                'First emergency contact street': $scope.formData.firstEmergencyContact.street,
                'First emergency contact city': $scope.formData.firstEmergencyContact.city,
                'First emergency contact state': $scope.formData.firstEmergencyContact.state,
                'First emergency contact zip': $scope.formData.firstEmergencyContact.zip,
                'First emergency contact best phone number': $scope.formData.firstEmergencyContact.bestPhone,
                // 'Second emergency contact (full)': $scope.formData.secondEmergencyContact,
                'Second emergency contact name': $scope.formData.secondEmergencyContact.name,
                'Second emergency contact relationship': $scope.formData.secondEmergencyContact.relationship,
                'Second emergency contact street': $scope.formData.secondEmergencyContact.street,
                'Second emergency contact city': $scope.formData.secondEmergencyContact.city,
                'Second emergency contact state': $scope.formData.secondEmergencyContact.state,
                'Second emergency contact zip': $scope.formData.secondEmergencyContact.zip,
                'Second emergency contact best phone number': $scope.formData.secondEmergencyContact.bestPhone,
                'How did you hear about ITN?': $scope.formData.heardAboutItn,
                'Send info to friends or relatives?': $scope.formData.sendInfoToRelativeFriendBiz,
                // 'Customer info (full)': $scope.formData.customerInfo ,
                'Date of Birth': $scope.formData.customerInfo.dateOfBirth,
                'Gender': $scope.formData.customerInfo.gender,
                'Marital Status': $scope.formData.customerInfo.maritalStatus,
                'Living Arrangement': $scope.formData.customerInfo.livingArrangement,
                'Dwelling Arrangement': $scope.formData.customerInfo.dwellingArrangement,
                'Languages Spoken': $scope.formData.customerInfo.languages,
                'Current transportation means': $scope.formData.customerInfo.currentTransportationMeans,
                'Member of Organization or Union': $scope.formData.memberOfProfessionalOrgOrUnion,
                'Served in Military': $scope.formData.customerInfo.servedInMilitary,
                'Special Needs': $scope.formData.customerInfo.specialNeeds,
                // 'Driving Info (full)': $scope.formData.drivingInfo,
                'Has license': $scope.formData.drivingInfo.hasLicense,
                'Owns a vehicle': $scope.formData.drivingInfo.ownVehicle,
                'Took Driver Improvement classes': $scope.formData.drivingInfo.driverImprovementClasses,
                'Driven in last 10 years': $scope.formData.drivingInfo.drivenLast10Years,
                'Currently drives': $scope.formData.drivingInfo.currentlyDrive,
                'Reduce trip cost by sharing ride': $scope.formData.drivingInfo.reduceCostWithRideshare,
                // 'Agreement (full)': $scope.formData.agreement,
                'Agreement signature': $scope.formData.agreement.signature1,
                'Agreement date': $scope.formData.agreement.date1,
                'Informed consent signature': $scope.formData.agree1,
                'Informed consent date': $scope.formData.agreement.signature2,
            }
        } else {
            return true;
        }

        for (var field in requiredFieldsArray) {
            console.log('field is ', field);
            if (requiredFieldsArray.hasOwnProperty(field) && !requiredFieldsArray[field]) {
                console.log('You must fill this required field: ', field);
                $scope.serverMessage = 'Please complete all required fields. Field missing is:  " ' + field + '"';
                return false;
            }
        }
        return true;
    };


    $scope.validateContactInputs = function() {
        return ($scope.formData.name && $scope.formData.email && $scope.formData.phone && $scope.formData.subject && $scope.formData.messageBody) ? true : false;
    };


    $scope.removeIfEmpty = function(formField) {
        // console.log('form field is ', formField, 'type is ', typeof(formField), 'length is ', formField.length)
        if ((formField.constructor === Object) && (Object.keys(formField).length < 1)) {
            console.log('false1');
            return false;
        } else if ((formField.constructor === String) && (formField.length < 1)) {
            console.log('false2');
            return false;
        }  else if ((formField.constructor === Boolean) && formField) {
            console.log('yes');
            return true;
        } else {
            return true;
        }
    };

    //captures param to know if normal or custom contact form, custom comes from portal (HR or staff)
    $scope.isContactPerson = function(){
      if ($stateParams.contact) {
        console.log('contact is ', $stateParams.contact);
        $scope.contactPerson = $stateParams.contact;
        //if submitting HR ticket (portal)
        if ($scope.contactPerson === 'hrcontactform'){
            $scope.formType = angular.copy($scope.contactPerson);
            //if contacting a staff member (portal)
        } else if ($scope.contactPerson.email){
          $scope.formType = $scope.contactPerson;
        }
      } else {
        $scope.formType = 'contact'
      }
    };

    //for contact and newsletter forms
    $scope.submitForm = function(formType) {
        var contactInputsValid = $scope.validateContactInputs();
        console.log('valid contact is ', contactInputsValid);
        var formObj = {};
        var today = new Date();

        $scope.loading = true;
        if (formType) {
            $scope.formType = formType;
        } //else $scope.formType is assigned in function above.

        if ($scope.formType === 'contact' && contactInputsValid) {
            console.log('submitting valid contact form');
            formObj = {
                from: '"ITNAmerica Web User" <donotreply@itnamerica.com>',
                to: 'itnamerica2018@gmail.com',
                subject: "ITNAmerica Contact Form Submitted",
                text: $scope.formData,
                date: today,
                html: "<p><strong>Name</strong>: " + $scope.formData.name + "</p>\n" +
                    "<p><strong>Email</strong>: " + $scope.formData.email + "</p>\n " +
                    "<p><strong>Mobile</strong>: " + $scope.formData.phone + "</p>\n " +
                    "<p><strong>Subject</strong>: " + $scope.formData.subject + "</p>\n " +
                    "<p><strong>Message Body</strong>: " + $scope.formData.messageBody + "</p>\n ",
                formType: $scope.formType
            }
        } else if ($scope.formType === 'newsletter' && $scope.formData.email) {
            console.log('submitting valid newsletter form');
            formObj = {
                from: '"ITNAmerica Web User" <donotreply@itnamerica.com>',
                to: 'itnamerica2018@gmail.com',
                subject: "ITNAmerica Request to be added to Newsletter",
                text: $scope.formData,
                date: today,
                html: "<p><strong>Email</strong>: " + $scope.formData.email + "</p> ",
                formType: $scope.formType
            }
        } else if ($scope.formType === 'comment' && $scope.formData.messageBody) {
            console.log('submitting valid comment form');
            formObj = {
                from: '"ITNAmerica Web User" <donotreply@itnamerica.com>',
                to: 'itnamerica2018@gmail.com',
                subject: "ITNAmerica Staff Comment",
                text: $scope.formData,
                date: today,
                html: "<p><strong>Message</strong>: " + $scope.formData.messageBody + "</p> " +
                    "<p><strong>Author</strong>: " + $scope.formData.author + "</p>\n ",
                formType: $scope.formType
            }
        } else if ($scope.formType === 'hrcontactform' && $scope.formData.messageBody) {
                console.log('submitting valid HR ticket');
                formObj = {
                    from: '"ITNAmerica Staff Member" <donotreply@itnamerica.com>',
                    to: 'itnamerica2018@gmail.com',
                    subject: "New HR ticket submitted",
                    text: $scope.formData,
                    date: today,
                    html: "<p><strong>Subject</strong>: " + $scope.formData.subject + "</p> " +
                          "<p><strong>Message</strong>: " + $scope.formData.messageBody + "</p> " +
                          "<p><strong>Sender</strong>: " + $scope.formData.name + "</p>\n " +
                          "<p><strong>Sender contact</strong>: " + $scope.formData.email + " - " + $scope.formData.phone + "</p>\n ",
                    formType: $scope.formType
                }
        } else if ($scope.formType.firstName && $scope.formType.email && $scope.formData.messageBody) {
                console.log('submitting email to ITN staff');
                formObj = {
                    from: '"ITNAmerica Staff Member" <donotreply@itnamerica.com>',
                    to: $scope.formType.email,
                    subject: "New message from ITN Staff",
                    text: $scope.formData,
                    date: today,
                    html: "<p><strong>Subject</strong>: " + $scope.formData.subject + "</p> " +
                          "<p><strong>Message</strong>: " + $scope.formData.messageBody + "</p> " +
                          "<p><strong>Sender</strong>: " + $scope.formData.name + "</p>\n " +
                          "<p><strong>Sender contact</strong>: " + $scope.formData.email + " - " + $scope.formData.phone + "</p>\n ",
                    formType: $scope.formType
                }
        } else {
            return $scope.serverMessage = "Please fill in all required fields before submitting."
        }
        $http.post('/sendmail', formObj)
            .then(function(res) {
                $scope.loading = false;
                $scope.serverMessage = 'Your form was submitted successfully. You should hear back from us soon.';
                $scope.contactPerson = null;
            }).catch(function(err) {
                $scope.loading = false;
                $scope.serverMessage = 'There was an error submitting your form. Please contact us by phone instead.';
                $scope.contactPerson = null;
            });
    };


    //for membership, volunteer and non-rider forms
    $scope.submitFormWithPDF = function(formType) {
        console.log('submitForm PDF, formData is ', $scope.formData);
        $scope.serverMessage = '';
        $scope.formType = formType;
        var volunteerRequiredComplete = $scope.checkRequiredFields(formType);
        console.log('volunteerRequiredComplete is ', volunteerRequiredComplete);
        if (!(Object.keys($scope.formData).length === 0 && $scope.formData.constructor === Object)) {
            $scope.loading = true;
            //check for validations
            if (!volunteerRequiredComplete) {
                $scope.loading = false;
                return $scope.serverMessage;
                // return $scope.serverMessage = 'Please complete all required fields.';
            }

            $scope.formSubject = 'ITNAmerica - New ' + formType + ' application received';
            if (formType === 'membership' || formType === 'volunteer') {
                $(document).ready(function() {
                    $('#pdfVersion').css('display', 'block');
                })
                $scope.generateMultiPagePDF();
            } else if (formType === 'nonrider' || formType === 'ndaform') {
                $scope.generatePDF();
            }
        } else {
            $scope.loading = false;
            $scope.serverMessage = 'You cannot submit an empty form';
        }
    };


    $scope.submitNDAFormAsPDF = function() {
        console.log('inside pdf');
        kendo.drawing.drawDOM($("#formConfirmation"))
            .then(function(group) {
                return kendo.drawing.exportPDF(group, {
                    paperSize: "auto",
                    margin: {
                        left: "1cm",
                        top: "1cm",
                        right: "1cm",
                        bottom: "1cm"
                    }
                });
            })
            .done(function(data) {
                console.log('data is ', data);
                var ndaForm = null;
                $("#ndaForm input#name").replaceWith(function () {
                    return $("<span>"+ $scope.formData.name +"</span>");
                });
                $("#ndaForm input#itnAffiliate").replaceWith(function () {
                    return $("<span>"+ $scope.formData.itnAffiliate +"</span>");
                });
                ndaForm = $('#ndaForm').html();
                $scope.dataPDF = data;
                $http.post('/sendmail', {
                    from: '"ITNAmerica Web User" <donotreply@itnamerica.com>',
                    to: 'itnamerica2018@gmail.com',
                    subject: $scope.formSubject,
                    text: $scope.formData,
                    pdf: $scope.dataPDF,
                    html: ndaForm,
                    formType: 'ndaform'
                }).then(function(res) {
                    $scope.loading = false;
                    $scope.serverMessage = 'Your form was submitted successfully. You should hear back from us soon.';
                }).catch(function(err) {
                    $scope.loading = false;
                    $scope.serverMessage = 'There was an error submitting your form. Please contact us, or consider submitting your form by paper instead.';
                });
            });
    };

    $scope.generateMultiPagePDF = function() {
        console.log('inside multipage');
        kendo.drawing.drawDOM($("#pdfVersion"), {
                paperSize: "A4",
                margin: {
                    left: "3cm",
                    top: "1cm",
                    right: "1cm",
                    bottom: "1cm"
                },
                template: $("#page-template").html()
            }).then(function(group) {
                return kendo.drawing.exportPDF(group);
            })
            .done(function(data) {
                console.log('data is ', data);
                $scope.dataPDF = data;
                $http.post('/sendmail', {
                    from: '"ITNAmerica Web User" <donotreply@itnamerica.com>',
                    to: 'itnamerica2018@gmail.com',
                    subject: $scope.formSubject,
                    text: $scope.formData,
                    pdf: $scope.dataPDF,
                    formType: $scope.formType
                }).then(function(res) {
                    $scope.loading = false;
                    $scope.showForm = false;
                    $scope.serverMessage = 'Your form was submitted successfully. You should hear back from us soon.';
                }).catch(function(err) {
                    $scope.loading = false;
                    $scope.serverMessage = 'There was an error submitting your form. Please contact us, or consider submitting your form by paper instead.';
                });
            });
    };

    $scope.regenerateMultiPagePDF = function(formObj, formType) {
        console.log('inside renegerate pdf');
        $scope.formData = formObj;
        $scope.formType = formType;
        console.log("formdata is ", $scope.formData);
        $state.go('backup-pdf')
            .then(function() {
                console.log('begin kendo drawing');
                kendo.drawing.drawDOM($("#backupPdf"), {
                        paperSize: "A4",
                        margin: {
                            left: "3cm",
                            top: "1cm",
                            right: "1cm",
                            bottom: "1cm"
                        },
                        template: $("#page-template").html()
                    }).then(function(group) {
                        console.log('kendo complete, exporting pdf ', group);
                        return kendo.drawing.exportPDF(group);
                    }).catch(function(err) {
                        console.log('could not generate kendo, error is ', err);
                    })
                    .done(function(data) {
                        console.log('data is ', data);
                        // $scope.dataPDF = data;
                        $scope.base64ToPDF($scope.formType, $scope.formData);
                    });
            })
    };



    $scope.export = function(){
      console.log('inside export func');
        html2canvas(document.getElementById('annual-report'), {
            onrendered: function (canvas) {
                var data = canvas.toDataURL();
                var docDefinition = {
                    content: [{
                        image: data,
                        width: 500,
                    }]
                };
                console.log('doc def is ', docDefinition);
                pdfMake.createPdf(docDefinition).download("annualreport2018.pdf");
            }
        });
     };


    $scope.fetchRecentBlogURLs = function(blogLink){
      console.log('inside fetchRecentBlogURLs, blog link is ', blogLink);
      console.log('inside fetchRecentBlogURLs, blog URL is ', $scope.blogUrl);
      $http.get('/getBlogContent', {
          params: {
            blogURL: blogLink
          }
        }).then(function(response) {
            $scope.homepageBlogContent = response.data;
            $scope.blogURLs = [];
            var blogNumber = 3;
            var idx;
            if ($scope.homepageBlogContent.indexOf('<h1 class="entry-title"><a href="') !== -1){
              for (var num=0; num<blogNumber; num++){
                idx = $scope.homepageBlogContent.indexOf('<h1 class="entry-title"><a href="');
                var storeBlogURL = [];
                for (var i=33; i<$scope.homepageBlogContent.length; i++){
                  if ($scope.homepageBlogContent[idx+i] === ' ' && $scope.homepageBlogContent[idx+i+1] === 'r' && $scope.homepageBlogContent[idx+i+2] === 'e' && $scope.homepageBlogContent[idx+i+3] === 'l' && $scope.homepageBlogContent[idx+i+4] === '='){
                    break;
                  }
                  storeBlogURL.push($scope.homepageBlogContent[idx+i]);
                }
                storeBlogURL = storeBlogURL.slice(0, -1).join('').toString();
                $scope.blogURLs.push(storeBlogURL);
                $scope.homepageBlogContent =  $scope.homepageBlogContent.slice(idx+33);
              }
            }
            $scope.getContentForEachBlogURL();
      })
    };

    $scope.getContentForEachBlogURL = function(){
      for (var x = 0; x < $scope.blogURLs.length; x++) {
        $scope.getBlogContent($scope.blogURLs[x]);
      }
    };

    $scope.getBlogContent = function(url){
      console.log('inside getblogcontent');
      $http.get('/getBlogContent', {
          params: {
            blogURL: url
          }
        }).then(function(response) {
          $scope.blogContent = response.data;
          //get title of post for thumbnail
          if ($scope.blogContent.indexOf('<h1 class="entry-title"') !== -1){
            var idx = $scope.blogContent.indexOf('<h1 class="entry-title"');
            var store = [];
            for (var i=24; i<$scope.blogContent.length; i++){
              if ($scope.blogContent[idx+i] === '<'){
                break;
              }
              store.push($scope.blogContent[idx+i]);
            }
            store = store.join('').toString();
            //if title tag has other attr, strip them off
            $scope.entryTitle = store.substr(store.indexOf(">")+1,store.length)
            console.log('entry title is ', $scope.entryTitle);
          }
          //get img of post for thumnail
          if ($scope.blogContent.indexOf('<img class=') !== -1){
            var idx = $scope.blogContent.indexOf('<img class=');
            var store2 = [];
            for (var i=12; i<$scope.blogContent.length; i++){
              if ($scope.blogContent[idx+i] === 'a' && $scope.blogContent[idx+i+1] === 'l' && $scope.blogContent[idx+i+2] === 't' || $scope.blogContent[idx+i] === '>'){
                break;
              }
              store2.push($scope.blogContent[idx+i]);
            }
            $scope.entryImgURL = store2.join('').toString();
            $scope.entryImgURL = $scope.entryImgURL.match(/\bhttps?:\/\/\S+/gi);
            $scope.entryImgURL = $scope.entryImgURL.toString().slice(0,-1);
          }
          $scope.blogEntries.push({
            title: $scope.entryTitle,
            imgURL: $scope.entryImgURL,
            blogURL: url
          });
        });
    };

    $scope.readMoreLess = function(){
      $('.icon-legend').click(function() {
          var content = $(this).html();
          if ($(content).hasClass("btn-lg")){
            var innerTxt = $(this).find(".btn-lg")[0].innerText
            if (innerTxt === 'Show more'){
              $(this).find(".btn-lg")[0].innerText = 'Show less';
            } else {
              $(this).find(".btn-lg")[0].innerText = 'Show more';
            }
          }
      })
    };


    $scope.openAdditionalPage = function(pageName){
      var affiliateName;
      console.log('inside openadditionalpage ', pageName)
      $scope.itnamerica = $scope.ris = $scope.other = $scope.services = $scope.affiliates = $scope.social = $scope.events = $scope.learn = $scope.analytics = $scope.affiliateLanding = $scope.allComments = $scope.popularApps = false;
      if (pageName && pageName === 'portal'){
        $state.go('portal');
      }
      else if (pageName) {
        $scope[pageName] = true;
        $scope.showPortal = false;
      } else {
        $scope.showPortal = true;
      }
    };


    $scope.parseAffiliateNameToList = function(affiliate){
      if ($stateParams.filter){   //if comments page loaded directly from browser with filter params
        console.log('affiliate param in parseAffiliate is ', affiliate);
        // $scope.getCommentsPerAffiliate(affiliate);
        var affiliate = {};
        affiliate.name = $stateParams.filter;
        for (var eachAffiliate in $scope.affiliateList){
          var theAffiliate = $scope.affiliateList[eachAffiliate]
          if (theAffiliate.name === affiliate.name){
            $scope.itnAffiliate = theAffiliate;
          }
        }
      } else if (affiliate){ //if comments loaded from affiliate section
        for (var eachAffiliate in $scope.affiliateList){
          var theAffiliate = $scope.affiliateList[eachAffiliate]
          if (theAffiliate.name === affiliate.name){
            $scope.itnAffiliate = theAffiliate;
          }
        }
      }
      console.log('$scope.itnAffiliate in parseAffiliate is ', $scope.itnAffiliate);
    };


    $scope.loadAffiliatePage = function(affiliateName){
      $scope.bindParamToVar();
      $scope.getRidesData();
      $scope.parseAffiliateNameToList(affiliateName);
      $scope.getCommentsPerAffiliate($scope.itnAffiliate);
      $scope.currentUrl = window.location.href;
    };


    $scope.generateRESTUrl = function(affiliate, routeName){
      var baseUrl = window.location.origin;
      var url = '/' + routeName + '?filter=' + affiliate.name;
      window.location.href = url;
    };


    //is this function really needed?
    $scope.bindParamToVar = function(pageName){
      console.log('stateparams are ', $stateParams);
      if ($stateParams.filter){
        $scope.itnAffiliate.name = $stateParams.filter;
        //fetch ga view code from long variables.
      } else if ($stateParams.name){
        $stateParams.filter = $stateParams.name;
        $scope.itnAffiliate.name = $stateParams.name;
        $scope.itnAffiliate.gaViewCode = $stateParams.gaViewCode;
      }
      console.log("$scope.itnAffiliate in bindParam is ", $scope.itnAffiliate);
    };


    $scope.hasAffiliateFilter = function(){
      console.log('filter is ', $stateParams.filter);
      if ($stateParams.filter === "affiliate"){
        $scope.affiliateLanding = true;
        $scope.showPortal = false;
      } else {
        $scope.itnAffiliate = $stateParams.filter;
      }
    };


    $scope.getTemplate = function (row) {
      if (row.affiliateName === $scope.selected.affiliateName) return 'edit';
      else return 'display';
    };

    $scope.getTemplateWithAuth = function (row) {
      if (row.affiliateName === $scope.selected.affiliateName){
        return 'edit';
      }
      else {
        return 'display';
      }
    };

    $scope.switchTemplates = function(template) {
      if (template) {
        return template
      } else {
        return 'display'
      }
    };


    $scope.authAndRedirect = function(loginType, privilegeType, routeType, routeName){
        var title = "Please log in to access this page";
        swal({
          title: title,
          html:
            '<input type="text" id="swal-input1" class="swal2-input" placeholder="username or email">' +
            '<input type="password" id="swal-input2" class="swal2-input" placeholder="password">',
          focusConfirm: false,
          preConfirm: function(){
            return [
              document.getElementById('swal-input1').value,
              document.getElementById('swal-input2').value
            ]
          }
      }).then(function(result){
        if (result.value) {
          if (result.value) {
            console.log('login inputs are ', result.value[0], result.value[1]);
            var loginCredentials = {};
            loginCredentials.username = result.value[0];
            loginCredentials.password = result.value[1];
            return DataService.loginPrivilege(loginCredentials, loginType, privilegeType)
              .then(function(response){
                console.log('response is ', response);
                if (response.status === 500 && response.data === "error"){
                  swal("Login incorrect", "Please try again with the correct credentials", "error");
                } else {
                  console.log('response success loginredirect');
                  if (routeType === 'ui-sref') {
                     $state.go(routeName)
                  } else if (routeType === 'ng-click') {
                    $scope.openAdditionalPage(routeName);
                  }
                }
              })
          }
        }
      })
      return true;
    };


    $scope.authWallPopup = function(loginType, privilegeType, affiliateName, wallType){
        var theAffiliateName = affiliateName;
        var title = "Please log in to make changes";
        if (wallType && wallType === 'ridesData'){
          if ($scope.isLogged.ridesData){
            return $scope.editRidesData(theAffiliateName);
          }
        }
        swal({
          title: title,
          html:
            '<input type="text" id="swal-input1" class="swal2-input" placeholder="username/email">' +
            '<input type="password" id="swal-input2" class="swal2-input" placeholder="password">',
          focusConfirm: false,
          preConfirm: function(){
            return [
              document.getElementById('swal-input1').value,
              document.getElementById('swal-input2').value
            ]
          }
        }).then(function(result){
          if (result.value) {
            if (result.value) {
              var loginCredentials = {
                username: result.value[0],
                password : result.value[1]
              };
              console.log('login creds  are ', loginCredentials);
              return DataService.loginPrivilege(loginCredentials, loginType, privilegeType)
                .then(function(response){
                  console.log('response is ', response);
                  if ( (response.status === 500 && response.data === "error")) {
                    swal("Login incorrect", "Please try again with the correct credentials", "error");
                  } else {
                    console.log('response success');
                    $scope.isLogged.ridesData = true;
                    $scope.editRidesData(theAffiliateName);
                  }
                }).catch(function(error){
                  console.log('err returned from frontend ', error);
                })
            }
          }
        })
      return true;
    };


    $scope.getRidesData = function(){
        DataService.getAllRides().then(function(data){
          $scope.ridesData = data.data;
        })
    };

    $scope.editRidesData = function (affiliateName) {
      $scope.selected = angular.copy(affiliateName);
    };

    $scope.saveRidesData = function (idx) {
      $scope.ridesData[idx] = angular.copy($scope.selected);
      DataService.updateAffiliateRidesData($scope.selected).then(function(data){
      })
      $scope.selected = {};
    };


    $scope.getComments = function() {
      $scope.serverMessage = "Please wait a few seconds while the comments are loading.";
        DataService.getComments().then(function(response){
          $scope.comments = response.data;
          $scope.serverMessage = "";
        });
    };

    $scope.addComment = function () {
      console.log('inside add comment, content is', $scope.commentData);
      $scope.serverMessage = "Posting comment. Please wait.";
      DataService.addComment($scope.commentData)
      .then(function(data){
        //email the affiliate or dept in question
        $scope.emailCommentAsync().then(function(response){
          //async add for immediate update in page
          $scope.comments.push($scope.commentData);
          console.log('comments are ', $scope.comments);
          $scope.showCommentInput = false;
          $timeout(function(){
            $scope.serverMessage = "";
          }, 5000)
        });
      })
    };

    $scope.emailCommentAsync = function() {
      var deferred = $q.defer();
      var today = new Date();
      var formObj = {
          from: '"Samanthics Web User" <donotreply@samanthics.com>',
          to: $scope.commentData.emailContact,
          subject: "New message from Samanthics Portfolio App",
          text: $scope.commentData,
          date: today,
          html: "<p><strong>Message</strong>: " + $scope.commentData.message + "</p> " +
                "<p><strong>Sender</strong>: " + $scope.commentData.author + "</p>\n " +
                "<p><strong>Sender contact</strong>: " + $scope.commentData.email + "</p>\n "
      };
      FormService.sendMail(formObj).then(function(response){
        console.log('data returned from sendmail is ', response);
        $scope.serverMessage = response.serverMessage;
        $scope.loading = response.loading;
        $scope.contactPerson = response.contactPerson;
        deferred.resolve('Resolved: ', response.status);
      })
      return deferred.promise;
    };


    $scope.deleteComment = function() {
      $scope.serverMessage = "Loading. Please wait.";
      DataService.deleteComment($scope.commentToDelete)
        .then(function(data){
          //async delete for immediate update in page
            for (var key in $scope.comments) {
              if ($scope.comments.hasOwnProperty(key)) {
                if ( ($scope.commentToDelete.message === $scope.comments[key].message) &&  ($scope.commentToDelete.author === $scope.comments[key].author)) {
                  $scope.comments.splice(key, 1);
                }
              }
            }
          $timeout(function(){
            $scope.serverMessage = "";
          }, 5000)
          $scope.commentToDelete = {};
        })
    };

    $scope.addCommentFromAllComments = function(affiliateOfComment) {
      $scope.showCommentInput = true;
      $scope.affiliateOfComment = affiliateOfComment;
    };

    $scope.hideModal = function(modalId) {
      $('.modal').hide();
      $('#'+modalId).hide();
      $('.modal-backdrop').css('display','none');
    };

    $scope.toggleModal = function(modalIdToOpen, modalIdToClose) {
      if (modalIdToClose) {
        $('#'+modalIdToClose).modal('hide');
      }
      $('#'+modalIdToOpen).modal('show');
    };


    $scope.getEmployeesPromise = function() {
      var deferred = $q.defer();
      DataService.getEmployees().then(function(data){
        console.log('employees are ', data);
        $scope.employees = data.data;
        deferred.resolve('Resolved: ', data.data);
      }).catch(function(err){
        deferred.resolve('Error: ', err);
      })
      return deferred.promise;
    };

    $scope.toggleEmployee = function(employee) {
      console.log('employee is ', employee);
      $scope.employeeSelected = employee;
      $scope.showEditProfile = false;
      $scope.showDisplayProfile = true;
    };

    $scope.toggleProfileType = function(profile) {
      if (profile === 'display') {
        console.log('inside display profile');
        $scope.showEditProfile = false;
        $scope.showDisplayProfile = true;
      } else if (profile === 'edit') {
        console.log('inside edit profile');
        //ask for credentials
        $scope.showEditProfile = true;
        $scope.showDisplayProfile = false;
      };
      $(window).scrollTop(500);
    };

    $scope.editEmployee = function(){
      console.log('updated employee obj before backend is ', $scope.employeeSelected);
      DataService.updateEmployee($scope.employeeSelected)
        .then(function(data){
          console.log('return from employee put call is ', data);
          $scope.serverMessage = "Your profile was succesfully updated";
          //updates data on DOM without reload
          $timeout(function(){
            $scope.getEmployeesPromise().then(function(response){
              $scope.toggleProfileType('display');
            })
          }, 3000);
        })
        .catch(function(err){
          $scope.serverMessage = "There was an error updating your profile."
        })
    };


    $scope.addEmployee = function(){
      swal({
        title: 'Add an Employee',
        html:
          '<input type="text" id="swal-first-name" class="swal2-input" placeholder="First Name">' +
          '<input type="text" id="swal-last-name" class="swal2-input" placeholder="Last Name">' +
          '<input type="text" id="swal-dob" class="swal2-input" placeholder="Date of Birth (optional)">' +
          '<input type="text" id="swal-position" class="swal2-input" placeholder="Position">' +
          '<input type="text" id="swal-bio" class="swal2-input" placeholder="Employee Bio">' +
          '<input type="text" id="swal-email" class="swal2-input" placeholder="Email">' +
          '<input type="password" id="swal-password" class="swal2-input" placeholder="Password">',
        focusConfirm: false,
        preConfirm: function(){
          return [
            document.getElementById('swal-first-name').value,
            document.getElementById('swal-last-name').value,
            document.getElementById('swal-dob').value,
            document.getElementById('swal-position').value,
            document.getElementById('swal-bio').value,
            document.getElementById('swal-email').value,
            document.getElementById('swal-password').value,
          ]
        }
      }).then(function(result){
        if (result.value) {
          console.log('creds are ', result.value);
          var newEmployee = {};
          newEmployee.firstName = result.value[0];
          newEmployee.lastName = result.value[1];
          newEmployee.dob = result.value[2];
          newEmployee.position = result.value[3];
          newEmployee.bio = result.value[4];
          newEmployee.email = result.value[5];
          newEmployee.password = result.value[6];
          return DataService.addEmployee(newEmployee)
            .then(function(response){
              swal("New employee added", "Successfully added new employee.", "success")
              console.log('response is ', response);
              if (response.status === 500 && response.data === "error"){
                console.log('error');
              } else {
                console.log('success');
              }
            })
        }
      })
    };


    $scope.authWallEmployee = function(employee){
      var employeeSelected = employee
      swal({
        title: 'Please log in to edit your profile',
        html:
          '<input type="text" id="swal-input1" class="swal2-input" placeholder="email">' +
          '<input type="password" id="swal-input2" class="swal2-input" placeholder="password">',
        focusConfirm: false,
        preConfirm: function(){
          return [
            document.getElementById('swal-input1').value,
            document.getElementById('swal-input2').value
          ]
        }
      }).then(function(result){
        if (result.value) {
          console.log('creds are ', result.value[0], result.value[1]);
          var loginCredentials = {
            email: result.value[0],
            password: result.value[1]
          };
          return DataService.loginEmployees(loginCredentials, employeeSelected)
            .then(function(response){
              console.log('response is ', response);
              if ((response.status === 500 && response.data === "error") || response.data === null){
                swal("Login incorrect", "Please try again with the correct credentials", "error")
              } else {
                console.log('response success');
                $scope.toggleProfileType('edit');
              }
            }).catch(function(error){
              console.log('err returned from frontend ', error);
            })
        }
      })
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

   // $scope.getTimesheets = function(){
   //   var affiliateName = 'Gateway';
   //   DataService.retrieveTimesheets(affiliateName)
   //   .then(function(data){
   //     console.log('ts returned from get ', data);
   //     $scope.timesheets = data.timesheets;
   //   })
   // };


}]);
