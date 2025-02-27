import browser from 'webextension-polyfill'

browser.runtime.onInstalled.addListener(() => {
	console.log('Extension installed')
})

browser.tabs.onCreated.addListener((tab) => {
	console.log('New tab opened:', tab)
})

browser.runtime.onStartup.addListener(() => {
	console.log('open')
})
