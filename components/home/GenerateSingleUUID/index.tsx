'use client'

import { useEffect, useState, type FC } from 'react'
import { v4 as uuidv4 } from 'uuid'

const GenerateSingleUUID: FC = () => {
	const [singleUuid, setSingleUuid] = useState('')
	const [copied, setCopied] = useState(false)
	const [generateNewUuid, setGenerateNewUuid] = useState(true)

	useEffect(() => {
		if (!generateNewUuid) return

		const newUuid = uuidv4()

		setSingleUuid(newUuid)
		setGenerateNewUuid(false)
	}, [generateNewUuid])

	const generateNewUuidClick = () => setGenerateNewUuid(true)
	const handleCopy = async () => {
		try {
			await navigator.clipboard.writeText(singleUuid)
			setCopied(true)
			setTimeout(() => setCopied(false), 2000) // Reset after 2 seconds
		} catch (err) {
			console.error('Failed to copy!', err)
		}
	}

	return (
		<section className='w-full py-16 px-4 sm:px-6 md:px-8 lg:px-12 xl:xp-16 flex flex-col items-center gap-8 bg-black'>
			<div className='w-full flex justify-center item-center'>
				<h1 className='text-white text-center text-3xl font-bold'> Online UUID Generator </h1>
			</div>

			<div className='w-full md:w-fit flex flex-col gap-6 items-center'>
				<h2 className='w-full text-2xl text-left font-semibold'>Your Version 4 UUID: </h2>

				<div className='flex flex-col lg:flex-row items-center gap-6'>
					<button
						onClick={handleCopy}
						disabled={copied}
						className='w-full md:w-fit py-3 md:py-6 px-4 md:px-6 rounded-xl bg-white text-lg md:text-xl font-bold text-black cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed'
					>
						{' '}
						{singleUuid}{' '}
					</button>

					<button
						onClick={generateNewUuidClick}
						className='w-full md:w-fit py-3 md:py-6 px-4 md:px-6 rounded-xl bg-white text-lg md:text-xl font-bold text-black'
					>
						Click here to generate another UUID.
					</button>
				</div>
			</div>
		</section>
	)
}

export default GenerateSingleUUID
