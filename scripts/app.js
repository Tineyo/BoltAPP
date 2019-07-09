/* Connects to Sphero and init events handlers */
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
		bolt.on('onCharged', () => {
			alert(appDict[language].onCharged);
		});
		bolt.on("onCompassNotify", async (angle) => {
			bolt.setAllLeds(0, 0, 0);
			bolt.setMainLedColor(255, 0, 0);
			await bolt.setHeading(angle);
		});
	}
}

/* Init the GUI to control Sphero */
function loadConnectedPage(){
	let body = document.querySelector("#pageBody");
	body.innerHTML = `
		<button id="disconnect">`+ appDict[language].disconnect +`</button> <br>		
		<div id='control'>
				<h2>` + appDict[language].speed + `</h2>
				<span class="rangeVal">MIN </span><input type="range" min="0" max="255"><span class="rangeVal"> MAX</span><br>
				<button class="control-button heading-right"><i class="fas fa-share heading-right"></i></button>
				<button class="control-button roll"><i class="fas fa-arrow-up roll"></i> </button>
				<button class="control-button heading-left"><i class="fas fa-reply heading-left"></i></button><br>		
				<button class="control-button left"> <i class="fas fa-arrow-left left"></i> </button>
				<button class="control-button back"> <i class="fas fa-arrow-down back"></i> </button>
				<button class="control-button right"> <i class="fas fa-arrow-right right"></i> </button>
		</div>
		<div id="color-picker-container"></div><br>
		`;
		/*<button id="geo">` + appDict[language].geoloc + `</button>
		<div id="coords"></div>
		*/

	document.querySelector('#disconnect').addEventListener('click', () => { 
		bolt.disconnect();
		annyang.abort();
		/*if (watchId){
			navigator.geolocation.clearWatch(watchId);
		}*/
		loadMainPage(); 
	});
	/*
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
	}) */
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
	if (annyang){
		if (language == 'FR'){
			annyang.addCommands(commandsFR);
			annyang.setLanguage('fr-FR');
		} 
		else{
			annyang.addCommands(commandsEN);
			annyang.setLanguage('en-GB');
		}
		annyang.debug(true); 
	}
	else{
		alert(appDict[language].speechRecogError);
	}
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
			<p id="connectInstruction">` + appDict[language].connectInstruction + `</p>
			<button id= "connectButton">` + appDict[language].connection + `</button>
		</div>
        `;
	if (navigator.bluetooth){
		document.querySelector('#connectButton').addEventListener('click', boltConnect);
	}
	else{
		document.querySelector('#connectInstruction').innerHTML = appDict[language].errorBLE;
		document.querySelector('#connectButton').disabled = true;
	}
}

function loadLanguageChoice(){
	document.querySelector("#pageBody").innerHTML = `
		<header>
			<h1> Sphero Bolt App</h1>
		</header>
		<div id="flags">
			<p> Choose your language </p>
			<img src="../img/fr.png" id="fr" width="300px" height="150px">
			<img src="../img/gb.png" id="gb" width="300px" height="150px">
		</div>
		`;
	document.querySelector("#fr").addEventListener('click', () => {
		language = 'FR';
		loadMainPage();
	});

	document.querySelector("#gb").addEventListener('click', () => {
		language = 'EN';
		loadMainPage();
	})
}

var bolt = null;
var colorPicker = null;
var language = null;
loadLanguageChoice();




