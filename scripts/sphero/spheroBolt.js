class SpheroBolt{
	constructor() {
		this.seqNumber = 0;
		this.characs = new Map();
		this.eventListeners = {};
		this.device = null
		this.queue = new Queue(this.write);
	};

	/* Connect to Sphero */
	async connect() {
		try{
			this.device = await navigator.bluetooth.requestDevice({
				filters: [{
					namePrefix: 'SB-',				
					services: [UUID_SPHERO_SERVICE],
				}],
				optionalServices : [UUID_SPHERO_SERVICE_INITIALIZE],
			})
			const server = await this.device.gatt.connect();
			const services = await server.getPrimaryServices();
			
			for ( let service of services ){			
				if (service.uuid === UUID_SPHERO_SERVICE){
					let characteristics = await service.getCharacteristics();
					for ( let charac of characteristics){
						if ( charac.uuid === APIV2_CHARACTERISTIC ){
							await this.mapCharacteristic(charac);
						}
					}
				}
				else if (service.uuid === UUID_SPHERO_SERVICE_INITIALIZE){
					let characteristics = await service.getCharacteristics();
					for (let charac of characteristics){
						if (charac.uuid === ANTIDOS_CHARACTERISTIC || 
						charac.uuid === DFU_CONTROL_CHARACTERISTIC || 
						charac.uuid === DFU_INFO_CHARACTERISTIC || 
						charac.uuid === SUBS_CHARACTERISTIC){
							await this.mapCharacteristic(charac);
						}
					}
				}
			}
			console.log('Connected !')
			await this.init();
		}
		catch(error){
			console.log(error.message);
		}
	};
	
	/* Disconnect from Sphero */
	async disconnect(){
		if (this.device){
			await this.device.gatt.disconnect();
			this.device = null;
		}
		else{
			throw "Device is not connected"
		}
	}

	/* Init Sphero after connection*/
	async init(){
		await this.characs.get(ANTIDOS_CHARACTERISTIC).writeValue(useTheForce);
		this.wake();	
		this.resetYaw();
		this.resetLocator();	
		this.setAllLeds(255, 255, 255);
	};


	async mapCharacteristic(charac){
			if (charac.properties.notify){
				await charac.startNotifications();
			}
		   	this.characs.set(charac.uuid, charac);
			charac.addEventListener('characteristicvaluechanged', this.onDataChange);
	};

	/*  Write a command on a specific characteristic*/
	async write(data, callback){
		try{
			await data.charac.writeValue(new Uint8Array(data.command));
		}
		catch(error){
			console.log(error.message);	
		}
		if(callback){
			callback();
		}
	}

	/* Packet encoder */
	createCommand(commandInfo) {
		const {deviceId, commandId, targetId, data} = commandInfo;
	    this.seqNumber = (this.seqNumber+1)%255;
	    var sum = 0;
	    var command = [];
	    command.push(APIConstants.startOfPacket);
	    var cmdflg = Flags.requestsResponse | Flags.resetsInactivityTimeout | (targetId ? Flags.commandHasTargetId : 0) ;
	    command.push(cmdflg);
	    sum += cmdflg;
	    if (targetId){
	    	command.push(targetId);
	    	sum+=targetId;
	    }
	    commandPushByte(command, deviceId);
	    sum += deviceId;
	    commandPushByte(command, commandId);
	    sum += commandId;
	    commandPushByte(command, this.seqNumber);
	    sum += this.seqNumber;
	    for( var i = 0 ; i < data.length ; i++ ){
	        commandPushByte(command, data[i]);
	        sum += data[i];
	    }
	    var chk = (~sum) & 0xff;
	    commandPushByte(command, chk);
	    command.push(APIConstants.endOfPacket);
	    return command;
	}
	
	/* Put a command on the queue */
	queueCommand(command){
		this.queue.queue({charac: this.characs.get(APIV2_CHARACTERISTIC), command: command});
	}

	/* Waking up Sphero */
	wake(){
		let commandInfo = {
			deviceId: DeviceId.powerInfo,
			commandId: PowerCommandIds.wake,
			data: [],
		}
		let command = this.createCommand(commandInfo);
		this.queueCommand(command);
	}

	/* Enables collision detection */
	configureCollisionDetection( xThreshold = 100, yThreshold = 100, xSpeed = 100, ySpeed = 100, deadTime = 10, method = 0x01){
		let commandInfo = {
			deviceId: DeviceId.sensor,
			commandId: SensorCommandIds.configureCollision,
			targetId: 0x12,
			data: [method, xThreshold, xSpeed, yThreshold, ySpeed, deadTime]
		}
		let command = this.createCommand(commandInfo);
		this.queueCommand(command);
	}

	/* Enables sensor data streaming */
	configureSensorStream(){
		var mask = [
		SensorMaskValues.accelerometer,
		SensorMaskValues.orientation,
		SensorMaskValues.locator,
		SensorMaskValues.gyro,
		];
		let interval = 100; 
		this.rawMask = maskToRaw(mask); 
		this.sensorMask(flatSensorMask(this.rawMask.aol), interval); 
		this.sensorMaskExtended(flatSensorMask(this.rawMask.gyro));
	}

	/* Sends sensors mask to Sphero (acceleremoter, orientation and locator) */
	sensorMask(rawValue, interval){
		let commandInfo = {
			deviceId: DeviceId.sensor,
			commandId: SensorCommandIds.sensorMask,
			targetId: 0x12,
			data: [ (interval >> 8) & 0xff,
					interval & 0xff,
					0,	
					(rawValue >> 24) & 0xff,
					(rawValue >> 16) & 0xff,
					(rawValue >> 8) & 0xff,
					rawValue & 0xff,
				],
			}
		let command = this.createCommand(commandInfo);
		this.queueCommand(command);
	}
	/* Sends sensors mask to Sphero (gyroscope) */
	sensorMaskExtended(rawValue){
		let commandInfo = { 
			deviceId: DeviceId.sensor,
			commandId: SensorCommandIds.sensorMaskExtented,
			targetId: 0x12,
			data: [ (rawValue >> 24) & 0xff,
					(rawValue >> 16) & 0xff,
					(rawValue >> 8) & 0xff,
					rawValue & 0xff,
				],
			}
		let command = this.createCommand(commandInfo);
		this.queueCommand(command);
	}

	/* Sets the color of the back and front LED */
	setLedsColor(r, g, b){
		let commandInfo = {
			deviceId: DeviceId.userIO,
			commandId: UserIOCommandIds.allLEDs,
			data: [0x3f, r, g, b, r, g, b],
		};
		let command = this.createCommand(commandInfo);
		this.queueCommand(command);
	}

	/* Sets the color of the front LED */
	setMainLedColor(r, g, b){
		let commandInfo = {
			deviceId: DeviceId.userIO,
			commandId: UserIOCommandIds.allLEDs,
			data: [0x07, r, g, b],
		};
		let command = this.createCommand(commandInfo);
		this.queueCommand(command);
	}

	/* Sets the color of the back LED */
	setBackLedColor(r, g, b){
		let commandInfo = {
			deviceId: DeviceId.userIO,
			commandId: UserIOCommandIds.allLEDs,
			data: [0x38, r, g, b],
		};
		let command = this.createCommand(commandInfo);
		this.queueCommand(command);
	}

	/* Rolls the Sphero */
	roll(speed, heading, flags){
		let commandInfo = {
			deviceId: DeviceId.driving,
			commandId: DrivingCommandIds.driveWithHeading,
			targetId: 0x12,
			data: [speed, (heading >> 8) & 0xff, heading & 0xff, flags],
		}
		let command = this.createCommand(commandInfo);
		this.queueCommand(command);
		this.heading = heading;
	}

	/* Prints a char on the LED matrix  */
	printChar(char, r, g, b){
		let commandInfo = {
			deviceId: DeviceId.userIO,
			commandId: UserIOCommandIds.printChar,
			targetId: 0x12,
			data: [r, g, b, char.charCodeAt()]
		}
		let command = this.createCommand(commandInfo);
		this.queueCommand(command);
	}

	/* Sets the current orientation as orientation 0° */
	resetYaw(){
		let commandInfo = {
			deviceId: DeviceId.driving,
			commandId: DrivingCommandIds.resetYaw,
			targetId: 0x12,
			data: [],
		}
		this.heading = 0;
		let command = this.createCommand(commandInfo);
		this.queueCommand(command);
	}

	/* Resets the locator */
	resetLocator(){
		let commandInfo = {
		deviceId: DeviceId.sensor,
		commandId: SensorCommandIds.resetLocator,
		targetId: 0x12,
		data: [],
		}
		let command = this.createCommand(commandInfo)
		this.queueCommand(command);
	}

	/* Rolls the Sphero */
    async rollTime(speed, heading, time, flags) {
   		setTimeout((heading,flags) => this.roll(0, this.heading,[]) , time);
        await this.roll(speed, heading, flags);
       }
    	
    /* Sets the color of the LED matrix */
	setMatrixColor(r, g, b){
		let commandInfo = {
			deviceId: DeviceId.userIO,
			commandId: UserIOCommandIds.matrixColor,
			targetId: 0x12,
			data: [r, g, b], 
		}
		let command = this.createCommand(commandInfo);
		this.queueCommand(command);
	}

	/* Finds the north */
	calibrateToNorth(){
		let commandInfo = {
			deviceId: DeviceId.sensor,
			commandId: SensorCommandIds.calibrateToNorth,
			targetId: 0x12,
			data: [],
		}
		let command = this.createCommand(commandInfo);
		this.queueCommand(command);
	}

	/* Set the color of the LEd matrix and front and back LED */
	setAllLeds(r, g, b){
		this.setLedsColor(r, g, b);
		this.setMatrixColor(r, g, b);
	}

	/* Sets Sphero heading */
	async setHeading(heading){
		if (heading < 0 ){
			heading += 360 ;
		}
		this.roll(0, heading, []);
		await wait(1000);
		this.resetYaw();
	}

	/* Function triggered by the event characteristicvaluechanged */
	onDataChange(event) {
		this.init = function (){
		this.packet = [];
		this.sum = 0;
		this.escaped = false;
		}

		let len = event.target.value.byteLength;
		
		for (let i = 0; i < len ; i++)
		{
			let value = event.target.value.getUint8(i);
			switch(value){
		  		case APIConstants.startOfPacket:
		  			if (this.packet === undefined || this.packet.length != 0 )
		  			{
		  				this.init();
		  			}
		  			this.packet.push(value);
		  			break;
		  		case APIConstants.endOfPacket:
		  			this.sum-=this.packet[this.packet.length-1];
		  			if (this.packet.length < 6 )
		  			{
		  				console.log('Packet is too small');
		  				this.init();
		  
		  				break; 
		  			}
		  			if ( this.packet[this.packet.length-1] != (~(this.sum) & 0xff ))
		  			{
		  				console.log('Bad checksum');
						this.init();
						break;
		  			}
		  			this.packet.push(value);
		  			bolt.decode(this.packet);
		  			this.init();
		  			break;
		  		case APIConstants.escape:
		  			this.escaped=true;
		  			break;
		  		case APIConstants.escapedEscape:
		  		case APIConstants.escapedStartOfPacket:
		  		case APIConstants.escapedEndOfPacket:
		  			if ( this.escaped )
		  			{
		  				value = value | APIConstants.escapeMask;
		  				this.escaped=false;
		  			}	
		  			this.packet.push(value);
		  			this.sum+=value;
		  			break;
		  		default: 
		  			if (this.escaped){
		  				console.log('No escaped char...');
		  			}
		  			else{
		  			this.packet.push(value);
		  			this.sum+=value;
		  			}
		  	}
	  	}
	}

	/* If the packet is a notification , calls the right handler, else print the command status*/
	readCommand(command){
		if ( command.seqNumber === 255){
			if ( command.deviceId === DeviceId.powerInfo && command.commandId === PowerCommandIds.batteryStateChange){
				switch(command.data[0]){
					case BatteryState.charging:
						this.handleCharging(command);
						break;
					case BatteryState.notCharging:
						this.handleNotCharging(command);
						break;
					case BatteryState.charged:
						this.handleCharged(command)
						break;
					default:
						console.log('Unknown battery state');
				}
			}
			else if (command.deviceId === DeviceId.powerInfo && command.commandId === PowerCommandIds.willSleepAsync){
            	this.handleWillSleepAsync(command);
        	}
        	else if (command.deviceId === DeviceId.powerInfo && command.commandId === PowerCommandIds.sleepAsync ){
            	this.handleSleepAsync(command);
        	}
        	else if (command.deviceId === DeviceId.sensor && command.commandId === SensorCommandIds.collisionDetectedAsync) {
            	this.handleCollision(command);
        	}
        	else if (command.deviceId === DeviceId.sensor && command.commandId === SensorCommandIds.sensorResponse){
        		this.handleSensorUpdate(command);
        	}
        	else if (command.deviceId === DeviceId.sensor && command.commandId === SensorCommandIds.compassNotify){
        		this.handleCompassNotify(command);
        	}
			else{
				console.log('UNKNOWN EVENT '+ command.packet);
			}
		}
		else{
			this.printCommandStatus(command);	
		}
	}

	on(eventName, handler){
		this.eventListeners[eventName] = handler;
	}

	/*-------------------------------------------------------------------------------
									EVENT HANDLERS 
	-------------------------------------------------------------------------------*/
	handleCollision(command){
		let handler = this.eventListeners['onCollision'];
		if (handler){
			handler(command);
		}
		else{
			console.log('Event detected: onCollision, no handler for this event');
		}
	}

	handleCompassNotify(command){
		let handler = this.eventListeners['onCompassNotify'];
		if (handler){
			 let angle = command.data[0] << 8;
		     angle += command.data[1];
			handler(angle);
		}
		else{
			console.log('Event detected: onCompassNotify, no handler for this event');
		}
	}
	handleWillSleepAsync(command){
		let handler = this.eventListeners['onWillSleepAsync'];
		if (handler){
			handler(command);
		}
		else{
			console.log('Event detected: onWillSleepAsync, no handler for this event');
		}
	}

	handleSleepAsync(command){
		let handler = this.eventListeners['onSleepAsync'];
		if (handler){
			handler(command);
		}
		else{
			console.log('Event detected: onSleepAsync, no handler for this event');
		}
	}

	handleCharging(command){
		let handler = this.eventListeners['onCharging'];
		if (handler){
			handler(command);
		}
		else{
			console.log('Event detected: onCharging, no handler for this event');
		}
	}

	handleNotCharging(command){
		let handler = this.eventListeners['onNotCharging'];
		if (handler){
			handler(command);
		}
		else{
			console.log('Event detected: onNotCharging, no handler for this event');
		}
	}

	handleCharged(command){
		let handler = this.eventListeners['onCharged'];
		if (handler){
			handler(command);
		}
		else{
			console.log('Event detected: onCharged, no handler for this event');
		}
	}

	handleSensorUpdate(command){
		let handler = this.eventListeners['onSensorUpdate'];
		if(handler){
			const parsedResponse = parseSensorResponse(command.data, this.rawMask);
			handler(parsedResponse);
		}
		else{
			console.log('Event detected: onSensorUpdate, no handler for this event');
		}
	}

	//-------------------------------------------------------------------------------

	/* Prints the status of a command */
	printCommandStatus(command){
		switch(command.data[0]){
			case ApiErrors.success:
				//console.log('Command succefully executed!');
				break;
			case ApiErrors.badDeviceId:
				console.log('Error: Bad device id');
				break;
			case ApiErrors.badCommandId:
				console.log('Error: Bad command id');
				break;
			case ApiErrors.notYetImplemented:
				console.log('Error: Bad device id');
				break; 
			case ApiErrors.commandIsRestricted:
				console.log('Error: Command is restricted');
				break;
			case ApiErrors.badDataLength:
				console.log('Error: Bad data length');
				break;
			case ApiErrors.commandFailed:
				console.log('Error: Command failed');
				break;
			case ApiErrors.badParameterValue:
				console.log('Error: Bad paramater value');
				break;
			case ApiErrors.busy:
				console.log('Error: Busy');
				break;
			case ApiErrors.badTargetId:
				console.log('Error: Bad target id');
				break;
			case ApiErrors.targetUnavailable:
				console.log('Error: Target unavailable');
				break;
			default:
				console.log('Error: Unknown error');
		}
	}

	/* Packet decoder */
	decode(packet) {
		let command = {};
		command.packet = [...packet];
		command.startOfPacket = packet.shift();
		command.flags = decodeFlags(packet.shift());
		if (command.flags.hasTargetId){
			command.targetId = packet.shift();
		}	
		if (command.flags.hasSourceId){
			command.sourceId = packet.shift();
		}
		command.deviceId = packet.shift();
		command.commandId = packet.shift();
		command.seqNumber = packet.shift();
		command.data = [];
		let dataLen = packet.length-2;
		for ( let i = 0 ; i < dataLen ; i++){
			command.data.push(packet.shift());
		}
		command.checksum = packet.shift();
		command.endOfPacket = packet.shift();
		this.readCommand(command);
	}
}; 

