'use client'

import { useEffect, useState, type FC } from 'react'
import { v4 as uuidv4 } from 'uuid'

const GenerateMultipleUUID: FC = () => {
	const [count, setCount] = useState<number>(0)
	const [uuids, setUuids] = useState<string[]>([])
	const [copied, setCopied] = useState<boolean[]>([])
	const [generateNewUuid, setGenerateNewUuid] = useState(false)

	useEffect(() => {
		if (count === 0 || count > 500 || !generateNewUuid) return

		const newUuids: string[] = []
		const newCopied: boolean[] = []

		for (let i = 0; i < count; i++) {
			const newUuid = uuidv4()
			newUuids.push(newUuid)
			newCopied.push(false)
		}

		setUuids(newUuids)
		setCopied(newCopied)
		setGenerateNewUuid(false)
	}, [count, generateNewUuid])

	const handleCopy = async (index: number) => {
		try {
			if (copied[index]) return
			await navigator.clipboard.writeText(uuids[index])
			setCopied((prev) => prev.map((item, idx) => (idx === index ? true : item)))
		} catch (err) {
			console.error('Failed to copy!', err)
		}
	}

	return (
		<section className='w-full py-12 lg:py-16 px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16 flex flex-col items-center gap-8 bg-white/10'>
			<div className='w-full flex justify-center item-center'>
				<h1 className='text-white text-center text-3xl font-bold'> Generator Multiple V4 UUIDs </h1>
			</div>

			<div className='w-full flex flex-col gap-6 items-center'>
				<input
					className='w-full py-3 px-4 rounded-xl bg-white text-xl font-bold text-black'
					type='number'
					min={1}
					max={500}
					placeholder='Enter the number of UUIDs you want to generate'
					onChange={(e) => setCount(Number(e.target.value))}
				/>

				<button
					onClick={() => setGenerateNewUuid(true)}
					className='w-full sm:w-fit py-3 px-4 rounded-xl bg-white text-xl font-bold text-black'
				>
					Generate
				</button>
			</div>

			<div className='w-full grid gird-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
				{uuids.map((uuid, index) => (
					<div key={uuid} className='flex flex-col gap-4 items-center'>
						<button
							disabled={copied[index]}
							onClick={() => handleCopy(index)}
							className='w-fit py-3 px-4 rounded-xl bg-white text-lg md:text-xl font-bold text-black disabled:opacity-60 disabled:cursor-not-allowed'
						>
							{uuid}
						</button>
					</div>
				))}
			</div>
		</section>
	)
}

export default GenerateMultipleUUID
