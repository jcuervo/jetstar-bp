class ApplicationController < ActionController::Base
  protect_from_forgery
  
  rescue_from MultiJson::DecodeError do
    session[:origin] = nil
    session[:dest] = nil
    session[:depart] = nil
    session[:return] = nil
    session[:adults] = 1
    session[:child] = 0
    session[:infants] = 0
    #redirect_to :back
  end
end
