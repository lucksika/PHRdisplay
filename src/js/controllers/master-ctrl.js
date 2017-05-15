/**
 * Master Controller
 */

 angular.module('RDash')
 .controller('MasterCtrl', ['$scope', '$cookieStore', '$location', 'currentUser', MasterCtrl])
 .controller('AuthenticationCtrl', ['$scope', '$state','$rootScope', '$location', 'AuthenticationService' ,'currentUser', '$mdDialog' , AuthenticationCtrl])
 .controller('TimelineCtrl', ['$scope', 'EventService', 'ResourceFactory', 'currentUser', TimelineCtrl])
 .controller('UpcomingEventWidgetCtrl', ['$scope','EventService', 'ResourceFactory', 'currentUser', UpcomingEventWidgetCtrl])
 .controller('medicineInfoCtrl', ['$scope', 'ResourceFactory', 'currentUser', 'medicineService', medicineInfoCtrl])
 .controller('DashboardCtrl', ['$scope', 'modalProvider', 'currentDashbordWidgetService', 'medicineService', 'currentUser', 'profileService', DashboardCtrl])
 .controller('DashboardCustomCtrl', ['$scope', 'modalProvider','currentDashbordWidgetService', DashboardCustomCtrl])
 .controller('ProfileCtrl', ['$scope', 'ResourceFactory', 'currentUser', ProfileCtrl])
 .controller('InputFormCtrl', ['$scope', 'ResourceFactory' ,'modalProvider', 'currentUser', 'medicineService', 'resultsLimitFactory', InputFormCtrl]);


 function MasterCtrl($scope, $cookieStore, $location, currentUser) {
    /**
     * Sidebar Toggle & Cookie Control
     */
     $scope.path = $location.path().substring(1);
     var mobileView = 992;

     currentWidth = window.innerWidth;

     $scope.getWidth = function() {
        return window.innerWidth;
    };


    /**
     * Handle Toggle Sidebar 
     */
     $scope.$watch($scope.getWidth, function(newValue, oldValue) {
        if (newValue >= mobileView) {
            if (angular.isDefined($cookieStore.get('toggle'))) {
                $scope.toggle = ! $cookieStore.get('toggle') ? false : true;
            } else {
                $scope.toggle = true;
            }
        } else {
            $scope.toggle = false;
        }

    });

     $scope.toggleSidebar = function() {
        $scope.toggle = !$scope.toggle;
        $cookieStore.put('toggle', $scope.toggle);
    };


    $scope.FBImg = currentUser.getProfileImgUrl() ? currentUser.getProfileImgUrl() : ''
    $scope.profileImg = 'img/joii.png'

    var displayProfile = currentUser.getDisplayProfile()
    var noDisplayProfile = {
        displayName: "Please add information",
        birthDate: "",
        phone: ""
    }
    console.log("displayProfile: , " , displayProfile)
    $scope.displayProfile =  displayProfile ? displayProfile : noDisplayProfile
    
    window.onresize = function() {
        $scope.$apply();
    };
}
function AuthenticationCtrl($scope, $state, $rootScope, $location, AuthenticationService, currentUser, $mdDialog){
    // reset login status
    // console.log("AuthenticationCtrl")

    $scope.FBlogin = function () {
        console.log("click login")
        AuthenticationService.ClearCredentials();
        $scope.dataLoading = true;
        FB.login(function(response){
            console.log("response: " , response)
        
        // AuthenticationService.Login($scope.username, $scope.password, function (response) {
            if (response.status == "connected") {
                AuthenticationService.setStatus(true)
                AuthenticationService.SetCredentials(response.authResponse.userID);
                FB.api(
                    '/'+ response.authResponse.userID + '/picture', 
                    function(response){ 
                        AuthenticationService.SetInformation(response.data.url, $state.transitionTo("home.dashboard"))
                    }
                )
                
            } else {
                $scope.dataLoading = false;
                $scope.error = response.message;
            }
        }, {
            scope: 'publish_actions, public_profile',
            return_scopes: true
            }
        )
    };
    var FBlogout = function(){
        console.log("click logout");
        FB.getLoginStatus(function(response) {
            console.log("response: ", response)
            if (response && response.status === 'connected') {
                AuthenticationService.setStatus(false)
                FB.logout(function(response) {
                    AuthenticationService.ClearCredentials();
                    $state.transitionTo("login");
                });
            }
        });
    }
    $scope.alertLogoutDialog = function(){
        var confirm = $mdDialog.confirm()
          .title('Confirm Logout')
          // .textContent('All of the banks have agreed to forgive you your debts.')
          .ariaLabel('Lucky day')
          // .targetEvent(ev)
          .ok('OK')
          .cancel('CANCEL');

        $mdDialog.show(confirm).then(function() {
          FBlogout()
        });
    }
    
};

function DashboardCtrl($scope, modalProvider, currentDashbordWidgetService, medicineService, currentUser, profileService) {
    //get initial medicine list here
    medicineService.initialMedicineList()
    profileService.initialProfileList()
    
    //get initial profile: Name, Birthdate, Phone
    $scope.today = new Date()
    $scope.currentWidgets = currentDashbordWidgetService.getCurrentWidgets()
    $scope.openModal = function(type) {
       modalProvider.openModal(type)
    }
    $scope.$on("update: widgets", function(){
        $scope.currentWidgets = currentDashbordWidgetService.getCurrentWidgets()
    })

}

function DashboardCustomCtrl($scope, modalProvider, currentDashbordWidgetService){    
    var max = 4
    var closeModal = function(){
        modalProvider.closeModal()
    }
    $scope.check = angular.copy(currentDashbordWidgetService.getCurrentWidgetsKeys())
    $scope.closeModal = closeModal
    var countChecked = function(){
        var cnt = 0
        var checked = $scope.check
        var value = []
        for(var key in checked){
            value.push(checked[key])
        }
        value.filter(function(val){
            cnt += val ? 1 : 0
        })
        return cnt
    }

    $scope.amount = max - countChecked()
    
    $scope.shouldDisable = function(item){
        return !($scope.amount || item)
    }

    $scope.countAmount = function(){
        $scope.amount = max - countChecked()
    }

    $scope.setDashboardWidget = function() {
        currentDashbordWidgetService.updateCurrentWidgets($scope.check)
        closeModal()
    }

}

function ProfileCtrl($scope, ResourceFactory, currentUser){
    // console.log("ProfileCtrl")
    var userid = currentUser.getUserID()
    var appid = currentUser.getAppID()
    var date = '2017-01-28' //mock (find another solution later)

    var initialProfileView = function(){
        var profileResource = ResourceFactory.profile()
        var obj = profileResource.get({userid: userid, appid: appid, date: date}, function(){
            // console.log(obj.data.profile)
            if(obj.data){
                $scope.profile = obj.data.profile
                $scope.profile.birthdate = moment(obj.data.profile.birthdate).format("MMMM Do YYYY")    
            }
            
        })
        
    }
    initialProfileView()
}

function medicineInfoCtrl($scope, ResourceFactory, currentUser, medicineService){
    var userid = currentUser.getUserID()
    var appid = currentUser.getAppID()

    $scope.isEdit = false
    // console.log("userID: " , userid)

    var createDataObjForSchedule = function(obj){
        console.log(obj)
        bedtime = ''
        detail = []
        obj.forEach(function(x){
            var before = ''
            var after = ''
            var bed = ''
            if(x[0] != "bedtime"){
                for(var title in x[1].before){
                    before = before + x[1].before[title] + ", "
                }
                for(var title in x[1].after){
                    after = after + x[1].after[title] + ", "
                }
            detail.push({time: x[0], before: before, after: after, bed: bed})
            }else {
                for(var title in x[1]){
                   bedtime = bedtime + x[1][title] + ", "
                }
            }
        })
        $scope.table = detail
        $scope.bedtime = bedtime
    }
    var medicineResource = ResourceFactory.medicine()
    var initialMedicineView = function(){
        // medicineLists = medicineService.getMedicineList()
        // console.log("userid: " + userid + "/ appid: " + appid)
        var obj = medicineResource.get({userid: userid, appid: appid}, function(){
            createDataObjForSchedule(obj.data)
            console.log("obj.desc: " , obj.desc)
            $scope.description = obj.desc
        })
        
    }

    $scope.toggleDeleteBtn = function (argument) {
        $scope.isEdit = !$scope.isEdit
    }

    $scope.deleteMedicine = function(_title){
        var medicineLists = medicineService.getMedicineList()
        var index = medicineLists.findIndex(function(x){ return x.title == _title })
        var medId = medicineLists[index].medId
        medicineResource.delete({userid: userid, appid: appid, medId: medId}, function(){
            window.location.reload() //reload page
        })
    }

    initialMedicineView()
}
function UpcomingEventWidgetCtrl($scope, EventService,  ResourceFactory, currentUser){
    var userid = currentUser.getUserID()
    var appid = currentUser.getAppID()
    var today = new Date()
    var year = today.getFullYear().toString()
    var month = '0' + (today.getMonth() + 1).toString()

    var _today = moment(today).format('YYYY-MM-DD')    
    $scope.noData = false
    var appointmentResource = ResourceFactory.appointment()
    var eventsList = appointmentResource.get({userid: userid, appid: appid, month: month, year: year}, function (){
        // console.log(eventsList.data)
        var eventLists = eventsList.data
                    .filter(function(event){
                        return moment(new Date(event.date)).isSameOrAfter(_today)
                    }).map(function(event){
                        return EventService.createEventsObject(event, 'widgets')
                    })
        if(eventLists.length > 0){
            $scope.eventsWidget = eventLists   
        }else{
            $scope.noData = true
        }
        
        });
}
function TimelineCtrl($scope, EventService, ResourceFactory, currentUser){
    var userid = currentUser.getUserID()
    var appid = currentUser.getAppID()
    var monthList = EventService.monthList
    var today = new Date()
    $scope.monthList = monthList
    $scope.year = today.getFullYear()
    $scope.month = monthList[today.getMonth()]
    $scope.noData = false
    var getAppointment = function () {

        var month = $scope.month.ref
        var year = $scope.year
        var appointmentResource = ResourceFactory.appointment()
        var eventsList = appointmentResource.get({userid: userid, appid: appid, month: month, year: year}, function (){
            console.log("eventsList: " , eventsList)
            if(eventsList.data.length > 0){
                $scope.noData = false
                $scope.eventsPage = eventsList.data
                                .sort(function(a, b){
                                    return new Date(b.date) - new Date(a.date)
                                }).map(function(event) { 
                                    return EventService.createEventsObject(event, 'page')
                                })
            }else {
                console.log("noData")
                $scope.noData = true
                $scope.eventsPage = []
            }
               
        });
    }
    $scope.getEventAt = function(){
        getAppointment()
    } 
    getAppointment()
    
}

function InputFormCtrl($scope, ResourceFactory, modalProvider, currentUser, medicineService, resultsLimitFactory){    
    $scope.hstep = 1;
    $scope.mstep = 1;
    // console.log("medicineList " , medicineService.getMedicineList())
    var resultsLimit = resultsLimitFactory.limit
    $scope.option = {
        type_list: [
            {id: 1, title: 'Results', template: 'templates/inputform/labresults.html'},
            {id: 2, title: 'Nutrient', template: 'templates/inputform/nutrient.html'},
            {id: 3, title: 'Exercise', template: 'templates/inputform/exercise.html'},
            {id: 4, title: 'Appointment', template: 'templates/inputform/appointment.html'},
            {id: 5, title: 'Medicine', template: 'templates/inputform/medicine.html'},
            {id: 6, title: 'Profile', template: 'templates/inputform/profile.html'}
        ],
        labresults_list: [
            {id: 1, title: 'creatinine', unit: 'mm/dL', limit: resultsLimit.creatinine},
            {id: 2, title: 'BUN', unit: 'mm/dL', limit: resultsLimit.BUN},
            {id: 3, title: 'albumin', unit: 'mm/dL', limit: resultsLimit.albumin},
            {id: 4, title: 'eGFR', unit: 'mm/dL', limit: resultsLimit.eGFR},
            {id: 5, title: 'sediment', unit: 'mm/dL', limit: resultsLimit.sediment},
            {id: 6, title: 'albumin creatinine ratio', unit: 'mm/dL', limit: resultsLimit.albuminCretinineRatio},
            {id: 7, title: 'protein creatinie retio', unit: 'mm/dL', limit: resultsLimit.proteinCretinineRatio},  
            {id: 8, title: 'white blood cell ratio', unit: 'mm/dL', limit: resultsLimit.whiteBloodCellRatio},
            {id: 9, title: 'sodium', unit: 'mm/dL', limit: resultsLimit.sodium},
            {id: 10, title: 'blood pressure', unit: 'mm Hg', limit: resultsLimit.bloodPressure},
            {id: 11, title: 'water', unit: 'lt', limit: resultsLimit.water},
            {id: 12, title: 'weight', unit: 'kg', limit: resultsLimit.weight},
            {id: 13, title: 'glucose blood level', unit: 'mmol', limit: resultsLimit.glucoseBloodLevel},
        ],
        meal_list: [
            {id: 1, title: 'breakfast'},
            {id: 2, title: 'lunch'},
            {id: 3, title: 'dinner'}
        ],
        exercise_list: [
            {id: 1, title: 'walking', goal: 3000, unit: "step"},
            {id: 2, title: 'running', goal: 3000, unit: "step"},
            {id: 3, title: 'squeeze ball', goal: 500, unit: "time"}
        ],
        medicine_list: medicineService.getMedicineList()
    }
    
    var LabresultResource = ResourceFactory.labresultInfo()
    var postNutrientResource = ResourceFactory.nutrientMeal()
    var appointmentResource = ResourceFactory.appointment()
    var profileResource = ResourceFactory.profile()
    var exerciseResource = ResourceFactory.exercise()
    var medicineResource = ResourceFactory.medicine()
    

    var userid = currentUser.getUserID()
    var appid = currentUser.getAppID()

    var formatDate = function (dateObj){
        return moment(dateObj).format('YYYY-MM-DD');
    }

    var createDataObj = function(cat, input){
        // console.log("input: " , input)
        var data = new Object();
        data.userid = userid
        data.appid = appid
        if(cat != 'medicine'){
            data[cat] = angular.copy(input[cat])    
        }else if(cat == 'medicine'){
            data[cat] = {}
            data.medId = input.result.medId
            
            //"morning noon bedtime evening"
            var med_meal = ""
            //"before bed after"
            var times_daily = ""
            for ( var meal in input.med_meal){
                med_meal = med_meal + meal + " "
            }
            for ( var time in input.times_daily){
                times_daily = times_daily + time + " "

                // times_daily.push(time)
            }
            data[cat]["med_meal"] = med_meal
            data[cat]["times_daily"] = times_daily
            data[cat]["amount"] = input.amount

        }
        
        if(input.date != undefined){
            data.date = formatDate(input.date)
        }
        if(input.meal != undefined){
            console.log(input.meal)    
            data.meal = input.meal.title
        }
        if(input.time != undefined){
            data[cat].time = moment(input.time).format('LT')
        }

        // console.log(JSON.stringify(data))
        
        return data
    }
    var reloadPage = function(){
        window.location.reload()
    }

    var initialProfileInputForm = function () {
        var profile = currentUser.getUserProfile()
        var _profile = profile
        console.log("_profile: " , _profile )
        _profile.birthdate =  new Date(profile.birthdate)
        _profile.height = parseInt(profile.height)
        _profile.weight = parseInt(profile.weight)
        _profile.age = parseInt(profile.age)
        $scope.information = {
            profile: _profile
        }
    }

    initialProfileInputForm()

    var sendInformationToServer = function (resource, information) {
        resource.save(information, function(){
            closeModal(reloadPage)
        })
    }


    $scope.saveInputForm = function(){    
        if($scope.labresult != undefined){
            if($scope.labresult.result.title == 'water'){
                labresult = angular.toJson(createDataObj('result', $scope.labresult)); //receive data from input form

                sendInformationToServer(exerciseResource, labresult)
            }else {
                labresult = angular.toJson(createDataObj('result', $scope.labresult)); //receive data from input form
                sendInformationToServer(LabresultResource, labresult)
            }
            labresult = ''
        }else if($scope.appointment != undefined){
            information = angular.toJson(createDataObj('description', $scope.appointment)) 
            // appointmentResource.save(information)
            sendInformationToServer(appointmentResource, information)
        }else if($scope.exercise != undefined){
            activity = angular.toJson(createDataObj('activity', $scope.exercise)) 
            // exerciseResource.save(activity)
            sendInformationToServer(exerciseResource, activity)
        }else if($scope.nutrient != undefined){
            // console.log("save")
            nutrient = angular.toJson(createDataObj('nutrients', $scope.nutrient))
            // postNutrientResource.save(nutrient, function(data) {
            //     console.log("data: " , data)
            // })
            sendInformationToServer(postNutrientResource, nutrient)
            nutrient = ''
        }else if($scope.medicine != undefined){
            medicine = angular.toJson(createDataObj('medicine', $scope.medicine))
            console.log("medicine: " , medicine)
            // medicineResource.save(medicine)
            sendInformationToServer(medicineResource, medicine)
        }else if($scope.information != undefined){
            profile = angular.toJson(createDataObj('profile', $scope.information))
            console.log("profile: " , profile)
            // profileResource.save(profile, function(resp){
            //     console.log("resp: " , resp)
            //     closeModal(reloadPage)
            // })
            sendInformationToServer(profileResource, profile)
        }

        // closeModal(reloadPage)
    } 

    var closeModal = function(callback){
        modalProvider.closeModal()
        $scope.chooseType = {}
        $scope.labresult = {}
        $scope.exercise = {}
        $scope.general = {}
        callback()
        
    }
    $scope.closeModal = closeModal
}