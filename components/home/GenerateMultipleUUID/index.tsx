'use client'

import { FormEvent, useState, type FC } from 'react'
import { v4 as uuidv4 } from 'uuid'

import UuidContainer from './UuidContainer'

const GenerateMultipleUUID: FC = () => {
	const [count, setCount] = useState<number>(0)
	const [uuids, setUuids] = useState<string[]>([])
	const [copied, setCopied] = useState<boolean[]>([])

	const handleCopy = async (index: number) => {
		try {
			if (copied[index]) return
			await navigator.clipboard.writeText(uuids[index])
			setCopied((prev) => prev.map((item, idx) => (idx === index ? true : item)))
		} catch (err) {
			console.error('Failed to copy!', err)
		}
	}

	const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
		e.preventDefault()

		if (count <= 0 || count > 500) return

		const newUuids: string[] = []
		const newCopied: boolean[] = []

		for (let i = 0; i < count; i++) {
			const newUuid = uuidv4()
			newUuids.push(newUuid)
			newCopied.push(false)
		}

		setUuids(newUuids)
		setCopied(newCopied)
	}

	return (
		<section className='w-full py-12 lg:py-16 px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16 flex flex-col items-center gap-8 bg-white/10'>
			<div className='w-full flex justify-center item-center'>
				<h1 className='text-white text-center text-3xl font-bold'> Generator Multiple V4 UUIDs </h1>
			</div>

			<form onSubmit={handleSubmit} className='w-full flex flex-col sm:flex-row gap-6 items-end'>
				<div className='w-full flex flex-col gap-3'>
					<label htmlFor='count' className='text-white text-lg md:text-xl font-bold'>
						Enter the number of UUIDs you want to generate
					</label>
					<input
						className='w-full py-3 px-4 rounded-xl bg-white text-xl font-bold text-black'
						type='number'
						id='count'
						min={1}
						max={500}
						placeholder='Enter a number'
						onChange={(e) => setCount(Number(e.target.value))}
					/>
				</div>

				<button
					type='submit'
					className='w-full sm:w-fit py-3 px-4 rounded-xl bg-white text-xl font-bold text-black'
				>
					Generate
				</button>
			</form>

			<UuidContainer uuids={uuids} copied={copied} handleCopy={handleCopy} />
		</section>
	)
}

export default GenerateMultipleUUID
