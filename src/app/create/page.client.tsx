'use client'

import React from 'react'
import { Cat20TokenForm } from '@/components/cat20-token-form'

const Create: React.FC = () => {
	return (
		<div className="container flex flex-col items-center justify-center h-full flex-grow">
			<Cat20TokenForm />
		</div>
	)
}

export default Create
