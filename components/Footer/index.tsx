import { type FC } from 'react';

const Footer: FC = () => {
  return (
    <footer className="mt-16 w-full gap-5 bg-green-500 px-4 py-16 text-center text-white sm:px-6 md:px-8 lg:px-12 xl:px-16">
      Made with ❤️ by{' '}
      <a href="https://anoopraju.xyz/" target="_blank" rel="noreferrer" className="text-gray-950 hover:underline">
        Anoop Raju
      </a>
    </footer>
  );
};

export default Footer;
