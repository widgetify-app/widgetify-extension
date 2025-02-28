import browser from 'webextension-polyfill'
import { setToStorage } from './common/storage'
import { StoreKey } from './common/constant/store.key'

browser.runtime.onInstalled.addListener(async (details) => {
	console.log('Extension installed')
	if (details.reason === 'install') {
		await setToStorage(StoreKey.Show_Welcome_Modal, true)
	}
})

browser.runtime.onStartup.addListener(() => {
	console.log('open')
})
