'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { EXPLORER_URL } from '@/lib/constants'
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle
} from '@/components/ui/dialog'
import CountUp from 'react-countup'
import Confetti from 'react-confetti'

interface FxpRewardsModalProps {
	open: boolean
	onChange: (open: boolean) => void
	amount: number
	txid: string
}

export function FxpRewardsModal({ open, onChange, amount, txid }: FxpRewardsModalProps) {
	const [showConfetti, setShowConfetti] = useState(false)
	const [isJackpot, setIsJackpot] = useState(false)

	useEffect(() => {
		if (open) {
			setIsJackpot(amount === 420)
			setShowConfetti(true)
			const timer = setTimeout(() => setShowConfetti(false), isJackpot ? 10000 : 5000)
			return () => clearTimeout(timer)
		}
	}, [open, amount, isJackpot])

	const tokensEarned = amount

	return (
		<Dialog open={open} onOpenChange={onChange}>
			<DialogContent className="sm:max-w-[425px] text-white">
				{showConfetti && (
					<Confetti
						width={425}
						height={400}
						recycle={false}
						numberOfPieces={isJackpot ? 500 : 200}
						confettiSource={{
							x: 212,
							y: 0,
							w: 10,
							h: 0
						}}
					/>
				)}
				<DialogHeader>
					<DialogTitle className="text-2xl font-bold text-center">
						{isJackpot ? '🎉 Jackpot Hit! 🎉' : 'FXP Rewards Earned!'}
					</DialogTitle>
					<DialogDescription className="text-center text-gray-400">
						Your Flur Experience Points (FXP) are in the mempool and will appear
						in your balance shortly. Thank you for using Flur!
					</DialogDescription>
				</DialogHeader>
				<div className="flex flex-col items-center justify-center py-8">
					<div className="text-6xl font-bold text-green-500 mb-2">
						<CountUp end={tokensEarned} duration={isJackpot ? 4 : 2} />
					</div>
					<div className="text-xl text-gray-400">FXP Minted</div>
					{isJackpot && (
						<div className="mt-4 flex flex-col items-center">
							<div className="text-2xl font-bold text-yellow-400 animate-pulse">
								Jackpot Bonus Activated!
							</div>
							<div className="mt-2 text-lg text-center text-green-400">
								You pulled a 69! <br />
								Rewards boosted to 420!
							</div>
						</div>
					)}
				</div>
				<Button
					className="w-full bg-white text-black hover:bg-gray-200"
					onClick={() => window.open(`${EXPLORER_URL}/tx/${txid}`, '_blank')}
				>
					View Transaction
				</Button>
			</DialogContent>
		</Dialog>
	)
}
