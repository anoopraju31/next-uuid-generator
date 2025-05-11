import { type FC } from 'react'
import GenerateSingleUUID from './GenerateSingleUUID'

const Home: FC = () => {
	return (
		<main className='w-ful min-h-screen flex flex-col gap-8 lg:gap-12 font-mono'>
			<GenerateSingleUUID />
		</main>
	)
}

export default Home
