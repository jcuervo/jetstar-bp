class ApplicationController < ActionController::Base
  protect_from_forgery
  
  rescue_from MultiJson::DecodeError do
    reset_session
    redirect_to :back
  end
end
