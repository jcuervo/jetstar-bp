require 'test_helper'

class FlightControllerTest < ActionController::TestCase
  test "should get index" do
    get :index
    assert_response :success
  end

  test "should get calendar" do
    get :calendar
    assert_response :success
  end

  test "should get search" do
    get :search
    assert_response :success
  end

end
