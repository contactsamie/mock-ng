'use strict';

(function (app) {
    app.directive('testDirective', function () {
        return {
            templateUrl: 'views/templates/control.html',
            restrict: 'E',
            scope: {},
            link: function postLink() {
            }
        };
    });
})(angular.module('mockngApp'));