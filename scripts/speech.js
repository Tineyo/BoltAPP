/* Functions to execute when a command is matched */
const fct = {
	roll : () => {
		bolt.roll(30 ,0, []);
	},

	rollSpeed : (speed) => {
		speed = Number(speed);
		if (!isNaN(speed) && speed <= 255){
			bolt.roll(speed,0,[]);
		}
	},

	rollTime : (time) => {
		time = Number(time);
		if (!isNaN(time)){
			bolt.rollTime(50, 0, time*1000, []);
		}
	},

	rollSpeedTime : (speed, time) => {
		speed = Number(speed);
		time = Number(time);
		if (!isNaN(speed) && speed <= 255 && !isNaN(time)){
			bolt.rollTime(speed, 0, time*1000, []);
		}
	},

	rollTimeSpeed : (time, speed) => {
		speed = Number(speed);
		time = Number(time);
		if (!isNaN(speed) && speed <= 255 && !isNaN(time)){
			bolt.rollTime(speed, 0, time*1000, []);
		}
	},

	rollBackward : () => {
		bolt.roll(30, 180, []);
	},

	rollBackwardSpeed : (speed) => {
		speed = Number(speed);
		if (!isNaN(speed) && speed <= 255){
			bolt.roll(speed,180,[]);
		}
	},

	rollBackwardTime : (time) => {
		time = Number(time);
		if (!isNaN(time)){
			bolt.rollTime(50, 180, time*1000, []);
		}
	},

	rollBackwardSpeedTime : (speed, time) => {
		speed = Number(speed);
		time = Number(time);
		if (!isNaN(speed) && speed <= 255 && !isNaN(time)){
			bolt.rollTime(speed, 180, time*1000, []);
		}
	},

	rollBackwardTimeSpeed : (time, speed) => {
		speed = Number(speed);
		time = Number(time);
		if (!isNaN(speed) && speed <= 255 && !isNaN(time)){
			bolt.rollTime(speed, 180, time*1000, []);
		}
	},

	rollLeft : () => {
		bolt.roll(30, 270, []);
	},

	rollLeftSpeed : (speed) => {
		speed = Number(speed);
		if (!isNaN(speed) && speed <= 255){
			bolt.roll(speed, 270, []);
		}
	},

	rollLeftTime :  (time) => {
		time = Number(time);
		if (!isNaN(time)){
			bolt.rollTime(50, 270, time*1000, []);
		}
	},

	rollLeftSpeedTime :  (speed, time) => {
		speed = Number(speed);
		time = Number(time);
		if (!isNaN(speed) && speed <= 255 && !isNaN(time)){
			bolt.rollTime(speed, 270, time*1000, []);
		}
	},

	rollLeftTimeSpeed :  (time, speed) => {
		speed = Number(speed);
		time = Number(time);
		if (!isNaN(speed) && speed <= 255 && !isNaN(time)){
			bolt.rollTime(speed, 270, time*1000, []);
		}
	},

	rollRight : () => {
		bolt.roll(30, 90, []);
	},

	rollRightSpeed : () => {
		speed = Number(speed);
		if (!isNaN(speed) && speed <= 255){
			bolt.roll(speed, 90, []);
		}
	},

	rollRightTime : (time) => {
		time = Number(time);
		if (!isNaN(time)){
			bolt.rollTime(50, 90, time*1000, []);
		}
	},

	rollRightSpeedTime :  (speed, time) => {
		speed = Number(speed);
		tume = Number(time);
		if (!isNaN(speed) && speed <= 255 && !isNaN(time)){
			bolt.rollTime(speed, 90, time*1000, []);
		}
	},

	rollRightTimeSpeed :  (time,speed) => {
		speed = Number(speed);
		tume = Number(time);
		if (!isNaN(speed) && speed <= 255 && !isNaN(time)){
			bolt.rollTime(speed, 90, time*1000, []);
		}
	},

	spinRight : () => {
		bolt.setHeading(45);
	},

	spinLeft : () => {
		bolt.setHeading(315);
	},

	orientToNorth : () => {
		bolt.calibrateToNorth();
	},

	stop : () => {
		bolt.roll(0, bolt.heading, []);
	},

	setRed : () => {
		bolt.setAllLeds(255, 0, 0);
		colorPicker.color.rgb = {r: 255, g: 0, b: 0};
	},

	setGreen : () => {
		bolt.setAllLeds(0, 255, 0);
		colorPicker.color.rgb = {r: 0, g: 255, b: 0};
	},

	setBlue : () => {
		bolt.setAllLeds(0, 0, 255);
		colorPicker.color.rgb = {r: 0, g: 0, b: 255};
	},

	setPurple : () => {
		bolt.setAllLeds(255, 0, 255);
		colorPicker.color.rgb = {r: 255, g: 0, b: 255};
	},

	setYellow : () => {
		bolt.setAllLeds(255, 255, 0);
		colorPicker.color.rgb = {r: 255, g: 255, b: 0};
	},

	setTurquoise : () => {
		bolt.setAllLeds(0, 255, 255);
		colorPicker.color.rgb = {r: 0, g: 255, b: 255};
	},

	setWhite : () => {
		bolt.setAllLeds(255, 255, 255);
		colorPicker.color.rgb = {r: 255, g: 255, b: 255};
	},

	setBlack : () => {
		bolt.setAllLeds(0, 0, 0);
		colorPicker.color.rgb = {r: 0, g: 0, b: 0};
	},

	disconnect : () => {
		bolt.disconnect();
		annyang.abort();
		if (watchId){
			navigator.geolocation.clearWatch(watchId);
		}
		loadMainPage(); 
	},
}

const commandsFR = {
	'avant': fct.roll,
	'avant vitesse :speed': fct.rollSpeed,
	'avant pendant :time': fct.rollTime,
	'avant vitesse :speed pendant :time': fct.rollSpeedTime,
	'avant pendant :time vitesse :speed': fct.rollTimeSpeed,
	'arrière': fct.rollBackward,
	'arrière vitesse :speed': fct.rollBackwardSpeed,
	'arrière pendant :time': fct.rollSpeedTime,
	'arrière vitesse :speed pendant :time': fct.rollBackwardSpeedTime,
	'arrière pendant :time vitesse :speed': fct.rollBackwardTimeSpeed,	
	'gauche': fct.rollLeft,
	'gauche vitesse :speed': fct.rollLeftSpeed,
	'gauche pendant :time': fct.rollLeftTime,
	'gauche vitesse :speed pendant :time': fct.rollLeftSpeedTime,
	'gauche pendant :time vitesse :speed': fct.rollLeftTimeSpeed,
	'droite': fct.rollRight,
	'droite vitesse :speed': fct.rollRightSpeed,
	'droite pendant :time': fct.rollRightTime,
	'droite vitesse :speed pendant :time': fct.rollRightSpeedTime,
	'droite pendant :time vitesse :speed': fct.rollRightTimeSpeed,
	'pivoter droite':  fct.spinRight,
	'pivoter gauche':  fct.spinLeft,
	'orienter vers le nord': fct.orientToNorth,
	'stop': fct.stop,
	'rouge': fct.setRed,
	'vert': fct.setGreen,
	'bleu': fct.setBlue,
	'violet': fct.setPurple,
	'jaune': fct.setYellow,
	'turquoise': fct.setTurquoise,
	'blanc': fct.setWhite,
	'noir': fct.setBlack,
	'déconnexion': fct.disconnect,
};

const commandsEN = {
	'go forward': fct.roll,
	'go forward speed :speed': fct.rollSpeed,
	'go forward during :time': fct.rollTime,
	'go forward speed :speed during :time': fct.rollSpeedTime,
	'go forward during :time speed :speed': fct.rollTimeSpeed,
	'go backward': fct.rollBackward,
	'go backward speed :speed': fct.rollBackwardSpeed,
	'go backward during :time': fct.rollSpeedTime,
	'go backward speed :speed during :time': fct.rollBackwardSpeedTime,	
	'go backward during :time speed :speed': fct.rollBackwardTimeSpeed,
	'go left': fct.rollLeft,
	'go left speed :speed': fct.rollLeftSpeed,
	'go left during :time': fct.rollLeftTime,
	'go left speed :speed during :time': fct.rollLeftSpeedTime,
	'go left during :time speed :speed': fct.rollLeftTimeSpeed,
	'go right': fct.rollRight,
	'go right speed :speed': fct.rollRightSpeed,
	'go right during :time': fct.rollRightTime,
	'go right speed :speed during :time': fct.rollRightSpeedTime,
	'go right during :time speed :speed': fct.rollRightTimeSpeed,
	'spin right':  fct.spinRight,
	'spin left':  fct.spinLeft,
	'orient to north': fct.orientToNorth,
	'stop': fct.stop,
	'red': fct.setRed,
	'green': fct.setGreen,
	'blue': fct.setBlue,
	'purple': fct.setPurple,
	'yellow': fct.setYellow,
	'turquoise': fct.setTurquoise,
	'white': fct.setWhite,
	'black': fct.setBlack,
	'disconnect': fct.disconnect,
};

