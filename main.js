document.addEventListener("DOMContentLoaded", function(event) { 
  var API_KEY = "afe7909b194042b191b3d1279b3392ae";
  var currentTemp = document.getElementById('current-temp');
  var currentSunset = document.getElementById('sunset');
  var currentSunshine = document.getElementById('sunshine');
  var currentPressure = document.getElementById('current-pressure');
  var currentWind = document.getElementById('current-wind');
  var currentRain = document.getElementById('current-rain');
  var currentClouds = document.getElementById('current-clouds');

  navigator.geolocation.getCurrentPosition(function(pos){
  	
  	var lon = Math.round(pos.coords.longitude*10)/10;
  	var lat = Math.round(10*pos.coords.latitude)/10;
  	
  	var connect = new XMLHttpRequest();
  	connect.open("GET", "http://api.openweathermap.org/data/2.5/weather?lat="+lat+"&lon="+lon+"&APPID="+API_KEY);
	  connect.onload = function(){
	  	var data = JSON.parse(connect.responseText);
	  	var sunrise = data.sys.sunrise;
	  	var sunset = data.sys.sunset;
	  	var now = new Date();
	 	var pressureToday = data.main.pressure;
	 	var tempToday = data.main.temp;
	 	var rainToday = data.rain;
	 	var windToday = data.wind.speed;
	 	var cloudsToday = data.clouds.all;
	  	
	  	function timeConverterMain(now){

		  var months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
		  var year = now.getFullYear();
		  var month = months[now.getMonth()];
		  var date = now.getDate();
		  var hour = now.getHours();
		  var min = now.getMinutes();
		  var sec = now.getSeconds();
		  var time = date + ' ' + month + ' ' + year + ' ' + hour + ':' + min;
		  return time;
		}
		function timeConverterSun(sun){
		  var a = new Date(sun * 1000);
		  var hour = a.getHours();
		  var min = a.getMinutes();
		  var time = hour + ':' + min;
		  return time;
		}
		console.log(data);
		// currentTemp.innerHTML = tempToday;
		// currentSunshine.innerHTML = timeConverterSun(sunrise);
		// currentSunset.innerHTML = timeConverterSun(sunset);
		// currentClouds.innerHTML = cloudsToday;
		// currentWind.innerHTML = windToday;
		// // currentPressure.innerHTML = pressureToday;
		// currentRain.innerHTML = rainToday;

	  }
	  connect.send();
	})

});