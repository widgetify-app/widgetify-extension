import type { VipPlan } from '@/services/market/market-vip.interface'

const DAYS_PER_MONTH = 30
const DAY_MS = 24 * 60 * 60 * 1000

export interface PlanOffer {
	plan: VipPlan
	months: number
	monthlyPrice: number | null
	fullPrice: number | null
	discountPercent: number
	savings: number
	isBestValue: boolean
}

function monthsIn(days: number): number {
	return Math.max(1, Math.round(days / DAYS_PER_MONTH))
}

export function isGiftPlan(plan: VipPlan): boolean {
	return plan.price === 0
}

export function toPlanOffers(plans: VipPlan[]): PlanOffer[] {
	const paid = plans.filter((plan) => plan.price > 0 && plan.days > 0)
	const shortest = paid.reduce<VipPlan | null>(
		(best, plan) => (!best || plan.days < best.days ? plan : best),
		null
	)
	const listMonthlyPrice = shortest ? shortest.price / monthsIn(shortest.days) : 0

	const offers = paid.map((plan): PlanOffer => {
		const months = monthsIn(plan.days)
		const fullPrice = Math.round(listMonthlyPrice * months)
		const discountPercent = Math.round((1 - plan.price / fullPrice) * 100)
		const isDiscounted = plan !== shortest && discountPercent >= 1
		return {
			plan,
			months,
			monthlyPrice: plan.days >= DAYS_PER_MONTH ? plan.price / months : null,
			fullPrice: isDiscounted ? fullPrice : null,
			discountPercent: isDiscounted ? discountPercent : 0,
			savings: isDiscounted ? fullPrice - plan.price : 0,
			isBestValue: false,
		}
	})

	const best = offers.reduce<PlanOffer | null>(
		(top, offer) =>
			offer.discountPercent > (top?.discountPercent ?? 0) ? offer : top,
		null
	)
	return offers.map((offer) => ({ ...offer, isBestValue: offer === best }))
}

export function defaultOffer(offers: PlanOffer[]): PlanOffer | null {
	return (
		offers.find((offer) => Boolean(offer.plan.meta?.badge)) ??
		offers.find((offer) => offer.isBestValue) ??
		offers[0] ??
		null
	)
}

export function dailyPriceCeiling(offers: PlanOffer[]): number | null {
	if (offers.length === 0) return null
	const cheapestDaily = Math.min(
		...offers.map((offer) => offer.plan.price / offer.plan.days)
	)
	return Math.floor(cheapestDaily / 1000) + 1
}

export function extendedUntil(
	expiresAt: string | null | undefined,
	days: number,
	now: Date
): Date {
	const current = expiresAt ? new Date(expiresAt).getTime() : Number.NaN
	const start = Number.isNaN(current) ? now.getTime() : Math.max(current, now.getTime())
	return new Date(start + days * DAY_MS)
}

export function inThousands(toman: number): number {
	return Math.round(toman / 1000)
}
