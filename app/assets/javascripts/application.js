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
  $('#adults,#child,#infants').iPhonePicker({ width: '80px', imgRoot: 'images/' });
  addEventListener("load", function() { setTimeout(hideURLbar, 0); }, false);

  $('#uipv_ul_adults li,#uipv_ul_child li,#uipv_ul_infants li').bind('touchmove',function(e){
    e.preventDefault();
  });

  function hideURLbar(){
    window.scrollTo(0,100);
  }

   $(window).bind('orientationchange', function(){
        setOrientation();
    });
    setOrientation();

  var dp_source = $("#dpSource").html()
  var rp_source = $("#rpSource").html()

  if ($("#datepickerD").length){
    $( "#datepickerD" ).datepicker({
      minDate: 0,
      defaultDate: dp_source,
      onSelect: function(dateText, inst) {
        $("#dpDay").text(dateText.split("/")[1]);
        $("#dpDate").html("<div class='dpWD'>" + getWeekDay(dateText) + "</div><div class='dpMN'>" + getMonthName(dateText) + "</div>");
        $("#datepickerR").datepicker("option","minDate",$.datepicker.parseDate($.datepicker._defaults.dateFormat, dateText, $( "#datepickerD" ).data( "datepicker" )) );
        
        $("#dpSource").html(dateText);

        
        //submitDate("depart", dateText);
      }
    });
    $( "#datepickerR" ).datepicker({
      defaultDate: rp_source,
      minDate: dp_source,
      onSelect: function(dateText, inst) {
        $("#rpDay").text(dateText.split("/")[1]);
        $("#rpDate").html("<div class='dpWD'>" +  getWeekDay(dateText) + "</div><div class='dpMN'>" + getMonthName(dateText) + "</div>");
        $("#rpSource").html(dateText);
        //submitDate("return", dateText);
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
    select:function(event, ui){
      $("#search_from_hidden").val(ui.item.value);
      $("#flightForm").submit();
    },
    change:function(event, ui){
      $("#search_from_hidden").val(ui.item.value);
      $("#flightForm").submit();
    },
    open: function(event, ui) {
      $('ul.ui-autocomplete').removeAttr('style').hide().appendTo('#airportLst').show();
    },
    close:function(event,ui){
      $("ul.ui-autocomplete").show();
    }
  });

  
  $('#search_to').autocomplete({
    source: destination_airports,
    minLength: 3,
    select:function(event, ui){
      $("#search_to_hidden").val(ui.item.value);
      $("#flightForm").submit();
    },
    change:function(event, ui){
      $("#search_to_hidden").val(ui.item.value);
      $("#flightForm").submit();
    },
    open: function(event, ui) {
      $('ul.ui-autocomplete').removeAttr('style').hide().appendTo('#airportLst').show();
    },
    close:function(event,ui){
      $("ul.ui-autocomplete").show();
    }
  });
  $("#submitDate").click(function(e){
    e.preventDefault();
    submitDate();
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
          str += "<li class='lightGrayBg bold borderBottom'><a href='javascript:void(0)' class='selectClosestAirport'>" + data[i].a.split(";")[0] + " (" + data[i].a.split(";")[1] +")" + "</a></li>"
        }
        $("#searchResultUl").append(str);
        $("#origin_short").text(data[0].a.split(";")[1]);
        $("#origin_city").text(data[0].a.split(";")[0]);
        $(".selectClosestAirport").click(function(e){
          e.preventDefault();
          $("#search_from_hidden").val($(this).html());
          $("#search_to_hidden").val($(this).html());
          $("#flightForm").submit();
        });
      } // else
       //        alert('Unable to get nearby airports');
    }// ,
    //     error: function(jqXHR, textStatus, errorThrown){
    //       alert('Unable to get nearby airports');
    //     }
  });
}

function submitDate(){
  $.ajax({
    type: "POST",
    url: "/flight",
    data: "depart=" + $("#dpSource").html() + "&return=" + $("#rpSource").html(),
    complete: function(){
      window.location = "/flight";
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
    case 4:  return "Thursday";
    case 5:  return "Friday";
    case 6:  return "Saturday";
  }
}


// Change the device orientation
function setOrientation() {
    if (window.orientation == 0){
        $('#container').css('width','320px');
    }
    else
    {
        $('#container').css('width','480px');
    }
}


