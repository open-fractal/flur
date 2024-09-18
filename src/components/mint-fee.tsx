'use client'

import { Card, CardContent } from '@/components/ui/card'

export function MintFee() {
  return (
    <Card className="w-full">
      <CardContent className="p-4">
        <div className="flex flex-col space-y-2 sm:flex-row sm:items-center sm:justify-between sm:space-y-0 sm:space-x-2 text-sm">
          <div className="font-medium">Mint CAT-20</div>
          <div className="flex flex-wrap gap-2">
            <StatusItem label="Current Service Fee" value="0 sats" />
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