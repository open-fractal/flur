'use client'

import React, { useCallback, useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'
import { Copy, Github, Menu, Search, X, Twitter, InfoIcon } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'
import { useWallet } from '@/lib/unisat'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useRouter } from 'next/navigation'
import '@/app/globals.css'
import { useTheme } from 'next-themes'
import { Input } from '@/components/ui/input'
import { Sheet, SheetContent, SheetTrigger, SheetClose } from '@/components/ui/sheet'
import { validateTokenId } from '@/lib/utils'
import {
	NavigationMenu,
	NavigationMenuItem,
	NavigationMenuLink,
	NavigationMenuList
} from '@/components/ui/navigation-menu'
import { cn } from '@/lib/utils'
import { useFXPClaims } from '@/hooks/use-fxp-claims'
import { FXP_TOKEN_ID } from '@/lib/constants'
import { HoverCard, HoverCardContent, HoverCardTrigger } from '@/components/ui/hover-card'

const truncateAddress = (address: string) => {
	return `${address.slice(0, 4)}...${address.slice(-4)}`
}

const customNavigationMenuTriggerStyle = () => {
	return cn(
		'group inline-flex h-8 w-auto items-center justify-center m-3 px-0 py-2 text-sm font-medium transition-colors focus:outline-none disabled:pointer-events-none disabled:opacity-50',
		'bg-transparent',
		'hover:bg-transparent'
	)
}

export const Header: React.FC = () => {
	const { claimCount } = useFXPClaims()
	const [searchInput, setSearchInput] = useState('')
	const {
		address,
		isWalletConnected,
		balance,
		updateBalance,
		disconnectWallet,
		connectWallet
	} = useWallet()
	const { toast } = useToast()
	const pathname = usePathname()
	const router = useRouter()

	const { setTheme } = useTheme()

	useEffect(() => {
		setTheme('dark')
	}, [setTheme])

	const handleConnectWallet = useCallback(async () => {
		try {
			await connectWallet()
			await updateBalance()
		} catch (error) {
			console.error('Error connecting wallet:', error)
			toast({
				title: 'Connection Failed',
				description: 'Failed to connect to wallet. Please try again.',
				variant: 'destructive'
			})
		}
	}, [connectWallet, updateBalance, toast])

	const handleDisconnectWallet = useCallback(() => {
		disconnectWallet() // Use the new disconnectWallet function
	}, [disconnectWallet])

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

	const isActive = (path: string) => {
		if (path === '/' && pathname === '/') return true
		if (path !== '/' && pathname?.startsWith(path)) return true
		return false
	}

	const activeItemStyle = 'text-white border-b-2 border-white'
	const inactiveItemStyle = 'text-gray-400 hover:text-white'

	return (
		<>
			<div className="h-16"></div>
			<header className="h-16 bg-black border-b border-[hsl(var(--border))] flex items-center justify-between px-4 sm:px-8 fixed top-0 w-[100vw] z-50">
				<div className="flex items-center gap-4 sm:gap-8">
					<Link href="/">
						<img src="/logo.svg" alt="Logo" width={84} height={30} />
					</Link>
					<NavigationMenu className="hidden sm:block">
						<NavigationMenuList className="flex">
							<NavigationMenuItem>
								<Link href="/" legacyBehavior passHref>
									<NavigationMenuLink
										className={cn(
											customNavigationMenuTriggerStyle(),
											isActive('/') ? activeItemStyle : inactiveItemStyle,
											'whitespace-nowrap'
										)}
									>
										Mint
									</NavigationMenuLink>
								</Link>
							</NavigationMenuItem>
							<NavigationMenuItem>
								<Link href="/create" legacyBehavior passHref>
									<NavigationMenuLink
										className={cn(
											customNavigationMenuTriggerStyle(),
											isActive('/create') ? activeItemStyle : inactiveItemStyle,
											'whitespace-nowrap'
										)}
									>
										Deploy
									</NavigationMenuLink>
								</Link>
							</NavigationMenuItem>
							<NavigationMenuItem>
								<Link href="/docs" legacyBehavior passHref>
									<NavigationMenuLink
										className={cn(
											customNavigationMenuTriggerStyle(),
											isActive('/docs') ? activeItemStyle : inactiveItemStyle,
											'whitespace-nowrap'
										)}
									>
										Docs
									</NavigationMenuLink>
								</Link>
							</NavigationMenuItem>
							<NavigationMenuItem>
								<Link href="https://store.flur.gg" legacyBehavior passHref>
									<NavigationMenuLink
										className={cn(
											customNavigationMenuTriggerStyle(),
											inactiveItemStyle,
											'whitespace-nowrap'
										)}
										target="_blank"
										rel="noopener noreferrer"
									>
										Store
									</NavigationMenuLink>
								</Link>
							</NavigationMenuItem>
						</NavigationMenuList>
					</NavigationMenu>
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
						<>
							<HoverCard>
								<HoverCardTrigger asChild>
									<div className="flex items-center">
										<Link href={`/token/${FXP_TOKEN_ID}`}>
											<Button variant="outline" className="flex items-center gap-2">
												FXP Claims: {claimCount}
												<InfoIcon className="h-4 w-4 text-muted-foreground" />
											</Button>
										</Link>
									</div>
								</HoverCardTrigger>
								<HoverCardContent className="w-80">
									<div className="space-y-2">
										<h4 className="text-sm font-semibold">FXP Claims</h4>
										<p className="text-sm">
											Flur Experience Points (FXP) can be claimed or minted by users that complete
											trades.
										</p>
										<a
											href="/docs/FXP"
											target="_blank"
											rel="noopener noreferrer"
											className="text-sm text-blue-500 hover:text-blue-600 mt-4 transition-colors"
										>
											Learn More
										</a>
									</div>
								</HoverCardContent>
							</HoverCard>
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
									<DropdownMenuItem onClick={handleDisconnectWallet}>
										Disconnect Wallet
									</DropdownMenuItem>
								</DropdownMenuContent>
							</DropdownMenu>
						</>
					) : (
						<Button onClick={handleConnectWallet}>Connect Wallet</Button>
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
							<NavigationMenu orientation="vertical" className="w-full">
								<NavigationMenuList className="flex-col items-start space-y-2">
									<NavigationMenuItem className="w-full">
										<Link href="/" legacyBehavior passHref>
											<NavigationMenuLink
												className={cn(
													customNavigationMenuTriggerStyle(),
													'justify-start w-full',
													isActive('/') ? activeItemStyle : inactiveItemStyle,
													'whitespace-nowrap'
												)}
												onClick={() => setIsSheetOpen(false)}
											>
												Mint
											</NavigationMenuLink>
										</Link>
									</NavigationMenuItem>
									<NavigationMenuItem className="w-full">
										<Link href="/create" legacyBehavior passHref>
											<NavigationMenuLink
												className={cn(
													customNavigationMenuTriggerStyle(),
													'justify-start w-full',
													isActive('/create') ? activeItemStyle : inactiveItemStyle,
													'whitespace-nowrap'
												)}
												onClick={() => setIsSheetOpen(false)}
											>
												Deploy
											</NavigationMenuLink>
										</Link>
									</NavigationMenuItem>
									<NavigationMenuItem className="w-full">
										<Link href="/docs" legacyBehavior passHref>
											<NavigationMenuLink
												className={cn(
													customNavigationMenuTriggerStyle(),
													'justify-start w-full',
													isActive('/docs') ? activeItemStyle : inactiveItemStyle,
													'whitespace-nowrap'
												)}
												onClick={() => setIsSheetOpen(false)}
											>
												Docs
											</NavigationMenuLink>
										</Link>
									</NavigationMenuItem>
									<NavigationMenuItem className="w-full">
										<Link href="https://store.flur.gg" legacyBehavior passHref>
											<NavigationMenuLink
												className={cn(
													customNavigationMenuTriggerStyle(),
													'justify-start w-full',
													inactiveItemStyle,
													'whitespace-nowrap'
												)}
												onClick={() => setIsSheetOpen(false)}
												target="_blank"
												rel="noopener noreferrer"
											>
												Store
											</NavigationMenuLink>
										</Link>
									</NavigationMenuItem>
								</NavigationMenuList>
							</NavigationMenu>

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
									<Button onClick={handleDisconnectWallet}>Disconnect Wallet</Button>
								</div>
							) : (
								<Button onClick={handleConnectWallet}>Connect Wallet</Button>
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
