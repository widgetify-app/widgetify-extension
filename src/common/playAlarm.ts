type infoAlarmType = 'success' | 'done_todo'
let alarms: Record<infoAlarmType, string> = {
	success: 'https://cdn.widgetify.ir/effects/alarm-success.mp3',
	done_todo:
		'https://widgetify-ir.storage.c2.liara.space/effects/alarm_success_todo.mp3',
}
let audioCache: Partial<Record<infoAlarmType, HTMLAudioElement>> = {}

export async function playAlarm(type: infoAlarmType) {
	if (!audioCache[type]) {
		const alarm = alarms[type]
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
