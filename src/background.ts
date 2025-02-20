import browser from 'webextension-polyfill'

// console.log("Hello from the background!");

// browser.runtime.onInstalled.addListener((details) => {
//   console.log("Extension installed:", details);
// });

browser.runtime.onInstalled.addListener(() => {
	browser.alarms.create('keepAlive', { periodInMinutes: 1 })
})

browser.alarms.onAlarm.addListener((alarm) => {
	if (alarm.name === 'keepAlive') {
		console.log('Extension is active')
	}
})

browser.tabs.onCreated.addListener((tab) => {
	console.log('New tab opened:', tab)
})

browser.runtime.onStartup.addListener(() => {
	console.log('open')
})
