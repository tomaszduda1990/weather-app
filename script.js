
	
	var weatherApp = {
		metric: true,
		// get coordinates and run function getWeather
		getLocation: function(){
			navigator.geolocation.getCurrentPosition(function(pos){

				var lon = Math.round(1000*pos.coords.longitude)/1000;
  				var lat = Math.round(1000*pos.coords.latitude)/1000;
				var key = "afe7909b194042b191b3d1279b3392ae";
				weatherApp.getWeather(lon,lat,key);
			})
		},
		// connectCurrent APi data
		getWeather: function(lon, lat, key){
			var connectCurrent = new XMLHttpRequest();
			connectCurrent.open("GET", "http://api.openweathermap.org/data/2.5/weather?lat="+lat+"&lon="+lon+"&APPID="+key);
			connectCurrent.onload = function(){
				var dataCurrent = JSON.parse(connectCurrent.responseText);
				//what we see -------------------------------------
				
				weatherAppUpdate.updateFieldsCurrent(dataCurrent);
			};
			connectCurrent.send();
			
		//connectFOrecast API data
			var connectForecast = new XMLHttpRequest();
			connectForecast.open("GET", "http://api.openweathermap.org/data/2.5/forecast?lat="+lat+"&lon="+lon+"&APPID="+key);
			connectForecast.onload = function(){
				var dataForecast = JSON.parse(connectForecast.responseText);
				//what we see -------------------------------------
				weatherAppUpdate.updateFieldsForecast(dataForecast);
				

				
			};
			connectForecast.send();
		},
	
	};
	var weatherAppUpdate = {

		updateFieldsCurrent: function(data){
			var header = document.getElementById('location');
			var rain = document.getElementById('current-rain');
			var pressure = document.getElementById('current-pressure');
			var clouds = document.getElementById('current-clouds');
			var preLoader = document.getElementById("hide");
			var weatherCode = data.weather[0].icon.slice(0,2);

			preLoader.addEventListener("click", function(){
				var preLoaderScreen = document.querySelector('.pre-loader');
				preLoaderScreen.className += " hide";
				setTimeout(function(){
					preLoaderScreen.style.display = "none";
					
				}, 1000);
			});
			weatherAppLogic.setBackground(weatherCode, data.main.temp);

			weatherAppLogic.convertUnitsTemp(weatherApp.metric, data.main.temp);
			weatherAppLogic.convertUnitsWind(weatherApp.metric, data.wind.speed);
			weatherAppLogic.convertTime(data);

			header.textContent = data.name;
			header.innerHTML +="<span></span>";
			pressure.textContent = data.main.pressure + " hPa";
			clouds.textContent = data.clouds.all + " %";
			
			if(data.hasOwnProperty('rain')){
				
				rain.textContent = data.rain['3h'] + " mm";
			}else{
				data.rain = {};
				data.rain['3h'] = 0;
				rain.textContent = data.rain['3h'] + " mm";
				
			}

		},
		updateFieldsForecast: function(data){
			var array = weatherAppLogic.forecastArray(data);
			var table = document.getElementById('table');
			table.innerHTML = "";
			for(var i = 0; i<array.length; i++){
				table.appendChild(weatherAppLogic.updateForecastCondition(array[i]));
			};			
		},
	};

	weatherAppLogic = {
		setBackground: function(weatherCode, temp){
			var body = document.querySelector("body");
			if(temp >= 296 && (weatherCode == "01" || weatherCode == "02")){
				body.style.backgroundImage = "url('imgs/jeremy-ricketts-9573.jpg')";
			}else if((temp < 296 && temp >= 279) && (weatherCode == "01" || weatherCode == "02")){
				body.style.backgroundImage = "url('imgs/autumn.jpg')";
			}else if(temp>=279 && (weatherCode == "03" || weatherCode == "04")){
				body.style.backgroundImage = "url('imgs/clouds-autumn.jpg')";
			}else if(temp<279){
				body.style.backgroundImage = "url('imgs/cold.jpg')";
			}else if(weatherCode == "09" || weatherCode == "10" || weatherCode == "11"){
				body.style.backgroundImage = "url('imgs/rain.jpg')";
			}else{
				body.style.backgroundImage = "url('imgs/random.jpg')";
			}
		},
		toggleUnits: function(){
			weatherApp.metric = !weatherApp.metric;
			var buttonText = document.getElementById('toggleUnits');
			if(weatherApp.metric === true){
				buttonText.textContent = "Switch to imperial";
			}else{
				buttonText.textContent = "Switch to metric";
			}
			weatherApp.getLocation()
		},
		updateForecastCondition: function(data){
			var createLi = document.createElement('li');
			var temp = Math.round(this.returnTemp(weatherApp.metric, data.temperature));
			var rain;
			function isEmpty(obj) {
			    for(var prop in obj) {
			        if(obj.hasOwnProperty(prop))
			        return false;
			    }
			    return true;
			}
			if(data.rain === undefined){
				rain = '0.00';
			}else if(isEmpty(data.rain)){
				rain = "0.00";
			}else{
				rain = Math.round(data.rain['3h']*100)/100;
			}
			var pressure = Math.round(data.pressure);
			var units;
			if(weatherApp.metric === true){
				units = " &#x2103";
			}else units = " &#x2109";
			createLi.innerHTML += "<div class = \"day\">" +data.weekDay+"</div>";
			createLi.innerHTML += "<div class = \" forecast-day\"><img src=\"imgs/thermometer.png\" alt=\"temp icon\" class=\"icon\">"+temp + units+"</div>";
			createLi.innerHTML += "<div class = \" forecast-day\"><img src=\"imgs/003-raindrops-falling-of-a-black-cloud.png\" alt=\"temp icon\" class=\"icon\">"+rain + " mm</div>";
			createLi.innerHTML += "<div class = \" forecast-day\"><img src=\"imgs/004-meter.png\" alt=\"temp icon\" class=\"icon\">"+pressure + " hPa</div>";
			return createLi;
		},
		convertUnitsTemp: function(metric, temp){
			var currentTemp = document.getElementById('currentTemp');
			var tempValue = temp;
			currentTemp.innerHTML = "";
			if(metric === true){
				tempValue -= 273.15;
				currentTemp.textContent = tempValue;
				currentTemp.innerHTML += "<span>&#x2103</span>";
			}else{				
				tempValue = tempValue*1.8-459.67;
				tempValue = Math.round(tempValue);
				currentTemp.textContent = tempValue;
				currentTemp.innerHTML += "<span>&#x2109</span>";
			}
			
		},
		returnTemp: function(metric, temp){
			var tempValue = temp;
			if(metric === true){
				tempValue -= 273.15;
			
			}else{
				
				tempValue = tempValue*1.8-459.67;
				tempValue = Math.round(tempValue);
			}
			return tempValue;
		},
		convertUnitsWind: function(metric, wind){
			var windValue;
			var windText = document.getElementById('current-wind');
			if(metric === true){
				windValue = wind;
				windText.textContent = windValue + " m/s";
			}else{			
				windValue = Math.round(10*wind*2.2369)/10;
				windText.textContent = windValue + " mil/h";
			}
		},
		convertTime: function(time){
			var sun = [];
			var sunrise = document.getElementById('sunrise');
			var sunset = document.getElementById('sunset');
			var hour;
			var minutes;
			sun[0] = new Date(time.sys.sunrise*1000);
			sun[1] = new Date(time.sys.sunset*1000)			
			for(var i = 0; i<sun.length; i++){
				hour = sun[i].getHours().toString();
				minutes = sun[i].getMinutes().toString();
				if(minutes.length === 1){
					var addZero = "0"+minutes;
					minutes = addZero;
				}
				if(i<1){

					sunrise.textContent = hour + ":" + minutes;
				}else{
					sunset.textContent = hour + ":" + minutes;
				}			
			}
		},
		forecastArray: function(arr){
				
				var time;
				var control = 0; 
				var date = {};
				var arrRange = [];
				var days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]; 
				for(var i = 0; i<arr.list.length; i++){					
					time = arr.list[i].dt;
					var checkTime = new Date(time*1000);
					date.time = checkTime.getHours();
					date.date = checkTime.getDate();
					date.weekDay = days[checkTime.getDay()];				
					if(date.time>12 && date.time<18){
						arrRange.push(
							{
								day: date.date,
								weekDay: date.weekDay,
								temperature: arr.list[i].main.temp,
								rain: arr.list[i].rain,
								pressure: arr.list[i].main.pressure,
							}
						);						
					}
				}
				var arr_return = [];
				arr_return.push(arrRange[0]);
				for(var i = 1; i<arrRange.length; i++){
						if(arrRange[i-1].day != arrRange[i].day){
							arr_return.push(arrRange[i]);
						}
				}
				return arr_return;
		},
	};


	weatherApp.getLocation();