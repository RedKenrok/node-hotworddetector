// Imports module.
const HotwordDetector = require(`../library`);

// Options hotword detector.
const detectorData = {
	resource: `./node_modules/snowboy/resources/common.res`
};
const modelData = [{
	file: `./node_modules/snowboy/resources/snowboy.umdl`,
	hotwords : `snowboy`,
	sensitivity: 0.5
}];
const recorderData = {
	audioGain: 2
};

// Initialize detector.
const hotwordDetector = new HotwordDetector(detectorData, modelData, recorderData, console);
// Triggered when an error is encountered.
hotwordDetector.on(`error`, function(error) {
	throw error;
});
// Triggered when a hotword has been detected.
hotwordDetector.on(`hotword`, function(index, hotword, buffer) {
	// Index is the associated index of the detected hotword.
	// Hotword is a string of which word has been detected.
	// Buffer is the most recent section from the audio buffer.
	console.log(`Hotword detected: ${index}, ${hotword}, ${buffer}.`);
	// Stop detecting.
	hotwordDetector.stop();
	
	// Exit the program, perhaps here you want to re-enable the hotword detector again.
	process.exit(1);
});
// Triggered when there is no audible sound being recorded.
hotwordDetector.on(`silence`, function() {
	console.log(`Silence...`);
});

// Start recording and detecting.
hotwordDetector.start();