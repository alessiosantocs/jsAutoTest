Crawler::Application.routes.draw do
	post "/get" => "requests#get"
	get "/get" => "requests#get"
end
