/*
Open Weather API. Determine user's location and return user's local weather. User should be able to toggle between Farhenheit and Celcius. It should display an icon or background that reflects the user's local weather conditions.
*/

$(document).ready(function() {

	// get user's latitude and longitude
	var iconURL = '';
	var tempUnit = '';
	var windUnit = '';
	var unitsDefault = 'imperial';

var weatherApp = {	

	getLocation: function() {	
		navigator.geolocation.getCurrentPosition(function(position) {
				var latitude = position.coords.latitude;
				var longitude = position.coords.longitude;
			
				weatherApp.getWeather(latitude, longitude, unitsDefault); 
		});
	},
	// access Open Weather API
	getWeather: function(latitude, longitude, units) {
	  $.getJSON('https://cors-anywhere.herokuapp.com/http://api.openweathermap.org/data/2.5/weather?lat=' + latitude + '&lon=' + longitude + '&appid=c44bb65bf8b3b37d0b1a57e7fcdfa659&units=' + units + '', function(data) {

	    var icon = data.weather[0].icon;
	    iconURL = "<img src='http://openweathermap.org/img/w/" + icon + ".png'>"

	    if (units === 'metric') {
	    	tempUnit = '&degC';
	    	windUnit = 'km/hr';
	    	weatherApp.toggleImperial();
	    } else {
	    	tempUnit = '&degF';
	    	windUnit = 'mph';
	    }
	    weatherApp.displayWeather(data);
	    $('#retrieving').css('display', 'none');
	    $('#permission').css('display', 'none');
	    $('#seeWeather').css('display', 'none');
	  });
	},
	// display data on webpage
	displayWeather: function(data) {
		var city = data.name;
		var current = data.weather[0].main;
		var temp = Math.floor(data.main.temp);
		var humidity = data.main.humidity;
		var country = data.sys.country;
		var wind = Math.floor(data.wind.speed);
		var pressure = data.main.pressure;
		var description = data.weather[0].main;
		var conditionCode = data.weather[0].id;
		// var conditionCode = 951; // for testing background images
		
		// match background image to weather conditions
		weatherApp.backgroundImage(conditionCode);

		$('#city').html(city);
	  $('#current').html(iconURL);  // display conditions icon
	  $('#temp').html(temp);
	  $('#units').html(tempUnit);
	  $('#humidity').html(humidity);
	  $('#wind').html(wind);
	  $('#windUnit').html(windUnit);
	  $('#pressure').html(pressure);
	  $('#description').html(description);
	  $('.weather').fadeIn(1000);
	  $('.weather').css('display', 'block');
	},	
	imperial: function() {
	  document.getElementById('imperial').addEventListener("click", function() {
		unitsDefault = 'imperial';
		weatherApp.toggleImperial();
		weatherApp.getLocation();
		});
	},
	metric: function() {
		document.getElementById('metric').addEventListener("click", function() {
		unitsDefault = 'metric';
		weatherApp.getLocation();
		});
	},
	seeWeather: function() {
		document.getElementById('seeWeather').addEventListener("click", function() {
				$('#seeWeather').animate({'opacity': '0'}, 500);
				weatherApp.getLocation();
				$('#retrieving').fadeIn(2000);
				$('#permission').fadeIn(2000);
			});
		},
		toggleImperial: function() {
			$('imperial').addClass('a.turnedOn');
		},
		backgroundImage: function(conditionCode) {
			if (conditionCode >= 200 && conditionCode < 300) {
				$('body').fadeIn(500);
					$('body').addClass('thunderstorm');
			} else if (conditionCode >= 300 && conditionCode < 400) {
					$('body').fadeIn(500);
					$('body').addClass('drizzle');
			} else if (conditionCode >= 500 && conditionCode < 600) {
					$('body').fadeIn(500);
					$('body').addClass('rain');
			} else if (conditionCode >= 600 && conditionCode < 700) {
					$('body').fadeIn(500);
					$('body').addClass('snow');
			} else if (conditionCode >= 700 && conditionCode < 800) {
					$('body').fadeIn(500);
					$('body').addClass('atmosphere');
			}	else if (conditionCode === 800) {
					$('body').fadeIn(500);
					$('body').addClass('clear');
			} else if (conditionCode >= 801 && conditionCode < 900) {
					$('body').fadeIn(500);
					$('body').addClass('clouds');
			} else if (conditionCode >= 900 && conditionCode < 950) {
					$('body').fadeIn(500);
					$('body').addClass('extreme');
			} else {
					$('body').fadeIn(500);
					$('body').addClass('default');
			} 
		}
	};

	weatherApp.seeWeather();
	weatherApp.imperial();
	weatherApp.metric();
});



