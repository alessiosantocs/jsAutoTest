class TestsController < ApplicationController

  before_filter :set_test, only: [:show, :edit, :updata, :destroy]

  # POST /tests to create a test
  def create
    @test = Test.create!(test_params)

    render json: @test
  end

  # GET /tests/:id to retreive a test
  def show
    render json: @test
  end

  private
  def set_test
    @test = Test.find_by_uid(params[:id])
  end

  def test_params
    params.require(:test).permit(:value)
  end
end
