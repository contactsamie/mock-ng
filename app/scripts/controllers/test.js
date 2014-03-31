'use strict';

(function (app) {
    app.controller('TestCtrl', function ($scope, testValue, testFactory, testService) {
        $scope.used = true;
        testValue.used = true;
        testFactory.used = true;
        testService.used = true;

        $scope.testproperty = 456;
        $scope.testMethod = function () {
            return (testValue.b * 2);
        };

        $scope.factoryResult = testFactory.method() + 3;
    });
})(angular.module('mockngApp'));