angular.module("autoTest", []).controller("TestCtrl", ['$scope', '$http', function TestCtrl ($scope, $http) {
	
	$scope.pages = [
					{url: "http://www.pazienti.it", 								expect: "success"},
					{url: "http://www.pazienti.it/malattie/non-existent-content", 	expect: "error"},
					{url: "http://www.pazienti.it/malattie/anemia", 				expect: "success"}
					];

	$scope.finalResponse = [];

	window.hp = $http;

	$scope.startTesting = function startTestingFn (pages) {


		// For each page
		for (var i = $scope.pages.length - 1; i >= 0; i--) {

			var page = $scope.pages[i];

			// Create a scope as we will make an ajax call
			(function (pagina) {
				// Request the page at the url pagina.url
				$http.get(pagina.url).success(function ajaxGetCallbackFn (response) {
					
					// The default test result is Passed
					var result = "passed";

					// If you were expeting an error
					if(pagina.expect == "error")
						result = "failed"; // the result should be Failed

					// Push into the response array
					$scope.finalResponse.push({status: "success", page: pagina, testResult: result});

				}).error(function ajaxErrorCallbackFn (response) {
					// The default test result is Failed
					var result = "failed";

					// If you were expeting an error
					if(pagina.expect == "error")
						result = "passed"; // The test is Passed

					// Push into the response array
					$scope.finalResponse.push({status: "error", page: pagina, testResult: result});
				});
			})(page);

		};
	};
}]);


angular.module("autoTest").config(['$httpProvider', function($httpProvider){
	$httpProvider.defaults.headers.common["User-Agent"] = "Mozilla/5.0 (Linux; U; Android 2.3.4; en-us; Nexus S Build/GRJ22) AppleWebKit/533.1 (KHTML, like Gecko) Version/4.0 Mobile Safari/533.1";
}]);


