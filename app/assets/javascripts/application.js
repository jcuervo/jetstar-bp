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
      minDate: 0,
      onSelect: function(dateText, inst) {
//        $("#departDetails").html(dateText);
//        $("#dDate").val(dateText);
        $("#dpDay").text(dateText.split("/")[1]);
        $("#dpDate").html( getMonthName(dateText.split("/")[0]) + "<br/>" + dateText.split("/")[2]);
        $("#datepickerR").datepicker("option","minDate",$.datepicker.parseDate($.datepicker._defaults.dateFormat, $("#departDetails").text(), $( "#datepickerD" ).data( "datepicker" )) );
        submitDate("depart", dateText);
      }
    });
    $( "#datepickerR" ).datepicker({
      minDate: 0,
      onSelect: function(dateText, inst) {
//        $("#returnDetails").html(dateText);
//        $("#rData").val(dateText);
        $("#rpDay").text(dateText.split("/")[1]);
        $("#rpDate").html( getMonthName(dateText.split("/")[0]) + "<br/>" + dateText.split("/")[2]);
        submitDate("return", dateText);
      }
    });
  }
  
  $("#rd").click (function (){
    $("#datepickerD").toggleClass("hidden");
    $("#datepickerR").toggleClass("hidden");
    $(this).toggleClass("tapable");
    $("#dd").toggleClass("tapable");
  });
  $("#dd").click (function (){
    $("#datepickerD").toggleClass("hidden");
    $("#datepickerR").toggleClass("hidden");
    $(this).toggleClass("tapable");
    $("#rd").toggleClass("tapable");
  });
    
  $('#search_from').autocomplete({
    source: origin_airports,
    minLength: 3,
    appendTo: "#search_from_list",
    select:function(event, ui){
      $("#flightForm").submit();
    },
    change:function(event, ui){
      $("#flightForm").submit();
    }
  });
  
  $('#search_to').autocomplete({
    source: destination_airports,
    minLength: 3,
    appendTo: "#search_to_list", 
    select:function(event, ui){
      $("#flightForm").submit();
    },
    change:function(event, ui){
      $("#flightForm").submit();
    }
  });
  
  
  $("#clearSearch").click(function() {
    $(".searchField").val('').focus();
  });
  $(".searchField").click(function() {
    if($(this).val() == "Type name or city") {
      $(this).val('');
    }
  }).blur(function() {
    if($(this).val() == "") {
      $(this).val("Type name or city");
    }
  });
});

function findClosestAirport(lat, lng){
  $.ajax({
    type: "GET",
    url: "/flight/findClosestAirports?lat="+ lat + "&lng=" + lng, 
    success: function(data){
      if(data.length > 1){
        $("#origin_airport").text(data.split(";")[0] + " (" + data.split(";")[1] + ")");
        $("#search_from").attr("placeholder", data.split(";")[0] + " (" + data.split(";")[1] + ")");
      } else
        alert('Unable to get nearby airports');
    },
    error: function(jqXHR, textStatus, errorThrown){
      alert('Unable to get nearby airports');
    }
  });
}

function submitDate(dateType, d){
  $.ajax({
    type: "POST",
    url: "/flight",
    data: dateType + "=" + d,
    success: function(data){
    },
    error: function(jqXHR, textStatus, errorThrown){
      alert('Unable to set date.');
    }
  });
}

function getMonthName(m){
  console.log(m);
  switch(m){
    case 1: return "Jan";
    case 2: return "Feb";
    case 3: return "Mar";
    case 4: return "Apr";
    case 5: return "May";
    case 6: return "Jun";
    case 7: return "Jul";
    case 8: return "Aug";
    case 9: return "Sep";
    case 10: return "Oct";
    case 11: return "Nov";
    case 12: return "Dec";
  }
}
