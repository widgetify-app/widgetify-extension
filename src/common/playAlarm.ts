import infoEffect from "@/assets/sound-effects/alarm_info.mp3"
type infoAlarmType = 'success' | 'done_todo' | 'reaction' | 'market' | 'info'
let alarms: Record<infoAlarmType, string> = {
	success: 'https://cdn.widgetify.ir/effects/alarm-success.mp3',
	done_todo: 'https://cdn.widgetfiy.ir/effects/alarm_success_todo.mp3',
	reaction: 'https://cdn.widgetfiy.ir/effects/alarm_reaction.mp3',
	market: 'https://cdn.widgetfiy.ir/effects/alarm_market.mp3',
	info: ""
}


let audioCache: Partial<Record<infoAlarmType, HTMLAudioElement>> = {}

export async function playAlarm(type: infoAlarmType) {
	if (!audioCache[type]) {

		const alarm = type === 'info' ? infoEffect : alarms[type]
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
