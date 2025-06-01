import { type FC } from 'react'

type Props = {
	uuids: string[]
	copied: boolean[]
	handleCopy: (index: number) => void
}

const UuidContainer: FC<Props> = ({ uuids, copied, handleCopy }) => {
	if (!uuids.length) return null

	return (
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
	)
}

export default UuidContainer
