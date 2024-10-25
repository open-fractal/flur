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
	title: 'Flur',
	description: 'Developing open-source applications on Bitcoin using OP_CAT.',
	openGraph: {
		images: ['https://flur.gg/unfurl.jpeg'],
		url: 'https://flur.gg',
		title: 'Flur',
		description: 'Developing open-source applications on Bitcoin using OP_CAT.'
	}
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
	return (
		<html lang="en" className="dark">
			<body className={`${inter.className} [background:#000000] text-[#ffffff]`}>
				<div className="flex flex-col min-h-screen">
					<Header />
					<main className="flex-grow h-full flex flex-col">
						<div className="w-full h-full flex flex-grow max-w-[100vw] w-[100vw]">
							{/* Hide sidebar on mobile (< 768px) */}
							<div className="hidden md:flex md:flex-col border-r min-w-[300px] w-[300px] max-w-[300px]">
								<TokenBalances />
							</div>
							{/* Adjust max-width for mobile */}
							<div className="flex flex-col flex-grow w-full min-h-[calc(100vh-96px)] h-[calc(100vh-96px)] max-w-full md:max-w-[calc(100vw-300px)]">
								{children}
							</div>
						</div>
					</main>
					<Footer />
					<footer className="flex justify-center items-center py-4"></footer>
				</div>
				<Toaster />
				<Analytics />
			</body>
		</html>
	)
}
