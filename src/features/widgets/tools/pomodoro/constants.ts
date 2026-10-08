import { t } from '@/common/i18n'
import type { TimerMode } from './types'

export const modeFullLabels: Record<TimerMode, string> = {
	work: t('widgets.pomodoro.settings.workLabel'),
	'short-break': t('widgets.pomodoro.mode.shortBreak'),
}

export const ALARM_SOUND_URL = 'https://cdn.widgetify.ir/effects/alarm_1.mp3'
