angular.module("autoTest", []).controller("TestCtrl", ['$scope', '$http', function TestCtrl ($scope, $http) {
	
	var api_endpoint = "http://localhost:3000/get";

	$scope.pages = [
					{url: "http://www.pazienti.it", 								expect: "200"},
					{url: "http://www.pazienti.it/malattie/non-existent-content", 	expect: "404"},
					{url: "http://www.pazienti.it/malattie/anemia", 				expect: "200"}
					];

	$scope.finalResponse = [];


	$scope.addPage = function () {
		$scope.pages.push({
			url: "",
			expect: ""
		});
	};

	$scope.addPage();

	window.hp = $http;

	$scope.startTesting = function startTestingFn (pages) {


		// For each page
		for (var i = $scope.pages.length - 1; i >= 0; i--) {

			var page = $scope.pages[i];

			// Create a scope as we will make an ajax call
			(function (pagina) {

				// Request the page at the url pagina.url
				$http.post(api_endpoint, {
					url: pagina.url,
					expecting: pagina.expect,
					user_agent: pagina.userAgent
				}).success(function ajaxGetCallbackFn (response) {
					
					// The default test result is Passed
					var result = response.test_result;

					var status = response.status_code;

					// Push into the response array
					$scope.finalResponse.push({status: status, page: pagina, testResult: result});

				});

			})(page);

		};
	};
}]);

angular.module("autoTest").filter("fromHttpErrorToBootstrapClass", function () {
	return function fromHttpErrorToBootstrapClassFn (httpcode, prefix) {
		if(prefix === undefined)
			prefix = "label-";

		var classname = "";

		switch (httpcode){
			case "200":
				classname = prefix + "success";
				break;
			case "404":
				classname = prefix + "danger";
				break;
			case "401":
				classname = prefix + "danger";
				break;
			case "400":
				classname = prefix + "danger";
				break;
			case "500":
				classname = prefix + "danger";
				break;
			case "301":
				classname = prefix + "warning";
				break;
			case "302":
				classname = prefix + "warning";
				break;
			default:
				classname = "";
		}
		console.log(classname);

		return classname;

	}
});
