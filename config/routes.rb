Crawler::Application.routes.draw do
	post "/get" => "requests#get"
	get "/get" => "requests#get"

	# Api to create and get tests
	resources :tests
end
