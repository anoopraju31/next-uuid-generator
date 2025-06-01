import { type FC } from 'react'

const Footer: FC = () => {
	return (
		<footer className='w-full mt-16 px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16 py-16 bg-green-500 text-center gap-5 text-white'>
			Made with ❤️ by{' '}
			<a href='https://anoopraju.xyz/' target='_blank' rel='noreferrer' className='text-gray-950 hover:underline'>
				Anoop Raju
			</a>
		</footer>
	)
}

export default Footer
