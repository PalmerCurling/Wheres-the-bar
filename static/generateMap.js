var x, y, map, q, finalD;


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

	var request = {
		location: q,
		openNow: true,
		rankBy: google.maps.places.RankBy.DISTANCE,
		keyword: 'bar',
		types: ['bar', 'food', 'tavern']
	};
	service = new google.maps.places.PlacesService(map);
	service.nearbySearch(request, barCallback);
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
		addMarker(results[0]);
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
