
// usage: log('inside coolFunc', this, arguments);
// paulirish.com/2009/log-a-lightweight-wrapper-for-consolelog/
window.log = function(){
  log.history = log.history || [];   // store logs to an array for reference
  log.history.push(arguments);
  if(this.console) {
    arguments.callee = arguments.callee.caller;
    var newarr = [].slice.call(arguments);
    (typeof console.log === 'object' ? log.apply.call(console.log, console, newarr) : console.log.apply(console, newarr));
  }
};

// make it safe to use console.log always
// (function(b){function c(){}for(var d="assert,clear,count,debug,dir,dirxml,error,exception,firebug,group,groupCollapsed,groupEnd,info,log,memoryProfile,memoryProfileEnd,profile,profileEnd,table,time,timeEnd,timeStamp,trace,warn".split(","),a;a=d.pop();){b[a]=b[a]||c}})((function(){try
// {console.log();return window.console;}catch(err){return window.console={};}})());
// 
// 
// // place any jQuery/helper plugins in here, instead of separate, slower script files.
// (function(){  
// var supportsOrientation = (typeof window.orientation == 'number' && typeof window.onorientationchange == 'object');  
// var HTMLNode = document.body.parentNode;  
// var updateOrientation = function() {  
//   // rewrite the function depending on what's supported  
//   if(supportsOrientation) {  
//     updateOrientation = function() {  
//       var orientation = window.orientation;  
//   
//       switch(orientation) {  
//         case 90: case -90:  
//           orientation = 'landscape'; 
//         break; 
//         default: 
//           orientation = 'portrait'; 
//       } 
//  
//       // set the class on the HTML element (i.e. ) 
//       HTMLNode.setAttribute('class', orientation); 
//     } 
//   } else { 
//     updateOrientation = function() { 
//       // landscape when width is biggest, otherwise portrait 
//       var orientation = (window.innerWidth > window.innerHeight) ? 'landscape': 'portrait'; 
//  
//       // set the class on the HTML element (i.e. ) 
//       HTMLNode.setAttribute('class', orientation); 
//     } 
//   } 
//  
//   updateOrientation(); 
// } 
// var init = function() { 
//   // initialize the orientation 
//   updateOrientation(); 
//  
//   if(supportsOrientation) { 
//     window.addEventListener('orientationchange', updateOrientation, false); 
//   } else { 
//     // fallback: update every 5 seconds 
//     setInterval(updateOrientation, 5000); 
//   } 
//  
// } 
// window.addEventListener('DOMContentLoaded', init, false);  
// })(); 
