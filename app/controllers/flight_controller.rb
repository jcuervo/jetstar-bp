require 'net/http'
class FlightController < ApplicationController

  def create
    if params[:from] && !params[:from].blank?
      session[:origin] = params[:from] 
      session[:dest] = nil
    end
    session[:dest] = params[:to] if params[:to]  && !params[:to].blank?
    session[:depart] = params[:depart] if params[:depart]
    session[:return] = params[:return] if params[:return]

    
    
    if params[:commit]
      session[:adults] = params[:adults]
      session[:child] = params[:child]
      session[:infants] = params[:infants]
      
      findFlights
    else
      session[:flight] = nil
      session[:return_flights] = nil
    end
    if request.xml_http_request?
      render :nothing => true, :status => 200
    else
      redirect_to flight_index_path
    end
  end
  
  def search
    @origins = findOriginAirports
    @destination = findDestinationAirports
  end
  
  def findClosestAirports
    url = URI.parse("http://110.232.117.57:8080/JetstarWebServices/services/airports/near/#{params[:lat]}/#{params[:lng]}/100")
    req = Net::HTTP::Get.new(url.path)
    res = Net::HTTP.start(url.host, url.port) {|http|
      http.request(req)
    }
    airports = []
    parsed_json = ActiveSupport::JSON.decode(res.body)
    parsed_json["wrapper"]["results"].each do |airport|
      if airport.class == Hash
        airports << {:a => "#{ (airport["name"].index("("))?  airport["name"][0..airport["name"].index("(")-1] : airport["name"]};#{airport["iataCode"]}"}
      else
        airports <<  {:a => airport[1]} if airport[0] == "iataCode"
      end
    end if parsed_json["wrapper"]["results"]
    
    render :json => airports
  end
  
  def findOriginAirports
    airports = []
    url = URI.parse("http://110.232.117.57:8080/JetstarWebServices/services/airports/origin/")
    req = Net::HTTP::Get.new(url.path)
    res = Net::HTTP.start(url.host, url.port) {|http|
      http.request(req)
    }
    parsed_json = ActiveSupport::JSON.decode(res.body)
    parsed_json["wrapper"]["results"].each do |airport|
      airports << ["#{ (airport["name"].index("("))?  airport["name"][0..airport["name"].index("(")-1] : airport["name"]} (#{airport["iataCode"]})"]
    end if parsed_json["wrapper"]["results"]
    
    airports
  end
  
  def findDestinationAirports
    airports = []
    if session[:origin]
      o = session[:origin][-4..-2]
      url = URI.parse("http://110.232.117.57:8080/JetstarWebServices/services/airports/destination/#{o}")
      req = Net::HTTP::Get.new(url.path)
      res = Net::HTTP.start(url.host, url.port) {|http|
        http.request(req)
      }
      parsed_json = ActiveSupport::JSON.decode(res.body)
      parsed_json["wrapper"]["results"].each do |airport|
        airports << ["#{ (airport["name"].index("("))?  airport["name"][0..airport["name"].index("(")-1] : airport["name"]} (#{airport["iataCode"]})"]
      end if parsed_json["wrapper"]["results"]
    end
    
    airports
  end
  
  def findFlightsOld
    @flights = []
    @return_flights = []
    if session[:depart]
      o = session[:origin][-4..-2]
      d = session[:dest][-4..-2]
      date = session[:depart].split('/')
      rDate = "#{date[2]}#{date[0]}#{date[1]}"
                        
      url = URI.parse("http://110.232.117.57:8080/JetstarWebServices/services/flights/exactDates/#{o}/#{d}/#{rDate}/#{session[:adults]}/#{session[:child]}/#{session[:infants]}")
      req = Net::HTTP::Get.new(url.path)
      res = Net::HTTP.start(url.host, url.port) {|http|
        http.request(req)
      }
      parsed_json = ActiveSupport::JSON.decode(res.body)
      parsed_json["wrapper"]["results"].each do |flight|
        #{"arrivalAirport":"AVV","arrivalDateTime":"2011-10-21T09:15:00+11:00",
        #"businessClassAvailable":false,"carrierCode":"JQ","currency":"AUD","departureAirport":"SYD",
        #"departureDateTime":"2011-10-21T07:40:00+11:00","flightDesignator":"JQ 625","flightNumber":" 625",
        #"numStops":1,"opSuffix":" ","price":39}
        @flights << ["#{flight["currency"]} #{flight["price"]}, #{flight["departureAirport"]} (#{flight["departureDateTime"]}), #{flight["arrivalAirport"]} #{flight["arrivalDateTime"]}"]
      end if parsed_json["wrapper"]["results"]
      
      o = session[:dest][-4..-2]
      d = session[:origin][-4..-2]
      date = session[:return].split('/')
      rDate = "#{date[2]}#{date[0]}#{date[1]}"
                        
      url = URI.parse("http://110.232.117.57:8080/JetstarWebServices/services/flights/exactDates/#{o}/#{d}/#{rDate}/#{session[:adults]}/#{session[:child]}/#{session[:infants]}")
      req = Net::HTTP::Get.new(url.path)
      res = Net::HTTP.start(url.host, url.port) {|http|
        http.request(req)
      }
      parsed_json = ActiveSupport::JSON.decode(res.body)
      parsed_json["wrapper"]["results"].each do |flight|
        #{"arrivalAirport":"AVV","arrivalDateTime":"2011-10-21T09:15:00+11:00",
        #"businessClassAvailable":false,"carrierCode":"JQ","currency":"AUD","departureAirport":"SYD",
        #"departureDateTime":"2011-10-21T07:40:00+11:00","flightDesignator":"JQ 625","flightNumber":" 625",
        #"numStops":1,"opSuffix":" ","price":39}
        @return_flights << ["#{flight["currency"]} #{flight["price"]}, #{flight["departureAirport"]} (#{flight["departureDateTime"]}), #{flight["arrivalAirport"]} #{flight["arrivalDateTime"]}"]
      end if parsed_json["wrapper"]["results"]
    end

  end

  
  def findFlights
    @flights = []
    @return_flights = []
    if session[:depart] && session[:origin] && session[:dest]

      o = session[:origin][-4..-2]
      d = session[:dest][-4..-2]
      date = session[:depart].split('/')
      rDate = "#{date[2]}#{date[0]}#{date[1]}"

      str = ((params[:commit].downcase.index("exact"))? "exact" : "flexible")

      url = URI.parse("http://110.232.117.57:8080/JetstarWebServices/services/flights/#{str}Dates/#{o}/#{d}/#{rDate}/#{session[:adults]}/#{session[:child]}/#{session[:infants]}")
      logger.info url
      req = Net::HTTP::Get.new(url.path)
      res = Net::HTTP.start(url.host, url.port) {|http|
        http.request(req)
      }
      logger.info res.body
      parsed_json = ActiveSupport::JSON.decode(res.body)
      parsed_json["wrapper"]["results"].each do |flight|
        @flights << {:aa => flight["arrivalAirport"], :adt => flight["arrivalDateTime"], :bc => flight["businessClassAvailable"], :c => flight["currency"], :da => flight["departureAirport"], :ddt => flight["departureDateTime"], :flight => flight["flightDesignator"], :stop => flight["numStops"], :price => flight["price"]}
      end if parsed_json["wrapper"]["results"]
      
      # return flights
      o = session[:dest][-4..-2]
      d = session[:origin][-4..-2]
      date = session[:return].split('/')
      rDate = "#{date[2]}#{date[0]}#{date[1]}"

      # str = ((params[:commit].downcase.index("exact"))? "exact" : "flexible")

      url = URI.parse("http://110.232.117.57:8080/JetstarWebServices/services/flights/#{str}Dates/#{o}/#{d}/#{rDate}/#{session[:adults]}/#{session[:child]}/#{session[:infants]}")
      logger.info url
      req = Net::HTTP::Get.new(url.path)
      res = Net::HTTP.start(url.host, url.port) {|http|
        http.request(req)
      }
      logger.info res.body
      parsed_json = ActiveSupport::JSON.decode(res.body)
      parsed_json["wrapper"]["results"].each do |flight|
        @return_flights << {:aa => flight["arrivalAirport"], :adt => flight["arrivalDateTime"], :bc => flight["businessClassAvailable"], :c => flight["currency"], :da => flight["departureAirport"], :ddt => flight["departureDateTime"], :flight => flight["flightDesignator"], :stop => flight["numStops"], :price => flight["price"]}
      end if parsed_json["wrapper"]["results"]
    end
    session[:flight] = @flights
    session[:return_flights] = @return_flights
  end
  
    #if flight.class == Hash
  #  ddt = flight["departureDateTime"].split('T')
  #  adt = flight["departureDateTime"].split('T')
  #  @flights << ["#{flight["currency"]} #{flight["price"]}, #{flight["departureAirport"]} #{ddt[0]} (#{ddt[1]}), #{flight["arrivalAirport"]} #{adt[0]} (#{adt[1]})"]
  #else
  #  @flights <<  flight
  #end

end
