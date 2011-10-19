Jetbp::Application.routes.draw do
  
  root :to => 'welcome#index'
  resources :welcome
  
  resources :flight do
    collection do
      get :findClosestAirports, :findOriginAirports, :findDestinationAirports, :calendar, :search, :reset
    end
  end
  
end
