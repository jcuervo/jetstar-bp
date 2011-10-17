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


$(document).ready(function() {
  //add this in your javascript code to 'hide' the address bar  
  window.scrollTo(0, 1);  

  if ($("#datepickerD").length){
    $( "#datepickerD" ).datepicker({
      minDate: 0,
      onSelect: function(dateText, inst) {
//        $("#departDetails").html(dateText);
//        $("#dDate").val(dateText);
        $("#dpDay").text(dateText.split("/")[1]);
        $("#dpDate").html( getWeekDay(dateText) + "<br/>" + getMonthName(dateText) );
        $("#datepickerR").datepicker("option","minDate",$.datepicker.parseDate($.datepicker._defaults.dateFormat, dateText, $( "#datepickerD" ).data( "datepicker" )) );
        submitDate("depart", dateText);
      }
    });
    $( "#datepickerR" ).datepicker({
      minDate: 0,
      onSelect: function(dateText, inst) {
//        $("#returnDetails").html(dateText);
//        $("#rData").val(dateText);
        $("#rpDay").text(dateText.split("/")[1]);
        $("#rpDate").html( getWeekDay(dateText) + "<br/>" + getMonthName(dateText) );
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
      $("#search_from_hidden").val(ui.item.value);
      $("#flightForm").submit();
    },
    change:function(event, ui){
      $("#search_from_hidden").val(ui.item.value);
      $("#flightForm").submit();
    }
  });
  
  $('#search_to').autocomplete({
    source: destination_airports,
    minLength: 3,
    appendTo: "#search_to_list", 
    select:function(event, ui){
      $("#search_to_hidden").val(ui.item.value);
      $("#flightForm").submit();
    },
    change:function(event, ui){
      $("#search_to_hidden").val(ui.item.value);
      $("#flightForm").submit();
    }
  });
  
  
  // $("#clearSearch").click(function() {
  //    $(".searchField").val('').focus();
  //  });
  // $(".searchField").click(function() {
  //     if($(this).val() == "Type name or city") {
  //       $(this).val('');
  //     }
  //   }).blur(function() {
  //     if($(this).val() == "") {
  //       $(this).val("Type name or city");
  //     }
  //   });
});

function findClosestAirport(lat, lng){
  $.ajax({
    type: "GET",
    url: "/flight/findClosestAirports?lat="+ lat + "&lng=" + lng, 
    success: function(data){
      if(data.length > 1){
        str = "";
        for(i=0;i<data.length;i++){
          str += data[i].a + "<br />";
        }
        //$("#search_from_list").html(str);
         
        $("#origin_short").text(data[0].a.split(";")[1]);
        $("#origin_city").text(data[0].a.split(";")[0]);
        //$("#search_from").attr("placeholder", data[0].split(";")[0] + " (" + data[0].split(";")[1] + ")");
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
  switch(new Date(m).getMonth()){
    case 0:  return "Jan";
    case 1:  return "Feb";
    case 2:  return "Mar";
    case 3:  return "Apr";
    case 4:  return "May";
    case 5:  return "Jun";
    case 6:  return "Jul";
    case 7:  return "Aug";
    case 8:  return "Sep";
    case 9:  return "Oct";
    case 10:  return "Nov";
    case 11:  return "Dec";
  }
}

function getWeekDay(day){
  
  switch(new Date(day).getDay()){
    case 0:  return "Sunday";
    case 1:  return "Monday";
    case 2:  return "Tuesday";
    case 3:  return "Wednesday";
    case 4:  return "Thusday";
    case 5:  return "Friday";
    case 6:  return "Saturday";
  }
}


