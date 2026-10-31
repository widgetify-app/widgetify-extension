interface PricedPlan {
	price: number
	days: number
}

const MONTH_DAYS = 30
const PRICE_STEP = 1000

export function monthlyPrice(plan: PricedPlan): number {
	if (plan.days <= 0) return plan.price
	return Math.round((plan.price / plan.days) * (MONTH_DAYS / PRICE_STEP)) * PRICE_STEP
}

export function findMonthlyPlan<T extends PricedPlan>(plans: T[]): T | undefined {
	return plans.find((plan) => plan.price > 0 && plan.days >= 28 && plan.days <= 31)
}

export function savingPercent(plan: PricedPlan, monthly: PricedPlan | undefined): number {
	if (!monthly || plan === monthly || plan.price <= 0 || plan.days <= 0) return 0
	const perDay = plan.price / plan.days
	const monthlyPerDay = monthly.price / monthly.days
	return Math.max(0, Math.round((1 - perDay / monthlyPerDay) * 100))
}
