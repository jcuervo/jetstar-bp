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

  // addEventListener("load", function() { setTimeout(hideURLbar, 0); }, false);
  window.addEventListener('load', function() {
    setTimeout(scrollTo, 0, 0, 1);
    }, false);

  $('#uipv_ul_adults li,#uipv_ul_child li,#uipv_ul_infants li').bind('touchmove',function(e){
    e.preventDefault();
  });

  // function hideURLbar(){
  //  window.scrollTo(0,100);
  // }

   $(window).bind('orientationchange', function(){
        setOrientation();
        setTimeout(scrollTo, 0, 0, 1);
    });
    setOrientation();

  var dp_source = $("#dpSource").html()
  var rp_source = $("#rpSource").html()

  if ($("#datepickerD").length){
    $( "#datepickerD" ).datepicker({
      minDate: 0,
      dayNamesMin: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
      firstDay: 1,
      defaultDate: dp_source,
      beforeShowDay: tagReturn,
      onSelect: function(dateText, inst) {
        $("#dpDay").text(dateText.split("/")[1]);
        $("#dpDate").html("<div class='dpWD'>" + getWeekDay(dateText) + "</div><div class='dpMN'>" + getMonthName(dateText) + "</div>");
        $("#datepickerR").datepicker("option","minDate",$.datepicker.parseDate($.datepicker._defaults.dateFormat, dateText, $( "#datepickerD" ).data( "datepicker" )) );
        $("#dpSource").html(dateText);
      }
    });
    $( "#datepickerR" ).datepicker({
      defaultDate: rp_source,
      dayNamesMin: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
      firstDay: 1,
      minDate: dp_source,
      beforeShowDay: tagDepart,
      onSelect: function(dateText, inst) {
        $("#rpDay").text(dateText.split("/")[1]);
        $("#rpDate").html("<div class='dpWD'>" +  getWeekDay(dateText) + "</div><div class='dpMN'>" + getMonthName(dateText) + "</div>");
        $("#rpSource").html(dateText);
      }
    });
  }
  
  $("#rd").click (function (){
    $("#datepickerD").toggleClass("hidden");
    $("#datepickerR").toggleClass("hidden");
    $(this).toggleClass("tapable");
    $("#dd").toggleClass("tapable");
    
    if ($("#originToDest").length) {
      $("#destToOrgin").toggleClass("hidden");
      $("#originToDest").toggleClass("hidden");
    }
  });
  $("#dd").click (function (){
    $("#datepickerD").toggleClass("hidden");
    $("#datepickerR").toggleClass("hidden");
    $(this).toggleClass("tapable");
    $("#rd").toggleClass("tapable");
    
    if ($("#originToDest").length) {
      $("#destToOrgin").toggleClass("hidden");
      $("#originToDest").toggleClass("hidden");
    }
  });
    
  $('#search_from').autocomplete({
    source: origin_airports,
    minLength: 1,
    select:function(event, ui){
      $("#search_from_hidden").val(ui.item.value);
      $("#flightForm").submit();
    },
    change:function(event, ui){
      $("#search_from_hidden").val(ui.item.value);
      $("#flightForm").submit();
    },
    open: function(event, ui) {
      $("#geolocation").hide();
      $('ul.ui-autocomplete').removeAttr('style').hide().appendTo('#airportLst').show();
      $("#searchHeader").hide();
    },
    close:function(event,ui){
      $("#airportLstTxt").show();
      $("ul.ui-autocomplete").show();
    }
  });

  
  $('#search_to').autocomplete({
    source: destination_airports,
    minLength: 1,
    select:function(event, ui){
      $("#search_to_hidden").val(ui.item.value);
      $("#flightForm").submit();
    },
    change:function(event, ui){
      $("#search_to_hidden").val(ui.item.value);
      $("#flightForm").submit();
    },
    open: function(event, ui) {
      $("#geolocation").hide();
      $('ul.ui-autocomplete').removeAttr('style').hide().appendTo('#airportLst').show();
      $("#searchHeader").hide();
    },
    close:function(event,ui){
      $("#airportLstTxt").show();
      $("ul.ui-autocomplete").show();
    }
  });
  $("#submitDate").click(function(e){
    e.preventDefault();
    submitDate();
  });
  
  $("#clearSearch").click(function(){
    $(".searchField").val("");
    $("#geolocation").slideDown();
    $(".searchResults").css("margin-top","0");
    $("#searchHeader").show();
    $("#geolocret").hide();
  });
  $(".searchField").focus(function(){
    $("#geolocation").slideUp();
    $(".searchResults").css("margin-top","-21px");
  });
  $(".searchField").blur(function(){
    if($(".searchField").val() == ""){
      $("#geolocation").slideDown();
      $(".searchResults").css("margin-top","0");
    }
  });
  
  $("#geolocation").click(function (){
    findClosestAirport(centerLatitude, centerLongitude);
  });
  
});

function tagDepart(targetDate) {
  if (Date.parse($("#dpSource").text()) == Date.parse(targetDate)){
    return [true, 'dDate'];
  } else {
    return [true, ''];
  }
}

function tagReturn(targetDate) {
  if (Date.parse($("#rpSource").text()) == Date.parse(targetDate)){
    return [true, 'dDate'];
  } else {
    return [true, ''];
  }
}

function findClosestAirport(lat, lng){
  $.ajax({
    type: "GET",
    url: "/flight/findClosestAirports?lat="+ lat + "&lng=" + lng, 
    success: function(data){
      if(data.length == 1){
        if ($("#geolocation").length) {
          str = "<div id='geolocret' class='left fullWidth'><ul class='ui-autocomplete2 ui-menu ui-widget ui-widget-content ui-corner-all' role='listbox' aria-activedescendant='ui-active-menuitem'>";
          for(i=0;i<data.length;i++){
            console.log(data[i])
            str += "<li class='lightGrayBg bold borderBottom ui-menu-item'><a href='javascript:void(0)' class='selectClosestAirport'>" + data[i].a.split(";")[1] + " (" + data[i].a.split(";")[0] +")"  + "</a></li>"
          }
          $("#geolocret").remove();
          $("#geolocation").append(str + "</ul></div>");
        }
        
        $("#origin_short").html(data[0].a.split(";")[0] );
        $("#origin_city").html(data[0].a.split(";")[1]);
        $(".selectClosestAirport").click(function(e){
          e.preventDefault();
          $("#search_from_hidden").val($(this).html());
          $("#search_to_hidden").val($(this).html());
          $("#flightForm").submit();
        });
      } else if(data.length > 1){
        if ($("#geolocation").length) {
          str = "<div id='geolocret' class='left fullWidth'><ul class='ui-autocomplete2 ui-menu ui-widget ui-widget-content ui-corner-all' role='listbox' aria-activedescendant='ui-active-menuitem'>";
          for(i=0;i<data.length;i++){
            console.log(data[i])
            str += "<li class='lightGrayBg bold borderBottom ui-menu-item'><a href='javascript:void(0)' class='selectClosestAirport'>" + data[i].a.split(";")[1] + " (" + data[i].a.split(";")[0] +")"  + "</a></li>"
          }
          $("#geolocret").remove();
          $("#geolocation").append(str + "</ul></div>");
        }
        $("#origin_short").html(data[0].a.split(";")[0]);
        $("#origin_city").html(data[0].a.split(";")[1]);
        $(".selectClosestAirport").click(function(e){
          e.preventDefault();
          $("#search_from_hidden").val($(this).html());
          $("#search_to_hidden").val($(this).html());
          $("#flightForm").submit();
        });
      }
    }
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


