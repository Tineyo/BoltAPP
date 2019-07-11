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

/* Asks Sphero to roll depending the latitude and longitude of the device */
function moveSphero(position) {
	let speed = position.coords.speed;
	let heading = position.coords.heading;
  	if ( speed > 0.2 && heading ) 
  	{
  		//Speed conversion from m/s to 0 to SPHERO_MAX_SPEED range
  		console.log(speed,heading);
  		let spheroSpeed =  SPHERO_MAX_SPEED * speed / 2.0; //2.0 m/s is the maximum speed of Sphero Bolt
  		spheroSpeed < SPHERO_MAX_SPEED ? spheroSpeed = Math.round(speed) : spheroSpeed = SPHERO_MAX_SPEED; 
 		bolt.roll(spheroSpeed, heading, []);	
	}
	else {
		bolt.roll(0, bolt.heading, []);
	}
}



