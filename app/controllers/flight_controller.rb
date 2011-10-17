require 'net/http'
class FlightController < ApplicationController
  def create
    if params[:from]
      session[:origin] = params[:from] 
      session[:dest] = nil
    end
    session[:dest] = params[:to] if params[:to]
    session[:depart] = params[:depart] if params[:depart]
    session[:return] = params[:return] if params[:return]
    
    if params[:commit] == "Find Exact Date Flights"
      findExactFlights
    end

    redirect_to flight_index_path
  end
  
  def calendar
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
 #{"wrapper":{"status":"Success","results":{"altitude":-1,"city":"Sydney","country":"Australia","countryCode":"AU","daylightSaving":78,"iataCode":"SYD","icaoCode":"SYD","latitude":-33.9461,"longitude":151.177,"name":"Sydney","origin":true,"timeZoneOffset":-1}}}
    airports = []
    parsed_json = ActiveSupport::JSON.decode(res.body)
    parsed_json["wrapper"]["results"].each do |airport|
      if airport.class == Hash
        airports << "#{airport["city"]}, #{airport["country"]};#{airport["iataCode"]}"
      else
        logger.info airport[1] if airport[0] == "iataCode"
      end
      #airports << "#{airport["iataCode"]}"
    end if parsed_json["wrapper"]["results"]
    
    render :text => airports.first
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
      airports << ["#{airport["city"]}, #{airport["country"]} (#{airport["iataCode"]})"]
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
        #airports << ["#{airport["city"]}, #{airport["country"]} (#{airport["iataCode"]})", :code => "#{airport["iataCode"]}"}
        airports << ["#{airport["city"]}, #{airport["country"]} (#{airport["iataCode"]})"]
      end if parsed_json["wrapper"]["results"]
    end
    
    airports
  end
  
  def findExactFlights
    @flights = []
    if session[:depart]

      o = session[:origin][-4..-2]
      d = session[:dest][-4..-2]
      date = session[:depart].split('/')
      rDate = "#{date[2]}#{date[0]}#{date[1]}"
                        
      url = URI.parse("http://110.232.117.57:8080/JetstarWebServices/services/flights/exactDates/#{o}/#{d}/#{rDate}/#{params[:adults]}/#{params[:child]}/#{params[:infants]}")
      req = Net::HTTP::Get.new(url.path)
      res = Net::HTTP.start(url.host, url.port) {|http|
        http.request(req)
      }
      parsed_json = ActiveSupport::JSON.decode(res.body)
      parsed_json["wrapper"]["results"].each do |flight|
#{"arrivalAirport":"AVV","arrivalDateTime":"2011-10-21T09:15:00+11:00","businessClassAvailable":false,"carrierCode":"JQ","currency":"AUD","departureAirport":"SYD","departureDateTime":"2011-10-21T07:40:00+11:00","flightDesignator":"JQ 625","flightNumber":" 625","numStops":1,"opSuffix":" ","price":39}

        @flights << ["#{flight["currency"]} #{flight["price"]}, #{flight["departureAirport"]} (#{flight["departureDateTime"]}), #{flight["arrivalAirport"]} #{flight["arrivalDateTime"]}"]
      end if parsed_json["wrapper"]["results"]
    end

  end
  
  def findFlexiFlights
  end
  
  def show
  end

end
