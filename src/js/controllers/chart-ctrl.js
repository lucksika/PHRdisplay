/**
 * Alerts Controller
 แยก logic เรื่องวันที่เป็น super controller 
 สีอยู่ใน config
 */

angular
 .module('RDash')
 .controller('GetImageCtrl', ['$scope', 'ResourceFactory', GetImageCtrl])
 .controller('LabresultCtrl', ['$scope', 'ResourceFactory', 'currentUser','FormatDateFactory' , LabresultCtrl])
 .controller('LabResultDetailCtrl', ['$scope', '$state', '$stateParams', 'ResourceFactory', 'currentUser', 'FormatDateFactory', 'generateObjectForTableService', LabResultDetailCtrl])
 .controller('LineBunCtrl', ['$scope', LineBunCtrl])
 .controller('BarWeightCtrl', ['$scope', BarWeightCtrl])
 .controller('BarNutrientProgressCtrl', ['$scope', BarNutrientProgressCtrl])
 .controller('BarExerciseCtrl', ['$scope', '$rootScope', 'ResourceFactory', 'currentUser', 'FormatDateFactory', 'generateExerciseColorandOptionChart', BarExerciseCtrl])
 .controller('ExerciseDetailCtrl', ['$scope', '$state', '$stateParams', 'ResourceFactory', 'currentUser', 'FormatDateFactory', 'generateObjectForTableService', 'generateExerciseColorandOptionChart', ExerciseDetailCtrl])
 .controller('PieNutrientCtrl', ['$scope', 'ResourceFactory', 'FormatDateFactory', 'NutrientPieChartService', 'currentUser', PieNutrientCtrl])
 .controller('PieNutrientWidgetCtrl', ['$scope', 'ResourceFactory', 'FormatDateFactory', 'NutrientPieChartService', 'currentUser', PieNutrientWidgetCtrl])
 .controller('PieNutrientProgressWidgetCtrl', ['$scope', 'ResourceFactory', 'FormatDateFactory', 'NutrientPieChartService', 'currentUser', PieNutrientProgressWidgetCtrl])
 .controller('LineNutrientCtrl', ['$scope', 'ResourceFactory', 'FormatDateFactory', 'currentUser', '$mdDialog', LineNutrientCtrl])
 .controller('PieMineralCtrl', ['$scope', PieMineralCtrl])
 .controller('KnobWaterChartCtrl', ['$scope', 'ResourceFactory', 'currentUser', 'FormatDateFactory', 'resultsLimitFactory', KnobWaterChartCtrl])
 .controller('KnobRiceChartCtrl', ['$scope', KnobRiceChartCtrl]);

function GetImageCtrl($scope, ResourceFactory){
    var imageResource = ResourceFactory.labresultImage()

    $scope.getImg = function () {
        var image = imageResource.get( function (){
            // console.log(image)
            $scope.myImage = image.string
        });
    }

}
function ExerciseDetailCtrl($scope, $state, $stateParams, ResourceFactory, currentUser, FormatDateFactory, generateObjectForTableService, generateExerciseColorandOptionChart){
    // console.log("$stateParams.ref: ", $stateParams.ref)
    var userid = currentUser.getUserID()
    var appid = currentUser.getAppID()
    var date = FormatDateFactory.formatDate(new Date())
    var amount = 14
    
    $scope.title = $stateParams.ref
    $scope.unit = {
        "walking": "step",
        "running": "step",
        "squeeze ball": "time"
    }

    var initialBarExercise = function(){
        
        var exerciseResource = ResourceFactory.exercise()
        var info = exerciseResource.get({userid: userid, appid: appid, date: date, title: $stateParams.ref,amount: amount}, function(){
            // console.log("info" , info)
            $scope.results = info.chart
            // console.log(info.chart)
            // console.log(info.data)
            var list = generateExerciseColorandOptionChart.generateColorandOptionList(info.chart)
            $scope.colours = list[0]
            $scope.options = list[1]
            $scope.table = generateObjectForTableService.createObjforTable("under" ,info.data[$stateParams.ref])
        })
    }
    
    initialBarExercise()
}

function BarExerciseCtrl($scope, $rootScope, ResourceFactory, currentUser, FormatDateFactory, generateExerciseColorandOptionChart) {
    var userid = currentUser.getUserID()
    var appid = currentUser.getAppID()
    var date = FormatDateFactory.formatDate(new Date())
    var amount = 7
    $scope.noData = false

    $scope.unit = {
        "walking": "step",
        "running": "step",
        "squeeze ball": "time"
    }

    var initialBarExercise = function(){
        $scope.series = ['You data'];
        
        var exerciseResource = ResourceFactory.exercise()
        var info = exerciseResource.get({userid: userid, appid: appid, date: date, amount: amount}, function(){
            // console.log(info)
            if(info.chart){
                $scope.results = info.chart
                var list = generateExerciseColorandOptionChart.generateColorandOptionList(info.chart)
                $scope.colours = list[0]
                $scope.options = list[1]
                $scope.noData = false

            }else {
                $scope.noData = true
                $scope.results = []
            }
        })
    }
    
    initialBarExercise()

}
function KnobRiceChartCtrl($scope){
    $scope.value = 20;
    $scope.options = {
        unit: "%",
        size: 150,
        readOnly: true,
        subText: {
            enabled: true,
            text: 'Rice',
            color: '#000',
            font: 'auto'
        },
        trackWidth: 20,
        barWidth: 15,
        trackColor: '#656D7F',
        barColor: '#FFCC66'
        //other options
    };
}

function KnobWaterChartCtrl($scope, ResourceFactory, currentUser, FormatDateFactory, resultsLimitFactory){
    var waterResource = ResourceFactory.water()
    var userid = currentUser.getUserID()
    var appid = currentUser.getAppID()
    var date = FormatDateFactory.formatDate(new Date())
    // $scope.value = 20
    var limitDefault = resultsLimitFactory.limit.water
    
    function initialKnobChart () {
        $scope.options = {
            unit: "%",
            size: 200,
            readOnly: true,
            trackWidth: 25,
            barWidth: 20,
            dynamicOptions: true,
            trackColor: '#E0E0E0',
            
        
        }   
        var info = waterResource.get({userid: userid, appid: appid, date: date, amount: 1}, function(){
            // console.log("info" , info)
            var value = 0
            var limit = limitDefault
            if(info.chart[0].points.length){
                value = parseFloat(info.chart[0].points[0])
                limit = parseFloat(info.chart[0].goal[0])
            }
            var barValue = (value / limit * 100).toFixed(0);
            var barColor =  barValue > 100.00 ? '#E53935' : '#2cc185'
            $scope.value = barValue
            $scope.options = {
                subText: {
                    enabled: true,
                    text: value + ' / ' + limit + ' lb',
                    color: '#000',
                    font: 'auto'
                },
                barColor: barColor
            }
        })
            
        

    }
    initialKnobChart()
    
}

function LabresultCtrl($scope, ResourceFactory, currentUser, FormatDateFactory){
    var today = new Date()
    var userid = currentUser.getUserID()
    var appid = currentUser.getAppID()
    var year = today.getFullYear().toString()
    var month = '0' + (today.getMonth() + 1).toString()
    var amount = 4
    var firstName =  currentUser.getDisplayProfile().firstName
    $scope.noData = false
    $scope.options = {
            elements:{
                line: {
                    fill: false,
                    borderWidth: 5,

                },
                point:{
                    radius: 5,
                    // pointBackgroundColor: '#F44336'
                }
            },
            scales: {
                yAxes: [{
                    scaleLabel: {
                    display: true,
                    labelString: 'Value (mg/dL)'
                    }
                }],
                xAxes: [{
                    scaleLabel: {
                    display: true,
                    labelString: 'Date'
                    }
                }]
            }    
            

        }
    
    $scope.colours = ['#4FC3F7', '#F44336']
    
    $scope.series = [ firstName + ' (mg/dL)', 'Limit (mg/dL)']
    var initialLabresultData = function(){
        var LabresultResource = ResourceFactory.labresultChartPoint()
        var info = LabresultResource.get({userid: userid, appid: appid, year: year, month: month, amount: amount}, function(){
            if(info.chart){
                $scope.results = info.chart
                $scope.noData = false
            }else{
                $scope.noData = true
                $scope.results = []
            }
        })
        
    }

    initialLabresultData()

}

function LabResultDetailCtrl($scope, $state, $stateParams, ResourceFactory, currentUser, FormatDateFactory, generateObjectForTableService){
    // console.log("$stateParams.ref: ", $stateParams.ref)
    var today = new Date()
    var userid = currentUser.getUserID()
    var appid = currentUser.getAppID()
    var year = today.getFullYear().toString()
    var month = '0' + (today.getMonth() + 1).toString()
    var amount = 12
    var firstName =  currentUser.getDisplayProfile().firstName
    $scope.title = $stateParams.ref
    $scope.options = {
            elements:{
                line: {
                    fill: false,
                    borderWidth: 5,
                },
                point:{
                    radius: 5,
                    // pointBackgroundColor: '#F44336'
                }
            }, 
            scales: {
                yAxes: [{
                    scaleLabel: {
                    display: true,
                    labelString: 'Value (g)'
                    }
                }],
                xAxes: [{
                    scaleLabel: {
                    display: true,
                    labelString: 'Date'
                    }
                }]
            } 
            
        }
    $scope.colours = ['#4FC3F7', '#F44336']
    
    $scope.series = [ firstName + ' (mg/dL)', 'Limit (mg/dL)'] 
  
    var initialLabresultData = function(){
        var LabresultResource = ResourceFactory.labresultChartPoint()
        var info = LabresultResource.get({userid: userid, appid: appid, year: year, month: month, amount: amount, title: $stateParams.ref }, function(){
            $scope.results = info.chart
            $scope.table = generateObjectForTableService.createObjforTable("over", info.data[$stateParams.ref])
            
        })
        
    }

    initialLabresultData()


}
function LineBunCtrl($scope){
    var date = new Date();
    var lastcheck_bun = new Date(date);   
    lastcheck_bun.setDate(date.getDate() - 20);
    $scope.lastcheck_bun = lastcheck_bun;
    $scope.labels = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December", "January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December", "January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    $scope.series = ['Limit (mg/dL)', 'Lucksika (mg/dL)'];
    $scope.data = [
    [20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20],
    [10, 9, 15, 25, 22, 18, 11, 15, 12, 11, 9, 25, 10, 9, 15, 25, 22, 18, 11, 15, 12, 11, 9, 25, 10, 9, 15, 25, 22, 18, 11, 15, 12, 11, 9, 25]
    ]; 
}
function BarWeightCtrl($scope){
    var date = new Date();
    var lastcheck_bun = new Date(date);   
    lastcheck_bun.setDate(date.getDate() - 20);
    $scope.lastcheck_bun = lastcheck_bun;
    $scope.labels = ['2010', '2011', '2012', '2013', '2014', '2015', '2016'];
    $scope.series = ['You (kg)'];
    $scope.data = [
    [45, 50, 55, 60, 65, 61, 52]
    ];  
    $scope.colours = [{
        backgroundColor: [
            'rgba(255, 99, 132, 0.2)',
            'rgba(54, 162, 235, 0.2)',
            'rgba(255, 206, 86, 0.2)',
            'rgba(75, 192, 192, 0.2)',
            'rgba(153, 102, 255, 0.2)',
            'rgba(255, 159, 64, 0.2)'
        ],
        borderColor: [
            'rgba(255,99,132,1)',
            'rgba(54, 162, 235, 1)',
            'rgba(255, 206, 86, 1)',
            'rgba(75, 192, 192, 1)',
            'rgba(153, 102, 255, 1)',
            'rgba(255, 159, 64, 1)'
        ],
        hoverBackgroundColor:[
            'rgba(255,99,132,1)',
            'rgba(54, 162, 235, 1)',
            'rgba(255, 206, 86, 1)',
            'rgba(75, 192, 192, 1)',
            'rgba(153, 102, 255, 1)',
            'rgba(255, 159, 64, 1)'
        ],
        borderWidth: 1,

    }];
}
function BarNutrientProgressCtrl ($scope){
var date = new Date();
    var lastcheck_bun = new Date(date);   
    lastcheck_bun.setDate(date.getDate() - 20);
    $scope.lastcheck_bun = lastcheck_bun;
    $scope.labels = ['carbohydrate', 'protein', 'fat', 'sodium', 'phosphorus', 'potassium'];
    // $scope.series = ['You (kg)', 'You (kg)1', 'You (kg)2', 'You (kg)3', 'You (kg)4', 'You (kg)5'];
    $scope.data = [
        [45, 50, 55, 60, 65, 61]
    ];  
    $scope.colours = [{
        backgroundColor: [
            'rgba(255, 99, 132, 0.2)',
            'rgba(54, 162, 235, 0.2)',
            'rgba(255, 206, 86, 0.2)',
            'rgba(75, 192, 192, 0.2)',
            'rgba(153, 102, 255, 0.2)',
            'rgba(255, 159, 64, 0.2)'
        ],
        borderColor: [
            'rgba(255,99,132,1)',
            'rgba(54, 162, 235, 1)',
            'rgba(255, 206, 86, 1)',
            'rgba(75, 192, 192, 1)',
            'rgba(153, 102, 255, 1)',
            'rgba(255, 159, 64, 1)'
        ],
        hoverBackgroundColor:[
            'rgba(255,99,132,1)',
            'rgba(54, 162, 235, 1)',
            'rgba(255, 206, 86, 1)',
            'rgba(75, 192, 192, 1)',
            'rgba(153, 102, 255, 1)',
            'rgba(255, 159, 64, 1)'
        ],
        borderWidth: 1,

    }];
}
function PieNutrientProgressWidgetCtrl($scope, ResourceFactory, FormatDateFactory, NutrientPieChartService, currentUser){
    var userid = currentUser.getUserID()
    var appid = currentUser.getAppID()

    var today = new Date() 
    $scope.lastcheck = today
    var date = FormatDateFactory.formatDate(today)
    $scope.result = {
        carbohydrate: 0,
        protein: 0,
        fat: 0,
        calories: 0,
        sodium: 0,
        potassium: 0,
        phosphorus: 0
    }

    $scope.limit = {
        carbohydrate: {"maxValue": 0, "minValue": 0},
        protein: {"maxValue": 0, "minValue": 0},
        fat: {"maxValue": 0, "minValue": 0},
        calories: {"maxValue": 0, "minValue": 0},
        sodium: {"maxValue": 0, "minValue": 0},
        potassium: {"maxValue": 0, "minValue": 0},
        phosphorus: {"maxValue": 0, "minValue": 0}
    }

    var initialProgressWidgetView = function(){
        var getMealNutrientResource = ResourceFactory.nutrientMealProgress()
        var obj = getMealNutrientResource.get({userid: userid, appid: appid, date: date}, function(){
            if(!angular.equals({}, obj.data)){
                // console.log("not empty")
                $scope.result = obj.data
                $scope.limit = obj.limit
            }
            // console.log("===== obj ====== " , obj)
            // console.log($scope.result)
            // console.log($scope.limit)
        })
        
    }

    initialProgressWidgetView()


}
function PieNutrientWidgetCtrl($scope, ResourceFactory, FormatDateFactory, NutrientPieChartService, currentUser){
    var userid = currentUser.getUserID()
    var appid = currentUser.getAppID()
    var today = new Date()
    $scope.lastcheck = today
    var mealList = ['breakfast', 'lunch', 'dinner']
    var initialPieChartView = function(){
        var hour = today.getHours()
        var _meal = ''
        if(hour >= 6 && hour < 12){
            mealIndex = 0
        }else if(hour >= 12 && hour < 17){
            mealIndex = 1
        }else {
            mealIndex = 2
        }
        var date = FormatDateFactory.formatDate(today)
        var getMealNutrientResource = ResourceFactory.nutrientMeal()
        var obj = getMealNutrientResource.get({userid: userid, appid: appid, date: date, meal: mealList[mealIndex]}, function (){
            if(obj.data){
                $scope.meal = NutrientPieChartService.generatePieChartAttr(mealList[mealIndex], obj)  
                $scope.noData = false           
            }else {
                //check previous meal
                mealIndex = (mealIndex - 1) < 0 ? 2 : mealIndex - 1
                obj = getMealNutrientResource.get({userid: userid, appid: appid, date: date, meal: mealList[mealIndex]}, function(){
                    if(obj.data){
                        $scope.meal = NutrientPieChartService.generatePieChartAttr(mealList[mealIndex], obj)  
                        $scope.noData = false 
                    }else {
                        $scope.noData = true
                        $scope.meal = []
                    }
                })
            }
        })
    }
    initialPieChartView();

}
function PieNutrientCtrl($scope, ResourceFactory, FormatDateFactory, NutrientPieChartService, currentUser){
    var userid = currentUser.getUserID()
    var appid = currentUser.getAppID()

    var getMealNutrientResource = ResourceFactory.nutrientMeal()

    var mealList = [
            {id: 1, title: 'breakfast'},
            {id: 2, title: 'lunch'},
            {id: 3, title: 'dinner'},
            {id: 4, title: 'all'},
        ]
    $scope.meal_list = mealList
    

    var initialPieChartView = function(){
        // console.log("initial")
        var today = new Date()
        $scope.date = today
        showAllMeal(FormatDateFactory.formatDate(today))
    }

    var showAllMeal = function(date){
        var cntNull = 0
        var noData = true
        mealList.forEach(function(_meal) {
            // 'all' isn't meal in hbase
            if(_meal.title != 'all'){                
                var obj = getMealNutrientResource.get({userid: userid, appid: appid, date: date, meal: _meal.title}, function(){
                    // console.log("showAllMeal")
                    console.log("obj" , obj)
                    if(obj.data != null){
                        $scope[_meal.title] = NutrientPieChartService.generatePieChartAttr(_meal.title, obj)
                        $scope.noData = false
                    }else {
                        cntNull++
                        if(cntNull == mealList.length - 1){
                            $scope.noData = true
                        }
                    }
                })
                cntNull = 0
            }
        })
    }
    /*
         initial pie chart today data 
    */
    initialPieChartView();

    $scope.getNutreintMealAt = function(){
        var date = FormatDateFactory.formatDate($scope.date)
        var meal = $scope.meal
        mealList.forEach(function(_meal) {
            $scope[_meal.title] = {}
        })
        if(meal == undefined || meal.title == 'all'){
            showAllMeal(date)
        }else{
            var obj = getMealNutrientResource.get({userid: userid, appid: appid, date: date, meal: meal.title}, function (){
                if(obj.data){
                    $scope[meal.title] = NutrientPieChartService.generatePieChartAttr(meal.title, obj)  
                    $scope.noData = false           
                }else {
                    $scope.noData = true
                }
            })
        }
    
    }
}

function LineNutrientCtrl($scope, ResourceFactory, FormatDateFactory, currentUser, $mdDialog){
    $scope.noData = false
    $scope.myImage = false
    var userid = currentUser.getUserID()
    var appid = currentUser.getAppID() 
    var amount
    var title
    var date
    var firstName =  currentUser.getDisplayProfile().firstName
    
    $scope.daysList = [
        {id: 1, value: 2},
        {id: 2, value: 3},
        {id: 3, value: 4},
        {id: 4, value: 5},
        {id: 5, value: 6},
        {id: 6, value: 7}
    ]
    $scope.showLineChart = false
    $scope.nutrient_list = [
        {id: 1, title: 'protein'},
        {id: 2, title: 'carbohydrate'},
        {id: 3, title: 'fat'},
        {id: 4, title: 'sodium'},
        {id: 5, title: 'potassium'},
        {id: 6, title: 'phosphorus'}
    ]
    
    $scope.getNutreintLineChartAt = function(){
        amount = $scope.amount ? $scope.amount.value : 7
        title = $scope.nutrient.title
        date = FormatDateFactory.formatDate(new Date($scope.date))
        var params = {
            userid: userid,
            appid: appid,
            date: date,
            title: title,
            amount: amount
        }
        
        if($scope.buttonChecked == 'chart'){
            $scope.myImage = false
            var getLineChartNutrientResource = ResourceFactory.nutrientMealLineChart()
            var info = getLineChartNutrientResource.get(params, function(){
                if(info.chart){
                    $scope.noData = false
                    $scope.results = info.chart
                    $scope.showLineChart = true    
                }else if(info.nodata){
                    $scope.noData = true
                    $scope.showLineChart = false 
                }
            }) 
        }else if($scope.buttonChecked == 'image'){
            $scope.showLineChart = false 
            var imageResource = ResourceFactory.nutrientImage()
            var image = imageResource.get(params, function(){
                if(image.image){
                    $scope.noData = false
                    $scope.myImage = image.image
                }else if(image.nodata){
                    $scope.noData = true
                    $scope.myImage = false
                }
            })

        }else {
             var confirm = $mdDialog.confirm()
              .title('Please select Line chart or Image')
              .ok('OK')

            $mdDialog.show(confirm).then(function(){

            })
            // alert("Please select Line chart or Image")
        }
    }

    $scope.options = {
            elements:{
                line: {
                    fill: false,
                    borderWidth: 5,
                },
                point:{
                    radius: 5,
                    // pointBackgroundColor: '#F44336'
                }
            },
            scales: {
                yAxes: [{
                    scaleLabel: {
                    display: true,
                    labelString: 'Value (g)'
                    }
                }],
                xAxes: [{
                    scaleLabel: {
                    display: true,
                    labelString: 'Date'
                    }
                }]
            }     
        }

    $scope.colours = ['#4FC3F7', '#FFC400', '#F44336']
    $scope.series = [ firstName + ' (g)', 'Minimum (g)', 'Maximum (g)'] 
}

function PieMineralCtrl($scope){
    var date = new Date();
    $scope.today = date;
    $scope.labels = ["Sodium", "Potassium", "Phosphorus"];
    $scope.data = [5, 25, 15];   
}