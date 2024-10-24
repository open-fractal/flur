import './globals.css'
import { Inter } from 'next/font/google'
import React from 'react'
import { Toaster } from '@/components/ui/toaster'
import { Header } from '@/components/Header'
import { Footer } from '@/components/footer'
import { Analytics } from '@vercel/analytics/react'
const inter = Inter({ subsets: ['latin'] })
import { Metadata } from 'next'
import { TokenBalances } from '@/components/token-balances'

export const metadata: Metadata = {
	title: 'Flur – A Fractal Bitcoin company',
	description: 'Developing applications and infrastructure on Fractal Bitcoin.',
	openGraph: {
		images: ['https://flur.gg/unfurl.jpeg'],
		url: 'https://flur.gg',
		title: 'Flur – A Fractal Bitcoin company',
		description: 'Developing applications and infrastructure on Fractal Bitcoin.'
	}
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
	return (
		<html lang="en" className="dark">
			<body className={`${inter.className} [background:#000000] text-[#ffffff]`}>
				<div className="flex flex-col min-h-screen">
					<Header />
					<main className="flex-grow h-full flex flex-col">
						<div className="w-full h-full flex flex-grow">
							<div className="flex flex-col border-r min-w-[300px] w-[300px] max-w-[300px]">
								{<TokenBalances />}
							</div>
							<div className="flex flex-col flex-grow min-h-full h-full">{children}</div>
						</div>
					</main>
					<Footer />
					<footer className="flex justify-center items-center py-4"></footer>
				</div>
				{/* Move Toaster and Analytics inside the body */}
				<Toaster />
				<Analytics />
			</body>
		</html>
	)
}
