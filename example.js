// Only available for MacOS(darwin) and various Linux distro's.
const os = require('os');
if (['darwin', 'linux'].indexOf(os.platform()) > -1) {
	// Imports module.
	const HotwordDetector = require('./index.js');
	// Initialize detector.
	const hotwordDetector = new HotwordDetector([
		{
			file: './node_modules/snowboy/resources/models/snowboy.umdl',
			hotwords : 'model',
			sensitivity: '0.5',
		}
	], {
		resource: './node_modules/snowboy/resources/common.res',
		audioGain: 2
	}, console);
	
	// Listen to 'hotword' event.
	hotwordDetector.on('hotword', function(index, hotword, buffer) {
		// Do something...
	});
	
	// Start recording and detecting.
	hotwordDetector.start();
}