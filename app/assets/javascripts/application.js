// This is a manifest file that'll be compiled into including all the files listed below.
// Add new JavaScript/Coffee code in separate files in this directory and they'll automatically
// be included in the compiled file accessible from http://example.com/assets/application.js
// It's not advisable to add code directly here, but if you do, it'll appear at the bottom of the
// the compiled file.
//
//= require jquery
//= require jquery_ujs
//= require jqueryui
//= require plugins
//= require script
//= require helper

var centerLatitude = -38.47;
var centerLongitude = 144.98;
var destination_airports = [];

$(document).ready(function() {
  if (Modernizr.geolocation)
    navigator.geolocation.getCurrentPosition(function(position) {
      centerLatitude = position.coords.latitude;
      centerLongitude = position.coords.longitude;
      // remove me...
      centerLatitude = -38.47;
      centerLongitude = 144.98;
      
      findClosestAirport(centerLatitude, centerLongitude);
    });
  else {
    findClosestAirport(centerLatitude, centerLongitude);
    alert('Unable to get nearby airports');
  }
  
  if ($("#datepickerD").length){
    $( "#datepickerD" ).datepicker({
      onSelect: function(dateText, inst) {
        $("#departDetails").html(dateText);
      }
    });
    $( "#datepickerR" ).datepicker({
      onSelect: function(dateText, inst) {
        $("#returnDetails").html(dateText);
      }
    });
  }
	
    
  $('#search_from').autocomplete({
    source: origin_airports,
    minLength: 3,
    select: function(event, ui) {
          str = $("#search_from").val();
          if(str.length > 1){
            // $("#from_shortcode").text(str.substring(str.length-4,str.length-1));
            // $("#from_city").text(str.substring(0,str.length-6));
            // $("#to_shortcode").html("&nbsp;");
            // $("#to_city").text("Destination");
          }
        }
  });

  $("#from_back").click(function(){
    str = $("#search_from").val();
    if(str.length > 1){
      $("#from_shortcode").text(str.substring(str.length-4,str.length-1));
      $("#from_city").text(str.substring(0,str.length-6));
    }
  });
});

function findClosestAirport(lat, lng){
  $.ajax({
    type: "GET",
    url: "/flight/findClosestAirports?lat="+ lat + "&lng=" + lng, 
    success: function(data){
      if(data.length > 1){
        $("#from_city").text(data.split(";")[0]);
        $("#from_shortcode").text(data.split(";")[1]);
        $("#search_from").attr("placeholder", data.split(";")[0] + " (" + data.split(";")[1] + ")");
        //changeDestination();
      } else
        alert('Unable to get nearby airports');
    },
    error: function(jqXHR, textStatus, errorThrown){
      alert('Unable to get nearby airports');
    }
  });
}

function changeDestination(){
  $.ajax({
    type: "GET",
    url: "/flight/findDestinationAirports?o="+ $("#from_shortcode").text(),
    success: function(data){
      if(data.length < 1)
        alert('Sorry, we do not cater flight from the point of origin selected');
      else {
        destination_airports = [];
        for(i=0;i<data.length;i++) {
          destination_airports.push( data[i].city);
          //$("<li><a href=''>" + data[i].city +  "</a></li>").appendTo("#destinationLists")
        }
        $('#search_to').autocomplete({
          source: destination_airports,
          minLength: 3,
          select: function(event, ui) {
                str = $("#search_to").val();
                if(str.length > 1){
                  $("#to_shortcode").text(str.substring(str.length-4,str.length-1));
                  $("#to_city").text(str.substring(0,str.length-6));
                }
              }
        });
      }
    }
  });
}
