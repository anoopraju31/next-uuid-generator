import { type FC } from 'react'

import GenerateSingleUUID from './GenerateSingleUUID'
import GenerateMultipleUUID from './GenerateMultipleUUID'

const Home: FC = () => {
	return (
		<main className='w-full flex flex-col gap-8 lg:gap-12 font-mono'>
			<GenerateSingleUUID />
			<GenerateMultipleUUID />
		</main>
	)
}

export default Home
