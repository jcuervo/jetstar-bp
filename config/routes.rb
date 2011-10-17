Jetbp::Application.routes.draw do
  
  root :to => 'pages#index'
  resources :welcome
  
  resources :flight do
    collection do
      get :findClosestAirports, :findOriginAirports, :findDestinationAirports, :calendar, :search
    end
  end
  
end
