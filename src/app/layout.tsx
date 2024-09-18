import './globals.css'
import { Inter } from 'next/font/google'
import React from 'react'
import { Toaster } from '@/components/ui/toaster'
import Header from '@/components/Header'
import { Analytics } from '@vercel/analytics/react'
const inter = Inter({ subsets: ['latin'] })
import { ThemeProvider } from '@/components/theme-provider'

export default function RootLayout({ children }: { children: React.ReactNode }) {
	return (
		<html lang="en">
			<head>
				<title>Flur – A Fractal Bitcoin company</title>
				<meta
					name="description"
					content="Developing applications and infrastructure on Fractal Bitcoin."
				/>
				<meta property="og:image" content="https://flur.gg/unfurl.jpeg" />
				<meta name="twitter:card" content="summary_large_image" />
				<meta property="twitter:image" content="https://flur.gg/unfurl.jpeg" />
			</head>
			<ThemeProvider attribute="class" defaultTheme="dark" disableTransitionOnChange>
				<body className={inter.className}>
					<div className="flex flex-col min-h-screen">
						<Header />
						<main className="flex-grow">{children}</main>
						<footer className="flex justify-center items-center py-4"></footer>
						<Toaster />
						<Analytics />
					</div>
				</body>
			</ThemeProvider>
		</html>
	)
}
