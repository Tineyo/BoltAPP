function commandPushByte(command, b){
    switch (b){
    	case APIConstants.startOfPacket:
    		command.push(APIConstants.escape,APIConstants.escapedStartOfPacket);
    		break;
    	case APIConstants.escape:
    		command.push(APIConstants.escape,APIConstants.escapedEscape);
    		break;
    	case APIConstants.endOfPacket:
    		command.push(APIConstants.escape,APIConstants.escapedEndOfPacket);
    		break;
    	default:
    		command.push(b);
    }	    
}

function decodeFlags(flags){
	let isResponse = flags & Flags.isResponse;
	let requestsResponse = flags & Flags.requestsResponse;
	let requestOnlyErrorResponse = flags & Flags.requestOnlyErrorResponse;
	let resetsInactivityTimeout = flags & Flags.resetsInactivityTimeout;
	let hasTargetId = flags & Flags.commandHasTargetId;
	let hasSourceId = flags & Flags.commandHasSourceId;
	return{
		isResponse,
		requestsResponse,
		requestOnlyErrorResponse,
		resetsInactivityTimeout,
		hasTargetId,
		hasSourceId,
	}
}

const wait = (time) =>  {return new Promise(callback => setTimeout(callback, time))};

const maskToRaw = (sensorMask) => {
	return{
		aol: sensorMask.reduce((aol,m) => {
			let mask;
			switch(m){
				case SensorMaskValues.accelerometer:
					mask = SensorMask.accelerometerFilteredAll;
					break;
				case SensorMaskValues.locator:
					mask = SensorMask.locatorFilteredAll;
					break;
				case SensorMaskValues.orientation:
					mask = SensorMask.orientationFilteredAll;
					break;
			}
			if (mask){
				return [...aol, mask];
			}
			return aol;
		}, []),
		gyro: sensorMask.reduce((gyro,m) => {
			let mask;
			if ( m === SensorMaskValues.gyro){
				mask = SensorMask.gyroFilteredAll;
			}
			if (mask){
				return [...gyro, mask];
			}
			return gyro;
		}, []),
	};
}

const flatSensorMask = (sensorMask) => 
  sensorMask.reduce((bits, m) => { return (bits |= m); }, 0);

const parseSensorResponse = (data, mask) => {
	let state = {data,
				 mask,
				 offset: 0,
				 response: {},
				}
	state = fillAngle(state);
	state = fillAccelerometer(state);
	state = fillLocator(state);
	state = fillGyro(state);
	return state.response;
}

const convertBinaryToFloat = (data, offset) => {
	if ( offset + 4 > data.length ){
		console.log('error');
		return 0;
	}
	const uint8Tab = new Uint8Array ([
		data[offset],
		data[offset + 1],
		data[offset + 2],
		data[offset + 3],
		]);
	const view = new DataView(uint8Tab.buffer);
	return view.getFloat32(0);
}

const fillAngle = (state) => {
	const {data, mask} = state;
	let {offset, response} = state;

	if (mask.aol.indexOf(SensorMask.orientationFilteredAll) >= 0){
		let pitch = convertBinaryToFloat(data, offset);
		offset += 4;

		let roll = convertBinaryToFloat(data, offset);
		offset += 4;

		let yaw = convertBinaryToFloat(data, offset);
		offset += 4;

		response.angles = {
			pitch,
			roll,
			yaw,
		};
	}
	return{
		data,
		mask,
		offset,
		response,
	};
}

const fillAccelerometer = (state) => {
	const {data, mask} = state;
	let {offset, response} = state;

	if (mask.aol.indexOf(SensorMask.accelerometerFilteredAll) >= 0){
		let x = convertBinaryToFloat(data, offset);
		offset += 4;

		let y = convertBinaryToFloat(data, offset);
		offset += 4;

		let z = convertBinaryToFloat(data, offset);
		offset += 4;

		response.accelerometer = {
			x,
			y,
			z,
		};
	}
	return{
		data,
		mask,
		offset,
		response,
	};
}

const fillLocator = (state) => {
	const {data, mask} = state;
	let {offset, response} = state;

	if (mask.aol.indexOf(SensorMask.locatorFilteredAll) >= 0){
		let positionX = convertBinaryToFloat(data, offset) * 100.0;
		offset += 4;
		
		let positionY = convertBinaryToFloat(data, offset) * 100.0;
		offset += 4;

		let velocityX = convertBinaryToFloat(data, offset) * 100.0;
		offset += 4;

		let velocityY = convertBinaryToFloat(data, offset) * 100.0;
		offset += 4;

		response.locator = {
			positionX,
			positionY,
			velocityX,
			velocityY,
		};
	}
	return{
		data,
		mask,
		offset,
		response,
	};
}

const fillGyro = (state) => {
	const {data, mask} = state;
	let {offset, response} = state;

	if (mask.gyro.indexOf(SensorMask.gyroFilteredAll) >= 0){
		let x = convertBinaryToFloat(data, offset);
		offset += 4;

		let y = convertBinaryToFloat(data, offset);
		offset += 4;

		let z = convertBinaryToFloat(data, offset);
		offset += 4;

		response.gyro = {
			x,
			y,
			z,
		}
	}
	return{
		data,
		mask,
		offset,
		response,
	};
}