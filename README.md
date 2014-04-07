mock-ng 
=======
- Just another way to make your TDD more friendly and attractive in angular!


#[ The more easily you are able to write tests, the more tests you will easily write ]


AngularJs TDD Module With mocking Service To Mock  easily do mocking In Yeoman Jasmine Setup

```javascript

npm install

bower install

npm install karma-jasmine --save-dev

npm install karma-chrome-launcher --save-dev

grunt

```
Done!


## Example Usage (using Jasmine + in Karma):



```javascript

        // just ask for it
        var dependency = mockng.mock.controller('tCtrl').dependency;
        var $scope = dependency.$scope;
        
        expect($scope.tValue).toBe('value');
        expect($scope.tFactory2.getName()).toBe('factory');
        expect(dependency.tService.getName()).toBe('service');
        
        //hmmmm...What about directives? Lets see!
        var directive = mockng.mock.directive('tDirective', { dom: '<div t-directive="foo"></div>'  });
        directive.definition.$scope.foo = 'bar';
        
        //cool eh! So..
        
        expect(directive.definition.$element.text()).toBe('');
        directive.definition.$element[0].click();
        expect(directive.definition.$element.text()).toBe('bar,and I called : tDirective'); 
        
```


## And :

You can also mock other services as well ....

## Again, simply allowing you to focus on the logic of your test rather than on its plumbing !


In your Tests, you can get the ball rolling by injection

```javascript

 var mockng;
    beforeEach(function () {
        module('myApp');
        inject(function (_mockng_) {
            mockng = _mockng_;
        });
    });
        
```

Period :)

