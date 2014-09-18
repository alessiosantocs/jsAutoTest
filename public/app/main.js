function getParameterByName(name) {
    name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
    var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
        results = regex.exec(location.search);
    return results == null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
}

angular.module("autoTest", []).controller("TestCtrl", ['$scope', '$http', '$location', function TestCtrl ($scope, $http, $location) {

	var api_endpoint = "/get";

  if(getParameterByName("api_endpoint"))
    api_endpoint = getParameterByName("api_endpoint");

	$scope.pages = [];

	$scope.finalResponse = [];


	$scope.addPage = function () {
    var url = "";
    if($scope.pages.length > 0)
      url = $scope.pages[$scope.pages.length - 1].url;
		$scope.pages.push({
			url: url,
			expect: ""
		});
	};

	$scope.removePage = function (index) {
		$scope.pages.splice(index, 1);
	};

	$scope.encodeJson = function (){
		$scope.public_link = "http://" + window.location.host + "/app/launch.html?k=" + escape(JSON.stringify($scope.pages));
	};

	// $scope.addPage();

	window.hp = $http;

	$scope.startTesting = function startTestingFn (pages) {

    $scope.editingMode = false;
    $scope.finalResponse = [];

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

	$scope.init = function(){
    $scope.editingMode = true;

    // If there is a special parameter
		if(getParameterByName("k")){
			var array = getParameterByName("k");
			array = JSON.parse(array);

			for (var i = 0; i < array.length; i++) {
				var page = array[i];
				$scope.pages.push(page);
			}
		}else{
      $scope.addPage();
    }
	};

	$scope.init();
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

		return classname;

	}
});
