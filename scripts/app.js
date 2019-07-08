/* Connects  to Sphero and init events handlers */
async function boltConnect(event){
	bolt = new SpheroBolt();
	await bolt.connect();
	if (bolt.device){
		loadConnectedPage();
		if (!annyang.started){
			annyang.started=true;
			annyang.start({continuous: true});
		}
		else{
			annyang.resume();
		}
		bolt.on("onWillSleepAsync", () => {
			console.log('Waking up robot');
			bolt.wake();
		});
		bolt.on("onCompassNotify",async (angle) => {
			console.log(angle);
			bolt.setAllLeds(0, 0, 0);
			bolt.setMainLedColor(255, 0, 0);
			await bolt.setHeading(angle);
		});

		bolt.on("onSensorUpdate", (command) => {
			console.log(
				`Locator:`+
				`\npositionX = `+command.locator.positionX.toFixed(3)+
				`\npositionY = `+command.locator.positionY.toFixed(3)+
				`\nvelocityX = `+command.locator.velocityX.toFixed(3)+
				`\nvelocityY = `+command.locator.velocityY.toFixed(3)); 
		});
	}
}

/* Init the GUI to controls Sphero */
function loadConnectedPage(){
	let body = document.querySelector("#pageBody");
	body.innerHTML = `
		<button id="disconnect"> Déconnexion </button> <br>		
		<div id='control'>
				<h2> Vitesse </h2>
				<span class="rangeVal">MIN </span><input type="range" min="0" max="255"><span class="rangeVal"> MAX</span><br>
				<button class="control-button heading-right"><i class="fas fa-share heading-right"></i></button>
				<button class="control-button roll"><i class="fas fa-arrow-up roll"></i> </button>
				<button class="control-button heading-left"><i class="fas fa-reply heading-left"></i></button><br>		
				<button class="control-button left"> <i class="fas fa-arrow-left left"></i> </button>
				<button class="control-button back"> <i class="fas fa-arrow-down back"></i> </button>
				<button class="control-button right"> <i class="fas fa-arrow-right right"></i> </button>
		</div>
		<div id="color-picker-container"></div><br>
		<button id="geo"> Suivre </button>
		<div id="coords"></div>
		`;
	document.querySelector('#disconnect').addEventListener('click', () => { 
		bolt.disconnect();
		annyang.abort();
		if (watchId){
			navigator.geolocation.clearWatch(watchId);
		}
		loadMainPage(); 
	});
	document.querySelector('#geo').addEventListener('click', function(event){
		if (watchId){
			bolt.roll(0, bolt.heading, []);
			navigator.geolocation.clearWatch(watchId);
			watchId = null;
			document.querySelector('#coords').innerHTML = '';
		}
		else {
			getLocation();
		}
	})
	document.querySelector('#control').addEventListener('touchstart', startRoll);
	document.querySelector('#control').addEventListener('mousedown', startRoll);
	document.querySelector('#control').addEventListener('touchend', stopRoll);
	document.querySelector('#control').addEventListener('mouseup', stopRoll);
	document.querySelector('#control').addEventListener('click', (e) => {
		if (e.target.classList.contains('heading-right')){
			bolt.setHeading((bolt.heading+45)%360);
		}
		else if (e.target.classList.contains('heading-left')){
			bolt.setHeading((bolt.heading-45)%360);
			
		}
	});

	colorPicker = new iro.ColorPicker('#color-picker-container');
	colorPicker.on("input:end", async function(color){
		let r = color.rgb.r;
		let g = color.rgb.g;
		let b = color.rgb.b;
		try{
			await bolt.setAllLeds(r, g, b);
		}
		catch(error){
			console.log(error.message);
		}
	});
}

/* Function to launch when user stops touching button , asks Sphero to stop rolling */
function stopRoll(e){
	let classList = e.target.classList;
	if (classList.contains('roll') || classList.contains('back') || classList.contains('left') || classList.contains('right')) {
		bolt.roll(0, bolt.heading, []);
	}
}

/* Function to launch when user starts touching button, asks Sphero to roll */
function startRoll(e){
	let speed = Number(document.querySelector('input[type=range]').value);
		if (e.target.classList.contains('roll')){
			bolt.roll(speed, 0, []);
		}
		else if (e.target.classList.contains('back')){
			bolt.roll(speed, 180, []);
		}
		else if (e.target.classList.contains('left')){
			bolt.roll(speed, 270, []);
		}
		else if (e.target.classList.contains('right')){
			bolt.roll(speed, 90, []);
		}
}


/* Prints the connection page */
function loadMainPage(){
	let body = document.querySelector("#pageBody");
	body.innerHTML = `
		<header>
			<h1> Sphero Bolt App</h1>
		</header>
		<div id="connectContainer">
			<p id="connectInstruction"> Vous devez vous connecter au Sphero Bolt en cliquant sur le bouton Connexion </p>
			<button id= "connectButton"> Connexion </button>
		</div>
        `;
	document.querySelector('#connectButton').addEventListener('click', boltConnect);
}

var bolt = null;
var colorPicker = null;
loadMainPage();



