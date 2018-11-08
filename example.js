// Only available for MacOS(darwin) and various Linux distro's.
const os = require('os');
if (['darwin', 'linux'].indexOf(os.platform()) > -1) {
	// Imports module.
	const HotwordDetector = require('./index.js');
	// Initialize detector.
	const hotwordDetector = new HotwordDetector({
		resource: './node_modules/snowboy/resources/common.res'
	}, [
		{
			file: './node_modules/snowboy/resources/models/snowboy.umdl',
			hotwords : 'snowboy',
			sensitivity: '0.5'
		}
	], {
		audioGain: 2
	}, console);
	
	// Triggered when an error is encountered.
	hotwordDetector.on('error', function(error) {
		console.error('hotwordDetector: ' + error);
	});
	// Triggered when a hotword has been detected.
	hotwordDetector.on('hotword', function(index, hotword, buffer) {
		// Index is the associated index of the detected hotword.
		// Hotword is a string of which word has been detected.
		// Buffer is the most recent section from the audio buffer.
		console.log('hotwordDetector: Hotword detected: ' + hotword);
		
		// In the example stop detecting and exit the program.
		hotwordDetector.stop();
		process.exit(1);
	});
	// Triggered when there is no audible sound being recorded.
	hotwordDetector.on('silence', function() {
		console.log('hotwordDetector: silence');
	});
	
	// Start recording and detecting.
	hotwordDetector.start();
} else {
	console.warn("The operating system does not meet the requirements to run the hotword detection library.");c7502eb80f9a5ee
}