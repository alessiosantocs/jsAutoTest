require 'net/http'

class RequestsController < ApplicationController
	# The method to get/crawl pages
	def get

		response = nil

		if params[:url]
			uri = URI.parse(params[:url])
			http = Net::HTTP.new(uri.host, uri.port)

			path = uri.path
			path = "/" if path == ""

			req = Net::HTTP::Get.new(path, {'User-Agent' => USERAGENTS[(params[:user_agent] || :chrome_mac).to_sym]})
			response = http.request(req)
		end

		response = check_response response

		render :json => response.to_json

	end

	private
	def check_response(response)
		final_response = {}
		if response
			final_response[:status_code] = response.code
			final_response[:test_result] = "failed"

			if response.code == "200"
				final_response[:test_result] = "passed"
				if params[:expecting] == "500"
					final_response[:test_result] = "failed"
				end
			elsif response.code == "500" || response.code == "404"
				final_response[:test_result] = "failed"

				if params[:expecting] == "500" || params[:expecting] == "404"
					final_response[:test_result] = "passed"
				end
			end

		end

		final_response
	end
end
