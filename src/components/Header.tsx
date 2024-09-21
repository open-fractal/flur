'use client'

import React, { useCallback, useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'
import { Copy, Github, Menu, Search, X, Twitter } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'
import { useWallet } from '@/lib/unisat'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useRouter } from 'next/navigation'
import '@/app/globals.css'
import { useTheme } from 'next-themes'
import { Input } from '@/components/ui/input'
import { Sheet, SheetContent, SheetTrigger, SheetClose } from '@/components/ui/sheet'
import { validateTokenId } from '@/lib/utils'

const truncateAddress = (address: string) => {
	return `${address.slice(0, 4)}...${address.slice(-4)}`
}

// Define an array of tab items
const tabItems = [
	{ value: '/', label: 'Mint' },
	{ value: '/create', label: 'Deploy' },
	{ value: '/docs', label: 'Docs' }
	// Add more tabs here as needed
]

export const Header: React.FC = () => {
	const [searchInput, setSearchInput] = useState('')
	const {
		address,
		setAddress,
		isWalletConnected,
		setIsWalletConnected,
		balance,
		updateBalance
	} = useWallet()
	const { toast } = useToast()
	const pathname = usePathname()
	const router = useRouter()

	const { setTheme } = useTheme()

	useEffect(() => {
		setTheme('dark')
	}, [setTheme])

	const connectWallet = useCallback(async () => {
		if (typeof window.unisat !== 'undefined') {
			try {
				const accounts = await window.unisat.requestAccounts()
				setIsWalletConnected(true)
				setAddress(accounts[0])
				updateBalance() // Update balance after connecting
			} catch (error) {
				console.error('Error connecting wallet:', error)
			}
		} else {
			alert('Unisat wallet not detected. Please install the extension.')
		}
	}, [setIsWalletConnected, setAddress, updateBalance])

	const disconnectWallet = useCallback(() => {
		setIsWalletConnected(false)
		setAddress('')
	}, [setIsWalletConnected, setAddress])

	const copyAddress = () => {
		navigator.clipboard.writeText(address).then(() => {
			toast({
				title: 'Address Copied!',
				description: 'Your wallet address has been copied to clipboard'
			})
		})
	}

	const formatBalance = (balance: { total: number }) => {
		const fb = balance.total / 1e8
		if (fb < 0.001) {
			return fb.toFixed(6) // Show more precision for very small amounts
		} else {
			return fb.toLocaleString(undefined, {
				minimumFractionDigits: 3,
				maximumFractionDigits: 3
			})
		}
	}

	const handleSearch = (e: React.FormEvent) => {
		e.preventDefault()

		const trimmedInput = searchInput.trim()

		if (validateTokenId(trimmedInput)) {
			router.push(`/token/${trimmedInput}`)
			setSearchInput('')
		} else {
			toast({
				title: 'Invalid Token ID',
				description: 'Please enter a valid token ID',
				variant: 'destructive'
			})
		}
	}

	const [isSheetOpen, setIsSheetOpen] = useState(false)

	// Function to determine the active tab
	const getActiveTab = useCallback(() => {
		if (pathname === '/') {
			return '/'
		}
		return tabItems.find(tab => pathname?.startsWith(tab.value) && tab.value !== '/')?.value || '/'
	}, [pathname])

	return (
		<>
			<div className="h-16"></div>
			<header className="h-16 bg-black border-b border-[hsl(var(--border))] flex items-center justify-between px-4 sm:px-8 fixed top-0 w-[100vw] z-50">
				<div className="flex items-center gap-4 sm:gap-8">
					<Link href="/">
						<img src="/logo.svg" alt="Logo" width={84} height={30} />
					</Link>
					<Tabs value={getActiveTab()} className="hidden sm:block">
						<TabsList>
							{tabItems.map(tab => (
								<TabsTrigger key={tab.value} value={tab.value} asChild>
									<Link
										href={tab.value}
										className="hover:text-white transition-colors duration-200"
									>
										{tab.label}
									</Link>
								</TabsTrigger>
							))}
						</TabsList>
					</Tabs>
				</div>
				<div className="hidden sm:flex items-center gap-4">
					<form onSubmit={handleSearch} className="relative">
						<Input
							type="text"
							placeholder="Search contracts..."
							value={searchInput}
							onChange={e => setSearchInput(e.target.value)}
							className="w-[200px] pl-8"
						/>
						<div className="absolute left-2 top-1/2 transform -translate-y-1/2">
							<Search className="h-4 w-4 text-muted-foreground" />
						</div>
					</form>
					{isWalletConnected ? (
						<DropdownMenu>
							<DropdownMenuTrigger asChild>
								<Button variant="outline">
									{truncateAddress(address)}
									<span className="ml-2">({formatBalance(balance)} FB)</span>
								</Button>
							</DropdownMenuTrigger>
							<DropdownMenuContent>
								<DropdownMenuItem onClick={copyAddress}>
									<Copy className="mr-2 h-4 w-4" />
									Copy Address
								</DropdownMenuItem>
								<DropdownMenuItem onClick={disconnectWallet}>Disconnect Wallet</DropdownMenuItem>
							</DropdownMenuContent>
						</DropdownMenu>
					) : (
						<Button onClick={connectWallet} className="transition-ease-in-out">
							Connect Wallet
						</Button>
					)}
					<div className="flex items-center gap-4">
						<a
							href="https://github.com/open-fractal/flur"
							target="_blank"
							rel="noopener noreferrer"
							className="text-gray-600 hover:text-white transition-all ease-in-out duration-300 transform hover:scale-110"
						>
							<Github size={16} />
						</a>
						<a
							href="https://x.com/Flur69"
							target="_blank"
							rel="noopener noreferrer"
							className="text-gray-600 hover:text-white transition-all ease-in-out duration-300 transform hover:scale-110"
						>
							<Twitter size={16} />
						</a>
					</div>
				</div>
				<Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
					<SheetTrigger asChild>
						<Button variant="ghost" size="icon" className="sm:hidden">
							<Menu className="h-6 w-6" />
						</Button>
					</SheetTrigger>
					<SheetContent side="right" className="w-[300px] sm:w-[400px]">
						<div className="flex flex-col gap-6">
							<div className="flex justify-between items-center">
								<Link href="/" onClick={() => setIsSheetOpen(false)}>
									<img src="/logo.svg" alt="Logo" width={84} height={30} />
								</Link>
								<SheetClose asChild>
									<Button variant="ghost" size="icon">
										<X className="h-6 w-6" />
									</Button>
								</SheetClose>
							</div>
							<Tabs value={getActiveTab()} className="w-full">
								<TabsList className="w-full">
									{tabItems.map(tab => (
										<TabsTrigger key={tab.value} value={tab.value} asChild className="flex-1">
											<Link
												href={tab.value}
												onClick={() => setIsSheetOpen(false)}
												className="w-full"
											>
												{tab.label}
											</Link>
										</TabsTrigger>
									))}
								</TabsList>
							</Tabs>

							<form onSubmit={handleSearch} className="relative">
								<Input
									type="text"
									placeholder="Search contracts..."
									value={searchInput}
									onChange={e => setSearchInput(e.target.value)}
									className="w-full pl-8"
								/>
								<div className="absolute left-2 top-1/2 transform -translate-y-1/2">
									<Search className="h-4 w-4 text-muted-foreground" />
								</div>
							</form>

							{isWalletConnected ? (
								<div className="flex flex-col gap-2">
									<Button variant="outline" onClick={copyAddress}>
										<Copy className="mr-2 h-4 w-4" />
										Copy Address: {truncateAddress(address)}
									</Button>
									<div className="text-center">Balance: {formatBalance(balance)} FB</div>
									<Button onClick={disconnectWallet}>Disconnect Wallet</Button>
								</div>
							) : (
								<Button onClick={connectWallet}>Connect Wallet</Button>
							)}

							<div className="flex justify-center gap-4">
								<a
									href="https://github.com/open-fractal/flur"
									target="_blank"
									rel="noopener noreferrer"
									className="text-gray-600 hover:text-white transition-all ease-in-out duration-300 transform hover:scale-110"
								>
									<Github size={24} />
								</a>
								<a
									href="https://x.com/Flur69"
									target="_blank"
									rel="noopener noreferrer"
									className="text-gray-600 hover:text-white transition-all ease-in-out duration-300 transform hover:scale-110"
								>
									<Twitter size={24} />
								</a>
							</div>
						</div>
					</SheetContent>
				</Sheet>
			</header>
		</>
	)
}
