'use strict';

(function (ng) {
	var APPNAME = 'mockngApp';
	var app = ng.module(APPNAME);

	var mockngAplication = function ($injector) {
		var scopeStr = '$scope';
		var rootScopeStr = '$rootScope';

		var angularTypes = [
			'$http',
			'$timeout',
			'$scope'
		];

		var basicTypes = {
			controller: '$controller',
			directive: '$directive',
			value: '$value',
			contstant: '$contstant',
			factory: '$factory',
			service: '$service'
		};

		var currentBasicTypeName = '';

		var controllerIsCreated = false;

		var getDependencies = function (ctrlname, dep) {
			if (typeof ctrlname !== 'string') {
				throw 'Please supply a controller string name in order to create dependencies for it';
			}
			var depend = {};
			currentBasicTypeName = ctrlname;
			for (var i = 0; i < dep.length; i++) { // LOOP THROUGH SUPLIED DEPENDENCIES
				var tmpDep = dep[i];

				if (typeof tmpDep !== 'string') { // if a fake is supplied use it
					for (var prop in tmpDep) {
						if (tmpDep.hasOwnProperty(prop)) {
							depend[prop] = tmpDep[prop];
						}
					}
				} else { // if a fake is not supplied, ask angular to provide concrete stuf
					// if ($injector.has(tmpDep)) {
					depend[tmpDep] = tmpDep === scopeStr ?
						$injector.get(rootScopeStr).$new() :
						$injector.get(tmpDep);
					// }
				}
			}

			return depend;
		};

		var createBasicType = function (basicType, injectObj) {
			if (!basicType) {
				throw 'Please supply a basic type such as  "$controller" or  "$directive" etc';
			}

			if (!controllerIsCreated) {
				try {
					$injector.get(basicType)(currentBasicTypeName, injectObj);

					controllerIsCreated = true;

					return true;
				} catch (exception) {
					throw exception;
				}
			} else {
				return false;
			}
		};

		//mockng.createDependencies (ctrlname, dependency)
		//ctrlname arg must be supplied and is the controller name
		//dependency arg are the dependencies and my be supplied if any
		//**createDependencies is a precursor of createController
		//this should preferably called in the 'beforeEach' function
		var createDependencies = function (ctrlname, dep) {
			var dependency = getDependencies(ctrlname, dep);

			return dependency;
		};

		var createGenericAuto = function (basicType, dep, cName) {
			var d = angular.module(APPNAME).controller()._invokeQueue;
			var depend = [];
			for (var i = 0; i < d.length; i++) {
				var queueSubLength = d[i].length;
				var queueSub = d[i];
				for (var k = 0; k < queueSubLength; k++) {
					var subk = queueSub[k];
					if (subk === '$provide') {
						for (var j = 0; j < queueSubLength; j++) {
							var subj = queueSub[j];
							if (subj !== '$provide' && typeof subj !== 'string') {
								if (subj[0] !== 'mockng') {
									depend.push(subj[0]);
								}
							}
						}
						break;
					}
				}
			}
			var finalDep = depend.concat(dep).concat(angularTypes);

			var dependency = createDependencies(cName, finalDep);
			if (basicType === basicTypes.controller) {
				createBasicType(basicType, dependency);
			}

			return dependency;
		};

		var createGenerically = function (basicType, name, dep) {
			var dependency = createGenericAuto(basicType, dep || [], name);

			context = testContext(dependency);

			return context;
		};

		// hoisting this was needed
		function testContext(dependency) {
			var api = function () {
				return currentBasicTypeName ? api.dependency[currentBasicTypeName] : null;
			};
			var depMgnt = depMgnt || {};

			if (dependency && testContext.currentBasicTypeName) {
				depMgnt[testContext.currentBasicTypeName] = dependency;
			}

			//is an object containing all the specified controller's
			// dependencies both the concrete ones as well as the fake ones supplied
			api.dependency = depMgnt[testContext.currentBasicTypeName];

			api.self = api();

			//createDependencies and createController in one shot!
			api.mock = function (moduleName) {
				if (typeof moduleName === 'string') {
					APPNAME = moduleName;
				}

				return this.mock;
			};
			api.mock.ng = function (basicType, name, dep) {
				if (basicType && name) {
					currentBasicTypeName = name;

					testContext.currentBasicTypeName = name;

					var specificModule = createGenerically(basicType, name, dep || []);

					var result;
					//Since constants and values always return a static value, they are not invoked via the injector
					if (((basicType === basicTypes.contstant) || (basicType === basicTypes.value))) {
						result = specificModule();
					} else {
						result = specificModule;
					}

					return result;
				}
				throw 'Please supply a angular object"s name name';
			};
			// you do not need to supply any dependency, except the fake replacements
			api.mock.controller = function (cName, dep) {
				return this.ng(basicTypes.controller, cName, dep);
			};
			api.mock.service = function (cName, dep) {
				return this.ng(basicTypes.service, cName, dep);
			};
			api.mock.directive = function (cName, dep) {
				return this.ng(basicTypes.directive, cName, dep);
			};
			api.mock.factory = function (cName, dep) {
				return this.ng(basicTypes.factory, cName, dep);
			};
			api.mock.value = function (cName, dep) {
				return this.ng(basicTypes.value, cName, dep);
			};
			api.mock.module = function (moduleName) {
				if (typeof moduleName === 'string') {
					APPNAME = moduleName;
				}
			};

			api.injector = $injector;

			return api;
		}

		var context = testContext();

		return context;
	};
	app.service('mockng', function ($injector) {
		this.mockng = mockngAplication($injector);
		this.mock = this.mockng.mock;
	});
})(angular);