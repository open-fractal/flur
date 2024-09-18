'use client'

import { Card, CardContent } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'

interface CompactFeeRateDashboardProps {
	currentFeeRate?: number
	isLoading: boolean
	error: Error | null
}

export function CompactFeeRateDashboard({
	currentFeeRate,
	isLoading,
	error
}: CompactFeeRateDashboardProps) {
	if (isLoading) {
		return <FeeRateSkeleton />
	}

	if (error) {
		return <ErrorMessage />
	}

	return (
		<Card className="w-full">
			<CardContent className="p-4">
				<div className="flex flex-col space-y-2 sm:flex-row sm:items-center sm:justify-between sm:space-y-0 sm:space-x-2 text-sm">
					<div className="font-medium">Current Fee Rate:</div>
					<div className="flex flex-wrap gap-2">
						<StatusItem label="Fee Rate" value={`${currentFeeRate?.toFixed(2) || '-'} sat/vB`} />
					</div>
				</div>
			</CardContent>
		</Card>
	)
}

function StatusItem({ label, value }: { label: string; value: string }) {
	return (
		<div className="flex items-center space-x-1">
			<span className="text-muted-foreground">{label}:</span>
			<span>{value}</span>
		</div>
	)
}

function FeeRateSkeleton() {
	return (
		<Card className="w-full">
			<CardContent className="p-2">
				<div className="flex items-center justify-between space-x-2">
					<Skeleton className="h-4 w-24" />
					<Skeleton className="h-4 w-20" />
				</div>
			</CardContent>
		</Card>
	)
}

function ErrorMessage() {
	return (
		<Card className="w-full">
			<CardContent className="p-2">
				<div className="text-sm text-red-500">
					Error loading fee rate. Please try again later.
				</div>
			</CardContent>
		</Card>
	)
}