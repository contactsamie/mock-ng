mock-ng
=======

AngularJs TDD Module With mocking Service To Mock  easily do mocking In Yeoman Jasmine Setup



npm install

bower install

npm install karma-jasmine --save-dev

npm install karma-chrome-launcher --save-dev

grunt

Done!


## Example Usage :



```javascript

        var dependency = mockng.mock.controller('tCtrl').dependency;
        var $scope = dependency.$scope;
        
        expect($scope.tValue).toBe('value');
        expect($scope.tFactory2.getName()).toBe('factory');
        expect(dependency.tService.getName()).toBe('service');
        
        
        var directive = mockng.mock.directive('tDirective', { dom: '<div t-directive="foo"></div>'  });
        directive.definition.$scope.foo = 'bar';
        
        expect(directive.definition.$element.text()).toBe('');
        directive.definition.$element[0].click();
        expect(directive.definition.$element.text()).toBe('bar,and I called : tDirective'); 
        
```




