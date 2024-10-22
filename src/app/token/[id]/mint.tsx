'use client'

import React, { useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Button } from '@/components/ui/button'
import { useMint } from '@/hooks/use-mint'
import { TokenData } from '@/hooks/use-token'
import { HoverCard, HoverCardContent, HoverCardTrigger } from '@/components/ui/hover-card'
import { InfoIcon } from 'lucide-react'
import { useWallet, getBitcoinUtxoCount } from '@/lib/unisat'
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog'
import { SplitUTXOs } from '@/components/split-utxos'
import useSWR from 'swr'
import { MinterType } from '@/lib/scrypt/common'
import { useFXPClaims } from '@/hooks/use-fxp-claims'
import { useFXPMint } from '@/hooks/use-fxp-mint'
import { useTokenMintCount } from '@/hooks/use-token-mint-count'
import { FxpRewardsModal } from '@/components/fxp-rewards-modal'

interface MintProps {
	token: TokenData
	utxoCount: number | undefined
	isUtxoCountLoading: boolean
}

const Mint: React.FC<MintProps> = ({ token, utxoCount, isUtxoCountLoading }) => {
	const { isMinting, handleMint } = useMint(token.tokenId)
	const { mintCount: tokenMintCount } = useTokenMintCount(token.tokenId)
	const [isSplitDialogOpen, setIsSplitDialogOpen] = useState(false)
	const { address } = useWallet()
	const [isFxpRewardsModalOpen, setIsFxpRewardsModalOpen] = useState(false)
	const [fxpRewardsAmount, setFxpRewardsAmount] = useState(0)
	const [fxpRewardsTxId, setFxpRewardsTxId] = useState('')

	// @ts-ignore
	const isFXP = MinterType.FXP_OPEN_MINTER === token.info.minterMd5

	const { claimCount } = useFXPClaims()
	const { handleMint: handleFXPMint, isMinting: isFXPMinting } = useFXPMint(token.tokenId)

	// SWR hook for wallet UTXO count
	const { data: walletUtxoCount } = useSWR(
		address ? ['walletUtxoCount', address] : null,
		async () => {
			if (!address) return null
			return await getBitcoinUtxoCount()
		}
	)

	// Safely parse numeric values
	const maxSupply = safeParseInt(token.info?.max)
	const mintCount = isFXP ? tokenMintCount : token?.supply / Math.pow(10, token.decimals)
	const currentSupply = mintCount as number
	const mintProgress = maxSupply > 0 ? ((currentSupply / maxSupply) * 100).toFixed(2) : '0.00'
	const isMintable = currentSupply < maxSupply && !!utxoCount && utxoCount > 0

	return (
		<Card className="w-[400px] max-w-[100vw]">
			<CardContent className="p-6 space-y-4">
				<div>
					<div className="flex justify-between">
						<p className="text-sm font-medium mb-1">Mint Progress: {mintProgress}%</p>
					</div>
					<Progress value={parseFloat(mintProgress)} className="w-full" />
				</div>
				{/* @ts-ignore */}
				{token.info.minterMd5 !== MinterType.FXP_OPEN_MINTER && (
					<div>
						<p className="text-sm font-medium">Supply</p>
						<p className="text-sm font-medium mb-1 text-muted-foreground">
							{currentSupply.toLocaleString()}/{maxSupply.toLocaleString()}
						</p>
					</div>
				)}
				{/* @ts-ignore */}
				{MinterType.FXP_OPEN_MINTER === token.info.minterMd5 ? (
					<>
						<FxpRewardsModal
							open={isFxpRewardsModalOpen}
							onChange={setIsFxpRewardsModalOpen}
							amount={fxpRewardsAmount}
							txid={fxpRewardsTxId}
						/>
						<div>
							<p className="text-sm font-medium">Mints</p>
							<p className="text-sm font-medium mb-1 text-muted-foreground">
								{mintCount?.toLocaleString()}/{maxSupply.toLocaleString()}
							</p>
						</div>
						<div>
							<p className="text-sm font-medium flex items-center gap-2">
								Your Available Claims
								<HoverCard>
									<HoverCardTrigger>
										<InfoIcon className="h-4 w-4 text-muted-foreground cursor-pointer" />
									</HoverCardTrigger>
									<HoverCardContent className="w-80">
										<div className="space-y-2">
											<h4 className="text-sm font-semibold">Available Claims</h4>
											<p className="text-sm">
												This represents the number of tokens you are eligible to claim from this FXP
												Open Minter contract. Each claim allows you to mint a specific random amount
												of tokens as defined by the contract.
											</p>
										</div>
									</HoverCardContent>
								</HoverCard>
							</p>
							<p className="text-sm font-medium mb-1 text-muted-foreground">{claimCount}</p>
						</div>
					</>
				) : (
					<div>
						<p className="text-sm font-medium">Limit Per Mint</p>
						<p className="text-sm font-medium mb-1 text-muted-foreground">{token.info?.limit}</p>
					</div>
				)}
				<div>
					<p className="text-sm font-medium flex items-center gap-2">
						Mint UTXOs
						<HoverCard>
							<HoverCardTrigger>
								<InfoIcon className="h-4 w-4 text-muted-foreground cursor-pointer" />
							</HoverCardTrigger>
							<HoverCardContent className="w-80">
								<div className="space-y-2">
									<h4 className="text-sm font-semibold">Mint UTXOs</h4>
									<p className="text-sm">
										Mint UTXOs are special Bitcoin outputs used for minting new tokens. Each UTXO
										can only be used once, ensuring accurate token supply tracking.
									</p>
									<p className="text-sm">
										More available Mint UTXOs allow for higher concurrent minting capacity.
									</p>
								</div>
							</HoverCardContent>
						</HoverCard>
					</p>
					<p className="text-sm font-medium mb-1 text-muted-foreground flex items-center gap-2 h-4">
						{isUtxoCountLoading ? 'Loading...' : utxoCount}
						<div
							className={`w-2 h-2 rounded-full ${
								isMintable ? 'bg-green-500' : 'bg-red-500'
							} animate-pulse`}
						></div>
					</p>
				</div>

				{address && walletUtxoCount !== undefined && (
					<div>
						<p className="text-sm font-medium flex items-center gap-2">
							Wallet UTXOs
							<HoverCard>
								<HoverCardTrigger>
									<InfoIcon className="h-4 w-4 text-muted-foreground cursor-pointer" />
								</HoverCardTrigger>
								<HoverCardContent className="w-80">
									<div className="space-y-2">
										<p className="text-sm">
											Wallet UTXOs are unspent Bitcoin outputs in your wallet used for paying
											minting fees.
										</p>
										<p className="text-sm">
											Splitting UTXOs creates smaller amounts for better fee management and
											concurrent minting.
										</p>
									</div>
								</HoverCardContent>
							</HoverCard>
						</p>
						<div className="flex items-center justify-between">
							<p className="text-sm font-medium mb-1 text-muted-foreground flex items-center gap-2 h-4">
								{walletUtxoCount === undefined ? 'Loading...' : walletUtxoCount}
								{walletUtxoCount !== undefined && (
									<div
										className={`w-2 h-2 rounded-full ${
											!!walletUtxoCount && walletUtxoCount > 0 ? 'bg-green-500' : 'bg-red-500'
										} animate-pulse`}
									></div>
								)}
							</p>
							<Dialog open={isSplitDialogOpen} onOpenChange={setIsSplitDialogOpen}>
								<DialogTrigger asChild>
									<Button
										variant="outline"
										size="sm"
										disabled={walletUtxoCount === undefined || walletUtxoCount === 0}
									>
										Split UTXOs
									</Button>
								</DialogTrigger>
								<DialogContent className="p-0 w-[400px]">
									<SplitUTXOs onSplitComplete={() => setIsSplitDialogOpen(false)} />
								</DialogContent>
							</Dialog>
						</div>
					</div>
				)}

				<Button
					onClick={() =>
						// @ts-ignore
						MinterType.FXP_OPEN_MINTER === token.info.minterMd5
							? // @ts-ignore
							  handleFXPMint(utxoCount, (amount, txid) => {
									setFxpRewardsAmount(amount)
									setFxpRewardsTxId(txid)
									setIsFxpRewardsModalOpen(true)
							  })
							: handleMint(utxoCount)
					}
					disabled={isFXPMinting || isMinting || !isMintable || utxoCount === 0}
					className="w-full"
				>
					{isMinting
						? 'Minting...'
						: !isMintable
						? 'Mint Ended'
						: utxoCount === 0
						? 'No UTXOs Available'
						: 'Mint Now'}
				</Button>
			</CardContent>
		</Card>
	)
}

// Helper function to safely parse integers
const safeParseInt = (value: string | undefined): number => {
	if (!value) return 0
	const parsed = parseInt(value, 10)
	return isNaN(parsed) ? 0 : parsed
}

export default Mint
