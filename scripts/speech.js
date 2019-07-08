/* List of all commands to recognize and the function to execute */
var commands = {
	'avant': () => {
		bolt.roll(30 ,0, []);
	},
	
	'avant vitesse :speed': (speed) => {
		speed = Number(speed);
		if (!isNaN(speed) && speed <= 255){
			bolt.roll(speed,0,[]);
		}
	},

	'avant pendant :time': (time) => {
		time = Number(time);
		if (!isNaN(time)){
			bolt.rollTime(50, 0, time*1000, []);
		}
	},
	
	'arrière': () => {
		bolt.roll(30, 180, []);
	},

	'arrière vitesse :speed': (speed) => {
		speed = Number(speed);
		if (!isNaN(speed) && speed <= 255){
			bolt.roll(speed,180,[]);
		}
	},

	'arrière pendant :time': (time) => {
		time = Number(time);
		if (!isNaN(time)){
			bolt.rollTime(50, 180, time*1000, []);
		}
	},

	'gauche': () => {
		bolt.roll(30, 270, []);
	},

	'gauche vitesse :speed': (speed) => {
		speed = Number(speed);
		if (!isNaN(speed) && speed <= 255){
			bolt.roll(speed, 270, []);
		}
	},

	'gauche pendant :time': (time) => {
		time = Number(time);
		if (!isNaN(time)){
			bolt.rollTime(50, 270, time*1000, []);
		}
	},

	'droite': () => {
		bolt.roll(30, 90, []);
	},

	'droite vitesse :speed': () => {
		speed = Number(speed);
		if (!isNaN(speed) && speed <= 255){
			bolt.roll(speed, 90, []);
		}
	},

	'droite pendant :time': (time) => {
		time = Number(time);
		if (!isNaN(time)){
			bolt.rollTime(50, 90, time*1000, []);
		}
	},

	'pivoter droite':  () => {
		bolt.setHeading(45);
	},

	'pivoter gauche':  () => {
		bolt.setHeading(315);
	},

	'mode calibrage orientation': () => {
		bolt.setAllLeds(0, 0, 0);
		bolt.setMainLedColor(0, 0, 255);
	},

	'orienter vers le nord': () => {
		bolt.calibrateToNorth();
	},

	'stop': () => {
		bolt.roll(0, bolt.heading, []);
	},

	'rouge': () => {
		bolt.setAllLeds(255, 0, 0);
		colorPicker.color.rgb = {r: 255, g: 0, b: 0};
	},

	'vert': () => {
		bolt.setAllLeds(0, 255, 0);
		colorPicker.color.rgb = {r: 0, g: 255, b: 0};
	},

	'bleu': () => {
		bolt.setAllLeds(0, 0, 255);
		colorPicker.color.rgb = {r: 0, g: 0, b: 255};
	},

	'violet': () => {
		bolt.setAllLeds(255, 0, 255);
		colorPicker.color.rgb = {r: 255, g: 0, b: 255};
	},

	'jaune': () => {
		bolt.setAllLeds(255, 255, 0);
		colorPicker.color.rgb = {r: 255, g: 255, b: 0};
	},

	'turquoise': () => {
		bolt.setAllLeds(0, 255, 255);
		colorPicker.color.rgb = {r: 0, g: 255, b: 255};
	},

	'blanc': () => {
		bolt.setAllLeds(255, 255, 255);
		colorPicker.color.rgb = {r: 255, g: 255, b: 255};
	},

	'noir': () => {
		bolt.setAllLeds(0, 0, 0);
		colorPicker.color.rgb = {r: 0, g: 0, b: 0};
	},

	'déconnexion': () => {
		bolt.disconnect();
		annyang.abort();
		if (watchId){
			navigator.geolocation.clearWatch(watchId);
		}
		loadMainPage(); 
	},
};

