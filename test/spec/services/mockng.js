'use strict';

describe('Service: mockng', function () {
    var moduleName = 'mockngApp';
    var _testController;
    var _testValue;
    var _testFactory;
    var _testService;
    var _testDirective;
    var _testFactoryUnused;
    // load the service's module

    beforeEach(module(moduleName));

    // instantiate service
    var mockng;
    var testSetup = function (_mockng_) {
        mockng = _mockng_;
        mockng.mock.module(moduleName);
        _testController = mockng.mock.controller('TestCtrl');
        _testValue = mockng.mock.value('testValue');
        _testFactory = mockng.mock.factory('testFactory')();
        _testFactoryUnused = mockng.mock.factory('testFactoryUnused')();
        _testService = mockng.mock.service('testService')();
        _testDirective = mockng.mock.directive('testDirective');
    };
    beforeEach(inject(testSetup));

    it('should have all the required api', function () {
        expect(mockng).toBeTruthy();
        expect(mockng.mock).toBeTruthy();
        expect(mockng.mock.controller).toBeTruthy();
        expect(mockng.mock.service).toBeTruthy();
        expect(mockng.mock.factory).toBeTruthy();
        expect(mockng.mock.directive).toBeTruthy();
        expect(mockng.mock.value).toBeTruthy();
    });

    it('should be able to return a directive', function () {
        expect(_testDirective).toBeTruthy();
    });

    it('should return an object when mock.controller is referenced', function () {
        expect(_testController).toBeTruthy();
    });
    it('should return an object with a dependency property', function () {
        expect(_testController.dependency).toBeTruthy();
    });
    it('should have a $scope as one of its dependencies ', function () {
        expect(_testController.dependency.$scope).toBeTruthy();
    });
    it('should be able to access a $scope method as a function', function () {
        expect(typeof _testController.dependency.$scope.testMethod === 'function').toBeTruthy();
    });
    it('should be able to invoke the $scope method defined', function () {
        expect(_testController.dependency.$scope.testMethod()).toBe(123 * 2);
    });
    it('should be able to invoke the $scope property defined', function () {
        expect(_testController.dependency.$scope.testproperty).toBe(456);
    });
    it('should be able to provide value dependencies', function () {
        expect(_testValue.b).toBe(123);
    });
    it('should be able to return a factory', function () {
        expect(_testFactory.method()).toBe(987);
    });

    it('should return the value of a factory when factory is injected', function () {
        expect(_testController.dependency.$scope.factoryResult).toBe(990);
    });

    it('should be able to return a service', function () {
        expect(_testService.sample.getSamples()).toEqual([{ name: 'john' }, { name: 'doe' }]);
    });

    it('should be able to get value of a factory dependent on a service returning that value', function () {
        expect(_testFactory.service()).toEqual([{ name: 'john' }, { name: 'doe' }]);
    });

    it('should be able to return a service injected into a factory', function () {
        expect(mockng.mock.factory('testFactory').dependency.testService.sample.getSamples()).toEqual([{ name: 'john' }, { name: 'doe' }]);
    });

    it('should be able to return a service injected into a factory - where a fake service is supplied - compared with when its not', function () {
        expect(mockng.mock.factory('testFactory', {
            testService: {
                sample: {
                    getSamples: function () {
                        return ['John Doe'];
                    }
                }
            }
        }).dependency.testService.sample.getSamples()).toEqual(['John Doe']);

        expect(mockng.mock.factory('testFactory', {
            testService: {
                sample: function () {
                    return [{ a: 'John Doe' }];
                }
            }
        }).dependency.testService.sample()).toEqual([{ a: 'John Doe' }]);

        expect(_testFactory.service()).not.toEqual(['John Doe']);
        expect(_testFactory.service()).not.toEqual([{ a: 'John Doe' }]);
        expect(_testFactory.service()).toEqual([{ name: 'john' }, { name: 'doe' }]);
        expect(mockng.mock.factory('testFactory').dependency.testService.sample.getSamples()).not.toEqual(['John Doe']);
        expect(mockng.mock.factory('testFactory').dependency.testService.sample.getSamples()).not.toEqual([{ a: 'John Doe' }]);
        expect(mockng.mock.factory('testFactory').dependency.testService.sample.getSamples()).toEqual([{ name: 'john' }, { name: 'doe' }]);
    });

    it('should be that testController has $scope, testValue and testFactory dependencies', function () {
        expect(_testController.dependency.$scope.used).toBeTruthy();
        expect(_testController.dependency.testValue.used).toBeTruthy();
        expect(_testController.dependency.testFactory.used).toBeTruthy();
        expect(_testController.dependency.testService.used).toBeTruthy();
        expect(_testController.dependency.testFactoryUnused.used).not.toBeTruthy();
        expect(_testFactoryUnused.used).not.toBeTruthy();
    });
});