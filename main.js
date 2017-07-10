var location = {
		//methods
		success: function(pos){
			var crd = pos.coords;
	 	 	console.log(crd.lat);
		},
		getLocation: function(){
			navigator.geolocation.getCurrentPosition(location.success);
		},
	

	}

location.getLocation();
