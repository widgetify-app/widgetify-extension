import browser from 'webextension-polyfill'

browser.runtime.onInstalled.addListener(() => {
	console.log('Extension installed')
})

browser.runtime.onStartup.addListener(() => {
	console.log('open')
})
