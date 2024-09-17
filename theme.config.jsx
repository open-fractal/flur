import Header from '@/components/Header'

export default {
	logo: <span>Flur Docs</span>,
	project: {
		link: 'https://github.com/open-fractal/flur'
	},
	navbar: {
		component: () => <Header />
	}
}
