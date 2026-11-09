import infoEffect from '@/assets/sound-effects/alarm_info.mp3'
import islandEffect from '@/assets/sound-effects/island_chime.mp3'
type infoAlarmType = 'success' | 'done_todo' | 'reaction' | 'market' | 'info' | 'island'
let alarms: Record<infoAlarmType, string> = {
	success: 'https://cdn.widgetify.ir/effects/alarm-success.mp3',
	done_todo: 'https://cdn.widgetify.ir/effects/alarm_success_todo.mp3',
	reaction: 'https://cdn.widgetify.ir/effects/alarm_reaction.mp3',
	market: 'https://cdn.widgetify.ir/effects/alarm_market.mp3',
	info: '',
	island: '',
}

const bundled: Partial<Record<infoAlarmType, string>> = {
	info: infoEffect,
	island: islandEffect,
}

let audioCache: Partial<Record<infoAlarmType, HTMLAudioElement>> = {}

export async function playAlarm(type: infoAlarmType) {
	if (!audioCache[type]) {
		const alarm = bundled[type] ?? alarms[type]
		const audio = new Audio(alarm)
		audio.preload = 'auto'
		audioCache[type] = audio
		await new Promise((resolve) => {
			audio.addEventListener('canplaythrough', resolve, { once: true })
			audio.addEventListener('error', resolve, { once: true })
		})
	}
	const audio = audioCache[type]
	audio.currentTime = 0
	await audio.play()
}
