'use client'

import React, { useState, useEffect } from 'react'
import { useSplit } from '@/hooks/use-split'
import { Slider } from '@/components/ui/slider'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import {
	Form,
	FormField,
	FormItem,
	FormLabel,
	FormControl,
	FormDescription,
	FormMessage
} from '@/components/ui/form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import * as z from 'zod'
import { btcToSats } from '@/lib/utils'

interface SplitUTXOsProps {
	onSplitComplete: () => void
}

export const SplitUTXOs: React.FC<SplitUTXOsProps> = ({ onSplitComplete }) => {
	const { handleSplit, isSplitting } = useSplit()
	const [serviceFee, setServiceFee] = useState<string | null>(null)

	const formSchema = z.object({
		minBTC: z.number().min(0.01, 'Minimum 0.01 BTC required'),
		splitCount: z
			.number()
			.min(2, 'Minimum split count is 2')
			.max(100, 'Maximum split count is 100')
	})

	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			minBTC: 0.01,
			splitCount: 10
		}
	})

	const onSubmit = async (values: z.infer<typeof formSchema>) => {
		const minSats = btcToSats(values.minBTC)
		await handleSplit(values.splitCount, minSats)
		onSplitComplete()
	}

	useEffect(() => {
		const fee = process.env.NEXT_PUBLIC_FEE_SATS
		if (fee) {
			setServiceFee((parseInt(fee) / 1e8).toString())
		}
	}, [])

	return (
		<div className="p-6">
			<h2 className="text-lg font-semibold mb-4">Split UTXOs</h2>
			<Form {...form}>
				<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
					<FormField
						control={form.control}
						name="minBTC"
						render={({ field }) => (
							<FormItem>
								<FormLabel>Minimum FB per UTXO</FormLabel>
								<FormControl>
									<Input
										type="number"
										step="0.01"
										min="0.01"
										{...field}
										onChange={e => field.onChange(Number(e.target.value))}
									/>
								</FormControl>
								<FormDescription>Minimum 0.01 FB (1,000,000 sats)</FormDescription>
								<FormMessage />
							</FormItem>
						)}
					/>
					<FormField
						control={form.control}
						name="splitCount"
						render={({ field }) => (
							<FormItem>
								<FormLabel>Split Count: {field.value}</FormLabel>
								<FormControl>
									<Slider
										min={2}
										max={100}
										step={1}
										value={[field.value]}
										onValueChange={value => field.onChange(value[0])}
									/>
								</FormControl>
							</FormItem>
						)}
					/>
					<div>
						{serviceFee && (
							<p className="text-sm text-muted-foreground mb-1">Service fee: {serviceFee} FB</p>
						)}
						<Button type="submit" disabled={isSplitting} className="w-full">
							{isSplitting ? 'Splitting...' : 'Split'}
						</Button>
					</div>
				</form>
			</Form>
		</div>
	)
}
