// Only available for MacOS (darwin) and various Linux distro`s.
const os = require(`os`);
if ([`darwin`, `linux`].indexOf(os.platform()) > -1) {
	console.log(`Compatible!`);
	// TODO: Run hot word detector program from here.
} else {
	console.warn(`The operating system does not meet the requirements to run the hotword detection library.`);
}