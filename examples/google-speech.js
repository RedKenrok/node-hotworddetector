// Requires the node-audiorecorder and @google-cloud/speech modules to be installed.

// Only available for MacOS (darwin) and various Linux distro`s.
const os = require(`os`);
if ([`darwin`, `linux`].indexOf(os.platform()) > -1) {
	// Dependency modules.
	const AudioRecorder = require(`node-audiorecorder`),
		HotwordDetector = require(`../library`);
	const GoogleSpeech = require(`@google-cloud/speech`);

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
	// Options Google-Cloud Speech API.
	const speech = new GoogleSpeech.SpeechClient({
		keyFilename: `KEYPATH_GOOGLECLOUD`
	}); // TODO: Add path to file.
	const speechRequest = {
		config: {
			encoding: `LINEAR16`,
			sampleRateHertz: 16000,
			languageCode: `en-GB`
		},
		interimResults: false
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
		
		// Start Google-Cloud Speech API web stream.
		let stream = speech.streamingRecognize(speechRequest)
			.on(`error`, console.error)
			.on(`data`, function(data) {
				console.log(`Transcript: '${data.results[0].alternatives[0].transcript}'.`);
			});
		
		// Start streaming audio to web stream.
		audioRecorder.stream().pipe(stream);
	});

	// Start detection.
	hotwordDetector.start();
} else {
	console.warn(`The operating system does not meet the requirements to run the hotword detection library.`);
}