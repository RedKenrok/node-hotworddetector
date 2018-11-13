// Requires the node-audiorecorder module to be installed.

// Node modules.
const fs = require(`fs`);
// Dependency modules.
const AudioRecorder = require(`node-audiorecorder`),
	HotwordDetector = require(`../library`);

// Options audio recorder.
const recorderOptions = {};
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

// Initialize hotword detector.
const hotwordDetector = new HotwordDetector(detectorData, modelData, recorderData, console);
hotwordDetector.on(`error`, function(error) {
	throw error;
});
hotwordDetector.on(`hotword`, function(index, hotword, buffer) {
	// Index is the associated index of the detected hotword.
	// Hotword is a string of which word has been detected.
	// Buffer is the most recent section from the audio buffer.
	console.log(`hotwordDetector: Hotword detected: ${index}, ${hotword}, ${buffer}.`);
	
	// Stop the detector.
	hotwordDetector.stop();
	
	// Record audio.
	let audioRecorder = new AudioRecorder(recorderOptions);
	// Start recording.
	audioRecorder.start();
	// Listen to events.
	audioRecorder.stream().on(`error`, function(error) {
		throw error;
	});
	audioRecorder.on(`close`, function(exitCode) {
		console.log(`Audio stream closed, exit code: '${exitCode}'.`);
		// Stop audio recorder.
		audioRecorder.stop();
		
		// Exit the program, perhaps here you want to re-enable the hotword detector again.
		process.exit(1);
	});
	
	// Start file stream.
	let stream = fs.createWriteStream(`recording-${new Date().getTime()}.wav`, { encoding: `binary` });
	
	// Start streaming audio to stream.
	audioRecorder.stream().pipe(stream);
});

// Start detection.
hotwordDetector.start();