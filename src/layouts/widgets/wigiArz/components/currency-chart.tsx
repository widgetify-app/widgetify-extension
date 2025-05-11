import type { PriceHistory } from '@/services/hooks/currency/getCurrencyByCode.hook'
import {
	CategoryScale,
	type ChartData,
	Chart as ChartJS,
	type ChartOptions,
	Legend,
	LineElement,
	LinearScale,
	PointElement,
	Title,
	Tooltip,
} from 'chart.js'
import { Line } from 'react-chartjs-2'

ChartJS.register(
	CategoryScale,
	LinearScale,
	PointElement,
	LineElement,
	Title,
	Tooltip,
	Legend,
)

interface CurrencyChartProp {
	priceHistory: PriceHistory[]
}

export function CurrencyChart({ priceHistory }: CurrencyChartProp) {
	const chartData: ChartData = {
		labels: priceHistory?.map((entry: any) => entry.createdAt) || [],
		datasets: [
			{
				label: 'Price History',
				data: priceHistory?.map((entry: any) => entry.price) || [],
				borderColor: 'rgba(75, 192, 192, 1)',
				backgroundColor: 'rgba(75, 192, 192, 0.2)',
				tension: 0.4,
				fill: true,

				pointRadius: 2,
				pointStyle: 'star',
				animation: {
					delay: 600,
					duration: 1000,
					easing: 'easeInOutQuart',
				},
				pointBackgroundColor: 'rgba(75, 192, 192, 1)',
			},
		],
	}

	const chartOptions: ChartOptions = {
		responsive: true,
		maintainAspectRatio: false,
		scales: {
			x: {
				grid: {
					display: false,
				},
				ticks: {
					//@ts-ignore
					color: (theme: { dark: any }) => (theme.dark ? '#ffffff' : '#666666'),
					font: {
						size: 8,
						weight: 'bold',
					},
					align: 'start',
				},
				reverse: true,
			},
			y: {
				position: 'right',
				grid: {
					//@ts-ignore
					color: (theme: { dark: any }) =>
						theme.dark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)',
				},
				ticks: {
					//@ts-ignore
					color: (theme: { dark: any }) => (theme.dark ? '#ffffff' : '#666666'),
					font: {
						size: 10,
						weight: 'bold',
					},
					align: 'inner',
				},
			},
		},
		plugins: {
			legend: {
				display: false,
			},
			tooltip: {
				backgroundColor: 'rgba(0, 0, 0, 0.7)',
				titleColor: '#ffffff',
				bodyColor: '#ffffff',
				borderColor: 'rgba(75, 192, 192, 1)',
				borderWidth: 1,
			},
		},
	}
	// @ts-ignore
	return <Line className="w-full" data={chartData} options={chartOptions} />
}
