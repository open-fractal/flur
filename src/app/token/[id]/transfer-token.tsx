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
	console.log('token', token)
	const { isTransferring, handleTransfer, totalAmount } = useTransfer(token)
	const [serviceFee, setServiceFee] = useState<string | null>(null)

	const formSchema = z.object({
		amount: z.number().refine(value => value > 0 && value >= 1 / Math.pow(10, token.decimals), {
			message: `Amount must be greater than ${1 / Math.pow(10, token.decimals)} ${token.symbol}`
		}),
		address: z.string().refine(validateTaprootAddress, {
			message: 'Invalid taproot address'
		})
	})

	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
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
			<h2 className="text-lg font-semibold mb-4">Transfer {token.symbol} Tokens</h2>
			<p className="text-muted-foreground text-sm mb-4">
				Balance:{' '}
				<span className="font-bold">
					{formatNumber(totalAmount)} {token.symbol}
				</span>
			</p>
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
										step={`${1 / Math.pow(10, token.decimals)}`}
										min={`${1 / Math.pow(10, token.decimals)}`}
										{...field}
										onChange={e => {
											const value = e.target.value
											field.onChange(value === '' ? undefined : Number(value))
										}}
										placeholder={`Enter ${token.symbol} amount`}
									/>
								</FormControl>
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
									<Input type="text" {...field} placeholder="Enter a valid taproot address" />
								</FormControl>
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
