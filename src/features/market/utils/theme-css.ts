const THEME_ROOT = /^(:root(:has\(.*\))?|html|\[data-theme=["']?[\w-]+["']?\])$/
const SELECTOR_GROUP = /^:(is|where)\((.*)\)$/
const THEME_NAME = /^[\w-]+$/

export function isThemeRootSelector(selectorText: string): boolean {
	const trimmed = selectorText.trim()
	const list = trimmed.match(SELECTOR_GROUP)?.[2] ?? trimmed
	return list.split(',').every((part) => THEME_ROOT.test(part.trim()))
}

export function scopeThemeCss(css: string, theme: string): string {
	if (!THEME_NAME.test(theme)) return ''
	const sheet = new CSSStyleSheet()
	try {
		sheet.replaceSync(css)
	} catch {
		return ''
	}
	return rootDeclarations(sheet.cssRules)
		.map((declarations) => `[data-theme="${theme}"]{${declarations}}`)
		.join('')
}

function rootDeclarations(rules: CSSRuleList): string[] {
	return Array.from(rules).flatMap((rule) => {
		if (rule instanceof CSSStyleRule) {
			return isThemeRootSelector(rule.selectorText) ? [rule.style.cssText] : []
		}
		if (rule instanceof CSSGroupingRule && !(rule instanceof CSSMediaRule)) {
			return rootDeclarations(rule.cssRules)
		}
		return []
	})
}
