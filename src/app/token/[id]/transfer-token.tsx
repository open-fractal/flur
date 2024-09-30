'use client'

import React, { useState, useEffect } from 'react'
import { useTransfer } from '@/hooks/use-transfer'
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
import { validateTaprootAddress } from '@/lib/utils'

type TransferTokenProps = {
	token: any
}

export function TransferToken({ token }: TransferTokenProps) {
	const { isTransferring, handleTransfer, totalAmount } = useTransfer(token)
	const [serviceFee, setServiceFee] = useState<string | null>(null)

	const formSchema = z.object({
		amount: z.number().min(0, 'Amount must be greater than 0'),
		address: z.string().refine(validateTaprootAddress, {
			message: 'Invalid taproot address'
		})
	})

	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			amount: 0,
			address: ''
		}
	})

	useEffect(() => {
		const fee = process.env.NEXT_PUBLIC_FEE_SATS
		if (fee) {
			setServiceFee((parseInt(fee) / 1e8).toString())
		}
	}, [])

	const formatNumber = (num: number | string | undefined): string => {
		if (num === undefined || isNaN(Number(num))) {
			return 'N/A'
		}
		return Number(num).toLocaleString(undefined, {
			minimumFractionDigits: 2,
			maximumFractionDigits: token.decimals
		})
	}

	const onSubmit = async (values: z.infer<typeof formSchema>) => {
		await handleTransfer(values.amount.toString(), values.address)
		form.reset()
	}

	return (
		<div className="p-6">
			<h2 className="text-lg font-semibold mb-4">
				Balance:{' '}
				<span className="font-bold">
					{formatNumber(totalAmount)} {token.symbol}
				</span>
			</h2>
			<Form {...form}>
				<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
					<FormField
						control={form.control}
						name="amount"
						render={({ field }) => (
							<FormItem>
								<FormLabel>Amount</FormLabel>
								<FormControl>
									<Input
										type="number"
										step="any"
										min="0"
										{...field}
										onChange={e => field.onChange(Number(e.target.value))}
										placeholder={`Enter ${token.symbol} amount`}
									/>
								</FormControl>
								<FormDescription>Enter the amount to transfer</FormDescription>
								<FormMessage />
							</FormItem>
						)}
					/>
					<FormField
						control={form.control}
						name="address"
						render={({ field }) => (
							<FormItem>
								<FormLabel>Recipient Address</FormLabel>
								<FormControl>
									<Input type="text" {...field} placeholder="Enter recipient address" />
								</FormControl>
								<FormDescription>Enter a valid taproot address</FormDescription>
								<FormMessage />
							</FormItem>
						)}
					/>
					<div>
						{serviceFee && (
							<p className="text-sm text-muted-foreground mb-2">Service fee: {serviceFee} FB</p>
						)}
						<Button type="submit" disabled={isTransferring} className="w-full">
							{isTransferring ? 'Transferring...' : 'Transfer'}
						</Button>
						<p className="text-xs text-muted-foreground mt-2">
							You will sign two transactions to transfer
						</p>
					</div>
				</form>
			</Form>
		</div>
	)
}
