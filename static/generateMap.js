var x, y, map, q, finalD, cityID, cityName, barName, streetAdd;


function getLocation(){
	if (navigator.geolocation){
		navigator.geolocation.getCurrentPosition(showPosition);
	}else{
		alert("Geolocation is not supported by this browser. Please enable it or use a newer browser, so we can help you find a bar");
	}
}

function showPosition(position){
	x = position.coords.latitude;
	y = position.coords.longitude;

	generateMap(x, y);
}

function generateMap(x, y){
	var mapOptions = {
		zoom: 15,
		center: q = new google.maps.LatLng(x, y),
		mapTypeId: google.maps.MapTypeId.ROADMAP
	};
	map = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);
	
	//for zomato api//
	.ajax({
		url: 'https://developers.zomato.com/api/v2.1/cities?lat='+x+'lon='+y,
		beforeSend: function(xhr) {
			xhr.setRequestHeader("user_key", "8f7c932e14b9840a253f966c2392b161")
		}, sucess: function(serverResponse) {
			//on success: get city name, pass to other functions for further info
			cityID = serverResponse.location_suggestions.id;
			cityName = serverResponse.location_suggestions.name;
		}
	})
	
	.ajax({
		url: 'https://developers.zomato.com/api/v2.1/search?entity_id='+cityID+'&entity_type=city&q=bar&sort=real_distance&order=asc',
		beforeSend: function(xhr) {
			xhr.setRequestHeader("user_key", "8f7c932e14b9840a253f966c2392b161")
		}, success: function(serverResponse) {
			//on success: query and make global nearest bar address + name
			barName = serverResponse.restaurants[0].name;
			streetAdd = serverResponse.restaurants[0].location.address;
	})
	
	//for using only Google to power backend//
	//	var request = {
	//		location: q,
	//		openNow: true,
	//		rankBy: google.maps.places.RankBy.DISTANCE,
	//		keyword: 'bar',
	//		types: ['bar', 'food', 'tavern']
	//	};
	service = new google.maps.places.PlacesService(map);
	service.nearbySearch(streetAdd, barCallback);
}

function diCallback(results, status){
	directionsDisplay = new google.maps.DirectionsRenderer();
	if(status == google.maps.DirectionsStatus.OK){
		directionsDisplay.setDirections(results);
	}
	directionsDisplay.setMap(map);
}

function barCallback(results, status) {
	if (status == google.maps.places.PlacesServiceStatus.OK) {
		addMarker(results);
		addHome(q);
		getDirections();
	}
}

function addHome(location){
	marker = new google.maps.Marker({
		position: location,
		map: map
	});

	var contentString = '<div id="home"><h2>Current location</h2></div>'

		var infowindow = new google.maps.InfoWindow({
			content: contentString
		});
	infowindow.open(map, marker);
}

function addMarker(location) {
	marker = new google.maps.Marker({
		position: location.geometry.location,
		map: map
	});

	finalD=location.geometry.location;

	var contentString = '<div id="content"><h2>'+location.name+'</h2></div>'

		var infowindow = new google.maps.InfoWindow({
			content: contentString
		});
	infowindow.open(map, marker);
}

function getDirections(){
	var diRequest = {
		origin: q,
		destination: finalD,
		travelMode: google.maps.TravelMode.WALKING,
	}

	directions = new google.maps.DirectionsService();

	directions.route(diRequest, diCallback);
}

google.maps.event.addDomListener(window, 'load', getLocation);
