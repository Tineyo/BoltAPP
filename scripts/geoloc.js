/* Maximum speed Sphero can roll ( 0 to 255 ) */
const SPHERO_MAX_SPEED = 100;

/* Geoloc options */
var geo_options = {
  		enableHighAccuracy: true, 
  		maximumAge        : 0, 
  		timeout           : 27000,
		};

var watchId = null;
var oldLong, oldLat, oldTs;
function getLocation() {
 	if (navigator.geolocation) {
	  	bolt.calibrateToNorth();
	  	var oldLong = null;
		var oldLat = null;
		var oldTs = null;
	  	watchId = navigator.geolocation.watchPosition(moveSphero,errorLocation,geo_options);
  	}
    else { 
   		alert(appDict[language].geolocNotSupported);
  	}
}

function errorLocation(err){
	bolt.roll(0, bolt.heading, []);
	navigator.geolocation.clearWatch(watchId);
	watchId = null;
	alert(appDict[language].geolocError+err.message);
}

/* Asks Sphero to roll depending on latitude and longitude of the device */
function moveSphero(position) {
	let long = position.coords.longitude;
  	let lat = position.coords.latitude;
  	let ts = position.timestamp;
  	if (oldLat && oldLong && oldTs){

	  	let dlon = (long - oldLong) ;
		let dlat = (lat - oldLat) ;

		// Heading
	  	let heading = (180/Math.PI)*Math.atan2(dlon,dlat);
	  	heading < 0 ? heading = Math.round(heading+360) : heading = Math.round(heading);	

	  	dlon *= Math.PI / 180;
		dlat *= Math.PI / 180;

		//Speed
		let a = Math.pow(Math.sin(dlat / 2),2) + Math.cos(oldLat) * Math.cos(lat) * Math.pow(Math.sin(dlon / 2),2);
		let c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
		let dist = 6373.0 * c * 1000;
		let time = (ts-oldTs)/1000;
		let speed = dist / time;		 	
	  
	  	//Debug /!\ ne pas oublier de supprirer coords dans app.js. /!\
		let div = document.querySelector("#coords");
	 		div.innerHTML = "Latitude: " + lat + 
			"<br>Longitude: " + long +
			"<br>Speed: "+ speed + " m/s" +
			"<br>Heading: "+ heading+
			"<br>Accuarcy: " + position.coords.accuracy +
			"<br>Time: " + time +
			"<br>Distance: " + dist;

	  	if ( speed < 0.4 ) {
	  		bolt.roll(0, bolt.heading, []);
	  	}
	  	else{
	  		//Speed convertion from m/s to 0 to SPHERO_MAX_SPEED range
	  		let spheroSpeed =  SPHERO_MAX_SPEED * speed / 2.0; //2.0 m/s is the maximum speed of Sphero Bolt
	  		spheroSpeed < SPHERO_MAX_SPEED ? spheroSpeed = Math.round(speed) : spheroSpeed = SPHERO_MAX_SPEED; 
	 		bolt.roll(spheroSpeed, heading, []);	
		}
	}
	oldLong = long;
	oldLat = lat;
	oldTs = ts;	
}


