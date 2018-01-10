# Hotword detector
Hotword detector for [Node.js](https://nodejs.org/) using [Snowboy](https://snowboy.kitt.ai/) by [Kitt.ai](https://kitt.ai/). Snowboy is an offline neural network driven hotword detection library, with compatibility only on MacOS (darwin) and most Linux distro's. This module aims to simplify and improve the standard [snowboy module](https://github.com/Kitt-AI/snowboy) by turning it into one single interface with build-in microphone recording and by adding start, stop, pause, and resume functionality.

## Installation
```
npm install --save node-hotworddetector
```

## Dependencies
This module uses snowboy, therefore it requires a some resources before hand please see the [official website](https://snowboy.kitt.ai/) for these resources.

The module also uses the [node-audiorecording](https://github.com/RedKenrok/node-audiorecording) module. It requires you to have [SoX](http://sox.sourceforge.net/) installed and it must be available in your $PATH. For more information see the [node-audiorecording](https://github.com/RedKenrok/node-audiorecording) module.

## Usage

### Constructor
```javascript
// Import module.
const HotwordDetector = require('node-hotworddetector');

// Array of data for each hotword model.
// See the 'snowboy' module for more information.
const modelData = [
  {
    file: './node_modules/snowboy/resources/snowboy.umdl',
    hotwords : 'snowboy'
  }
];
// Detector data.
// See the 'snowboy' module for more information.
const detectorData = {
  resource: './node_modules/snowboy/resources/common.res'
};
// Optional parameter to select the recording options.
// See the 'node-audiorecording' module for more information.
const recorderData = {};
// Optional parameter intended for debugging.
// The object has to implement a log and warn function.
const logger = {
  log: console.log,
  warn: console.warn
};

// Create an instance.
let hotwordDetector = new HotwordDetector(modelData, detectorData, recorderData, logger);
```

> More information about [audio recording options](https://github.com/RedKenrok/node-audiorecorder#constructor).

### Methods
```javascript
// Creates the detector and starts the recording process.
hotwordDetector.Start();
// Stops the detection process and removes the recording process.
hotwordDetector.Stop();
// Stops the detection process.
hotwordDetector.Pause();
// Starts the detection process.
hotwordDetector.Resume();
```

### Events
```javascript
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
});
// Triggered when there is no audible sound being recorded.
hotwordDetector.on('silence', function() {
  console.log('hotwordDetector: silence');
});
// Triggered when there is audible sound being recorded.
hotwordDetector.on('sound', function(buffer) {
  // Buffer is the most recent section from the audio buffer.
  console.log('hotwordDetector: sound: ' + buffer);
});
```

### Example
```javascript
// Only available for MacOS(darwin) and various Linux distro's.
const os = require('os');
if (['darwin', 'linux'].indexOf(os.platform()) > -1) {
  // Imports module.
  const HotwordDetector = require('node-hotworddetector');
  // Initialize detector.
  const hotwordDetector = new HotwordDetector([
    {
      file: './relative/path/to/model.umdl',
      hotwords : 'model',
      sensitivity: '0.5',
    }
  ], {
    resource: './relative/path/to/common.res',
    audioGain: 2
  }, console);
  
  // Listen to 'hotword' event.
  hotwordDetector.on('hotword', function(index, hotword, buffer) {
	// Do something...
  });
  
  // Start recording and detecting.
  hotwordDetector.start();
}
```

> For another example see the [Electron-VoiceInterfacePrototype](https://github.com/RedKenrok/Electron-VoiceInterfacePrototype)'s input.js.
