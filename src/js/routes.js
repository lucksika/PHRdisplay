'use strict';

/**
 * Route configuration for the RDash module.
 */
angular.module('RDash').config(['$stateProvider', '$urlRouterProvider',
    function($stateProvider, $urlRouterProvider) {

        // For unmatched routes
        $urlRouterProvider.otherwise('/');

        // Application routes
        $stateProvider
            .state('login', {
                url: '/',
                templateUrl: 'templates/login/login.html',
                controller: 'AuthenticationCtrl',
                authenticate: false
            })
            .state('home', {
                url: '/home',
                templateUrl: 'templates/home.html',
                authenticate: true
            })
            .state('home.dashboard', {
                url: '/dashboard',
                views: {
                    'content@home': {
                        templateUrl: 'templates/dashboard.html',
                    }
                },
                authenticate: true
            })
            .state('home.profile', {
                url: '/profile',
                views: {
                    'content@home': {
                        templateUrl: 'templates/profile.html',
                    }
                },
                authenticate: true
            })
            .state('info', {
                url: '/info',
                views: {
                    'content@home': {
                        templateUrl: 'templates/info.html',
                    }
                },
                authenticate: true
            })
            .state('home.medication', {
                url: '/medication',
                views: {
                    'content@home': {
                        templateUrl: 'templates/medication.html',
                    }
                },
                authenticate: true
            })
            .state('home.foods', {
                url: '/foods',
                views: {
                    'content@home': {
                        templateUrl: 'templates/foods.html',
                    }
                },
                authenticate: true
            })
            .state('home.medication.labresults', {
                url: '/labresults',
                views: {
                    'content@home': {
                        templateUrl: 'templates/labresults.html',
                    }
                },
                authenticate: true

            })
            .state('home.medication.labresults.resultDetail', {
                url: '/resultDetail:ref',
                views: {
                    'content@home': {
                        templateUrl: 'templates/resultDetail.html',
                        controller: 'LabResultDetailCtrl',
                    }
                },
                authenticate: true
            })
            .state('home.medication.exercise', {
                url: '/exercise',
                views: {
                    'content@home': {
                        templateUrl: 'templates/exercise.html',
                    }
                },
                authenticate: true
            })
            .state('home.medication.appointment', {
                url: '/appointment',
                views: {
                    'content@home': {
                        templateUrl: 'templates/appointment.html',
                    }
                },
                authenticate: true
            })
            .state('home.medication.exercise.exerciseDetail', {
                url: '/exerciseDetail:ref',
                views: {
                    'content@home': {
                        templateUrl: 'templates/exerciseDetail.html',
                        controller: 'ExerciseDetailCtrl',
                    }
                },
                authenticate: true
            })
            .state('home.medication.medicine', {
                url: '/medicine',
                views: {
                    'content@home': {
                        templateUrl: 'templates/medicine.html',
                    }
                },
                authenticate: true
            });
    }
]);