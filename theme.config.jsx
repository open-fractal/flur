import { Header } from '@/components/Header'

export default {
	logo: <span>Flur Docs</span>,
	project: {
		link: 'https://github.com/open-fractal/flur'
	},
	docsRepositoryBase: 'https://github.com/open-fractal/flur/tree/main',

	navbar: {
		component: () => <Header />
	},
	footer: {
		component: () => <></>
	},
	themeSwitch: {
		component: () => <></>
	},
	sidebar: {
		toggleButton: false
	}
}
