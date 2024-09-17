import React, { useContext, useCallback } from 'react'
import useSWR from 'swr'
import { Button } from '@/components/ui/button'
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'
import { Copy, Github } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'
import { WalletContext } from '@/app/layout'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import '@/app/globals.css'

const fetcher = (url: string) => fetch(url).then(res => res.json())

const truncateAddress = (address: string) => {
	return `${address.slice(0, 4)}...${address.slice(-4)}`
}

const Header: React.FC = () => {
	const { address, setAddress, isWalletConnected, setIsWalletConnected } = useContext(WalletContext)
	const { toast } = useToast()
	const pathname = usePathname()

	const { data: balanceData, error: balanceError } = useSWR(
		isWalletConnected ? `https://utxo-detective-fractal.twetch.app/balance/${address}?v=1` : null,
		fetcher
	)

	const connectWallet = useCallback(async () => {
		if (typeof window.unisat !== 'undefined') {
			try {
				const accounts = await window.unisat.requestAccounts()
				setIsWalletConnected(true)
				setAddress(accounts[0])
			} catch (error) {
				console.error('Error connecting wallet:', error)
			}
		} else {
			alert('Unisat wallet not detected. Please install the extension.')
		}
	}, [setIsWalletConnected, setAddress])

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

	const formatBalance = (satoshis: number) => {
		return (satoshis / 1e8).toFixed(2)
	}

	const isDocsPage = pathname?.startsWith('/docs')

	return (
		<>
			<div className="h-16"></div>
			<header className="h-16 bg-black border-b border-[hsl(var(--border))] flex items-center justify-between px-8 fixed top-0 w-[100vw] z-50">
				<div className="flex items-center gap-8">
					<img src="/logo.svg" alt="Logo" width={84} height={30} />
					<Tabs value={pathname === '/docs' ? '/docs' : '/'}>
						<TabsList>
							<TabsTrigger value="/" asChild>
								<Link href="/">Explore</Link>
							</TabsTrigger>
							<TabsTrigger value="/docs" asChild>
								<Link href="/docs">Docs</Link>
							</TabsTrigger>
						</TabsList>
					</Tabs>
				</div>
				<div className="flex items-center gap-4">
					<a
						href="https://github.com/open-fractal/flur"
						target="_blank"
						rel="noopener noreferrer"
						className="text-gray-600 hover:text-gray-900 transition-colors"
					>
						<Github size={24} />
					</a>
					{!isDocsPage &&
						(isWalletConnected ? (
							<DropdownMenu>
								<DropdownMenuTrigger asChild>
									<Button variant="outline">
										{truncateAddress(address)}
										{balanceData && !balanceError && (
											<span className="ml-2">({formatBalance(balanceData.satoshis)} FB)</span>
										)}
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
							<Button onClick={connectWallet}>Connect Wallet</Button>
						))}
				</div>
			</header>
		</>
	)
}

export default Header
